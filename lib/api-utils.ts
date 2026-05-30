import { NextResponse } from "next/server"
import { checkRateLimit, getClientKey } from "@/lib/rate-limit"

export function rateLimitedResponse(request: Request) {
  const key = getClientKey(request)
  const { allowed, retryAfterSec } = checkRateLimit(key)
  if (!allowed) {
    return NextResponse.json(
      { error: "請求過於頻繁，請稍後再試", retryAfterSec },
      { status: 429, headers: { "Retry-After": String(retryAfterSec ?? 60) } }
    )
  }
  return null
}

export function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status })
}
