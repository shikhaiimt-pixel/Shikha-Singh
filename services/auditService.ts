
import { GoogleGenAI } from "@google/genai";
import { AuditResponse, Severity, IssueType, AuditIssue } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Performs a high-precision Local SEO and Performance audit using Gemini 3 Pro with Grounding.
 * Refined to ensure high accuracy for Google Business Profiles (GMB), specifically for 
 * personal brands, doctors, and professional practitioners who may not have a clear 
 * 'storefront' address but have verified practitioner listings.
 */
export async function runAudit(url: string): Promise<AuditResponse> {
  let targetUrl = url.trim();
  if (!/^https?:\/\//i.test(targetUrl)) {
    targetUrl = 'https://' + targetUrl;
  }

  let domain = 'site';
  let brandHint = 'the business';
  try {
    const urlObj = new URL(targetUrl);
    domain = urlObj.hostname.replace('www.', '');
    const parts = domain.split('.');
    if (parts.length > 0) {
      // Improved brand hint extraction: handles domain-based names (e.g. mariademerus.com -> Maria Demerus)
      brandHint = parts[0].split(/[-.]/).map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    }
  } catch (e) {
    domain = targetUrl;
  }

  const promptText = `Perform a high-precision Local SEO and Speed Performance audit for the website: ${targetUrl}
Associated Domain: ${domain}
Potential Business/Practitioner Name: ${brandHint}

STRICT INSTRUCTIONS FOR GOOGLE BUSINESS PROFILE (GBP/GMB) CHECK:
1. Search specifically for "${brandHint}" and "${domain}" on Google Search and Google Maps.
2. For personal brands or individual practitioners (like "Maria Demerus" or "Dr. Anna Kalbhenn"), search for their full name and associated city to find a "Practitioner" or "Local Business" profile.
3. Look for the "Google Knowledge Panel" (the detailed business card on the right side of search results) or a verified Google Maps pin.
4. Extract exactly:
   - "hasGbp": (boolean) Set to TRUE if you find a verified Knowledge Panel, a Maps listing with ratings/reviews, or a profile that shows "Website" and "Directions" buttons.
   - "gbpRating": (number) The average star rating (e.g., 5.0).
   - "gbpReviewCount": (number) The total number of verified reviews.
   - "businessName": (string) The exact title used on the official Google listing.
5. MANDATORY VERIFICATION RULE: If you find ANY valid star rating or ANY review count associated with this entity or person on Google, you MUST set "hasGbp" to true. Do not report "Not Found" if ratings are visible.

ALSO ESTIMATE:
- Performance: loadTimeMs, pageSizeKb, and a score (0-100).
- SEO Health: Title tag content, meta description, and image alt stats.

Return ONLY a valid JSON object:
{
  "businessName": "Official Listing Name",
  "hasGbp": true,
  "gbpRating": 5.0,
  "gbpReviewCount": 10,
  "performance": { "loadTimeMs": 1500, "pageSizeKb": 1200, "score": 85 },
  "title": "Page Title",
  "description": "Meta Description",
  "imageStats": { "total": 10, "missingAlt": 1 }
}`;

  let auditData = {
    businessName: brandHint,
    title: domain,
    description: "Analyzing local SEO footprint and performance metrics...",
    isSsl: targetUrl.startsWith('https'),
    hasGbp: false,
    gbpRating: 0,
    gbpReviewCount: 0,
    performance: { loadTimeMs: 0, pageSizeKb: 0, score: 100 },
    imageStats: { total: 0, missingAlt: 0 }
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: [{ role: 'user', parts: [{ text: promptText }] }],
      config: { 
        tools: [{ googleSearch: {} }], 
        temperature: 0.1 // Low temperature for factual consistency
      },
    });

    const responseText = response.text;
    if (responseText) {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        
        // --- SECONDARY ROBUSTNESS OVERRIDE ---
        // Programmatic fallback: If the model found a rating or reviews, the profile definitely exists.
        // We override 'hasGbp' to true if these indicators are present to prevent false negatives.
        const foundReviews = parseInt(String(parsed.gbpReviewCount || 0));
        const foundRating = parseFloat(String(parsed.gbpRating || 0));
        const verifiedSignal = !!parsed.hasGbp || foundReviews > 0 || foundRating > 0;

        auditData = {
          ...auditData,
          ...parsed,
          hasGbp: verifiedSignal,
          gbpReviewCount: foundReviews,
          gbpRating: foundRating
        };
      }
    }
  } catch (err) {
    console.error("GMB Verification Error:", err);
  }

  const issues: AuditIssue[] = [];

  // --- Speed Check Logic ---
  if (auditData.performance.score < 70) {
    issues.push({
      id: 'slow-performance',
      title: 'Performance Score Below Optimal',
      severity: auditData.performance.score < 40 ? Severity.P0 : Severity.P1,
      type: IssueType.Technical,
      found: `${auditData.performance.loadTimeMs}ms load time`,
      description: 'Your website speed affects both user conversion and search engine crawl budget.',
      whyItMatters: 'Google confirmed that Core Web Vitals (speed) are a direct ranking factor for mobile and desktop.',
      howToFix: 'Optimize image assets, use WebP formats, and implement lazy loading.',
      exampleSnippet: 'Target: < 2.5s Load Time'
    });
  }

  // --- GMB Detection Logic ---
  if (!auditData.hasGbp) {
    issues.push({
      id: 'missing-gbp',
      title: 'Google Business Profile Not Found',
      severity: Severity.P0,
      type: IssueType.Technical,
      found: 'No active listing detected',
      description: 'We could not find a verified Google Business Profile for this website or practitioner name.',
      whyItMatters: 'GBP is the #1 signal for local search rankings. Without it, you are excluded from Google Maps and the Local Pack.',
      howToFix: 'Go to business.google.com to claim and verify your profile. Ensure your brand name matches your website.',
      exampleSnippet: 'Claim Your Local Identity'
    });
  } else if (auditData.gbpReviewCount < 15) {
    issues.push({
      id: 'low-reviews',
      title: 'Low Google Review Count',
      severity: Severity.P1,
      type: IssueType.NonTechnical,
      found: `${auditData.gbpReviewCount} reviews`,
      description: 'Your Google profile exists but has a low volume of customer reviews compared to industry leaders.',
      whyItMatters: 'Review volume is a major trust signal for prospective clients and helps you rank higher in Maps.',
      howToFix: 'Create a direct review request link and send it to your most satisfied clients.',
      exampleSnippet: 'Target: 25+ Google Reviews'
    });
  }

  // --- Title & Meta Health ---
  if (!auditData.title || auditData.title.length < 15 || auditData.title.toLowerCase().includes('index')) {
    issues.push({
      id: 'weak-title',
      title: 'Suboptimal SEO Title Tag',
      severity: Severity.P0,
      type: IssueType.Technical,
      found: auditData.title || 'Incomplete',
      description: 'Your title tag is either too short or missing key service-location descriptors.',
      whyItMatters: 'The title tag is the primary indicator to Google about what your business offers.',
      howToFix: 'Update your title to include your brand name and primary service keyword.',
      exampleSnippet: `<title>${auditData.businessName} | Local SEO Services</title>`
    });
  }

  // --- SCORING CALCULATION ---
  let score = 100;
  const p0s = issues.filter(i => i.severity === Severity.P0).length;
  const p1s = issues.filter(i => i.severity === Severity.P1).length;

  score -= (p0s * 35); 
  score -= (p1s * 15);
  score -= Math.max(0, (100 - auditData.performance.score) / 5);

  if (p0s > 0) score = Math.min(score, 65);
  score = Math.max(5, Math.min(100, Math.round(score)));

  let grade: 'Excellent' | 'Good' | 'Needs Work' | 'Poor' = 'Excellent';
  if (score >= 90) grade = 'Excellent';
  else if (score >= 75) grade = 'Good';
  else if (score >= 50) grade = 'Needs Work';
  else grade = 'Poor';

  return {
    url: targetUrl,
    finalUrl: targetUrl,
    statusCode: 200,
    redirectChain: [],
    score,
    grade,
    counts: { 
      P0: p0s, 
      P1: p1s, 
      P2: issues.filter(i => i.severity === Severity.P2).length, 
      technical: issues.filter(i => i.type === IssueType.Technical).length, 
      nonTechnical: issues.filter(i => i.type === IssueType.NonTechnical).length 
    },
    issues,
    extracted: {
      title: auditData.title,
      description: auditData.description,
      og: { title: auditData.title },
      twitter: { card: 'summary_large_image' },
      hreflang: [],
      jsonld: [{
        "@type": "LocalBusiness",
        "name": auditData.businessName,
        "rating": auditData.gbpRating,
        "reviewCount": auditData.gbpReviewCount,
        "verified": auditData.hasGbp
      }],
      imageAltCount: auditData.imageStats.total,
      missingAltCount: auditData.imageStats.missingAlt,
      loadTime: auditData.performance.loadTimeMs,
      pageSizeKb: auditData.performance.pageSizeKb,
      performanceScore: auditData.performance.score
    }
  };
}

export async function submitLead(lead: any): Promise<boolean> {
  console.log('Lead captured by Mapmyspot:', lead);
  await new Promise(r => setTimeout(r, 600));
  return true;
}
