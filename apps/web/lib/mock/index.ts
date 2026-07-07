import { AiTask } from "../ai/aiClient";

export function getMockResponse<T>(task: AiTask, payload: unknown): T {
  switch (task) {
    case "chat":
      return { 
        message: "This is a simulated response. Verify with the official department.",
        intent: "general"
      } as unknown as T;
    
    case "scheme-recommendation":
      return {
        recommendations: [
          {
            id: "SCH-001",
            name: "Mock Scheme (Simulated)",
            eligibility: "Eligible based on mock profile",
            benefits: ["Mock benefit"],
            documents: ["Aadhaar", "Mock Doc"],
            steps: ["Step 1 mock"],
            officialLink: "https://india.gov.in"
          }
        ]
      } as unknown as T;
      
    case "complaint-generation":
      return {
        id: "CMP-2026-000482",
        category: "civic",
        department: "Municipal Corporation",
        priority: "medium",
        summary: (payload as Record<string, string>)?.description ? `Mock summary of: ${(payload as Record<string, string>).description}` : "Mock complaint",
        estimatedResolutionDays: 3
      } as unknown as T;
      
    // Default fallback for any other task
    default:
      return { 
        status: "mocked", 
        task,
        note: "This is a simulated result for demonstration. Verify with the official department before acting." 
      } as unknown as T;
  }
}
