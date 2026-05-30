"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Wand2, BarChart3, ArrowRight } from "lucide-react"

const tools = [
  {
    icon: <Search className="w-6 h-6" />,
    title: "GEO 模擬優化器",
    titleEn: "GEO Optimizer",
    description: "評估品牌在 ChatGPT、Gemini 等 AI 搜尋引擎中的可見度，獲取專業優化建議",
    href: "#geo",
    features: ["AI 可見度評分", "多平台分析", "優化建議清單"],
  },
  {
    icon: <Wand2 className="w-6 h-6" />,
    title: "智能文案變形",
    titleEn: "Smart Copywriter",
    description: "一段產品描述，一鍵轉化為 Threads、LinkedIn、Instagram 不同平台風格",
    href: "#copywriter",
    features: ["多平台適配", "風格智能切換", "一鍵複製"],
  },
  {
    icon: <BarChart3 className="w-6 h-6" />,
    title: "爆款 Post 分析",
    titleEn: "Viral Analyzer",
    description: "分析競爭對手社群專頁，找出互動率最高的貼文及爆紅原因",
    href: "#analyzer",
    features: ["互動率排序", "AI 原因分析", "卡片/表格切換"],
  },
]

export function ToolsOverview() {
  const scrollToSection = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <section id="tools" className="py-20 px-6 bg-secondary/20">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4">
            AI Tools
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">
            三大核心營銷工具
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-balance">
            運用 AI 技術，全方位提升您的品牌營銷效率
          </p>
        </div>

        {/* Tools Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {tools.map((tool, index) => (
            <Card
              key={index}
              className="group bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-all duration-300 cursor-pointer"
              onClick={() => scrollToSection(tool.href)}
            >
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  {tool.icon}
                </div>
                <CardTitle className="flex items-center justify-between">
                  <span>{tool.title}</span>
                  <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </CardTitle>
                <CardDescription className="text-xs uppercase tracking-wider">
                  {tool.titleEn}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{tool.description}</p>
                <div className="flex flex-wrap gap-2">
                  {tool.features.map((feature, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
