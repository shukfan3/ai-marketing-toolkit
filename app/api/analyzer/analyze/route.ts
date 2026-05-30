import { NextResponse } from "next/server"
import { z } from "zod"
import { hasAiConfigured } from "@/lib/ai"
import { aiFallbackError, generateWithAi } from "@/lib/api-ai-fallback"
import { analyzerDemoPosts } from "@/lib/demo-data"
import { jsonError, rateLimitedResponse } from "@/lib/api-utils"
import { analyzerSchema } from "@/lib/schemas"

const DISCLAIMER_AI =
  "此為 AI-assisted 模擬分析，並非 Meta/IG 官方 API 即時數據。貼文為策略推演，非實際爬取。"

const DISCLAIMER_DEMO =
  "此為示範數據。設定 GOOGLE_GENERATIVE_AI_API_KEY 後可獲得基於 URL 的 Gemini 分析。"

const bodySchema = z.object({
  pageUrl: z.string().url().max(500),
  notes: z.string().max(1000).optional(),
})

const ANALYZER_PROMPT = (pageUrl: string, notes?: string) =>
  `你是香港社群營銷分析師。用戶提供競爭對手專頁 URL，你無法實際爬取，請基於 URL、平台類型、行業常識及用戶備註做策略推演（繁體中文）。

專頁 URL：${pageUrl}
${notes ? `用戶補充：${notes}` : "（無額外備註）"}

生成 5 條模擬「近期高互動」貼文（posts 陣列），每條含：
- date：YYYY-MM-DD，最近 30 日內
- preview：貼文開頭預覽，30-80 字，符合該品牌類型
- likes、comments、shares：合理整數
- engagementRate：0.1-18.0 之間，一位小數
- aiAnalysis：一句話解釋可能爆紅原因（手法標籤式）

按 engagementRate 由高到低排序。勿聲稱這是真實爬蟲數據。`

export async function POST(request: Request) {
  const limited = rateLimitedResponse(request)
  if (limited) return limited

  let body: z.infer<typeof bodySchema>
  try {
    body = bodySchema.parse(await request.json())
  } catch {
    return jsonError("請提供有效的社群專頁網址")
  }

  const { pageUrl, notes } = body

  if (!hasAiConfigured()) {
    return NextResponse.json({
      posts: analyzerDemoPosts,
      source: "demo" as const,
      disclaimer: DISCLAIMER_DEMO,
    })
  }

  try {
    const { object } = await generateWithAi({
      schema: analyzerSchema,
      prompt: ANALYZER_PROMPT(pageUrl, notes),
    })

    const posts = [...object.posts]
      .sort((a, b) => b.engagementRate - a.engagementRate)
      .map((post, index) => ({
        id: String(index + 1),
        ...post,
      }))

    return NextResponse.json({
      posts,
      source: "ai" as const,
      disclaimer: DISCLAIMER_AI,
    })
  } catch (error) {
    console.error("[analyzer/analyze]", error)
    return NextResponse.json({
      posts: analyzerDemoPosts,
      source: "demo" as const,
      disclaimer: "AI 暫時不可用，已顯示示範數據。",
      error: aiFallbackError(error),
    })
  }
}
