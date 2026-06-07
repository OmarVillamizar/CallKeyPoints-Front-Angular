/** Mirrors the backend KnowledgeBase / Prompt / Profile DTOs. */

export interface KnowledgeBaseResponse {
  content: string;
  updatedAt: string | null;
}

export interface PromptTemplateResponse {
  content: string;
  updatedAt: string | null;
}

export interface TechnicianProfileResponse {
  displayName: string;
  updatedAt: string | null;
}
