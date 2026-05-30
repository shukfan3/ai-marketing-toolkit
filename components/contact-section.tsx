"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Mail, Linkedin, Instagram, Send } from "lucide-react"
import { toast } from "sonner"
import { buildMailtoUrl, siteConfig } from "@/lib/site-config"

export function ContactSection() {
  const [name, setName] = useState("")
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) {
      toast.error("請填寫訊息內容")
      return
    }

    const mailto = buildMailtoUrl({
      name: name.trim(),
      subject: subject.trim(),
      message: message.trim(),
    })

    if (!mailto) {
      toast.error("尚未設定聯絡電郵", {
        description: "請在 Vercel 設定 NEXT_PUBLIC_CONTACT_EMAIL",
      })
      return
    }

    setIsSubmitting(true)
    window.location.href = mailto
    toast.success("已開啟你的郵件程式", {
      description: "請用你本身的電郵帳號確認並按傳送。",
    })
    setTimeout(() => setIsSubmitting(false), 1500)
  }

  const hasSocial =
    siteConfig.linkedInUrl || siteConfig.instagramUrl || siteConfig.contactEmail

  return (
    <section id="contact" className="py-20 px-6 bg-secondary/20">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4">
            <Mail className="w-3 h-3 mr-1" />
            Contact
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">
            聯絡我
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-balance">
            填寫訊息後會開啟你電腦的郵件 app，用<strong>你自己的電郵</strong>直接寄給我。
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    姓名 <span className="text-muted-foreground font-normal">（可選）</span>
                  </label>
                  <Input
                    id="name"
                    placeholder="您的姓名"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="subject" className="text-sm font-medium">
                    主題 <span className="text-muted-foreground font-normal">（可選）</span>
                  </label>
                  <Input
                    id="subject"
                    placeholder="合作洽談 / 工具查詢 / 其他"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium">
                    訊息內容
                  </label>
                  <Textarea
                    id="message"
                    placeholder="請描述您的需求..."
                    className="min-h-[120px] resize-none"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  <Send className="w-4 h-4 mr-2" />
                  {isSubmitting ? "開啟郵件中..." : "用我的電郵發送"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  關於 Niki Chan
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                  專注於 AI 驅動的數碼營銷策略，擁有多年品牌推廣經驗。致力於運用最新 AI 技術，幫助企業提升營銷效率與可見度。
                </p>
                <div className="space-y-2 text-sm">
                  <p><span className="text-muted-foreground">專長：</span>GEO優化 · 內容營銷 · 社群經營 · AI應用</p>
                  <p><span className="text-muted-foreground">地區：</span>香港</p>
                </div>
              </CardContent>
            </Card>

            {hasSocial && (
              <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">社群媒體</h3>
                  <div className="flex gap-3">
                    {siteConfig.linkedInUrl && (
                      <Button variant="outline" size="icon" asChild>
                        <a
                          href={siteConfig.linkedInUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="LinkedIn"
                        >
                          <Linkedin className="w-4 h-4" />
                        </a>
                      </Button>
                    )}
                    {siteConfig.instagramUrl && (
                      <Button variant="outline" size="icon" asChild>
                        <a
                          href={siteConfig.instagramUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label="Instagram"
                        >
                          <Instagram className="w-4 h-4" />
                        </a>
                      </Button>
                    )}
                    {siteConfig.contactEmail && (
                      <Button variant="outline" size="icon" asChild>
                        <a
                          href={`mailto:${siteConfig.contactEmail}`}
                          aria-label="Email"
                        >
                          <Mail className="w-4 h-4" />
                        </a>
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
