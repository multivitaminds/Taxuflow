"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Code, ExternalLink, Star } from 'lucide-react'

export default function ExamplesPage() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedLanguage, setSelectedLanguage] = useState("All")

  const examples = [
    {
      title: "Tax Filing Integration",
      description: "Complete tax filing flow with document upload, AI processing, and e-filing",
      language: "Node.js",
      category: "Full Stack",
      difficulty: "Intermediate",
      github: "https://github.com/multivitaminds/taxu-examples",
      demo: "https://demo.taxu.io/tax-filing",
      popular: true,
    },
    {
      title: "Payroll Tax Calculator",
      description: "Calculate payroll taxes for employees with multi-state support",
      language: "Python",
      category: "Backend",
      difficulty: "Beginner",
      github: "https://github.com/multivitaminds/taxu-examples",
      demo: null,
      popular: true,
    },
    {
      title: "Accounting Dashboard",
      description: "Real-time accounting dashboard with invoices, expenses, and reports",
      language: "React",
      category: "Frontend",
      difficulty: "Intermediate",
      github: "https://github.com/multivitaminds/taxu-examples",
      demo: "https://demo.taxu.io/accounting",
      popular: true,
    },
    {
      title: "Webhook Handler",
      description: "Express.js webhook handler with signature verification",
      language: "Node.js",
      category: "Backend",
      difficulty: "Beginner",
      github: "https://github.com/multivitaminds/taxu-examples",
      demo: null,
      popular: false,
    },
    {
      title: "Document OCR Pipeline",
      description: "Automated document processing pipeline with AI extraction",
      language: "Python",
      category: "AI/ML",
      difficulty: "Advanced",
      github: "https://github.com/multivitaminds/taxu-examples",
      demo: null,
      popular: false,
    },
    {
      title: "Multi-tenant SaaS",
      description: "Multi-tenant tax software with team management and billing",
      language: "Next.js",
      category: "Full Stack",
      difficulty: "Advanced",
      github: "https://github.com/multivitaminds/taxu-examples",
      demo: "https://demo.taxu.io/saas",
      popular: true,
    },
    {
      title: "Mobile Tax App",
      description: "React Native mobile app for tax filing on iOS and Android",
      language: "React Native",
      category: "Mobile",
      difficulty: "Intermediate",
      github: "https://github.com/multivitaminds/taxu-examples",
      demo: null,
      popular: false,
    },
    {
      title: "Compliance Checker",
      description: "Automated compliance checking for business entities",
      language: "Go",
      category: "Backend",
      difficulty: "Intermediate",
      github: "https://github.com/multivitaminds/taxu-examples",
      demo: null,
      popular: false,
    },
  ]

  const categories = ["All", "Full Stack", "Backend", "Frontend", "AI/ML", "Mobile"]
  const languages = ["All", "Node.js", "Python", "React", "Next.js", "Go", "React Native"]

  const filteredExamples = examples.filter((example) => {
    const matchesCategory = selectedCategory === "All" || example.category === selectedCategory
    const matchesLanguage = selectedLanguage === "All" || example.language === selectedLanguage
    return matchesCategory && matchesLanguage
  })

  const popularFiltered = filteredExamples.filter((ex) => ex.popular)
  const otherFiltered = filteredExamples.filter((ex) => !ex.popular)

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Code Examples</h1>
          <p className="text-xl text-gray-400 max-w-3xl">
            Real-world integration examples and starter templates to help you build faster
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 space-y-4">
          <div>
            <h3 className="text-sm font-medium text-gray-400 mb-2">Category</h3>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <Button
                  key={cat}
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedCategory(cat)}
                  className={`border-gray-700 text-gray-300 hover:bg-gray-800 transition-colors ${
                    selectedCategory === cat ? "bg-[#635BFF] hover:bg-[#5046E5] text-white border-[#635BFF]" : "bg-transparent"
                  }`}
                >
                  {cat}
                </Button>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-400 mb-2">Language</h3>
            <div className="flex flex-wrap gap-2">
              {languages.map((lang) => (
                <Button
                  key={lang}
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedLanguage(lang)}
                  className={`border-gray-700 text-gray-300 hover:bg-gray-800 transition-colors ${
                    selectedLanguage === lang ? "bg-[#635BFF] hover:bg-[#5046E5] text-white border-[#635BFF]" : "bg-transparent"
                  }`}
                >
                  {lang}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Popular Examples */}
        {popularFiltered.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">Popular Examples</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {popularFiltered.map((example) => (
                <Card
                  key={example.title}
                  className="bg-[#111] border-gray-800 p-6 hover:border-[#635BFF] transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="p-2 bg-[#635BFF]/10 rounded">
                      <Code className="w-5 h-5 text-[#635BFF]" />
                    </div>
                    <div className="flex items-center gap-1 text-yellow-500">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-xs">Popular</span>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2">{example.title}</h3>
                  <p className="text-sm text-gray-400 mb-4">{example.description}</p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="px-2 py-1 bg-black/50 text-gray-300 text-xs rounded">{example.language}</span>
                    <span className="px-2 py-1 bg-black/50 text-gray-300 text-xs rounded">{example.category}</span>
                    <span className="px-2 py-1 bg-black/50 text-gray-300 text-xs rounded">{example.difficulty}</span>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800 bg-transparent"
                      asChild
                    >
                      <a href={example.github} target="_blank" rel="noopener noreferrer">
                        <Code className="w-4 h-4 mr-2" />
                        Code
                      </a>
                    </Button>
                    {example.demo && (
                      <Button size="sm" className="flex-1 bg-[#635BFF] hover:bg-[#5046E5] text-white" asChild>
                        <a href={example.demo} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Demo
                        </a>
                      </Button>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* All Examples */}
        {otherFiltered.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">All Examples</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherFiltered.map((example) => (
                <Card
                  key={example.title}
                  className="bg-[#111] border-gray-800 p-6 hover:border-gray-700 transition-colors"
                >
                  <div className="p-2 bg-[#635BFF]/10 rounded w-fit mb-3">
                    <Code className="w-5 h-5 text-[#635BFF]" />
                  </div>

                  <h3 className="text-lg font-bold text-white mb-2">{example.title}</h3>
                  <p className="text-sm text-gray-400 mb-4">{example.description}</p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="px-2 py-1 bg-black/50 text-gray-300 text-xs rounded">{example.language}</span>
                    <span className="px-2 py-1 bg-black/50 text-gray-300 text-xs rounded">{example.category}</span>
                    <span className="px-2 py-1 bg-black/50 text-gray-300 text-xs rounded">{example.difficulty}</span>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full border-gray-700 text-gray-300 hover:bg-gray-800 bg-transparent"
                    asChild
                  >
                    <a href={example.github} target="_blank" rel="noopener noreferrer">
                      <Code className="w-4 h-4 mr-2" />
                      View Code
                    </a>
                  </Button>
                </Card>
              ))}
            </div>
          </div>
        )}

        {filteredExamples.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No examples match your filters. Try selecting different options.</p>
          </div>
        )}
      </div>
    </div>
  )
}
