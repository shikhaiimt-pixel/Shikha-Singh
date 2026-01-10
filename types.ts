
export enum Severity {
  P0 = 'P0',
  P1 = 'P1',
  P2 = 'P2'
}

export enum IssueType {
  Technical = 'Technical',
  NonTechnical = 'Non-technical'
}

export interface AuditIssue {
  id: string;
  title: string;
  severity: Severity;
  type: IssueType;
  found: string | boolean | null;
  description: string;
  whyItMatters: string;
  howToFix: string;
  exampleSnippet?: string;
}

export interface AuditExtracted {
  title?: string;
  description?: string;
  robots?: string;
  canonical?: string;
  og: Record<string, string>;
  twitter: Record<string, string>;
  hreflang: string[];
  jsonld: any[];
  imageAltCount?: number;
  missingAltCount?: number;
}

export interface AuditResponse {
  url: string;
  finalUrl: string;
  statusCode: number;
  redirectChain: string[];
  score: number;
  grade: 'Excellent' | 'Good' | 'Needs Work' | 'Poor';
  counts: {
    P0: number;
    P1: number;
    P2: number;
    technical: number;
    nonTechnical: number;
  };
  issues: AuditIssue[];
  extracted: AuditExtracted;
}

export interface LeadForm {
  name: string;
  email: string;
  website: string;
  businessType: string;
  notes: string;
  emailReport: boolean;
}
