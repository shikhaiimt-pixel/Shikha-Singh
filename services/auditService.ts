
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
      model: 'gemini-2.5-flash-lite',
      contents: [{ role: 'user', parts: [{ text: promptText }] }],
      config: { 
        temperature: 0.1,
        responseMimeType: "application/json",
        systemInstruction: "You are a professional SEO analyzer. Output ONLY the JSON object. Do not include markdown formatting (like ```json), commentary, or extra text at the end."
      },
    });

    let rawText = response.text.trim();
    
    // Attempt to extract the JSON block if the model included extra text
    // This regex looks for the outermost curly braces
    const jsonMatch = rawText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("No JSON found in response");
    }
    
    const jsonToParse = jsonMatch[0];

    try {
      const parsed = JSON.parse(jsonToParse);
      return parsed;
    } catch (parseError) {
      console.error("JSON Parse Error on extracted text:", parseError);
      console.debug("Problematic text segment:", jsonToParse.substring(0, 100) + "...");
      throw parseError;
    }
  } catch (err) {
    console.error("Audit Service Failed:", err);
    throw new Error("Local audit failed. Please try again.");
  }
}
