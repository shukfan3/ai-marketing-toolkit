# Niki Chan | AI 營銷工具箱

個人 portfolio 專案，展示 AI 驅動的數碼營銷工具（v0 UI + Next.js + Gemini）。

## Live Demo

- **GitHub:** https://github.com/shukfan3/ai-marketing-toolkit  
- **Vercel:** https://vercel.com/new/clone?repository-url=https://github.com/shukfan3/ai-marketing-toolkit  

Production URL：（部署後填寫）

## 功能（已全部接線）

| 功能 | 說明 |
|------|------|
| GEO 模擬優化器 | Gemini 評分 + 優化建議（ChatGPT / Gemini / Perplexity / Bing AI） |
| 多平台文案變形 | Threads / LinkedIn / Instagram 三種風格 |
| 爆款 Post 分析器 | 輸入 URL + 可選備註，AI 推演爆款策略（非爬蟲） |
| 聯絡表單 | `mailto:` 開啟郵件客戶端發送 |
| 導航 / 工具卡片 | 平滑捲動至各區塊 |

「填入 Demo」只預填輸入；仍會呼叫 API（有 key 則真 AI，無 key 則示範數據）。

## AI 設定（Gemini）

預設使用 **Vercel AI Gateway** + **`google/gemini-2.5-flash`**（繁中營銷文案表現佳、成本低）。

1. 到 [Vercel AI Gateway](https://vercel.com/docs/ai-gateway) 建立 API key  
2. 在 Vercel Project → **Settings → Environment Variables** 加入：

| 變數 | 必填 | 說明 |
|------|------|------|
| `AI_GATEWAY_API_KEY` | 是（真 AI） | Gateway API key |
| `AI_MODEL` | 否 | 預設 `google/gemini-2.5-flash` |
| `NEXT_PUBLIC_CONTACT_EMAIL` | 否 | 聯絡表單收件電郵 |
| `NEXT_PUBLIC_LINKEDIN_URL` | 否 | LinkedIn 個人頁 |
| `NEXT_PUBLIC_INSTAGRAM_URL` | 否 | Instagram 個人頁 |

3. **Redeploy** 後三個工具會顯示「Gemini AI」標籤。

本地開發：

```bash
pnpm install
cp .env.example .env.local
# 編輯 .env.local 填入 AI_GATEWAY_API_KEY
pnpm dev
```

## 技術棧

- Next.js 16 · React 19 · Tailwind CSS 4 · shadcn/ui  
- Vercel AI SDK · AI Gateway · Gemini Flash  
- 簡單 in-memory rate limit（每 IP 每分鐘 15 次）

## 部署

連接 GitHub 後 Vercel 自動 build：`pnpm install` → `pnpm build`。

無 git 時上傳：

```bash
GITHUB_TOKEN=xxx node scripts/github-upload.mjs
```
