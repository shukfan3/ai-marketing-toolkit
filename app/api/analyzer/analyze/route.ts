import { generateObject } from "ai"
import { NextResponse } from "next/server"
import { z } from "zod"
import { getAiModel, hasAiGateway } from "@/lib/ai"
import { analyzerDemoPosts } from "@/lib/demo-data"
import { jsonError, rateLimitedResponse } from "@/lib/api-utils"
import { analyzerSchema } from "@/lib/schemas"

const bodySchema = z.object({
  pageUrl: z.string().url().max(500),
  notes: z.string().max(1000).optional(),
})

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

  if (!hasAiGateway()) {
    return NextResponse.json({
      posts: analyzerDemoPosts,
      source: "demo" as const,
      disclaimer:
        "此為 AI-assisted 示範數據，並非從該專頁即時爬取。設定 AI_GATEWAY_API_KEY 後可獲得基於 URL 的模擬分析。",
    })
  }

  try {
    const { object } = await generateObject({
      model: getAiModel(),
      schema: analyzerSchema,
      prompt: `你是社群營銷分析師。用戶提供了競爭對手社群專頁 URL（你無法實際爬取，請基於 URL 域名、路徑及常識推斷可能嘅內容策略）。

專頁 URL：${pageUrl}
${notes ? `用戶補充：${notes}` : ""}

請生成 5 條「模擬」近期高互動貼文（繁體中文 preview），包含：
- date（YYYY-MM-DD 格式，最近 30 日內）
- likes、comments、shares（合理整數）
- engagementRate（0-20 之間小數，一位）
- aiAnalysis：一句話解釋可能爆紅原因

在回應語意上這是競品策略推演，不是真實爬蟲數據。貼文預覽要符合該類型專頁（餐飲/零售/服務等）常見爆款模式。`,
    })

    const posts = object.posts.map((post, index) => ({
      id: String(index + 1),
      ...post,
    }))

    return NextResponse.json({
      posts,
      source: "ai" as const,
      disclaimer:
        "此為 AI-assisted 模擬分析，並非 Meta/IG 官方 API 即時數據。",
    })
  } catch (error) {
    console.error("[analyzer/analyze]", error)
    return NextResponse.json({
      posts: analyzerDemoPosts,
      source: "demo" as const,
      disclaimer: "AI 暫時不可用，已顯示示範數據。",
    })
  }
}
