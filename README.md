# Niki Chan | AI 營銷工具箱

個人 portfolio 專案，展示 AI 驅動的數碼營銷工具（v0 生成 UI + Next.js 實作）。

## Live Demo

部署後將 Production URL 更新於此。

### 發布到 GitHub + Vercel

**若 `xcode-select --install` 彈出「無法從軟件更新伺服器取得軟件」**（Apple 伺服器問題），請改用 **唔需要 git** 嘅腳本：

```bash
cd ~/Desktop/ai-marketing-toolkit
chmod +x scripts/publish-no-git.sh
./scripts/publish-no-git.sh
```

腳本會下載 `gh` + `node`、用瀏覽器登入 GitHub、自動建立 repo 並上傳。完成後到 [vercel.com/new](https://vercel.com/new) Import `ai-marketing-toolkit`。

**Command Line Tools 裝到之後**（可選，方便之後 `git push`）：

- 稍後再試：`xcode-select --install`
- 或到 [Apple Developer Downloads](https://developer.apple.com/download/all/) 搜尋「Command Line Tools」手動安裝
- 然後可用：`./scripts/publish.sh`

## 功能

- **GEO 模擬優化器** — 評估品牌在 AI 搜尋引擎的可見度
- **多平台文案智能變形** — 產品描述轉換為 Threads / LinkedIn / Instagram 風格
- **同行爆款 Post 分析器** — AI-assisted 競品洞察（非官方社群爬蟲）

每個工具均保留「填入 Demo」按鈕，無 API key 時亦可展示。

## 技術棧

- Next.js 16 · React 19 · Tailwind CSS 4 · shadcn/ui
- Vercel AI SDK + Vercel AI Gateway（可選 `AI_GATEWAY_API_KEY`）

## 本地開發

```bash
pnpm install
cp .env.example .env.local
# 在 .env.local 填入 AI_GATEWAY_API_KEY（可選，用於真 AI 生成）
pnpm dev
```

## 環境變數

| 變數 | 必填 | 說明 |
|------|------|------|
| `AI_GATEWAY_API_KEY` | 否 | [Vercel AI Gateway](https://vercel.com/docs/ai-gateway) API key；未設定時 API 回傳 demo 數據 |

## 部署

連接 GitHub 後由 Vercel 自動 build（`pnpm install` → `pnpm build`）。
