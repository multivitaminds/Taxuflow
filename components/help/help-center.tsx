"use client"

import { useState } from "react"
import { Search, Video, MessageCircle, ExternalLink, FileText } from "lucide-react"
import { DocumentIcon, WelcomeIcon, InsightIcon } from "@/components/icons/professional-icons"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function HelpCenter() {
  const [searchQuery, setSearchQuery] = useState("")

  const categories = [
    {
      title: "Getting Started",
      icon: WelcomeIcon,
      articles: [
        { title: "Quick Start Guide", views: "12.5K", readTime: "5 min" },
        { title: "Account Setup", views: "8.2K", readTime: "3 min" },
        { title: "Navigation Tips", views: "6.1K", readTime: "4 min" },
      ],
    },
    {
      title: "Accounting Platform",
      icon: DocumentIcon,
      articles: [
        { title: "Chart of Accounts Setup", views: "15.3K", readTime: "8 min" },
        { title: "Bank Reconciliation Guide", views: "11.7K", readTime: "10 min" },
        { title: "Creating Invoices", views: "9.4K", readTime: "6 min" },
      ],
    },
    {
      title: "Neobank Features",
      icon: InsightIcon,
      articles: [
        { title: "Virtual Cards Guide", views: "7.8K", readTime: "5 min" },
        { title: "Investment Portfolio Setup", views: "6.5K", readTime: "7 min" },
        { title: "International Transfers", views: "5.2K", readTime: "4 min" },
      ],
    },
  ]

  const videos = [
    { title: "Platform Overview", duration: "5:23", views: "45K" },
    { title: "Advanced Reporting", duration: "8:15", views: "32K" },
    { title: "Integration Setup", duration: "6:42", views: "28K" },
  ]

  const filteredCategories = categories
    .map((cat) => ({
      ...cat,
      articles: cat.articles.filter((article) => article.title.toLowerCase().includes(searchQuery.toLowerCase())),
    }))
    .filter((cat) => cat.articles.length > 0)

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">How can we help you?</h1>
          <p className="text-muted-foreground mb-8">Search our knowledge base or browse by category</p>

          {/* Search */}
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search for help articles, guides, tutorials..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-14 text-lg"
            />
          </div>
        </div>

        <Tabs defaultValue="articles" className="space-y-8">
          <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto">
            <TabsTrigger value="articles">Articles</TabsTrigger>
            <TabsTrigger value="videos">Videos</TabsTrigger>
            <TabsTrigger value="contact">Contact</TabsTrigger>
          </TabsList>

          <TabsContent value="articles" className="space-y-8">
            {filteredCategories.map((category) => (
              <Card key={category.title} className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <category.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h2 className="text-xl font-semibold">{category.title}</h2>
                </div>

                <div className="space-y-3">
                  {category.articles.map((article) => (
                    <button
                      key={article.title}
                      className="w-full flex items-center justify-between p-4 rounded-lg hover:bg-muted transition-colors text-left"
                    >
                      <div>
                        <h3 className="font-medium mb-1">{article.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {article.views} views • {article.readTime} read
                        </p>
                      </div>
                      <ExternalLink className="h-4 w-4 text-muted-foreground" />
                    </button>
                  ))}
                </div>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="videos" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((video) => (
                <Card key={video.title} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="aspect-video bg-muted flex items-center justify-center">
                    <Video className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold mb-2">{video.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {video.duration} • {video.views} views
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="contact" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-6 hover:shadow-lg transition-shadow">
                <MessageCircle className="h-8 w-8 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Live Chat</h3>
                <p className="text-muted-foreground mb-4">Get instant help from our support team</p>
                <Button className="w-full">Start Chat</Button>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-shadow">
                <FileText className="h-8 w-8 text-primary mb-4" />
                <h3 className="text-xl font-semibold mb-2">Email Support</h3>
                <p className="text-muted-foreground mb-4">Send us a detailed message about your issue</p>
                <Button variant="outline" className="w-full bg-transparent">
                  Send Email
                </Button>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
