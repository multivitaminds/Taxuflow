"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Play } from "lucide-react"
import { useEffect, useState } from "react"
import Link from "next/link"

export function HeroSection() {
  const [count, setCount] = useState(3200)

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((prev) => prev + Math.floor(Math.random() * 3))
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      <div className="absolute top-20 left-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-accent/10 rounded-full blur-3xl animate-pulse delay-1000" />

      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent text-sm font-medium border border-accent/20">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
            </span>
            AI-Powered Tax Filing
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-8xl font-bold tracking-tight text-balance leading-[1.1]">
            Taxes Filed by AI.
            <br />
            <span className="text-glow">Fast. Secure. All Year.</span>
          </h1>

          <p className="text-xl sm:text-2xl text-muted-foreground max-w-3xl mx-auto text-balance leading-relaxed">
            Taxu is your always-on, always-learning AI tax assistant — built for W-2 employees, gig workers, and
            founders.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/get-started">
              <Button size="lg" className="text-base px-8 h-12 glow-neon hover:glow-neon-strong transition-all">
                Start Filing Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/pricing">
              <Button
                size="lg"
                variant="outline"
                className="text-base px-8 h-12 bg-transparent border-accent/30 hover:border-accent hover:bg-accent/5"
              >
                <Play className="mr-2 h-5 w-5" />
                Book a Demo
              </Button>
            </Link>
          </div>

          <div className="pt-8">
            <p className="text-sm text-muted-foreground">
              Returns filed this week: <span className="text-accent font-semibold">{count.toLocaleString()}+</span>
            </p>
          </div>

          <div className="pt-16">
            <div className="relative rounded-2xl border border-border bg-card/50 backdrop-blur-sm p-4 sm:p-8 shadow-2xl glow-neon">
              <div className="aspect-video rounded-lg bg-muted flex items-center justify-center overflow-hidden">
                <img
                  src="/modern-ai-tax-filing-dashboard-interface-with-chat.jpg"
                  alt="Taxu AI Interface"
                  className="rounded-lg w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
