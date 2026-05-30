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

## AI 設定（Gemini 直連 Google）

使用 **你自己嘅 Google Gemini API key**（唔經 Vercel AI Gateway，帳單喺 Google 控制台）。

### 1. 拎 API Key（建議用 AI Studio，最簡單）

1. 打開 https://aistudio.google.com/apikey  
2. 用 Google 帳號登入（可同 GCP 同一個）  
3. 按 **Create API key** → 揀 project（例如 My First Project）  
4. 複製 key（形如 `AIza...`）

你截圖已喺 GCP 啟用 **Gemini API**，上面步驟會用到同一個 project。

（進階）GCP 控制台：Gemini API 頁面 → **管理** → **憑證** → **建立憑證** → **API 金鑰**

### 2. 填入 Vercel

**Settings → Environment Variables**：

| 變數 | 必填 | 說明 |
|------|------|------|
| `GOOGLE_GENERATIVE_AI_API_KEY` | 是 | 剛才複製嘅 Gemini key |
| `AI_MODEL` | 否 | 預設 `gemini-2.5-flash` |
| `NEXT_PUBLIC_CONTACT_EMAIL` | 否 | 聯絡表單收件電郵 |

可刪除舊嘅 `AI_GATEWAY_API_KEY`（已唔再用）。

3. **Redeploy**

本地 `.env.local`：

```bash
GOOGLE_GENERATIVE_AI_API_KEY=AIza你的key
pnpm dev
```

## 技術棧

- Next.js 16 · React 19 · Tailwind CSS 4 · shadcn/ui  
- Vercel AI SDK · **@ai-sdk/google** · Gemini Flash  
- 簡單 in-memory rate limit（每 IP 每分鐘 15 次）

## 部署

連接 GitHub 後 Vercel 自動 build：`pnpm install` → `pnpm build`。

無 git 時上傳：

```bash
GITHUB_TOKEN=xxx node scripts/github-upload.mjs
```
