"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const testimonials = [
  {
    quote: "I filed in 6 minutes and got my biggest refund. This is exactly what tax software should be.",
    author: "Alex R.",
    role: "Freelance Designer",
  },
  {
    quote: "This is the future of taxes. Feels like magic. The AI actually understands my questions.",
    author: "Priya M.",
    role: "Software Engineer",
  },
  {
    quote: "Finally, a tax app that doesn't make me want to pull my hair out. Clean, simple, fast.",
    author: "Jordan K.",
    role: "Small Business Owner",
  },
  {
    quote: "Saved me $500 in accountant fees. The AI caught deductions I didn't even know about.",
    author: "Marcus T.",
    role: "Uber Driver",
  },
  {
    quote: "As a founder, I need year-round tax help. Taxu is like having a CPA in my pocket.",
    author: "Sarah L.",
    role: "Startup Founder",
  },
]

export function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % Math.ceil(testimonials.length / 3))
  }

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + Math.ceil(testimonials.length / 3)) % Math.ceil(testimonials.length / 3))
  }

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-background-alt">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight">Loved by Filers</h2>
          <p className="text-xl text-muted-foreground">Join thousands who've already filed smarter</p>
        </div>

        <div className="relative">
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.slice(currentIndex * 3, currentIndex * 3 + 3).map((testimonial, index) => (
              <div
                key={index}
                className="rounded-2xl border border-border bg-card p-8 hover:border-accent/30 transition-colors"
              >
                <div className="mb-6">
                  <svg className="h-8 w-8 text-accent/30" fill="currentColor" viewBox="0 0 32 32">
                    <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                  </svg>
                </div>
                <p className="text-lg mb-6 leading-relaxed text-balance">{testimonial.quote}</p>
                <div>
                  <div className="font-semibold">{testimonial.author}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-center gap-4 mt-8">
            <Button variant="outline" size="icon" onClick={prev} className="rounded-full bg-transparent">
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <div className="flex gap-2">
              {Array.from({ length: Math.ceil(testimonials.length / 3) }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i === currentIndex ? "bg-accent w-8" : "bg-muted-foreground/30"
                  }`}
                />
              ))}
            </div>
            <Button variant="outline" size="icon" onClick={next} className="rounded-full bg-transparent">
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
