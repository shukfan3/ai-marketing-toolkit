import { createOpenAI } from "@ai-sdk/openai"

const DEFAULT_MODEL = "google/gemini-2.5-flash"
const FALLBACK_MODEL = "google/gemini-2.0-flash"

export function hasAiGateway(): boolean {
  return Boolean(process.env.AI_GATEWAY_API_KEY?.trim())
}

export function getAiModelId(): string {
  const configured = process.env.AI_MODEL?.trim()
  return configured || DEFAULT_MODEL
}

export function getAiModel(modelId?: string) {
  const openai = createOpenAI({
    apiKey: process.env.AI_GATEWAY_API_KEY,
    baseURL: "https://ai-gateway.vercel.sh/v1",
  })
  return openai(modelId ?? getAiModelId())
}

export function getAiErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message
  return "AI 服務暫時不可用"
}

export { DEFAULT_MODEL, FALLBACK_MODEL }
