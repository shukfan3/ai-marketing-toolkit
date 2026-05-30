import { generateObject } from "ai"
import { NextResponse } from "next/server"
import { z } from "zod"
import { getAiModel, hasAiGateway } from "@/lib/ai"
import { copywriterDemoVariants } from "@/lib/demo-data"
import { jsonError, rateLimitedResponse } from "@/lib/api-utils"
import { copywriterSchema } from "@/lib/schemas"

const bodySchema = z.object({
  productDescription: z.string().min(10).max(4000),
})

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

  if (!hasAiGateway()) {
    return NextResponse.json({
      variants: copywriterDemoVariants,
      source: "demo" as const,
    })
  }

  try {
    const { object } = await generateObject({
      model: getAiModel(),
      schema: copywriterSchema,
      prompt: `你是香港數碼營銷文案專家。根據以下產品/服務描述，生成三個平台版本嘅繁體中文文案：

產品描述：
${productDescription}

請分別生成：
1. Threads — platform: "Threads", style 標註風格如「貼地有梗」，口語、有梗、適合香港用戶
2. LinkedIn — platform: "LinkedIn", style「商務專業」，結構清晰、專業可信
3. Instagram — platform: "Instagram", style「多Emoji與Hashtag」，豐富 emoji 同相關 hashtag

每段 content 要完整可用，保留換行。`,
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
    })
  }
}
