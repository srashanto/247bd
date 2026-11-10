# 247BD

Football store (boots, balls, kit and gear), live at https://247bd.net.

- Store: home, shop, product pages with colour and size pickers, cart, checkout, order tracking, wishlist.
- Customer accounts at https://247bd.net/account/: sign in with Google or email, order history, saved address, wishlist on every device.
- Admin panel: https://247bd.net/admin/ for orders, products, stock, coupons and settings.

## Turn on the admin panel (one time, about 5 minutes)

Until this is done the store still works, but orders only reach you through WhatsApp.

1. Go to https://supabase.com, open your account, and create a new project (free plan is fine). Pick the Singapore region.
2. In the project, open **SQL Editor → New query**, paste everything from [`supabase/schema.sql`](supabase/schema.sql), and click **Run**.
3. Open **Authentication → Users → Add user → Create new user**. Use `shantors18@gmail.com` (the admin email in the SQL file), choose a password, and tick **Auto confirm user**.
4. Open **Project Settings → API** and copy the **Project URL** and the **anon public** key.
5. Put the Project URL and anon key in `.env.production` in this repo (already done for the live project).
6. Open **Actions → Deploy to GitHub Pages → Run workflow**.
7. Visit https://247bd.net/admin/, sign in, go to **Products** and click **Import starter catalog** (adds the Meike boots). Then set the real price and stock for each size and colour.

### Switching an existing database to the football store

The storefront only shows football categories (boots, footballs, jerseys, socks, shin-guards, gloves, bags, training), so older grooming products in the database stay hidden. To tidy the database too, run [`supabase/football-store.sql`](supabase/football-store.sql) once in the SQL Editor, or untick **Show on store** / delete them in **Admin → Products**.

### Adding products

Admin → Products → **Add product**. Pick a category, add photos, and add one size row per size. For colours, use the starter boots as the example: each size row has a `color` and `size`, and the product has a `colors` list.

## Turn on customer login

In Supabase open **Authentication → URL Configuration**:
- **Site URL**: `https://247bd.net`
- **Redirect URLs**: add `https://247bd.net/account/` and `https://247bd.net/admin/`

Email + password works after this. For **Continue with Google**:
1. In Google Cloud Console (console.cloud.google.com) create a project, then **APIs & Services → OAuth consent screen** (External, app name 247BD).
2. **Credentials → Create credentials → OAuth client ID → Web application**. Under Authorized redirect URIs paste the callback URL shown in Supabase **Authentication → Providers → Google** (it looks like `https://<project>.supabase.co/auth/v1/callback`).
3. Copy the Client ID and Client secret back into Supabase **Providers → Google**, turn it on, and save.

The anon key is meant to be public. Everything private (orders, coupons, payment screenshots) is protected by the rules in `schema.sql`, and only emails in the `admins` table can open the admin panel.

## How orders work

- Prices, stock, coupons and delivery charges are calculated in the database when an order is placed, so they can't be changed from the browser.
- Delivery: ৳80 inside Dhaka, ৳120 outside. Customers pay the delivery charge in advance by bKash, Nagad or Rocket and enter the TrxID; the rest is cash on delivery. Change all of this in **Admin → Settings**.
- Cancelling or returning an order in the admin panel puts the stock back.
- New orders appear in the admin panel instantly with a sound.

## Develop

```bash
npm install
npm run dev
```

Add a `.env.local` with the two `NEXT_PUBLIC_SUPABASE_*` values to test against the database.
