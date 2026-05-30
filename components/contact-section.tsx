"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Mail, Linkedin, Instagram, Send } from "lucide-react"

export function ContactSection() {
  return (
    <section id="contact" className="py-20 px-6 bg-secondary/20">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4">
            <Mail className="w-3 h-3 mr-1" />
            Contact
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">
            聯絡我
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-balance">
            有任何合作機會或想進一步了解這些工具？歡迎與我聯繫！
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Contact Form */}
          <Card className="bg-card/50 backdrop-blur-sm border-border/50">
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    姓名
                  </label>
                  <Input id="name" placeholder="您的姓名" />
                </div>
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    電郵
                  </label>
                  <Input id="email" type="email" placeholder="you@example.com" />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="subject" className="text-sm font-medium">
                  主題
                </label>
                <Input id="subject" placeholder="合作洽談 / 工具查詢 / 其他" />
              </div>
              <div className="space-y-2">
                <label htmlFor="message" className="text-sm font-medium">
                  訊息內容
                </label>
                <Textarea
                  id="message"
                  placeholder="請描述您的需求..."
                  className="min-h-[120px] resize-none"
                />
              </div>
              <Button className="w-full">
                <Send className="w-4 h-4 mr-2" />
                發送訊息
              </Button>
            </CardContent>
          </Card>

          {/* Contact Info */}
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

            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">社群媒體</h3>
                <div className="flex gap-3">
                  <Button variant="outline" size="icon" asChild>
                    <a href="#" aria-label="LinkedIn">
                      <Linkedin className="w-4 h-4" />
                    </a>
                  </Button>
                  <Button variant="outline" size="icon" asChild>
                    <a href="#" aria-label="Instagram">
                      <Instagram className="w-4 h-4" />
                    </a>
                  </Button>
                  <Button variant="outline" size="icon" asChild>
                    <a href="#" aria-label="Email">
                      <Mail className="w-4 h-4" />
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}
