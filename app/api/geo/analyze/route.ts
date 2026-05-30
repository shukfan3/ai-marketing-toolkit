import { generateObject } from "ai"
import { NextResponse } from "next/server"
import { z } from "zod"
import { getAiModel, hasAiGateway } from "@/lib/ai"
import { geoDemoResult } from "@/lib/demo-data"
import { jsonError, rateLimitedResponse } from "@/lib/api-utils"
import { geoAnalysisSchema } from "@/lib/schemas"

const bodySchema = z.object({
  brandName: z.string().min(1).max(200),
  industry: z.string().min(1).max(200),
})

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
    })
  }

  try {
    const { object } = await generateObject({
      model: getAiModel(),
      schema: geoAnalysisSchema,
      prompt: `你是一位 GEO（Generative Engine Optimization）顧問。根據以下品牌資訊，評估其在 ChatGPT、Gemini、Perplexity、Bing AI 等 AI 搜尋/回答場景的可見度。

品牌名稱：${brandName}
行業：${industry}

請輸出：
- overallScore、aiVisibilityScore（0-100 整數）
- 4-6 條具體優化建議（type: success/warning/info，繁體中文）
- 4 個平台評分：ChatGPT、Gemini、Perplexity、Bing AI

建議需切合該行業（Schema.org、FAQ、知識庫、Google Business Profile 等）。`,
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
    })
  }
}
