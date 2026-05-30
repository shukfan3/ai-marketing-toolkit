import { z } from "zod"

export const geoAnalysisSchema = z.object({
  overallScore: z.number().min(0).max(100),
  aiVisibilityScore: z.number().min(0).max(100),
  suggestions: z.array(
    z.object({
      type: z.enum(["success", "warning", "info"]),
      text: z.string(),
    })
  ),
  platforms: z.array(
    z.object({
      name: z.string(),
      score: z.number().min(0).max(100),
    })
  ),
})

export const copywriterSchema = z.object({
  variants: z.array(
    z.object({
      platform: z.enum(["Threads", "LinkedIn", "Instagram"]),
      style: z.string(),
      content: z.string(),
    })
  ),
})

export const analyzerSchema = z.object({
  posts: z.array(
    z.object({
      date: z.string(),
      preview: z.string(),
      likes: z.number(),
      comments: z.number(),
      shares: z.number(),
      engagementRate: z.number(),
      aiAnalysis: z.string(),
    })
  ),
})
