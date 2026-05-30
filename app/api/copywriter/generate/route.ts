import { NextResponse } from "next/server"
import { z } from "zod"
import { hasAiConfigured } from "@/lib/ai"
import { aiFallbackError, generateWithAi } from "@/lib/api-ai-fallback"
import { copywriterDemoVariants } from "@/lib/demo-data"
import { jsonError, rateLimitedResponse } from "@/lib/api-utils"
import { copywriterSchema } from "@/lib/schemas"

const bodySchema = z.object({
  productDescription: z.string().min(10).max(4000),
})

const COPYWRITER_PROMPT = (productDescription: string) =>
  `你是香港數碼營銷文案專家，擅長繁體中文與本地化語氣。

根據以下產品/服務描述，生成三個平台版本文案（JSON variants 陣列，每項含 platform、style、content）：

產品描述：
${productDescription}

要求：
1. Threads — platform 必須為 "Threads"，style 如「貼地有梗」，口語、有梗、適合香港 Threads 用戶，可適度 emoji
2. LinkedIn — platform 必須為 "LinkedIn"，style「商務專業」，條理清晰、專業可信，適合 B2B
3. Instagram — platform 必須為 "Instagram"，style「多 Emoji 與 Hashtag」，豐富 emoji 與 8-15 個相關 hashtag

每段 content 要完整可直接發佈，保留換行。內容需忠於輸入描述，勿虛構未提及的優惠。`

export async function POST(request: Request) {
  const limited = rateLimitedResponse(request)
  if (limited) return limited

  let body: z.infer<typeof bodySchema>
  try {
    body = bodySchema.parse(await request.json())
  } catch {
    return jsonError("請提供至少 10 字嘅產品描述")
  }

  const { productDescription } = body

  if (!hasAiConfigured()) {
    return NextResponse.json({
      variants: copywriterDemoVariants,
      source: "demo" as const,
      message: "未設定 GOOGLE_GENERATIVE_AI_API_KEY，已顯示示範文案。",
    })
  }

  try {
    const { object } = await generateWithAi({
      schema: copywriterSchema,
      prompt: COPYWRITER_PROMPT(productDescription),
    })

    return NextResponse.json({
      variants: object.variants,
      source: "ai" as const,
    })
  } catch (error) {
    console.error("[copywriter/generate]", error)
    return NextResponse.json({
      variants: copywriterDemoVariants,
      source: "demo" as const,
      error: aiFallbackError(error),
    })
  }
}
