"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Sparkles, TrendingUp, Heart, MessageCircle, Share2, Eye, ExternalLink, BarChart3, Flame, Info } from "lucide-react"
import { toast } from "sonner"

interface ViralPost {
  id: string
  date: string
  preview: string
  likes: number
  comments: number
  shares: number
  engagementRate: number
  aiAnalysis: string
}

const ANALYZER_DISCLAIMER =
  "AI-assisted 模擬分析：根據專頁 URL 與備註推演爆款策略，非 Meta/IG 官方即時數據。"

export function PostAnalyzer() {
  const [pageUrl, setPageUrl] = useState("")
  const [notes, setNotes] = useState("")
  const [posts, setPosts] = useState<ViralPost[] | null>(null)
  const [disclaimer, setDisclaimer] = useState<string | null>(null)
  const [resultSource, setResultSource] = useState<"ai" | "demo" | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [viewMode, setViewMode] = useState<"cards" | "table">("cards")

  const handleAnalyze = async () => {
    if (!pageUrl) return
    setIsLoading(true)
    try {
      const res = await fetch("/api/analyzer/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pageUrl,
          notes: notes.trim() || undefined,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error ?? "分析失敗，請稍後再試")
        return
      }
      setPosts(data.posts)
      setDisclaimer(data.disclaimer ?? ANALYZER_DISCLAIMER)
      setResultSource(data.source)
      if (data.source === "ai") {
        toast.success("Gemini AI 分析完成")
      } else if (data.error) {
        toast.warning("已顯示示範數據", { description: data.error })
      } else {
        toast.message("示範模式", {
          description: data.disclaimer ?? "設定 AI_GATEWAY_API_KEY 可啟用 Gemini。",
        })
      }
    } catch {
      toast.error("網絡錯誤，請稍後再試")
    } finally {
      setIsLoading(false)
    }
  }

  const handleFillDemo = () => {
    setPageUrl("https://facebook.com/starlightcoffee.hk")
  }

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K"
    }
    return num.toString()
  }

  return (
    <section id="analyzer" className="py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4">
            <BarChart3 className="w-3 h-3 mr-1" />
            Viral Analyzer
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">
            同行爆款 Post 分析器
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-balance">
            輸入競爭對手的社群專頁網址，AI-assisted 推演高互動貼文策略（非官方 API 即時爬取）
          </p>
        </div>

        <Card className="bg-card/50 backdrop-blur-sm border-border/50 mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              輸入競爭對手專頁
            </CardTitle>
            <CardDescription>
              支援 Facebook、Instagram、LinkedIn 等主流社群平台網址
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-2 p-3 rounded-lg border border-border/50 bg-secondary/20 text-sm text-muted-foreground">
              <Info className="w-4 h-4 flex-shrink-0 mt-0.5 text-primary" />
              <p>{ANALYZER_DISCLAIMER}</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="pageUrl">社群專頁網址</Label>
                  <Input
                    id="pageUrl"
                    placeholder="https://facebook.com/competitor-page"
                    value={pageUrl}
                    onChange={(e) => setPageUrl(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="notes">補充備註（可選）</Label>
                  <Textarea
                    id="notes"
                    placeholder="例：對手係精品咖啡店，主要做 Instagram 短片同限時優惠..."
                    className="min-h-[80px] resize-none"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex gap-3 sm:self-end">
                <Button onClick={handleAnalyze} disabled={!pageUrl || isLoading}>
                  {isLoading ? (
                    <>
                      <span className="animate-spin mr-2">⏳</span>
                      分析中...
                    </>
                  ) : (
                    <>
                      <BarChart3 className="w-4 h-4 mr-2" />
                      開始分析
                    </>
                  )}
                </Button>
                <Button variant="outline" onClick={handleFillDemo}>
                  <Sparkles className="w-4 h-4 mr-2" />
                  填入 Demo
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {posts && (
          <>
            <div className="flex justify-between items-center mb-6 flex-wrap gap-2">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Flame className="w-5 h-5 text-orange-400" />
                近期熱門貼文（按互動率排序）
                {resultSource === "ai" && (
                  <Badge variant="secondary" className="text-xs font-normal">
                    <Sparkles className="w-3 h-3 mr-1" />
                    Gemini AI
                  </Badge>
                )}
              </h3>
              <div className="flex gap-2">
                <Button
                  variant={viewMode === "cards" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("cards")}
                >
                  卡片
                </Button>
                <Button
                  variant={viewMode === "table" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("table")}
                >
                  表格
                </Button>
              </div>
            </div>

            {viewMode === "cards" ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post, index) => (
                  <Card
                    key={post.id}
                    className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-colors"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <Badge
                          variant={index < 3 ? "default" : "secondary"}
                          className="flex items-center gap-1"
                        >
                          {index < 3 && <Flame className="w-3 h-3" />}
                          #{index + 1}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{post.date}</span>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm line-clamp-3">{post.preview}</p>

                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="p-2 rounded-lg bg-secondary/50">
                          <Heart className="w-4 h-4 mx-auto mb-1 text-red-400" />
                          <span className="text-sm font-medium">{formatNumber(post.likes)}</span>
                        </div>
                        <div className="p-2 rounded-lg bg-secondary/50">
                          <MessageCircle className="w-4 h-4 mx-auto mb-1 text-blue-400" />
                          <span className="text-sm font-medium">{formatNumber(post.comments)}</span>
                        </div>
                        <div className="p-2 rounded-lg bg-secondary/50">
                          <Share2 className="w-4 h-4 mx-auto mb-1 text-green-400" />
                          <span className="text-sm font-medium">{formatNumber(post.shares)}</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between p-3 rounded-lg bg-primary/10 border border-primary/20">
                        <span className="text-sm font-medium">互動率</span>
                        <span className="text-lg font-bold text-primary">{post.engagementRate}%</span>
                      </div>

                      <div className="p-3 rounded-lg bg-secondary/30 border border-border/50">
                        <div className="flex items-center gap-2 mb-2">
                          <Sparkles className="w-4 h-4 text-primary" />
                          <span className="text-xs font-medium text-muted-foreground">AI 爆紅原因分析</span>
                        </div>
                        <p className="text-xs leading-relaxed">{post.aiAnalysis}</p>
                      </div>

                      <Button variant="outline" size="sm" className="w-full" asChild>
                        <a href={pageUrl} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          查看專頁
                        </a>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="bg-card/50 backdrop-blur-sm border-border/50 overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="w-12">#</TableHead>
                      <TableHead>日期</TableHead>
                      <TableHead className="max-w-[200px]">內容預覽</TableHead>
                      <TableHead className="text-center">
                        <Heart className="w-4 h-4 mx-auto" />
                      </TableHead>
                      <TableHead className="text-center">
                        <MessageCircle className="w-4 h-4 mx-auto" />
                      </TableHead>
                      <TableHead className="text-center">
                        <Share2 className="w-4 h-4 mx-auto" />
                      </TableHead>
                      <TableHead className="text-center">互動率</TableHead>
                      <TableHead>AI 分析</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {posts.map((post, index) => (
                      <TableRow key={post.id}>
                        <TableCell>
                          <Badge variant={index < 3 ? "default" : "secondary"}>
                            {index + 1}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground text-sm">
                          {post.date}
                        </TableCell>
                        <TableCell className="max-w-[200px]">
                          <p className="text-sm line-clamp-2">{post.preview}</p>
                        </TableCell>
                        <TableCell className="text-center">{formatNumber(post.likes)}</TableCell>
                        <TableCell className="text-center">{formatNumber(post.comments)}</TableCell>
                        <TableCell className="text-center">{formatNumber(post.shares)}</TableCell>
                        <TableCell className="text-center">
                          <Badge variant="outline" className="text-primary border-primary/50">
                            {post.engagementRate}%
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-[250px]">
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {post.aiAnalysis}
                          </p>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            )}
            {disclaimer && (
              <p className="mt-6 text-xs text-muted-foreground text-center">{disclaimer}</p>
            )}
          </>
        )}

        {!posts && (
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardContent className="flex flex-col items-center justify-center h-64 text-muted-foreground">
              <Eye className="w-12 h-12 mb-4 opacity-20" />
              <p>輸入社群專頁網址後開始分析</p>
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  )
}
