import { Navigation } from "@/components/navigation"
import { HeroSection } from "@/components/hero-section"
import { ToolsOverview } from "@/components/tools-overview"
import { GeoOptimizer } from "@/components/geo-optimizer"
import { CopywriterTool } from "@/components/copywriter-tool"
import { PostAnalyzer } from "@/components/post-analyzer"
import { ContactSection } from "@/components/contact-section"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <HeroSection />
      <ToolsOverview />
      <GeoOptimizer />
      <CopywriterTool />
      <PostAnalyzer />
      <ContactSection />
      <Footer />
    </main>
  )
}
