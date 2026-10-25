-- 247BD store database.
-- Run this whole file once in Supabase: Dashboard → SQL Editor → New query → paste → Run.
-- It is safe to run again later; it only adds what is missing and refreshes the functions.

-- ─────────────────────────── Tables ───────────────────────────

create table if not exists public.admins (
  email text primary key
);

create table if not exists public.settings (
  id int primary key default 1 check (id = 1),
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.products (
  id text primary key,
  slug text unique not null,
  data jsonb not null,
  published boolean not null default true,
  sort int not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists public.coupons (
  code text primary key,
  type text not null default 'percent' check (type in ('percent', 'fixed', 'tiered')),
  value numeric,
  tiers jsonb,
  min_subtotal numeric default 0,
  expires_at timestamptz,
  usage_limit int,
  used int not null default 0,
  active boolean not null default true,
  note text,
  created_at timestamptz not null default now()
);

create sequence if not exists public.order_number start 1001;

create table if not exists public.orders (
  id text primary key,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  status text not null default 'pending'
    check (status in ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled', 'returned')),
  customer jsonb not null,
  items jsonb not null,
  subtotal numeric not null,
  discount numeric not null default 0,
  coupon text,
  delivery numeric not null,
  total numeric not null,
  payment jsonb not null default '{}'::jsonb,
  note text,
  admin_note text,
  courier text,
  tracking text
);
create index if not exists orders_created_at on public.orders (created_at desc);
create index if not exists orders_status on public.orders (status);

-- ─────────────────────────── Admin check ───────────────────────────

create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from admins where lower(email) = lower(coalesce(auth.jwt() ->> 'email', '')));
$$;
grant execute on function public.is_admin() to anon, authenticated;

-- ─────────────────────────── Row level security ───────────────────────────

alter table public.admins enable row level security;
alter table public.settings enable row level security;
alter table public.products enable row level security;
alter table public.coupons enable row level security;
alter table public.orders enable row level security;

drop policy if exists "admins read admins" on public.admins;
create policy "admins read admins" on public.admins for select to authenticated using (public.is_admin());
drop policy if exists "admins manage admins" on public.admins;
create policy "admins manage admins" on public.admins for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "anyone reads settings" on public.settings;
create policy "anyone reads settings" on public.settings for select using (true);
drop policy if exists "admins write settings" on public.settings;
create policy "admins write settings" on public.settings for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "anyone reads published products" on public.products;
create policy "anyone reads published products" on public.products for select using (published or public.is_admin());
drop policy if exists "admins write products" on public.products;
create policy "admins write products" on public.products for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists "admins manage coupons" on public.coupons;
create policy "admins manage coupons" on public.coupons for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Customers never read or write orders directly; they go through place_order() and track_order().
drop policy if exists "admins manage orders" on public.orders;
create policy "admins manage orders" on public.orders for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- ─────────────────────────── Coupons ───────────────────────────

create or replace function public.coupon_discount(p_code text, p_subtotal numeric) returns numeric
language plpgsql stable security definer set search_path = public as $$
declare
  c coupons;
  pct numeric := 0;
  lowest numeric;
  t jsonb;
begin
  select * into c from coupons where code = upper(trim(p_code));
  if not found or not c.active then raise exception 'This coupon code is not valid'; end if;
  if c.expires_at is not null and c.expires_at < now() then raise exception 'This coupon has expired'; end if;
  if c.usage_limit is not null and c.used >= c.usage_limit then raise exception 'This coupon has been used up'; end if;
  if p_subtotal < coalesce(c.min_subtotal, 0) then
    raise exception 'Add ৳% or more to use this coupon', c.min_subtotal;
  end if;
  if c.type = 'fixed' then return least(coalesce(c.value, 0), p_subtotal); end if;
  if c.type = 'percent' then return round(p_subtotal * coalesce(c.value, 0) / 100); end if;
  for t in select * from jsonb_array_elements(coalesce(c.tiers, '[]'::jsonb)) loop
    lowest := least(coalesce(lowest, (t ->> 'min')::numeric), (t ->> 'min')::numeric);
    if p_subtotal >= (t ->> 'min')::numeric then pct := greatest(pct, (t ->> 'percent')::numeric); end if;
  end loop;
  if pct = 0 then raise exception 'Add ৳% or more to use this coupon', coalesce(lowest, 0); end if;
  return round(p_subtotal * pct / 100);
end $$;

create or replace function public.check_coupon(p_code text, p_subtotal numeric) returns jsonb
language plpgsql stable security definer set search_path = public as $$
begin
  return jsonb_build_object('ok', true, 'discount', public.coupon_discount(p_code, p_subtotal));
exception when others then
  return jsonb_build_object('ok', false, 'discount', 0, 'message', sqlerrm);
end $$;
grant execute on function public.check_coupon(text, numeric) to anon, authenticated;

-- ─────────────────────────── Placing an order ───────────────────────────
-- Prices, stock, coupon and delivery are all worked out here from the database,
-- so a customer can't change what they pay from the browser.

create or replace function public.place_order(payload jsonb) returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  s jsonb;
  it jsonb;
  prod products;
  v jsonb;
  vidx int;
  unit numeric;
  qty int;
  left_stock int;
  items jsonb := '[]'::jsonb;
  subtotal numeric := 0;
  discount numeric := 0;
  delivery numeric;
  total numeric;
  cust jsonb := coalesce(payload -> 'customer', '{}'::jsonb);
  pay jsonb := coalesce(payload -> 'payment', '{}'::jsonb);
  v_code text := upper(nullif(trim(coalesce(payload ->> 'coupon', '')), ''));
  phone text;
  oid text;
  advance_on boolean;
  result jsonb;
begin
  select data into s from settings where id = 1;
  s := coalesce(s, '{}'::jsonb);
  advance_on := coalesce((s ->> 'advancePayment')::boolean, true);

  phone := regexp_replace(coalesce(cust ->> 'phone', ''), '[\s-]', '', 'g');
  if phone !~ '^(\+?88)?01[3-9][0-9]{8}$' then raise exception 'Enter an 11-digit Bangladeshi mobile number'; end if;
  if coalesce(trim(cust ->> 'name'), '') = '' or coalesce(trim(cust ->> 'address'), '') = ''
     or coalesce(trim(cust ->> 'district'), '') = '' or coalesce(trim(cust ->> 'area'), '') = '' then
    raise exception 'Fill in your name, district, area and address';
  end if;
  if jsonb_array_length(coalesce(payload -> 'items', '[]'::jsonb)) = 0 then raise exception 'Your cart is empty'; end if;
  if jsonb_array_length(payload -> 'items') > 50 then raise exception 'Too many items in one order'; end if;

  for it in select * from jsonb_array_elements(payload -> 'items') loop
    qty := greatest(1, least(99, coalesce((it ->> 'qty')::int, 1)));
    select * into prod from products where slug = it ->> 'slug' and published for update;
    if not found then raise exception 'A product in your cart is no longer available. Remove it and try again.'; end if;

    if jsonb_array_length(coalesce(prod.data -> 'variations', '[]'::jsonb)) > 0 then
      v := null;
      select (t.ord - 1)::int, t.val into vidx, v
        from jsonb_array_elements(prod.data -> 'variations') with ordinality as t(val, ord)
        where t.val ->> 'id' = it ->> 'variation';
      if v is null then raise exception 'Choose a size for %', prod.data ->> 'name'; end if;
      left_stock := coalesce((v ->> 'stock')::int, 0);
      if left_stock < qty then raise exception '% (%) has only % left', prod.data ->> 'name', v ->> 'label', left_stock; end if;
      unit := (v ->> 'price')::numeric;
      update products set data = jsonb_set(data, array['variations', vidx::text, 'stock'], to_jsonb(left_stock - qty)), updated_at = now()
        where id = prod.id;
      items := items || jsonb_build_object('slug', prod.slug, 'name', prod.data ->> 'name', 'variation', v ->> 'id',
        'label', v ->> 'label', 'price', unit, 'qty', qty, 'image', prod.data -> 'images' -> 0 ->> 'thumb');
    else
      left_stock := coalesce((prod.data ->> 'stock')::int, 0);
      if left_stock < qty then raise exception '% has only % left', prod.data ->> 'name', left_stock; end if;
      unit := (prod.data ->> 'price')::numeric;
      update products set data = jsonb_set(data, '{stock}', to_jsonb(left_stock - qty)), updated_at = now() where id = prod.id;
      items := items || jsonb_build_object('slug', prod.slug, 'name', prod.data ->> 'name', 'variation', null,
        'label', null, 'price', unit, 'qty', qty, 'image', prod.data -> 'images' -> 0 ->> 'thumb');
    end if;
    subtotal := subtotal + unit * qty;
  end loop;

  if v_code is not null then
    discount := public.coupon_discount(v_code, subtotal);
    update coupons set used = used + 1 where coupons.code = v_code;
  end if;

  if coalesce((s ->> 'freeDeliveryOver')::numeric, 0) > 0 and subtotal >= (s ->> 'freeDeliveryOver')::numeric then
    delivery := 0;
  elsif cust ->> 'district' = 'Dhaka' then
    delivery := coalesce((s ->> 'deliveryInsideDhaka')::numeric, 80);
  else
    delivery := coalesce((s ->> 'deliveryOutsideDhaka')::numeric, 120);
  end if;
  total := greatest(0, subtotal - discount) + delivery;

  if advance_on then
    if coalesce(pay ->> 'method', '') not in ('bkash', 'nagad', 'rocket') then raise exception 'Choose how you sent the delivery charge'; end if;
    if length(trim(coalesce(pay ->> 'trx', ''))) < 4 then raise exception 'Enter the Transaction ID or the last 4 digits of the number you paid from'; end if;
    pay := jsonb_build_object('method', pay ->> 'method', 'trx', trim(pay ->> 'trx'), 'advance', delivery,
      'screenshot', pay ->> 'screenshot', 'verified', false);
  else
    pay := jsonb_build_object('method', 'cod');
  end if;

  oid := '247BD-' || nextval('order_number')::text;
  insert into orders (id, customer, items, subtotal, discount, coupon, delivery, total, payment, note)
  values (
    oid,
    jsonb_build_object('name', trim(cust ->> 'name'), 'phone', phone, 'district', cust ->> 'district',
      'area', trim(cust ->> 'area'), 'address', trim(cust ->> 'address'), 'email', nullif(trim(coalesce(cust ->> 'email', '')), '')),
    items, subtotal, discount, v_code, delivery, total, pay, nullif(trim(coalesce(payload ->> 'note', '')), '')
  )
  returning to_jsonb(orders.*) into result;
  return result;
end $$;
grant execute on function public.place_order(jsonb) to anon, authenticated;

-- A customer can look up an order with its number and the phone number used.
create or replace function public.track_order(p_id text, p_phone text) returns jsonb
language sql stable security definer set search_path = public as $$
  select to_jsonb(o) - 'admin_note'
  from orders o
  where upper(o.id) = upper(trim(p_id))
    and right(regexp_replace(o.customer ->> 'phone', '\D', '', 'g'), 10) = right(regexp_replace(p_phone, '\D', '', 'g'), 10)
  limit 1;
$$;
grant execute on function public.track_order(text, text) to anon, authenticated;

-- Changing an order's status. Cancelling or returning puts the stock back; reopening takes it out again.
create or replace function public.set_order_status(p_id text, p_status text) returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  o orders;
  it jsonb;
  prod products;
  vidx int;
  was_out boolean;
  now_out boolean;
  dir int;
  result jsonb;
begin
  if not public.is_admin() then raise exception 'Only admins can change orders'; end if;
  if p_status not in ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled', 'returned') then raise exception 'Unknown status'; end if;
  select * into o from orders where id = p_id for update;
  if not found then raise exception 'Order not found'; end if;
  was_out := o.status in ('cancelled', 'returned');
  now_out := p_status in ('cancelled', 'returned');
  if was_out <> now_out then
    dir := case when now_out then 1 else -1 end;
    for it in select * from jsonb_array_elements(o.items) loop
      select * into prod from products where slug = it ->> 'slug' for update;
      continue when not found;
      if it ->> 'variation' is not null then
        vidx := null;
        select (t.ord - 1)::int into vidx
          from jsonb_array_elements(prod.data -> 'variations') with ordinality as t(val, ord)
          where t.val ->> 'id' = it ->> 'variation';
        continue when vidx is null;
        update products set data = jsonb_set(data, array['variations', vidx::text, 'stock'],
          to_jsonb(greatest(0, coalesce((data -> 'variations' -> vidx ->> 'stock')::int, 0) + dir * (it ->> 'qty')::int))), updated_at = now()
          where id = prod.id;
      else
        update products set data = jsonb_set(data, '{stock}',
          to_jsonb(greatest(0, coalesce((data ->> 'stock')::int, 0) + dir * (it ->> 'qty')::int))), updated_at = now()
          where id = prod.id;
      end if;
    end loop;
  end if;
  update orders set status = p_status, updated_at = now() where id = p_id returning to_jsonb(orders.*) into result;
  return result;
end $$;
grant execute on function public.set_order_status(text, text) to authenticated;

-- ─────────────────────────── Storage for photos ───────────────────────────

insert into storage.buckets (id, name, public) values ('payment-proofs', 'payment-proofs', false) on conflict (id) do nothing;
insert into storage.buckets (id, name, public) values ('product-images', 'product-images', true) on conflict (id) do nothing;

drop policy if exists "customers upload payment proofs" on storage.objects;
create policy "customers upload payment proofs" on storage.objects for insert to anon, authenticated
  with check (bucket_id = 'payment-proofs');
drop policy if exists "admins read payment proofs" on storage.objects;
create policy "admins read payment proofs" on storage.objects for select to authenticated
  using (bucket_id = 'payment-proofs' and public.is_admin());
drop policy if exists "admins manage product images" on storage.objects;
create policy "admins manage product images" on storage.objects for all to authenticated
  using (bucket_id = 'product-images' and public.is_admin())
  with check (bucket_id = 'product-images' and public.is_admin());

-- New orders show up in the admin panel instantly.
do $$ begin
  alter publication supabase_realtime add table public.orders;
exception when duplicate_object then null; when undefined_object then null;
end $$;

-- ─────────────────────────── Starting data ───────────────────────────

-- The admin login. Change or add emails here, then create the same user under Authentication → Users.
insert into public.admins (email) values ('shantors18@gmail.com') on conflict do nothing;

insert into public.settings (id, data) values (1, '{
  "storeName": "247BD",
  "tagline": "PRIDE grooming by PahelaPride, delivered all over Bangladesh",
  "phone": "01748047444",
  "whatsapp": "8801748047444",
  "email": "pahelapride.official@gmail.com",
  "address": "Narayanganj, Bangladesh",
  "facebook": "https://www.facebook.com/pahela.pride",
  "instagram": "https://www.instagram.com/pahela.pride/",
  "youtube": "https://www.youtube.com/@pahelapride",
  "community": "https://www.facebook.com/share/g/1EiPYJT8C5/",
  "deliveryInsideDhaka": 80,
  "deliveryOutsideDhaka": 120,
  "freeDeliveryOver": 0,
  "advancePayment": true,
  "paymentNumbers": {"bkash": "01683075333", "nagad": "01683075333", "rocket": "01683075333"},
  "announcements": ["Use [PAHELA] coupon code to get up to 30% discount", "Combo কিনলে FREE gift", "Cash on Delivery সারা বাংলাদেশে"],
  "couponNotice": "Use [PAHELA] coupon code to get up to 30% discount"
}'::jsonb) on conflict (id) do nothing;

insert into public.coupons (code, type, tiers, note) values ('PAHELA', 'tiered', '[
  {"min": 500, "percent": 5}, {"min": 1500, "percent": 10}, {"min": 2500, "percent": 15},
  {"min": 3500, "percent": 20}, {"min": 4500, "percent": 25}, {"min": 5000, "percent": 30}
]'::jsonb, 'Up to 30% off by cart subtotal') on conflict (code) do nothing;

-- Products are loaded from the admin panel: Products → "Import PRIDE catalog".
