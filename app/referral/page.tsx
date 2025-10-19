"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Gift, Users, Check, Copy } from "lucide-react"

export default function ReferralPage() {
  const [copied, setCopied] = useState(false)
  const referralCode = "TAXU-ALEX-2025"
  const referralLink = `https://taxu.ai/join/${referralCode}`

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-background pt-20">
      {/* Hero */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neon/10 border border-neon/20 mb-6">
            <Gift className="w-4 h-4 text-neon" />
            <span className="text-sm font-medium text-neon">Referral Program</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-balance">
            Share Taxu.
            <br />
            <span className="text-neon">File for Free.</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 text-balance">
            Invite your friends and family. When they file, you both get your next return completely free.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 border-neon/20 bg-card/50 backdrop-blur text-center">
              <div className="text-4xl font-bold text-neon mb-2">3</div>
              <div className="text-sm text-muted-foreground">Friends Invited</div>
            </Card>
            <Card className="p-6 border-neon/20 bg-card/50 backdrop-blur text-center">
              <div className="text-4xl font-bold text-neon mb-2">2</div>
              <div className="text-sm text-muted-foreground">Successfully Filed</div>
            </Card>
            <Card className="p-6 border-neon/20 bg-card/50 backdrop-blur text-center">
              <div className="text-4xl font-bold text-neon mb-2">$58</div>
              <div className="text-sm text-muted-foreground">Credits Earned</div>
            </Card>
          </div>
        </div>
      </section>

      {/* Share Section */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-2xl">
          <Card className="p-8 border-neon/20 bg-card/50 backdrop-blur">
            <h2 className="text-2xl font-bold mb-6 text-center">Your Referral Link</h2>
            <div className="flex gap-2 mb-6">
              <Input value={referralLink} readOnly className="flex-1 border-neon/20 bg-background/50" />
              <Button onClick={handleCopy} className="bg-neon hover:bg-neon/90 text-background">
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline" className="border-neon/20 bg-transparent">
                Share via Email
              </Button>
              <Button variant="outline" className="border-neon/20 bg-transparent">
                Share on Twitter
              </Button>
            </div>
          </Card>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl font-bold mb-12 text-center">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-neon/10 flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-neon" />
              </div>
              <h3 className="text-xl font-bold mb-2">1. Share Your Link</h3>
              <p className="text-sm text-muted-foreground">
                Send your unique referral link to friends, family, or colleagues
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-neon/10 flex items-center justify-center mx-auto mb-4">
                <Check className="w-8 h-8 text-neon" />
              </div>
              <h3 className="text-xl font-bold mb-2">2. They File</h3>
              <p className="text-sm text-muted-foreground">When they complete their tax return using Taxu</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-neon/10 flex items-center justify-center mx-auto mb-4">
                <Gift className="w-8 h-8 text-neon" />
              </div>
              <h3 className="text-xl font-bold mb-2">3. You Both Win</h3>
              <p className="text-sm text-muted-foreground">You both get your next filing completely free</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
