export const SITE_URL = "https://247bd.net";
export const SITE_NAME = "247BD";

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
    slug: "mens-grooming",
    label: "All",
    category: null,
    title: "Men's Grooming Products in Bangladesh",
    description:
      "Shop men's grooming products in Bangladesh: hair clay, pomade, sea salt spray, shampoo, curl cream, face wash and moisturizer. Cash on delivery all over Bangladesh.",
    h1: "Men's grooming products in Bangladesh",
    lead: "Hair styling, hair care, curly hair and skin care for men, delivered anywhere in Bangladesh with cash on delivery.",
    body: [
      "247BD is the grooming store of PahelaPride. Everything here is from the PRIDE grooming line: styling products for every hairstyle, shampoo and conditioner for daily care, a full curly hair routine, and simple skin care for men.",
      "Not sure where to start? Pick a combo. Each one is a complete routine, costs less than buying the products one by one, and most come with a free gift such as a texture comb, hair diffuser or skin towels.",
    ],
    keywords: ["men's grooming products Bangladesh", "men's grooming BD", "grooming kit for men Bangladesh", "men's hair products Bangladesh", "men's skin care Bangladesh"],
    faq: [
      {
        q: "Which grooming products should a beginner buy?",
        a: "Start with a shampoo and a styling product that suits your hair. For short to medium straight or wavy hair, a matte hair clay is the most versatile. For curly hair, a curl cream with a leave-in conditioner works best.",
      },
      deliveryFaq,
      codFaq,
    ],
  },
  {
    slug: "hair-styling",
    label: "Hair styling",
    category: "hair-styling",
    title: "Hair Styling Products in Bangladesh – Hair Clay, Pomade, Sea Salt Spray",
    description:
      "Buy hair styling products in Bangladesh: PRIDE hair clay, pomade, sea salt spray and texture powder. Strong hold, matte or shine finish. Budget packs from ৳549, cash on delivery.",
    h1: "Hair styling products in Bangladesh",
    lead: "Hair clay, pomade, sea salt spray and texture powder for every hairstyle, from messy textured crops to slick side parts.",
    body: [
      "Hair clay gives strong hold with a matte, natural finish and is the best all-rounder for short and medium hair. Pomade gives a classic shine for slick-backs and side parts. Sea salt spray adds volume and beachy texture before you style, and texture powder lifts flat hair at the roots in seconds.",
      "Every styling product comes in budget pack sizes so you can try it first, and full sizes come with a free texture comb. Combine two in a combo to save more.",
    ],
    keywords: ["hair clay price in Bangladesh", "hair styling products Bangladesh", "pomade price in BD", "sea salt spray Bangladesh", "texture powder Bangladesh", "hair wax for men BD", "matte hair clay"],
    faq: [
      {
        q: "Hair clay or pomade: which one should I use?",
        a: "Use hair clay for a matte, textured look with strong hold. Use pomade if you want shine and a neat, slicked style. Clay suits thick and wavy hair; pomade is easier to restyle through the day.",
      },
      {
        q: "How much is hair clay in Bangladesh?",
        a: "PRIDE Hair Clay starts at ৳549 for the 20ml budget pack, with 45ml and 85ml full sizes. The full size comes with a free texture comb.",
      },
      deliveryFaq,
    ],
  },
  {
    slug: "hair-care",
    label: "Hair care",
    category: "hair-care",
    title: "Men's Hair Care in Bangladesh – Shampoo, Conditioner, Hair Oil",
    description:
      "Sulfate-free shampoo, conditioner and hair elixir for men in Bangladesh. Gentle daily hair care for soft, healthy hair. Budget packs from ৳499, cash on delivery.",
    h1: "Hair care for men in Bangladesh",
    lead: "Sulfate-free shampoo and conditioner for daily use, plus a lightweight hair elixir for shine and frizz control.",
    body: [
      "Dust, sweat and humidity are hard on hair. A gentle sulfate-free shampoo cleans the scalp without drying it, and a conditioner keeps hair soft and easy to style. Hair elixir adds shine and protects from heat and pollution.",
      "Try the 50ml budget packs first, or save with the Shower Duo bundle of shampoo and conditioner.",
    ],
    keywords: ["men's shampoo Bangladesh", "sulfate free shampoo BD", "conditioner for men Bangladesh", "hair care products Bangladesh", "hair oil for men BD"],
    faq: [
      {
        q: "Is sulfate-free shampoo good for daily use?",
        a: "Yes. Sulfate-free shampoo cleans gently without stripping natural oils, so it is suitable for daily washing, including for a dry or sensitive scalp.",
      },
      deliveryFaq,
      codFaq,
    ],
  },
  {
    slug: "curly-hair",
    label: "Curly hair",
    category: "curly-hair",
    title: "Curly Hair Products in Bangladesh – Curl Cream, Leave-in, Curl Gel",
    description:
      "Curly hair products in Bangladesh: PRIDE Santal curl cream, leave-in conditioner, curl gel, curl mousse and refresh spray. Define curls and control frizz. Cash on delivery.",
    h1: "Curly hair products in Bangladesh",
    lead: "A complete routine for curly, wavy and coily hair: define your curls, stop frizz and keep them bouncy all day.",
    body: [
      "Start with a leave-in conditioner on damp hair for moisture, then a curl cream to define each curl. Add curl gel for longer hold or curl mousse for volume, and use the refresh spray on day two or three.",
      "The Santal Curly Combo and the 4-piece Curl Care Set give you the whole routine and come with a free hair diffuser.",
    ],
    keywords: ["curly hair products Bangladesh", "curl cream price in BD", "leave in conditioner Bangladesh", "curl gel Bangladesh", "frizz control Bangladesh", "wavy hair products BD"],
    faq: [
      {
        q: "What is the best routine for curly hair in humid weather?",
        a: "After washing, apply a leave-in conditioner, then curl cream to define, and finish with curl gel for hold. Let it air dry or use a diffuser, and avoid touching curls while they dry to reduce frizz.",
      },
      deliveryFaq,
      codFaq,
    ],
  },
  {
    slug: "skin-care",
    label: "Skin care",
    category: "skincare",
    title: "Men's Skin Care in Bangladesh – Face Wash, Moisturizer, Under Eye",
    description:
      "Simple men's skin care in Bangladesh: daily facial cleanser, moisturizer, under eye elixir, skin revival spray and tallow moisturizer. Cash on delivery all over Bangladesh.",
    h1: "Skin care for men in Bangladesh",
    lead: "A simple routine for men's skin: cleanse, moisturize and treat tired eyes.",
    body: [
      "Wash your face morning and night with a gentle cleanser, then lock in hydration with a light moisturizer. For dark circles and puffiness, add the under eye elixir. The skin revival spray soothes redness after sun or shaving.",
      "The Skincare Duo and the Complete Skincare Set cost less than buying each product alone and come with 2 free antibacterial skin towels.",
    ],
    keywords: ["men's face wash Bangladesh", "moisturizer for men BD", "men's skin care Bangladesh", "under eye cream for men Bangladesh", "skin care routine for men"],
    faq: [
      {
        q: "What is a simple skin care routine for men?",
        a: "Use a face wash morning and night, apply moisturizer after washing, and add an under eye product if you have dark circles or puffiness. Use sunscreen when you're outside in the day.",
      },
      deliveryFaq,
      codFaq,
    ],
  },
  {
    slug: "combos",
    label: "Combos",
    category: "combos",
    title: "Grooming Combos & Gift Sets for Men in Bangladesh",
    description:
      "Men's grooming combos in Bangladesh: hair styling sets, curly hair kits and skincare sets that cost less together, with a free gift. Cash on delivery.",
    h1: "Grooming combos and gift sets",
    lead: "Complete routines in one box. Each combo costs less than buying the products one by one, and most come with a free gift.",
    body: [
      "Choose a styling set for hold and texture, a curly hair kit for defined curls, or a skincare set for a simple daily routine. Combos also make easy gifts for a brother, friend or husband.",
    ],
    keywords: ["grooming kit for men Bangladesh", "gift set for men Bangladesh", "hair styling combo BD", "skincare combo for men", "men's gift Bangladesh"],
    faq: [
      {
        q: "What free gift comes with the combos?",
        a: "Styling combos come with a free texture comb, curly hair combos with a free hair diffuser, and skincare combos with 2 free antibacterial skin towels.",
      },
      deliveryFaq,
      codFaq,
    ],
  },
];

export const landingForCategory = (category: string) => landings.find((l) => l.category === category);

/** Page for a catalog category, e.g. "skincare" → "/skin-care/". */
export const categoryHref = (category: string) => {
  const l = landingForCategory(category);
  return l ? `/${l.slug}/` : `/products/?category=${category}`;
};
