"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sparkles, Copy, Check, Wand2, MessageSquare, Briefcase, Instagram } from "lucide-react"
import { toast } from "sonner"

interface CopyVariant {
  platform: string
  style: string
  content: string
}

const platformIcons: Record<string, React.ReactNode> = {
  Threads: <MessageSquare className="w-4 h-4" />,
  LinkedIn: <Briefcase className="w-4 h-4" />,
  Instagram: <Instagram className="w-4 h-4" />,
}

export function CopywriterTool() {
  const [inputText, setInputText] = useState("")
  const [generatedCopies, setGeneratedCopies] = useState<CopyVariant[] | null>(null)
  const [resultSource, setResultSource] = useState<"ai" | "demo" | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)

  const handleGenerate = async () => {
    if (!inputText.trim()) return
    if (inputText.trim().length < 10) {
      toast.error("請輸入至少 10 字產品描述")
      return
    }
    setIsLoading(true)
    try {
      const res = await fetch("/api/copywriter/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productDescription: inputText }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast.error(data.error ?? "生成失敗，請稍後再試")
        return
      }
      setGeneratedCopies(data.variants)
      setResultSource(data.source)
      if (data.source === "ai") {
        toast.success("Gemini AI 文案已生成")
      } else if (data.error) {
        toast.warning("已顯示示範文案", { description: data.error })
      } else {
        toast.message("示範模式", {
          description: data.message ?? "設定 GOOGLE_GENERATIVE_AI_API_KEY 可啟用 Gemini。",
        })
      }
    } catch {
      toast.error("網絡錯誤，請稍後再試")
    } finally {
      setIsLoading(false)
    }
  }

  const handleFillDemo = () => {
    setInputText(
      "星光咖啡是一間位於香港的精品咖啡店，專營單品咖啡。我們使用來自哥倫比亞的優質咖啡豆，每天新鮮烘焙。咖啡帶有獨特的果香和花香，適合喜歡品味的咖啡愛好者。"
    )
  }

  const handleCopy = async (index: number, content: string) => {
    await navigator.clipboard.writeText(content)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  return (
    <section id="copywriter" className="py-20 px-6 bg-secondary/20">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4">
            <Wand2 className="w-3 h-3 mr-1" />
            Smart Copywriter
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">
            多平台文案智能變形
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-balance">
            輸入一段產品描述，一鍵轉化為 Threads、LinkedIn、Instagram 等不同平台的文案風格
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wand2 className="w-5 h-5 text-primary" />
                輸入產品描述
              </CardTitle>
              <CardDescription>
                用一般文字描述您的產品或服務，AI 會為您轉化成不同平台風格
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="例：我們是一間精品咖啡店，專營單品咖啡，使用哥倫比亞優質咖啡豆..."
                className="min-h-[200px] resize-none"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
              />
              <div className="flex gap-3">
                <Button
                  onClick={handleGenerate}
                  disabled={!inputText || isLoading}
                  className="flex-1"
                >
                  {isLoading ? (
                    <>
                      <span className="animate-spin mr-2">⏳</span>
                      生成中...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 mr-2" />
                      一鍵變形
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
                <MessageSquare className="w-5 h-5 text-primary" />
                智能文案輸出
              </CardTitle>
              <CardDescription className="flex flex-wrap items-center gap-2">
                <span>切換不同平台查看對應風格的文案</span>
                {resultSource === "ai" && (
                  <Badge variant="secondary" className="text-xs">
                    <Sparkles className="w-3 h-3 mr-1" />
                    Gemini AI
                  </Badge>
                )}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {generatedCopies ? (
                <Tabs defaultValue={generatedCopies[0]?.platform ?? "Threads"} className="w-full">
                  <TabsList className="grid w-full grid-cols-3 mb-4">
                    {generatedCopies.map((copy) => (
                      <TabsTrigger
                        key={copy.platform}
                        value={copy.platform}
                        className="flex items-center gap-2"
                      >
                        {platformIcons[copy.platform] ?? <MessageSquare className="w-4 h-4" />}
                        <span className="hidden sm:inline">{copy.platform}</span>
                      </TabsTrigger>
                    ))}
                  </TabsList>
                  {generatedCopies.map((copy, index) => (
                    <TabsContent key={copy.platform} value={copy.platform} className="space-y-4">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="secondary">{copy.style}</Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopy(index, copy.content)}
                        >
                          {copiedIndex === index ? (
                            <>
                              <Check className="w-4 h-4 mr-1 text-green-600" />
                              已複製
                            </>
                          ) : (
                            <>
                              <Copy className="w-4 h-4 mr-1" />
                              複製
                            </>
                          )}
                        </Button>
                      </div>
                      <div className="p-4 rounded-lg bg-secondary/50 min-h-[200px]">
                        <p className="whitespace-pre-wrap text-sm leading-relaxed">
                          {copy.content}
                        </p>
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
                  <Wand2 className="w-12 h-12 mb-4 opacity-20" />
                  <p>輸入產品描述後生成文案</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
