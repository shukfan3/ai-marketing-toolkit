import { createOpenAI } from "@ai-sdk/openai"

export function hasAiGateway(): boolean {
  return Boolean(process.env.AI_GATEWAY_API_KEY?.trim())
}

export function getAiModel() {
  const openai = createOpenAI({
    apiKey: process.env.AI_GATEWAY_API_KEY,
    baseURL: "https://ai-gateway.vercel.sh/v1",
  })
  return openai("openai/gpt-4o-mini")
}
