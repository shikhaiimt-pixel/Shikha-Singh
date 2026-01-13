
export type Severity = "Critical" | "Warning" | "Medium";
export type Impact = "High" | "Medium" | "Low";
export type Diff = "Easy" | "Medium" | "Hard";

export interface ActionItem {
  title: string;
  impact: Impact;
  type: string;
  steps: string[];
  difficulty: Diff;
}

export interface IssueItem {
  id: string;
  title: string;
  severity: Severity;
  type: string;
  whatWeFound: string;
  whyItMatters: string;
  howToFix: string[];
  exampleSnippet?: string;
  estTime: string;
}

export interface AuditResponse {
  url: string;
  finalUrl: string;
  statusCode: number;
  fetchedAtISO: string;
  score: number;
  grade: string;
  counts: {
    critical: number;
    warnings: number;
    medium: number;
    technical: number;
    nonTechnical: number;
    growthOpps: number;
  };
  overview: {
    priorityFixes: IssueItem[];
    summaryBullets: string[];
    recommendedNextStep: string;
  };
  local: {
    mapsStatus: "unknown" | "provided";
    providedGbpUrl: string | null;
    websiteSignals: {
      gbpLinkFound: boolean;
      gbpLinkUrl: string | null;
      napFound: boolean;
      addressFound: boolean;
      phoneFound: boolean;
      telLinkFound: boolean;
      localKeywordsFound: boolean;
      mapsEmbedFound: boolean;
      schemaLocalBusinessFound: boolean;
      reviewsSectionFound: boolean;
    };
    localReadinessScore: number;
    recommendations: ActionItem[];
  };
  speed: {
    status: "ok" | "estimated" | "unknown";
    metrics: {
      loadTimeMs: number | null;
      pageSizeKB: number | null;
      requestsCount: number | null;
      mobileFriendly: boolean | null;
      compression: "yes" | "no" | "unknown";
      caching: "yes" | "no" | "unknown";
    };
    tips: ActionItem[];
  };
  seo: {
    title: { value: string | null; length: number | null; status: string; suggestion: string };
    metaDescription: { value: string | null; length: number | null; status: string; suggestion: string };
    canonical: { value: string | null; status: string; suggestion: string };
    robots: { value: string | null; status: string; suggestion: string };
    headings: { h1Count: number | null; suggestion: string };
    altTags: { totalImages: number | null; missingAltCount: number | null; examplesMissingAlt: string[] };
    recommendations: ActionItem[];
    recommendedHeadSnippet: string;
  };
  social: {
    openGraph: {
      ogTitle: string | null;
      ogDescription: string | null;
      ogImage: string | null;
      ogUrl: string | null;
      ogType: string | null;
      issues: IssueItem[];
      recommendedTagsSnippet: string;
    };
    twitter: {
      card: string | null;
      title: string | null;
      description: string | null;
      image: string | null;
      issues: IssueItem[];
      recommendedTagsSnippet: string;
    };
    previews: {
      google: { title: string; description: string; displayUrl: string };
      facebook: { title: string; description: string; imageUrl: string | null; url: string };
      twitter: { title: string; description: string; imageUrl: string | null; url: string; cardType: string | null };
    };
  };
  structuredData: {
    status: "present" | "missing" | "invalid" | "unknown";
    detectedTypes: string[];
    parseErrors: string[];
    opportunities: ActionItem[];
    recommendedJsonLdSnippets: string[];
  };
}
