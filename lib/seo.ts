export const SITE_URL = "https://247bd.net";
export const SITE_NAME = "247BD";

/** Google wants absolute image URLs in structured data and sitemaps. */
export const absUrl = (u: string) => (u.startsWith("http") ? u : `${SITE_URL}${u}`);

export type Faq = { q: string; a: string };

export type Landing = {
  /** URL path, e.g. "hair-styling" → https://247bd.net/hair-styling/ */
  slug: string;
  /** Short name for menus and pills. */
  label: string;
  /** Catalog category it lists, or null for every product. */
  category: string | null;
  /** Browser tab / Google result title (the site name is added after it). */
  title: string;
  description: string;
  h1: string;
  /** Short line under the heading. */
  lead: string;
  /** Same idea in Bangla, so Bengali searches match too. */
  bn: string;
  /** Longer copy shown below the products. */
  body: string[];
  keywords: string[];
  faq: Faq[];
};

const deliveryFaq: Faq = {
  q: "How much is delivery and how long does it take?",
  a: "Delivery is ৳80 inside Dhaka and ৳120 outside Dhaka, anywhere in Bangladesh. Orders usually arrive in 1–2 days inside Dhaka and 2–4 days outside.",
};
const codFaq: Faq = {
  q: "Can I pay cash on delivery?",
  a: "Yes. Pay the delivery charge in advance by bKash, Nagad or Rocket to confirm the order, then pay the rest in cash when the parcel arrives.",
};

export const landings: Landing[] = [
  {
    slug: "football-shop",
    label: "All gear",
    category: null,
    title: "Football Boots, Balls and Kit in Bangladesh",
    description: "Shop football boots, footballs, jerseys, socks, shin guards and goalkeeper gloves in Bangladesh. Cash on delivery all over Bangladesh.",
    h1: "Football gear in Bangladesh",
    lead: "Boots, balls, kit and accessories for players of every level, delivered anywhere in Bangladesh with cash on delivery.",
    bn: "২৪৭বিডি বাংলাদেশের ফুটবল স্টোর। এখান থেকে ফুটবল বুট, ফুটবল, জার্সি, সক্স, শিন গার্ড ও গোলকিপার গ্লাভস অনলাইনে অর্ডার করুন। সারা বাংলাদেশে ক্যাশ অন ডেলিভারি।",
    body: [
      "247BD is a football store. Find boots for grass and turf, match balls, jerseys, socks, shin guards and everything else you need on the pitch.",
      "Every product page shows the colours and sizes in stock, so you can choose before you order.",
    ],
    keywords: ["football shop Bangladesh", "football boots Bangladesh", "football gear BD", "sports shop Bangladesh", "ফুটবল শপ বাংলাদেশ", "ফুটবল সরঞ্জাম"],
    faq: [{
        q: "How do I pick my size?",
        a: "Measure your foot length in centimetres and compare it with the size chart, or message us on WhatsApp with your foot length. If you are between two sizes, go one size up.",
      },
      deliveryFaq,
      codFaq],
  },
  {
    slug: "boots",
    label: "Boots",
    category: "boots",
    title: "Football Boots in Bangladesh: Price and Sizes",
    description: "Buy football boots online in Bangladesh. Long stud boots in several colours, EU sizes 35 to 45. Check the price, pick your size, cash on delivery all over Bangladesh.",
    h1: "Football boots in Bangladesh",
    lead: "Long stud football boots in several colours, EU sizes 35 to 45.",
    bn: "বাংলাদেশে ফুটবল বুটের দাম ও সাইজ দেখুন এবং অনলাইনে অর্ডার করুন। ঘাসের মাঠের জন্য লং স্টাড ফুটবল বুট, সাইজ ৩৫ থেকে ৪৫। সারা বাংলাদেশে ক্যাশ অন ডেলিভারি।",
    body: [
      "Long studs grip natural grass for sprints, sudden stops and sharp turns. Each product page lists the colours, the EU sizes in stock and the price in taka.",
      "Pick your colour and EU size on the product page, then order with cash on delivery.",
    ],
    keywords: ["football boots price in Bangladesh", "football boot BD", "studs boots Bangladesh", "football shoes Bangladesh", "ফুটবল বুট", "ফুটবল বুটের দাম", "ফুটবল জুতা"],
    faq: [{
        q: "How do I pick my size?",
        a: "Measure your foot length in centimetres and compare it with the size chart, or message us on WhatsApp with your foot length. If you are between two sizes, go one size up.",
      },
      deliveryFaq,
      codFaq],
  },
  {
    slug: "footballs",
    label: "Footballs",
    category: "footballs",
    title: "Footballs in Bangladesh: Price, Size 4 and 5",
    description: "Buy footballs online in Bangladesh for matches and training, size 4 and size 5. Check the price and pick your colour. Cash on delivery all over Bangladesh.",
    h1: "Footballs in Bangladesh",
    lead: "Match and training balls for the pitch, the field and the street.",
    bn: "বাংলাদেশে ফুটবল কিনুন অনলাইনে। ম্যাচ ও প্র্যাকটিসের জন্য সাইজ ৪ ও ৫ ফুটবল পাওয়া যায়। সারা বাংলাদেশে ক্যাশ অন ডেলিভারি।",
    body: [
      "Choose a size 5 ball for adults and older players, size 4 for juniors and size 3 for young children.",
    ],
    keywords: ["football price in Bangladesh", "buy football BD", "match ball Bangladesh", "ফুটবল", "ফুটবলের দাম"],
    faq: [deliveryFaq, codFaq],
  },
  {
    slug: "jerseys",
    label: "Jerseys & shorts",
    category: "jerseys",
    title: "Football Jerseys and Shorts in Bangladesh",
    description: "Football jerseys, training tops and shorts in Bangladesh. Cash on delivery all over Bangladesh.",
    h1: "Football jerseys and shorts",
    lead: "Match jerseys, training tops and shorts in a range of sizes and colours.",
    bn: "ফুটবল জার্সি ও শর্টস অনলাইনে কিনুন। সারা বাংলাদেশে ক্যাশ অন ডেলিভারি।",
    body: [
      "Check the size on each product page before you order.",
    ],
    keywords: ["football jersey Bangladesh", "jersey price in BD", "football shorts BD", "ফুটবল জার্সি"],
    faq: [{
        q: "How do I pick my size?",
        a: "Measure your foot length in centimetres and compare it with the size chart, or message us on WhatsApp with your foot length. If you are between two sizes, go one size up.",
      },
      deliveryFaq,
      codFaq],
  },
  {
    slug: "socks",
    label: "Socks",
    category: "socks",
    title: "Football Socks in Bangladesh",
    description: "Football socks and grip socks in Bangladesh. Cash on delivery all over Bangladesh.",
    h1: "Football socks in Bangladesh",
    lead: "Long match socks and grip socks in team colours.",
    bn: "ফুটবল সক্স ও গ্রিপ সক্স অনলাইনে কিনুন। সারা বাংলাদেশে ক্যাশ অন ডেলিভারি।",
    body: [
      "Long socks keep shin guards in place, and grip socks stop your foot sliding inside the boot.",
    ],
    keywords: ["football socks Bangladesh", "grip socks BD", "ফুটবল সক্স"],
    faq: [deliveryFaq, codFaq],
  },
  {
    slug: "shin-guards",
    label: "Shin guards",
    category: "shin-guards",
    title: "Football Shin Guards in Bangladesh",
    description: "Football shin guards in Bangladesh, slip-in and with ankle cover. Cash on delivery all over Bangladesh.",
    h1: "Shin guards in Bangladesh",
    lead: "Lightweight protection for the shin, with and without ankle cover.",
    bn: "ফুটবল শিন গার্ড অনলাইনে কিনুন। সারা বাংলাদেশে ক্যাশ অন ডেলিভারি।",
    body: [
      "Pick the size by your height and wear the guard under a long sock.",
    ],
    keywords: ["shin guard Bangladesh", "shin pads BD", "শিন গার্ড"],
    faq: [deliveryFaq, codFaq],
  },
  {
    slug: "gloves",
    label: "Keeper gloves",
    category: "gloves",
    title: "Goalkeeper Gloves in Bangladesh",
    description: "Goalkeeper gloves in Bangladesh with a soft grip palm. Cash on delivery all over Bangladesh.",
    h1: "Goalkeeper gloves in Bangladesh",
    lead: "Gloves with a grippy palm for training and match days.",
    bn: "গোলকিপার গ্লাভস অনলাইনে কিনুন। সারা বাংলাদেশে ক্যাশ অন ডেলিভারি।",
    body: [
      "Choose a glove size that leaves a little room at the fingertips.",
    ],
    keywords: ["goalkeeper gloves Bangladesh", "keeper gloves BD", "গোলকিপার গ্লাভস"],
    faq: [{
        q: "How do I pick my size?",
        a: "Measure your foot length in centimetres and compare it with the size chart, or message us on WhatsApp with your foot length. If you are between two sizes, go one size up.",
      },
      deliveryFaq,
      codFaq],
  },
  {
    slug: "bags",
    label: "Bags",
    category: "bags",
    title: "Football Bags in Bangladesh",
    description: "Boot bags and kit backpacks in Bangladesh. Cash on delivery all over Bangladesh.",
    h1: "Football bags in Bangladesh",
    lead: "Carry your boots, ball and kit to every session.",
    bn: "ফুটবল ব্যাগ ও বুট ব্যাগ অনলাইনে কিনুন। সারা বাংলাদেশে ক্যাশ অন ডেলিভারি।",
    body: [
      "Keep wet boots in a bag that lets air through.",
    ],
    keywords: ["football bag Bangladesh", "boot bag BD", "ফুটবল ব্যাগ"],
    faq: [deliveryFaq, codFaq],
  },
  {
    slug: "training",
    label: "Training gear",
    category: "training",
    title: "Football Training Gear in Bangladesh",
    description: "Cones, pumps, armbands and training gear in Bangladesh. Cash on delivery all over Bangladesh.",
    h1: "Football training gear",
    lead: "Cones, pumps, armbands and the small things every session needs.",
    bn: "ফুটবল ট্রেনিং কোন, পাম্প ও প্র্যাকটিসের সরঞ্জাম অনলাইনে কিনুন। সারা বাংলাদেশে ক্যাশ অন ডেলিভারি।",
    body: [
      "Everything for drills and practice.",
    ],
    keywords: ["football training equipment Bangladesh", "training cones BD", "ফুটবল ট্রেনিং সরঞ্জাম"],
    faq: [deliveryFaq, codFaq],
  },
]

export const landingForCategory = (category: string) => landings.find((l) => l.category === category);

/** Page for a catalog category, e.g. "skincare" → "/skin-care/". */
export const categoryHref = (category: string) => {
  const l = landingForCategory(category);
  return l ? `/${l.slug}/` : `/products/?category=${category}`;
};
