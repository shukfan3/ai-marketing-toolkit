export const siteConfig = {
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL?.trim() || "",
  linkedInUrl: process.env.NEXT_PUBLIC_LINKEDIN_URL?.trim() || "",
  instagramUrl: process.env.NEXT_PUBLIC_INSTAGRAM_URL?.trim() || "",
} as const

export function buildMailtoUrl(params: {
  name: string
  email: string
  subject: string
  message: string
}): string | null {
  const to = siteConfig.contactEmail
  if (!to) return null

  const subject = params.subject.trim() || `來自 ${params.name} 的查詢`
  const body = [
    `姓名：${params.name}`,
    `電郵：${params.email}`,
    "",
    params.message,
  ].join("\n")

  return `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}
