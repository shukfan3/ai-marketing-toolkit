import { Sparkles } from "lucide-react"

export function Footer() {
  return (
    <footer className="py-8 px-6 border-t border-border/50">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Sparkles className="w-4 h-4 text-primary" />
            <span>© 2024 Niki Chan. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <span>Powered by AI</span>
            <span>|</span>
            <span>Made with ❤️ in Hong Kong</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
