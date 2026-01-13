
import { GoogleGenAI } from "@google/genai";
import { AuditResponse } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function runAudit(url: string): Promise<AuditResponse> {
  let targetUrl = url.trim();
  if (!/^https?:\/\//i.test(targetUrl)) targetUrl = 'https://' + targetUrl;

  const promptText = `Perform a comprehensive SEO and Local Visibility audit for the website: ${targetUrl}.

  CRITICAL: FOR THE 'local' SECTION, ONLY ANALYZE WEBSITE-ONLY SIGNALS.
  - Do not claim a Google Business Profile (GBP) exists or is missing on Google Maps. 
  - Scan the website's code and content for: Name/Address/Phone (NAP) patterns, tel: links, Google Maps iframe embeds, Schema.org/LocalBusiness or Organization markup, and mentions of city/service keywords.
  - 'mapsStatus' must always be 'unknown' in your response.

  REQUIRED JSON SCHEMA:
  {
    "url": "${targetUrl}",
    "finalUrl": "${targetUrl}",
    "statusCode": 200,
    "fetchedAtISO": "${new Date().toISOString()}",
    "score": number,
    "grade": "Excellent"|"Good"|"Needs Improvement"|"Poor",
    "counts": { "critical": number, "warnings": number, "medium": number, "technical": number, "nonTechnical": number, "growthOpps": number },
    "overview": { "priorityFixes": [], "summaryBullets": [], "recommendedNextStep": string },
    "local": {
      "mapsStatus": "unknown",
      "providedGbpUrl": null,
      "websiteSignals": {
        "gbpLinkFound": boolean,
        "gbpLinkUrl": string|null,
        "napFound": boolean,
        "addressFound": boolean,
        "phoneFound": boolean,
        "telLinkFound": boolean,
        "localKeywordsFound": boolean,
        "mapsEmbedFound": boolean,
        "schemaLocalBusinessFound": boolean,
        "reviewsSectionFound": boolean
      },
      "localReadinessScore": number,
      "recommendations": [
        { "title": string, "impact": "High"|"Medium"|"Low", "type": "Non-technical"|"Technical", "steps": [string], "difficulty": "Easy"|"Medium"|"Hard" }
      ]
    },
    "speed": { "status": "estimated", "metrics": { "loadTimeMs": number, "mobileFriendly": boolean }, "tips": [] },
    "seo": { "title": {}, "metaDescription": {}, "canonical": {}, "robots": {}, "headings": {}, "altTags": {}, "recommendations": [] },
    "social": { "openGraph": {}, "twitter": {}, "previews": { "google": {}, "facebook": {}, "twitter": {} } },
    "structuredData": { "status": "unknown", "detectedTypes": [], "parseErrors": [], "opportunities": [] }
  }`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: [{ role: 'user', parts: [{ text: promptText }] }],
      config: { 
        temperature: 0.1,
        responseMimeType: "application/json",
        systemInstruction: "You are a senior Local SEO auditor. You evaluate websites for local search signals like NAP consistency, schema, and local keyword relevance. You never assume GMB status without user-provided links."
      },
    });

    const parsed = JSON.parse(response.text);
    return parsed;
  } catch (err) {
    console.error("Audit Service Failed:", err);
    throw new Error("Local audit failed. Please try again.");
  }
}
