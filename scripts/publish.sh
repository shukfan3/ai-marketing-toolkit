#!/usr/bin/env bash
# 首次發布：需要已安裝 Xcode CLT (git)、gh auth login、vercel login
set -euo pipefail
cd "$(dirname "$0")/.."

if ! command -v git >/dev/null 2>&1; then
  echo "請先安裝 git：xcode-select --install"
  exit 1
fi
if ! command -v gh >/dev/null 2>&1; then
  echo "請先安裝 GitHub CLI：https://cli.github.com/"
  exit 1
fi
if ! command -v pnpm >/dev/null 2>&1; then
  echo "請先安裝 pnpm：npm install -g pnpm"
  exit 1
fi

gh auth status || { echo "請執行：gh auth login"; exit 1; }

if [ ! -d .git ]; then
  git init -b main
  git add .
  git commit -m "feat: AI marketing toolkit with demo APIs and Vercel-ready build"
fi

if ! git remote get-url origin >/dev/null 2>&1; then
  gh repo create ai-marketing-toolkit --public --source=. --remote=origin --push
else
  git push -u origin main
fi

# 若無 git（未裝 Xcode CLT），可改用：
# GITHUB_TOKEN=你的token node scripts/github-upload.mjs

echo ""
echo "下一步：在 https://vercel.com/new 匯入 GitHub repo「ai-marketing-toolkit」"
echo "或執行：vercel link && vercel --prod"
echo ""
echo "可選：在 Vercel 專案設定 AI_GATEWAY_API_KEY 以啟用真 AI"
