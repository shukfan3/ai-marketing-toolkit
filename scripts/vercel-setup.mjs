#!/usr/bin/env node
/**
 * 用 Vercel API 連接 GitHub repo 並觸發部署
 * VERCEL_TOKEN=xxx node scripts/vercel-setup.mjs
 */
const TOKEN = process.env.VERCEL_TOKEN
const REPO = "shukfan3/ai-marketing-toolkit"
const PROJECT_NAME = "ai-marketing-toolkit"

async function vercel(path, options = {}) {
  const res = await fetch(`https://api.vercel.com${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
  })
  const text = await res.text()
  const data = text ? JSON.parse(text) : null
  if (!res.ok) {
    throw new Error(`Vercel API ${path}: ${res.status} ${text}`)
  }
  return data
}

async function main() {
  if (!TOKEN) {
    console.error("請設定 VERCEL_TOKEN（https://vercel.com/account/tokens）")
    process.exit(1)
  }

  const user = await vercel("/v2/user")
  console.log(`Vercel 帳號：${user.user?.email ?? user.user?.username ?? "ok"}`)

  let project
  try {
    const list = await vercel(`/v9/projects?search=${PROJECT_NAME}`)
    project = list.projects?.find((p) => p.name === PROJECT_NAME)
  } catch {
    /* ignore */
  }

  if (!project) {
    console.log("建立 Vercel project 並連接 GitHub...")
    project = await vercel("/v11/projects", {
      method: "POST",
      body: JSON.stringify({
        name: PROJECT_NAME,
        framework: "nextjs",
        installCommand: "pnpm install",
        buildCommand: "pnpm build",
        gitRepository: { type: "github", repo: REPO },
      }),
    })
    console.log(`Project ID: ${project.id}`)
  } else {
    console.log(`Project 已存在：${project.name}`)
  }

  console.log("觸發 production 部署...")
  const deployment = await vercel("/v13/deployments", {
    method: "POST",
    body: JSON.stringify({
      name: PROJECT_NAME,
      project: project.id ?? project.projectId,
      target: "production",
      gitSource: {
        type: "github",
        ref: "main",
        repoId: REPO,
      },
    }),
  })

  const url = deployment.url
    ? `https://${deployment.url}`
    : deployment.alias?.[0]
      ? `https://${deployment.alias[0]}`
      : null

  console.log("\n部署已排程！")
  if (url) console.log(`Preview/URL: ${url}`)
  console.log(`Dashboard: https://vercel.com/${user.user?.username ?? ""}/${PROJECT_NAME}`)
}

main().catch((err) => {
  console.error(err.message)
  console.error("\n若 GitHub 未連接 Vercel，請用瀏覽器開：")
  console.error(
    `https://vercel.com/new/clone?repository-url=https://github.com/${REPO}`
  )
  process.exit(1)
})
