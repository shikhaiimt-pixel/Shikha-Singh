
export interface GuidePost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  readTime: string;
  category: 'SEO Basics' | 'Local SEO' | 'Social Previews' | 'Speed' | 'Coaches' | 'Plumbers' | 'Salons' | 'Dentists';
  content: string;
  ogImage: string;
  industry?: string;
  tags: string[];
}

export const guides: GuidePost[] = [
  {
    slug: 'title-tags-formula-examples',
    title: 'Title Tags That Get Clicks: Simple Formula + Examples',
    excerpt: 'Stop losing clicks to competitors. Learn the "Service + Location | Brand" formula used by the top 1% of small businesses.',
    date: 'March 24, 2024',
    author: 'Mapmyspot Team',
    readTime: '8 min',
    category: 'SEO Basics',
    tags: ['Title Tags', 'On-Page SEO', 'Click-Through Rate'],
    ogImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800',
    content: `<h2>The Golden Formula</h2><p>Most small businesses make the mistake of putting their brand name first. Unless you are Nike, people aren't searching for your name—they are searching for your service.</p><h3>The Formula: Service + City | Brand Name</h3><p><strong>Bad:</strong> Luigi's Pizza Brooklyn</p><p><strong>Good:</strong> Best Thin-Crust Pizza in Brooklyn | Luigi's Famous Pizza</p><h3>Why it works</h3><ul><li>Keywords are at the start</li><li>Location is crystal clear</li><li>Brand builds trust at the end</li></ul>`
  },
  {
    slug: 'meta-descriptions-10-examples',
    title: 'Meta Descriptions: 10 Examples That Win More Calls',
    excerpt: 'Think of your meta description as your free ad on Google. If it doesn’t have a CTA, you are leaving money on the table.',
    date: 'March 25, 2024',
    author: 'Mapmyspot Team',
    readTime: '6 min',
    category: 'SEO Basics',
    tags: ['Meta Descriptions', 'Copywriting', 'CTR'],
    ogImage: 'https://images.unsplash.com/photo-1454165833767-027ffea9e77b?auto=format&fit=crop&w=800',
    content: `<h2>Stop Using Boring Descriptions</h2><p>Google doesn't use meta descriptions for ranking, but users use them to decide where to click.</p><h3>Example for a Plumber:</h3><p><em>"Burst pipe? We arrive in 60 mins or less. Serving Austin since 1998. Licensed, insured, and 5-star rated. Call now for emergency service!"</em></p><h3>Example for a Coach:</h3><p><em>"Break through your career plateau with 1-on-1 executive coaching. Proven results for Fortune 500 managers. Schedule your free 15-min discovery call today."</em></p>`
  },
  {
    slug: 'social-previews-open-graph-guide',
    title: 'Open Graph & Twitter Cards: Look Professional on Social Media',
    excerpt: 'Fix the "ugly link" problem. Learn how to control the image and text that appears when your site is shared.',
    date: 'March 26, 2024',
    author: 'Mapmyspot Team',
    readTime: '7 min',
    category: 'Social Previews',
    tags: ['Open Graph', 'Social Media', 'Meta Tags'],
    ogImage: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=800',
    content: `<h2>The "Ugly Link" Penalty</h2><p>When someone shares your site and the image is missing or the text is "Home - My Site", your click-through rate drops by 50%.</p><h3>The Big 3 Tags</h3><ul><li><strong>og:image:</strong> 1200x630px is the sweet spot.</li><li><strong>og:title:</strong> Keep it punchy.</li><li><strong>og:description:</strong> Similar to a meta description.</li></ul>`
  },
  {
    slug: 'why-website-isnt-on-google',
    title: 'Why Your Website Isnt Showing on Google (Top 10 Fixes)',
    excerpt: 'Invisible to your customers? These 10 technical checks will identify why Google is ignoring your site.',
    date: 'March 27, 2024',
    author: 'Mapmyspot Team',
    readTime: '12 min',
    category: 'SEO Basics',
    tags: ['Indexing', 'Google Search Console', 'Technical SEO'],
    ogImage: 'https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=800',
    content: `<h2>Are You Even Indexed?</h2><p>First, search <code>site:yourwebsite.com</code> on Google. If nothing appears, you have an indexing problem.</p><h3>The Checklist</h3><ol><li>Check for <code>noindex</code> tags.</li><li>Verify Google Search Console.</li><li>Check your Robots.txt file.</li><li>Ensure you have a sitemap.</li></ol>`
  },
  {
    slug: 'google-business-profile-checklist',
    title: 'Google Business Profile Checklist for Small Businesses',
    excerpt: 'Your GMB profile is the front door to your local business. Here is the daily, weekly, and monthly checklist to win the Map Pack.',
    date: 'March 28, 2024',
    author: 'Mapmyspot Team',
    readTime: '10 min',
    category: 'Local SEO',
    tags: ['GMB', 'Google Maps', 'Local SEO'],
    ogImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800',
    content: `<h2>The Local Pack King</h2><p>Google Business Profile (GBP) is often more important than your actual website for local search.</p><h3>The Setup Checklist</h3><ul><li>Upload 3+ photos weekly.</li><li>Reply to EVERY review (even the bad ones).</li><li>Use the "Updates" post feature.</li><li>Ensure your hours are accurate.</li></ul>`
  },
  {
    slug: 'not-showing-on-google-maps-fixes',
    title: 'Why Your Business Isnt Showing on Google Maps',
    excerpt: 'Ranking in the top 3 of Google Maps is a goldmine. If you are stuck on page 2, these fixes are for you.',
    date: 'March 29, 2024',
    author: 'Mapmyspot Team',
    readTime: '9 min',
    category: 'Local SEO',
    tags: ['Google Maps', 'Local Pack', 'Rankings'],
    ogImage: 'https://images.unsplash.com/photo-1526778545894-dd816349354d?auto=format&fit=crop&w=800',
    content: `<h2>Proximity vs. Authority</h2><p>Google ranks maps based on Relevance, Distance, and Prominence.</p><h3>Fix #1: Categories</h3><p>Make sure your primary category is exactly what you do (e.g., "Emergency Plumber" vs "Plumber").</p><h3>Fix #2: Citations</h3><p>Is your name, address, and phone number (NAP) exactly the same on Yelp, Facebook, and YellowPages?</p>`
  },
  {
    slug: 'seo-for-coaches-guide',
    title: 'SEO for Coaches: Get Clients While You Sleep',
    excerpt: 'Personal branding meets technical SEO. Learn how to rank for your niche and convert readers into high-paying clients.',
    date: 'March 30, 2024',
    author: 'Mapmyspot Team',
    readTime: '11 min',
    category: 'Coaches',
    industry: 'Coaching',
    tags: ['Coaches', 'Personal Brand', 'Clients'],
    ogImage: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800',
    content: `<h2>The Coach Authority Loop</h2><p>Coaches need to rank for problems, not just "coach".</p><h3>Target the "How-To" keywords</h3><p>Write guides on "How to stop burnout" or "Executive leadership transitions." When they find your answer, they find their coach.</p>`
  },
  {
    slug: 'seo-for-plumbers-rank-checklist',
    title: 'SEO for Plumbers: Rank for Emergency Near Me',
    excerpt: 'When a pipe bursts at 2 AM, your SEO decides if you get the call. The survival guide for plumbing business owners.',
    date: 'March 31, 2024',
    author: 'Mapmyspot Team',
    readTime: '8 min',
    category: 'Plumbers',
    industry: 'Plumbing',
    tags: ['Plumbers', 'Trade SEO', 'Lead Gen'],
    ogImage: 'https://images.unsplash.com/photo-1581092921461-7d6560b3706e?auto=format&fit=crop&w=800',
    content: `<h2>The Emergency Near Me Game</h2><p>Plumbing SEO is high-intent and high-competition.</p><h3>The Local Dominator Plan</h3><ol><li>Service Area Pages: Create pages for every city you serve.</li><li>Reviews are fuel: Text your customers a link to your GMB profile before you leave the driveway.</li><li>Schema Markup: Use LocalBusiness schema so Google knows exactly where you are.</li></ol>`
  }
];
