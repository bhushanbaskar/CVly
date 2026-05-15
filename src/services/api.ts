export interface PersonaResult {
  score: number;
  liked: string[];
  improve: string[];
}

export interface TemplateSuggestion {
  name: string;
  reason: string;
}

export interface FullAnalysisResponse {
  ats: PersonaResult;
  hr: PersonaResult;
  manager: PersonaResult;
  templateSuggestions: TemplateSuggestion[];
}

export interface AnalysisResponse {
  resumeA: FullAnalysisResponse;
  resumeB: FullAnalysisResponse | null;
}

export interface AnalysisRequest {
  resumeText?: string;
  resumeFiles?: { data: string, mimeType: string }[];
  jobRole: string;
  extraInfo?: string;
}

export async function analyzeFullResume(request: AnalysisRequest): Promise<FullAnalysisResponse> {
  const response = await fetch("/api/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Analysis failed");
    } else {
      const text = await response.text();
      throw new Error(`Server error (${response.status}): ${text.substring(0, 100)}`);
    }
  }

  return response.json();
}

export interface DesignSuggestions {
  strategy: string;
  dos: string[];
  donts: string[];
  layoutAdvice: string;
  keywords: string[];
}

export async function getDesignSuggestions(jobRole: string, extraInfo?: string): Promise<DesignSuggestions> {
  const response = await fetch("/api/design-suggestions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ jobRole, extraInfo }),
  });

  return response.json();
}

export async function extractJobFromUrl(url: string): Promise<{ title: string; description: string; extraInfo: string }> {
  const response = await fetch("/api/extract-job", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ url }),
  });

  if (!response.ok) {
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Extraction failed");
    } else {
      const text = await response.text();
      throw new Error(`Server error (${response.status}): ${text.substring(0, 100)}`);
    }
  }

  return response.json();
}
