import { NextResponse } from "next/server"
import { z } from "zod"
import { hasAiGateway } from "@/lib/ai"
import { aiFallbackError, generateWithAi } from "@/lib/api-ai-fallback"
import { geoDemoResult } from "@/lib/demo-data"
import { jsonError, rateLimitedResponse } from "@/lib/api-utils"
import { geoAnalysisSchema } from "@/lib/schemas"

const bodySchema = z.object({
  brandName: z.string().min(1).max(200),
  industry: z.string().min(1).max(200),
})

const GEO_PROMPT = (brandName: string, industry: string) =>
  `你是一位香港市場的 GEO（Generative Engine Optimization）顧問。用繁體中文（可夾雜粵語用語）回答。

品牌名稱：${brandName}
行業：${industry}

評估品牌在 ChatGPT、Gemini、Perplexity、Bing Copilot 等 AI 回答場景的可見度，輸出 JSON：
- overallScore、aiVisibilityScore：0-100 整數，需有區分度
- suggestions：4-6 條，type 為 success / warning / info，具體可執行（Schema.org、FAQ、知識庫、Google Business Profile、結構化內容等）
- platforms：必須包含 ChatGPT、Gemini、Perplexity、Bing AI 四個平台評分`

export async function POST(request: Request) {
  const limited = rateLimitedResponse(request)
  if (limited) return limited

  let body: z.infer<typeof bodySchema>
  try {
    body = bodySchema.parse(await request.json())
  } catch {
    return jsonError("請提供有效的品牌名稱與行業類別")
  }

  const { brandName, industry } = body

  if (!hasAiGateway()) {
    return NextResponse.json({
      ...geoDemoResult,
      brandName,
      industry,
      source: "demo" as const,
      message: "未設定 AI_GATEWAY_API_KEY，已顯示示範數據。",
    })
  }

  try {
    const { object } = await generateWithAi({
      schema: geoAnalysisSchema,
      prompt: GEO_PROMPT(brandName, industry),
    })

    return NextResponse.json({
      brandName,
      industry,
      ...object,
      source: "ai" as const,
    })
  } catch (error) {
    console.error("[geo/analyze]", error)
    return NextResponse.json({
      ...geoDemoResult,
      brandName,
      industry,
      source: "demo" as const,
      error: aiFallbackError(error),
    })
  }
}
