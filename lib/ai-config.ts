// AI Model Configuration for Taxu Platform
// This allows easy switching and A/B testing of different AI models

export type AIModel = "gpt-4o" | "gpt-5.1" | "claude-3.5-sonnet" | "o3" | "o3-mini"

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
  "gpt-5.1": {
    name: "GPT-5.1",
    modelId: "openai/gpt-5.1-chat-latest",
    provider: "OpenAI",
    description: "Latest GPT-5.1 with superior intelligence (November 2025)",
    strengths: ["Highest accuracy", "Advanced reasoning", "Best for complex documents"],
    maxTokens: 3000,
    timeoutMs: 13000,
  },
  o3: {
    name: "o3 Reasoning",
    modelId: "openai/o3",
    provider: "OpenAI",
    description: "Advanced reasoning model for complex logical tasks",
    strengths: ["Deep reasoning", "Multi-step logic", "Complex extraction"],
    maxTokens: 4096,
    timeoutMs: 15000,
  },
  "o3-mini": {
    name: "o3-mini",
    modelId: "openai/o3-mini",
    provider: "OpenAI",
    description: "Fast reasoning model optimized for speed",
    strengths: ["Fast response", "Cost-effective", "Good for batch processing"],
    maxTokens: 4096,
    timeoutMs: 8000,
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

// Get the model to use from environment variable, default to GPT-5.1
export function getExtractionModel(): AIModelConfig {
  const modelKey = (process.env.EXTRACTION_MODEL || "gpt-5.1") as AIModel

  const config = AI_MODELS[modelKey]

  if (!config) {
    return AI_MODELS["gpt-5.1"]
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

  // Default comparison: GPT-4o vs GPT-5.1 (both available)
  return [AI_MODELS["gpt-4o"], AI_MODELS["gpt-5.1"]]
}

// Check if A/B testing mode is enabled
export function isComparisonModeEnabled(): boolean {
  return process.env.ENABLE_MODEL_COMPARISON === "true"
}

export function getExtractionModelWithFallback(): AIModelConfig[] {
  const modelKey = (process.env.EXTRACTION_MODEL || "gpt-5.1") as AIModel
  const primaryConfig = AI_MODELS[modelKey]

  if (!primaryConfig) {
    console.warn(`[v0] Unknown model "${modelKey}", falling back to gpt-5.1`)
    return [AI_MODELS["gpt-5.1"]]
  }

  return [primaryConfig, AI_MODELS["gpt-4o"]]
}
