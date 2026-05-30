#!/usr/bin/env node
/**
 * 無需本機 git：用 GitHub API 建立 repo 並推送
 * 用法：GITHUB_TOKEN=ghp_xxx node scripts/github-upload.mjs
 */
import { readFile, readdir, stat } from "node:fs/promises"
import { join, relative } from "node:path"
import { fileURLToPath } from "node:url"

const ROOT = join(fileURLToPath(import.meta.url), "..", "..")
const REPO_NAME = process.env.REPO_NAME || "ai-marketing-toolkit"
const TOKEN = process.env.GITHUB_TOKEN || process.env.GH_TOKEN
const IS_PUBLIC = process.env.REPO_PUBLIC !== "false"

const IGNORE = new Set([
  "node_modules",
  ".next",
  ".git",
  ".vercel",
  ".DS_Store",
  ".env.local",
  ".env",
])

async function gh(path, options = {}) {
  const res = await fetch(`https://api.github.com${path}`, {
    ...options,
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${TOKEN}`,
      "X-GitHub-Api-Version": "2022-11-28",
      ...options.headers,
    },
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`GitHub API ${path}: ${res.status} ${text}`)
  }
  return res.status === 204 ? null : res.json()
}

async function walk(dir, files = []) {
  for (const name of await readdir(dir)) {
    if (IGNORE.has(name)) continue
    const full = join(dir, name)
    const st = await stat(full)
    if (st.isDirectory()) await walk(full, files)
    else files.push(full)
  }
  return files
}

async function hasMainBranch(owner) {
  try {
    await gh(`/repos/${owner}/${REPO_NAME}/git/ref/heads/main`)
    return true
  } catch {
    return false
  }
}

async function bootstrapEmptyRepo(owner) {
  const readme = await readFile(join(ROOT, "README.md"))
  await gh(`/repos/${owner}/${REPO_NAME}/contents/README.md`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message: "chore: bootstrap repository",
      content: Buffer.from(readme).toString("base64"),
    }),
  })
  await new Promise((r) => setTimeout(r, 1500))
}

async function main() {
  if (!TOKEN) {
    console.error("請設定 GITHUB_TOKEN 或 GH_TOKEN（需 repo 權限）")
    process.exit(1)
  }

  const user = await gh("/user")
  const owner = user.login
  console.log(`登入為：${owner}`)

  let repoExists = true
  try {
    await gh(`/repos/${owner}/${REPO_NAME}`)
    console.log(`Repo：https://github.com/${owner}/${REPO_NAME}`)
  } catch {
    repoExists = false
  }

  if (!repoExists) {
    await gh("/user/repos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: REPO_NAME,
        private: !IS_PUBLIC,
        description: "Niki Chan AI 營銷工具箱 — portfolio demo",
        auto_init: false,
      }),
    })
    console.log(`已建立空 repo`)
  }

  if (!(await hasMainBranch(owner))) {
    console.log("初始化 main 分支...")
    await bootstrapEmptyRepo(owner)
  }

  const ref = await gh(`/repos/${owner}/${REPO_NAME}/git/ref/heads/main`)
  const parentSha = ref.object.sha

  const files = await walk(ROOT)
  console.log(`上傳 ${files.length} 個檔案...`)

  const treeItems = []
  for (const file of files) {
    const rel = relative(ROOT, file).replace(/\\/g, "/")
    const content = await readFile(file)
    const blob = await gh(`/repos/${owner}/${REPO_NAME}/git/blobs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: content.toString("base64"),
        encoding: "base64",
      }),
    })
    treeItems.push({ path: rel, mode: "100644", type: "blob", sha: blob.sha })
    if (treeItems.length % 20 === 0) process.stdout.write(".")
  }
  console.log("")

  const tree = await gh(`/repos/${owner}/${REPO_NAME}/git/trees`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tree: treeItems }),
  })

  const commit = await gh(`/repos/${owner}/${REPO_NAME}/git/commits`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message: "feat: AI marketing toolkit with API routes and demo fallback",
      tree: tree.sha,
      parents: [parentSha],
    }),
  })

  await gh(`/repos/${owner}/${REPO_NAME}/git/refs/heads/main`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ sha: commit.sha, force: true }),
  })

  console.log(`\n完成！https://github.com/${owner}/${REPO_NAME}`)
  console.log("下一步：到 https://vercel.com/new 匯入此 repo 即可自動部署")
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
