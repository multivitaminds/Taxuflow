// AI Model Configuration for Taxu Platform
// This allows easy switching and A/B testing of different AI models

export type AIModel = "gpt-4o" | "gemini-3-pro" | "claude-3.5-sonnet"

export interface AIModelConfig {
  name: string
  modelId: string
  provider: string
  description: string
  strengths: string[]
  maxTokens: number
  timeoutMs: number
}

export const AI_MODELS: Record<AIModel, AIModelConfig> = {
  "gpt-4o": {
    name: "GPT-4o",
    modelId: "openai/gpt-4o",
    provider: "OpenAI",
    description: "Fast and reliable, excellent for general document extraction",
    strengths: ["Fast inference", "Reliable", "Good formatting"],
    maxTokens: 2000,
    timeoutMs: 10000,
  },
  "gemini-3-pro": {
    name: "Gemini 3 Pro Preview",
    modelId: "google/gemini-3-pro-preview",
    provider: "Google",
    description: "Superior multimodal reasoning, best for complex documents",
    strengths: ["Advanced OCR", "Better reasoning", "Complex layouts", "Superior address parsing"],
    maxTokens: 2000,
    timeoutMs: 15000,
  },
  "claude-3.5-sonnet": {
    name: "Claude 3.5 Sonnet",
    modelId: "anthropic/claude-3.5-sonnet",
    provider: "Anthropic",
    description: "Excellent accuracy and attention to detail",
    strengths: ["High accuracy", "Detail-oriented", "Structured output"],
    maxTokens: 2000,
    timeoutMs: 12000,
  },
}

// Get the model to use from environment variable, default to GPT-4o
export function getExtractionModel(): AIModelConfig {
  const modelKey = (process.env.EXTRACTION_MODEL || "gpt-4o") as AIModel
  
  const config = AI_MODELS[modelKey]
  
  if (!config) {
    console.warn(`[v0] Unknown model "${modelKey}", falling back to gpt-4o`)
    return AI_MODELS["gpt-4o"]
  }
  
  return config
}

// For A/B testing - returns both models to compare
export function getComparisonModels(): [AIModelConfig, AIModelConfig] {
  const primaryModel = getExtractionModel()
  const comparisonModelKey = process.env.COMPARISON_MODEL as AIModel
  
  if (comparisonModelKey && AI_MODELS[comparisonModelKey]) {
    return [primaryModel, AI_MODELS[comparisonModelKey]]
  }
  
  // Default comparison: GPT-4o vs Gemini 3 Pro
  return [AI_MODELS["gpt-4o"], AI_MODELS["gemini-3-pro"]]
}

// Check if A/B testing mode is enabled
export function isComparisonModeEnabled(): boolean {
  return process.env.ENABLE_MODEL_COMPARISON === "true"
}

export function getExtractionModelWithFallback(): AIModelConfig[] {
  const modelKey = (process.env.EXTRACTION_MODEL || "gpt-4o") as AIModel
  const primaryConfig = AI_MODELS[modelKey]
  
  if (!primaryConfig) {
    console.warn(`[v0] Unknown model "${modelKey}", falling back to gpt-4o`)
    return [AI_MODELS["gpt-4o"]]
  }
  
  // If Gemini is requested, provide GPT-4o as fallback (Gemini may have team restrictions)
  if (modelKey === "gemini-3-pro") {
    return [primaryConfig, AI_MODELS["gpt-4o"]]
  }
  
  return [primaryConfig]
}
