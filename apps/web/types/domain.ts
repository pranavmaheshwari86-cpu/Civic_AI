export interface GovernmentScheme {
  id: string;
  name: string;
  category: "student" | "farmer" | "business" | "senior-citizen" | "general";
  eligibilityCriteria: { minAge?: number; maxAge?: number; maxIncome?: number; states?: string[]; occupations?: string[] };
  benefits: string[];
  requiredDocuments: string[];
  applicationSteps: string[];
  officialLink: string;
}

export interface Department {
  id: string;
  name: string;
  category: string;
  avgResponseTimeHours: number;
}

export interface Complaint {
  id: string;              // e.g. "CMP-2026-000482"
  category: string;
  department: string;
  priority: "low" | "medium" | "high" | "critical";
  summary: string;
  location: string;
  status: "submitted" | "assigned" | "in-progress" | "resolved";
  estimatedResolutionDate: string;
  createdAt: string;
  timeline: { stage: Complaint["status"]; timestamp: string }[];
}

export interface CitizenProfile {
  name?: string;
  age?: number;
  gender?: string;
  occupation?: string;
  income?: number;
  state?: string;
  category?: string;
  savedSchemeIds: string[];
  language: "en" | "hi" | "ta" | "mr" | "gu" | "pa";
}

export interface Reminder {
  id: string;
  title: string;
  dueDate: string;
  type: "passport" | "license" | "scholarship" | "election" | "tax";
}

export interface Policy {
  id: string;
  title: string;
  summary: string;
  keyPoints: string[];
  deadlines: string[];
  benefits: string[];
  penalties: string[];
  plainLanguageRewrite: string;
}

export interface NewsItem {
  id: string;
  headline: string;
  sourceText: string;
  simplifiedText: string;
  date: string;
  impact: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}
