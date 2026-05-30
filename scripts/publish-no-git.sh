#!/usr/bin/env bash
# 當 xcode-select / Command Line Tools 裝唔到時用此腳本（唔需要 git）
set -euo pipefail
cd "$(dirname "$0")/.."

ARCH=$(uname -m)
GH_ARCH=$([ "$ARCH" = "arm64" ] && echo arm64 || echo amd64)
NODE_ARCH=$([ "$ARCH" = "arm64" ] && echo arm64 || echo x64)

GH="${GH_BIN:-/tmp/gh_2.67.0_macOS_${GH_ARCH}/bin/gh}"
NODE="${NODE_BIN:-/tmp/node-v22.14.0-darwin-${NODE_ARCH}/bin/node}"

install_gh() {
  echo "下載 GitHub CLI..."
  curl -fsSL -o /tmp/gh.zip "https://github.com/cli/cli/releases/download/v2.67.0/gh_2.67.0_macOS_${GH_ARCH}.zip"
  unzip -qo /tmp/gh.zip -d /tmp
}

install_node() {
  echo "下載 Node.js（用於上傳腳本）..."
  curl -fsSL -o /tmp/node.tar.gz "https://nodejs.org/dist/v22.14.0/node-v22.14.0-darwin-${NODE_ARCH}.tar.gz"
  tar xzf /tmp/node.tar.gz -C /tmp
}

[ -x "$GH" ] || install_gh
[ -x "$NODE" ] || install_node

if [ -z "${GITHUB_TOKEN:-}" ] && [ -z "${GH_TOKEN:-}" ]; then
  if ! "$GH" auth status >/dev/null 2>&1; then
    echo ""
    echo "=========================================="
    echo "  請用瀏覽器登入 GitHub（唔需要安裝 git）"
    echo "=========================================="
  "$GH" auth login -h github.com -p https -w
  fi
  export GITHUB_TOKEN="$("$GH" auth token)"
fi

echo ""
echo "上傳專案到 GitHub..."
"$NODE" scripts/github-upload.mjs

echo ""
echo "=========================================="
echo "  下一步：部署到 Vercel"
echo "=========================================="
echo "1. 打開 https://vercel.com/new"
echo "2. Import 剛才建立嘅 GitHub repo：ai-marketing-toolkit"
echo "3. 保持 Next.js 預設，Install: pnpm install，Build: pnpm build"
echo "4. Deploy 後會得到 https://xxx.vercel.app"
echo ""
