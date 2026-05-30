"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Search, Sparkles, CheckCircle, AlertCircle, TrendingUp, Eye, Bot, FileText } from "lucide-react"
import { toast } from "sonner"

interface OptimizationResult {
  brandName: string
  industry: string
  overallScore: number
  aiVisibilityScore: number
  suggestions: { type: "success" | "warning" | "info"; text: string }[]
  platforms: { name: string; score: number }[]
  source?: "demo" | "ai"
  error?: string
  message?: string
}

const platformIcons: Record<string, React.ReactNode> = {
  ChatGPT: <Bot className="w-4 h-4" />,
  Gemini: <Sparkles className="w-4 h-4" />,
  Perplexity: <Search className="w-4 h-4" />,
  "Bing AI": <Eye className="w-4 h-4" />,
}

export function GeoOptimizer() {
  const [brandName, setBrandName] = useState("")
  const [industry, setIndustry] = useState("")
  const [result, setResult] = useState<OptimizationResult | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleAnalyze = async () => {
    if (!brandName || !industry) return
    setIsLoading(true)
    try {
      const res = await fetch("/api/geo/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brandName, industry }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error ?? "分析失敗，請稍後再試")
        return
      }
      setResult(data)
      if (data.source === "ai") {
        toast.success("Gemini AI 分析完成")
      } else if (data.error) {
        toast.warning("已顯示示範數據", { description: data.error })
      } else {
        toast.message("示範模式", {
          description: data.message ?? "設定 AI_GATEWAY_API_KEY 可啟用 Gemini 真 AI 分析。",
        })
      }
    } catch {
      toast.error("網絡錯誤，請稍後再試")
    } finally {
      setIsLoading(false)
    }
  }

  const handleFillDemo = () => {
    setBrandName("星光咖啡 Starlight Coffee")
    setIndustry("餐飲 / 咖啡店")
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-amber-600"
    return "text-red-600"
  }

  const getProgressColor = (score: number) => {
    if (score >= 80) return "bg-green-500"
    if (score >= 60) return "bg-amber-500"
    return "bg-red-500"
  }

  return (
    <section id="geo" className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4">
            <Search className="w-3 h-3 mr-1" />
            GEO Optimizer
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">
            GEO 模擬優化器
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-balance">
            評估您的品牌在 ChatGPT、Gemini 等 AI 搜尋引擎中的可見度，獲取專業優化建議
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                輸入品牌資訊
              </CardTitle>
              <CardDescription>
                填寫您的品牌名稱及所屬行業，開始分析
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="brand">品牌名稱</Label>
                <Input
                  id="brand"
                  placeholder="例：星光咖啡 Starlight Coffee"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="industry">行業類別</Label>
                <Input
                  id="industry"
                  placeholder="例：餐飲 / 咖啡店"
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                />
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={handleAnalyze}
                  disabled={!brandName || !industry || isLoading}
                  className="flex-1"
                >
                  {isLoading ? (
                    <>
                      <span className="animate-spin mr-2">⏳</span>
                      分析中...
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4 mr-2" />
                      開始分析
                    </>
                  )}
                </Button>
                <Button variant="outline" onClick={handleFillDemo}>
                  <Sparkles className="w-4 h-4 mr-2" />
                  填入 Demo
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                分析結果
              </CardTitle>
              <CardDescription className="flex flex-wrap items-center gap-2">
                <span>{result ? `${result.brandName} 的 AI 可見度報告` : "等待分析..."}</span>
                {result?.source === "ai" && (
                  <Badge variant="secondary" className="text-xs">
                    <Sparkles className="w-3 h-3 mr-1" />
                    Gemini AI
                  </Badge>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {result ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-lg bg-secondary/50 text-center">
                      <div className={`text-4xl font-bold ${getScoreColor(result.overallScore)}`}>
                        {result.overallScore}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">綜合評分</div>
                    </div>
                    <div className="p-4 rounded-lg bg-secondary/50 text-center">
                      <div className={`text-4xl font-bold ${getScoreColor(result.aiVisibilityScore)}`}>
                        {result.aiVisibilityScore}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">AI 友善度</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-sm font-medium text-muted-foreground">各平台評分</h4>
                    {result.platforms.map((platform) => (
                      <div key={platform.name} className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span className="flex items-center gap-2">
                            {platformIcons[platform.name] ?? <Bot className="w-4 h-4" />}
                            {platform.name}
                          </span>
                          <span className={getScoreColor(platform.score)}>{platform.score}/100</span>
                        </div>
                        <div className="h-2 bg-secondary rounded-full overflow-hidden">
                          <div
                            className={`h-full ${getProgressColor(platform.score)} transition-all duration-500`}
                            style={{ width: `${platform.score}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-48 text-muted-foreground">
                  <Search className="w-12 h-12 mb-4 opacity-20" />
                  <p>輸入品牌資訊後開始分析</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {result && (
          <Card className="mt-8 bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle>優化建議清單</CardTitle>
              <CardDescription>根據分析結果，以下是提升 AI 可見度的建議</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-3">
                {result.suggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-3 rounded-lg bg-secondary/30"
                  >
                    {suggestion.type === "success" && (
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    )}
                    {suggestion.type === "warning" && (
                      <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    )}
                    {suggestion.type === "info" && (
                      <Sparkles className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    )}
                    <span className="text-sm">{suggestion.text}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  )
}
