import { createGoogleGenerativeAI } from "@ai-sdk/google"

/** 直連 Google Gemini（唔經 Vercel AI Gateway） */
export const DEFAULT_MODEL = "gemini-2.5-flash"
export const FALLBACK_MODEL = "gemini-2.0-flash"

export function getGeminiApiKey(): string | undefined {
  return (
    process.env.GOOGLE_GENERATIVE_AI_API_KEY?.trim() ||
    process.env.GEMINI_API_KEY?.trim() ||
    undefined
  )
}

/** 是否已設定 Gemini API key（直連 Google） */
export function hasAiConfigured(): boolean {
  return Boolean(getGeminiApiKey())
}

/** @deprecated 用 hasAiConfigured */
export const hasAiGateway = hasAiConfigured

export function getAiModelId(): string {
  const configured = process.env.AI_MODEL?.trim()
  if (!configured) return DEFAULT_MODEL
  return configured.replace(/^google\//, "")
}

export function getAiModel(modelId?: string) {
  const apiKey = getGeminiApiKey()
  if (!apiKey) {
    throw new Error("未設定 GOOGLE_GENERATIVE_AI_API_KEY")
  }
  const google = createGoogleGenerativeAI({ apiKey })
  const id = (modelId ?? getAiModelId()).replace(/^google\//, "")
  return google(id)
}

export function getAiErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message
  return "AI 服務暫時不可用"
}
