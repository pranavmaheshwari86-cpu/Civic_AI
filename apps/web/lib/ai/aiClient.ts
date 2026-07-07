import { getMockResponse } from "../mock";

export type AiTask = 
  | "chat" 
  | "scheme-recommendation"
  | "eligibility-check"
  | "complaint-generation"
  | "document-assistant"
  | "policy-explainer"
  | "form-assistant"
  | "translation"
  | "smart-search"
  | "news-simplifier"
  | "admin-summary";

export async function runAiTask<T>(task: AiTask, payload: unknown): Promise<T> {
  try {
    const res = await fetch("/api/ai", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ task, payload }),
    });
    
    if (!res.ok) {
      console.warn(`AI request failed with status ${res.status}. Using mock fallback.`);
      return getMockResponse<T>(task, payload);
    }

    return await res.json();
  } catch (error) {
    console.warn("AI network request failed completely. Using mock fallback.", error);
    return getMockResponse<T>(task, payload);
  }
}
