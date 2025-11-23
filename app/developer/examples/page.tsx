"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Code, Star, ArrowRight } from "lucide-react"

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
    <div className="min-h-screen bg-slate-50">
      {/* Updated hero section to use Stripe gradient and new styling */}
      <section className="gradient-stripe-hero text-white pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Code Examples</h1>
            <p className="text-xl text-white/80 leading-relaxed">
              Jumpstart your integration with complete, production-ready code examples for common tax and accounting
              workflows.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-12 -mt-10 relative z-10">
        {/* Filters */}
        <Card className="p-6 mb-8 border-0 shadow-lg bg-white/80 backdrop-blur-sm">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-3">Category</h3>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <Button
                    key={cat}
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedCategory(cat)}
                    className={`rounded-full transition-all ${
                      selectedCategory === cat
                        ? "bg-[#635BFF] hover:bg-[#5046E5] text-white border-transparent shadow-md"
                        : "bg-white text-slate-600 border-slate-200 hover:border-[#635BFF] hover:text-[#635BFF]"
                    }`}
                  >
                    {cat}
                  </Button>
                ))}
              </div>
            </div>
            <div className="pt-2 border-t border-slate-100">
              <h3 className="text-sm font-semibold text-slate-900 uppercase tracking-wider mb-3 mt-2">Language</h3>
              <div className="flex flex-wrap gap-2">
                {languages.map((lang) => (
                  <Button
                    key={lang}
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedLanguage(lang)}
                    className={`rounded-full transition-all ${
                      selectedLanguage === lang
                        ? "bg-[#635BFF] hover:bg-[#5046E5] text-white border-transparent shadow-md"
                        : "bg-white text-slate-600 border-slate-200 hover:border-[#635BFF] hover:text-[#635BFF]"
                    }`}
                  >
                    {lang}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* Popular Examples */}
        {popularFiltered.length > 0 && (
          <div className="mb-16">
            <div className="flex items-center gap-2 mb-6">
              <Star className="w-5 h-5 text-[#635BFF] fill-current" />
              <h2 className="text-2xl font-bold text-slate-900">Popular Integrations</h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {popularFiltered.map((example) => (
                <Card
                  key={example.title}
                  className="group bg-white border-slate-200 p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#635BFF] to-[#00D4FF] opacity-0 group-hover:opacity-100 transition-opacity" />

                  <div className="flex items-start justify-between mb-4">
                    <div className="p-3 bg-[#635BFF]/5 rounded-lg group-hover:bg-[#635BFF]/10 transition-colors">
                      <Code className="w-6 h-6 text-[#635BFF]" />
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-[#635BFF] transition-colors">
                    {example.title}
                  </h3>
                  <p className="text-sm text-slate-500 mb-6 leading-relaxed h-10 line-clamp-2">{example.description}</p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    <span className="px-2.5 py-0.5 bg-slate-100 text-slate-600 text-xs font-medium rounded-full border border-slate-200">
                      {example.language}
                    </span>
                    <span className="px-2.5 py-0.5 bg-slate-100 text-slate-600 text-xs font-medium rounded-full border border-slate-200">
                      {example.category}
                    </span>
                  </div>

                  <div className="flex gap-3 mt-auto">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 border-slate-200 text-slate-700 hover:border-[#635BFF] hover:text-[#635BFF] hover:bg-[#635BFF]/5 bg-transparent"
                      asChild
                    >
                      <a href={example.github} target="_blank" rel="noopener noreferrer">
                        View Code
                      </a>
                    </Button>
                    {example.demo && (
                      <Button size="sm" className="flex-1 bg-[#635BFF] hover:bg-[#5046E5] text-white shadow-sm" asChild>
                        <a href={example.demo} target="_blank" rel="noopener noreferrer">
                          Live Demo
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
            <h2 className="text-2xl font-bold text-slate-900 mb-6">More Examples</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherFiltered.map((example) => (
                <Card
                  key={example.title}
                  className="group bg-white border-slate-200 p-6 hover:shadow-lg transition-all hover:border-[#635BFF]/50"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 bg-slate-50 rounded-md group-hover:bg-[#635BFF]/5 transition-colors">
                      <Code className="w-5 h-5 text-slate-500 group-hover:text-[#635BFF]" />
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 mb-2">{example.title}</h3>
                  <p className="text-sm text-slate-500 mb-4 leading-relaxed">{example.description}</p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    <span className="px-2 py-0.5 bg-slate-50 text-slate-600 text-xs rounded border border-slate-100">
                      {example.language}
                    </span>
                    <span className="px-2 py-0.5 bg-slate-50 text-slate-600 text-xs rounded border border-slate-100">
                      {example.difficulty}
                    </span>
                  </div>

                  <a
                    href={example.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-sm font-medium text-[#635BFF] hover:text-[#5046E5]"
                  >
                    View Source <ArrowRight className="w-4 h-4 ml-1" />
                  </a>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {filteredExamples.length === 0 && (
          <div className="text-center py-20 bg-white rounded-xl border border-dashed border-slate-300">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Code className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-1">No examples found</h3>
            <p className="text-slate-500">Try adjusting your filters to find what you're looking for.</p>
          </div>
        )}
      </div>
    </div>
  )
}
