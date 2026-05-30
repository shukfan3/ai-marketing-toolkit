#!/usr/bin/env bash
# Vercel 部署（唔需要 git）
# 用法 A：先取得 token https://vercel.com/account/tokens
#   VERCEL_TOKEN=xxx ./scripts/vercel-deploy.sh
# 用法 B：已執行過 vercel login
#   ./scripts/vercel-deploy.sh
set -euo pipefail
cd "$(dirname "$0")/.."

ARCH=$(uname -m)
NODE_ARCH=$([ "$ARCH" = "arm64" ] && echo arm64 || echo x64)
export PATH="/tmp/node-v22.14.0-darwin-${NODE_ARCH}/bin:${PATH:-}"

if ! command -v vercel >/dev/null 2>&1; then
  npm install -g vercel@41 2>/dev/null || npm install -g vercel@latest
fi

TOKEN_ARGS=()
if [ -n "${VERCEL_TOKEN:-}" ]; then
  TOKEN_ARGS=(--token "$VERCEL_TOKEN")
elif ! vercel whoami "${TOKEN_ARGS[@]}" >/dev/null 2>&1; then
  echo ""
  echo "未登入 Vercel。請任選其一："
  echo "  1) 瀏覽器一鍵匯入："
  echo "     https://vercel.com/new/clone?repository-url=https://github.com/shukfan3/ai-marketing-toolkit"
  echo ""
  echo "  2) 用 Token 部署（推薦，可全自動）："
  echo "     到 https://vercel.com/account/tokens 建立 token"
  echo "     然後執行：VERCEL_TOKEN=你的token ./scripts/vercel-deploy.sh"
  echo ""
  echo "  3) CLI 登入：vercel login"
  exit 1
fi

echo "Building..."
if command -v pnpm >/dev/null 2>&1; then
  pnpm install --frozen-lockfile 2>/dev/null || pnpm install
  pnpm build
else
  npm install
  npm run build
fi

echo "Deploying to Vercel..."
vercel deploy --prebuilt --prod --yes "${TOKEN_ARGS[@]}"

echo ""
vercel ls "${TOKEN_ARGS[@]}" 2>/dev/null | head -5 || true
echo "完成！Production URL 見上方，或到 https://vercel.com/dashboard"
