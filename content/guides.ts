export type GuideCategory =
  | "SEO Basics"
  | "Local SEO"
  | "Social Previews"
  | "Speed"
  | "Coaches"
  | "Plumbers"
  | "Salons"
  | "Dentists";

export type GuideBlock =
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "image"; src: string; alt: string; caption?: string }
  | { type: "table"; headers: string[]; rows: string[][]; caption?: string }
  | { type: "chart"; title: string; labels: string[]; values: number[]; note?: string }
  | { type: "faq"; items: { q: string; a: string }[] };

export interface GuidePost {
  slug: string;
  title: string;              // H1
  excerpt: string;            // list page
  date: string;
  author: string;
  readTime: string;
  category: GuideCategory;
  tags: string[];

  // SEO / share
  metaTitle: string;
  metaDescription: string;
  ogImage: string;

  // publishing control
  status: "draft" | "published";

  // structured content
  blocks: GuideBlock[];
}

export const guides: GuidePost[] = [
  {
    slug: "google-business-profile-checklist",
    title: "Google Business Profile Checklist for Small Businesses",
    excerpt:
      "A step-by-step checklist to improve your GBP visibility, trust signals, and local enquiries.",
    date: "January 17, 2026",
    author: "Mapmyspot Editorial",
    readTime: "10 min",
    category: "Local SEO",
    tags: ["GBP", "Google Maps", "Local SEO", "Small Business"],

    metaTitle:
      "Google Business Profile Checklist (2026) | Improve Local Rankings",
    metaDescription:
      "Use this Google Business Profile checklist to improve local visibility: categories, services, reviews, posts, photos, NAP consistency, and website trust signals.",
    ogImage:
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1600&q=80",

    status: "published",

    blocks: [
      { type: "p", text: "Your Google Business Profile (GBP) can drive calls and enquiries even when your website is weak. This checklist focuses on the highest-impact actions first." },

      { type: "h2", text: "TL;DR: The 80/20 checklist" },
      {
        type: "ul",
        items: [
          "Choose the most accurate primary category (don’t guess).",
          "Complete services, description, hours, attributes, and service areas.",
          "Upload new photos weekly and publish Posts consistently.",
          "Ask for reviews every week and reply to every review.",
          "Keep Name/Address/Phone consistent across your website + directories.",
        ],
      },

      {
        type: "image",
        src: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1600&q=80",
        alt: "Small business team reviewing local SEO metrics and customer feedback",
        caption: "Consistency (info + activity + reviews) is what makes GBP trustworthy over time.",
      },

      { type: "h2", text: "1) Setup checklist (do this first)" },
      { type: "h3", text: "Business info that affects visibility" },
      {
        type: "ol",
        items: [
          "Primary category: pick the one closest to your core service.",
          "Add secondary categories only if they’re truly relevant.",
          "Write a description that includes your service + area + trust proof.",
          "Add services with clear names (match what people search).",
          "Set accurate hours + holiday hours.",
        ],
      },

      { type: "h2", text: "2) Trust signals that move rankings" },
      {
        type: "table",
        caption: "Quick trust wins",
        headers: ["Signal", "What to do", "Frequency"],
        rows: [
          ["Photos", "Add real job/office/team photos", "Weekly"],
          ["Posts", "Updates, offers, FAQs, before/after", "1–2x/week"],
          ["Reviews", "Ask consistently + reply to all", "Weekly"],
        ],
      },

      {
        type: "chart",
        title: "Why consistency beats one-time optimization",
        labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
        values: [2, 4, 6, 9],
        note: "Example trend: steady activity compounds trust signals.",
      },

      { type: "h2", text: "3) Reviews: the easiest compounding growth lever" },
      {
        type: "ul",
        items: [
          "Ask after successful jobs/appointments (same day if possible).",
          "Reply to every review (good and bad).",
          "Mention the service and location naturally in replies (no spam).",
        ],
      },

      { type: "h2", text: "FAQ" },
      {
        type: "faq",
        items: [
          {
            q: "How many photos should I add?",
            a: "Aim for 3–10 new photos per week. Real photos outperform stock images for trust.",
          },
          {
            q: "Do Posts matter?",
            a: "They can help engagement and freshness signals. Consistency matters more than perfection.",
          },
        ],
      },

      { type: "h2", text: "Sources & official references" },
      {
        type: "ul",
        items: [
          "Google Business Profile Help: https://support.google.com/business/",
          "Google Search Central docs: https://developers.google.com/search/docs",
          "Schema.org LocalBusiness: https://schema.org/LocalBusiness",
        ],
      },
    ],
  },

  // Add more guides here…
];
