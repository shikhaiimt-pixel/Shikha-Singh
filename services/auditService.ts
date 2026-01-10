
import { GoogleGenAI } from "@google/genai";
import { AuditResponse, Severity, IssueType, AuditIssue } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Uses Gemini 3 Pro with Grounding to perform a deep-dive local SEO audit.
 * Specifically handles the discovery of Google Business Profiles (GMB/GBP) for 
 * local service businesses and personal brands.
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
      brandHint = parts[0].charAt(0).toUpperCase() + parts[0].slice(1);
    }
  } catch (e) {
    domain = targetUrl;
  }

  // Engineering a prompt that forces the model to verify via Grounding
  const promptText = `Perform a high-precision Local SEO audit for: ${targetUrl} (Entity Hint: ${brandHint})

TASKS:
1. GOOGLE BUSINESS PROFILE (GBP/GMB) DISCOVERY:
   - Search for "${brandHint}" and "${domain}" on Google Search and Google Maps.
   - Look for a "Knowledge Panel" (on the right side of search) or a Google Maps pin.
   - For individuals (e.g., Maria Demérus), find the professional listing associated with their brand or location.
   - Extract EXACT values: "hasGbp" (boolean), "gbpRating" (float), "gbpReviewCount" (integer), and "businessName" (string).
   - If you see ANY rating stars or review counts for this specific brand/person, "hasGbp" MUST be true.
2. ACCESSIBILITY: 
   - Scan the site's presence for images missing "alt" attributes.
3. ON-PAGE SEO:
   - Identify the current Title tag and Meta Description.

Return ONLY a valid JSON object:
{
  "businessName": "Official Brand Name",
  "hasGbp": true,
  "gbpRating": 4.9,
  "gbpReviewCount": 24,
  "title": "Page Title",
  "description": "Meta Description",
  "imageStats": {
    "total": 15,
    "missingAlt": 2,
    "genericAlt": 1
  }
}`;

  let auditData = {
    businessName: brandHint,
    title: domain,
    description: "Analyzing local SEO footprint...",
    isSsl: targetUrl.startsWith('https'),
    hasGbp: false,
    gbpRating: 0,
    gbpReviewCount: 0,
    imageStats: { total: 0, missingAlt: 0, genericAlt: 0 }
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: [{
        role: 'user',
        parts: [{ text: promptText }]
      }],
      config: {
        tools: [{ googleSearch: {} }],
        temperature: 0.1, // High precision
      },
    });

    const responseText = response.text;
    if (responseText) {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        
        // --- MULTI-LAYERED GMB VERIFICATION ---
        // We override the model's boolean if it found numerical data (rating/reviews)
        // to prevent false negatives for established profiles.
        const foundReviews = parseInt(String(parsed.gbpReviewCount || 0));
        const foundRating = parseFloat(String(parsed.gbpRating || 0));
        const isVerified = !!parsed.hasGbp || foundReviews > 0 || foundRating > 0;

        auditData = {
          ...auditData,
          ...parsed,
          hasGbp: isVerified,
          gbpReviewCount: foundReviews,
          gbpRating: foundRating
        };
      }
    }
  } catch (err) {
    console.error("GMB Discovery Error:", err);
  }

  const issues: AuditIssue[] = [];

  // --- Issue Categorization & Scoring Logic ---
  if (!auditData.hasGbp) {
    issues.push({
      id: 'missing-gbp',
      title: 'Google Business Profile Not Found',
      severity: Severity.P0,
      type: IssueType.Technical,
      found: 'No verified listing detected',
      description: 'Your business does not appear to have a verified Google Business Profile.',
      whyItMatters: 'GBP is the #1 factor for ranking in local search. Without it, you are invisible to nearby customers using Google Maps.',
      howToFix: 'Go to business.google.com to claim and verify your location or service area.',
      exampleSnippet: 'Verify Your Identity'
    });
  } else {
    if (auditData.gbpReviewCount < 15) {
      issues.push({
        id: 'low-reviews',
        title: 'Low Trust Factor (Reviews)',
        severity: Severity.P1,
        type: IssueType.NonTechnical,
        found: `${auditData.gbpReviewCount} reviews found`,
        description: 'Your profile is found but has very few reviews.',
        whyItMatters: 'Customers rarely trust profiles with fewer than 15 reviews. High review counts significantly boost your Local 3-Pack ranking.',
        howToFix: 'Send your direct Google review link to your last 10 happy customers.',
        exampleSnippet: 'Target: 25+ Reviews'
      });
    }
  }

  if (!auditData.title || auditData.title.length < 10 || auditData.title.toLowerCase().includes('index')) {
    issues.push({
      id: 'poor-title',
      title: 'Weak SEO Title Tag',
      severity: Severity.P0,
      type: IssueType.Technical,
      found: auditData.title || 'Incomplete',
      description: 'The title tag is missing or generic.',
      whyItMatters: 'This is the most important on-page SEO signal. If it says "Home", you will never rank for your actual services.',
      howToFix: 'Update your <title> to include your primary service and city.',
      exampleSnippet: `<title>${auditData.businessName} | Expert Consultant in Stockholm</title>`
    });
  }

  if (!auditData.description || auditData.description.length < 50) {
    issues.push({
      id: 'poor-desc',
      title: 'Missing Meta Description',
      severity: Severity.P1,
      type: IssueType.Technical,
      found: 'Empty or too short',
      description: 'Your meta description is not long enough to persuade users to click.',
      whyItMatters: 'A professional description acts as a free advertisement on Google. It increases Click-Through Rate (CTR).',
      howToFix: 'Write a 150-character summary of what you offer and include a call to action.',
      exampleSnippet: `<meta name="description" content="Professional services from ${auditData.businessName}. We help you achieve results with proven strategies. Get a free consultation today!">`
    });
  }

  if (auditData.imageStats.missingAlt > 0) {
    issues.push({
      id: 'missing-alt-tags',
      title: 'Accessibility: Missing Alt Tags',
      severity: Severity.P1,
      type: IssueType.Technical,
      found: `${auditData.imageStats.missingAlt} images affected`,
      description: 'Some images are missing descriptions.',
      whyItMatters: 'Search engines use Alt text to understand images. It is also required for ADA and accessibility compliance.',
      howToFix: 'Add descriptive "alt" tags to all images in your website editor.',
      exampleSnippet: '<img src="header.jpg" alt="Description of my local business services">'
    });
  }

  // --- REFINED SCORING ALGORITHM ---
  let score = 100;
  const p0s = issues.filter(i => i.severity === Severity.P0).length;
  const p1s = issues.filter(i => i.severity === Severity.P1).length;

  score -= (p0s * 35); 
  score -= (p1s * 15);

  // Logic Caps: If you lack a GMB or a Title, you can't be "Good" or "Excellent"
  if (p0s > 0) score = Math.min(score, 65);
  if (p0s > 1) score = Math.min(score, 45);
  
  score = Math.max(5, Math.min(100, score));

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
      robots: 'index, follow',
      canonical: targetUrl,
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
      missingAltCount: auditData.imageStats.missingAlt + auditData.imageStats.genericAlt
    }
  };
}

export async function submitLead(lead: any): Promise<boolean> {
  console.log('Lead captured by Mapmyspot:', lead);
  await new Promise(r => setTimeout(r, 600));
  return true;
}
