import { generateObject } from "ai"
import type { z } from "zod"
import {
  FALLBACK_MODEL,
  getAiErrorMessage,
  getAiModel,
  getAiModelId,
} from "@/lib/ai"

type GenerateObjectParams<T extends z.ZodType> = {
  schema: T
  prompt: string
}

export async function generateWithAi<T extends z.ZodType>({
  schema,
  prompt,
}: GenerateObjectParams<T>): Promise<{
  object: z.infer<T>
  modelUsed: string
}> {
  const primaryId = getAiModelId()
  try {
    const { object } = await generateObject({
      model: getAiModel(primaryId),
      schema,
      prompt,
    })
    return { object, modelUsed: primaryId }
  } catch (primaryError) {
    if (primaryId === FALLBACK_MODEL) throw primaryError
    console.warn(`[ai] ${primaryId} failed, trying ${FALLBACK_MODEL}`, primaryError)
    const { object } = await generateObject({
      model: getAiModel(FALLBACK_MODEL),
      schema,
      prompt,
    })
    return { object, modelUsed: FALLBACK_MODEL }
  }
}

export function aiFallbackError(error: unknown): string {
  return getAiErrorMessage(error)
}
