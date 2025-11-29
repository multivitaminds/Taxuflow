import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle2 } from "lucide-react"
import Image from "next/image"

export default function PartnersPage() {
  const partners = [
    {
      name: "Gusto",
      logo: "/images/partners/gusto.png",
      description: "Seamless payroll integration for small businesses",
      features: ["Auto-import W-2s", "Quarterly tax estimates", "Year-end tax forms"],
    },
    {
      name: "Uber",
      logo: "/images/partners/uber.png",
      description: "Automatic 1099 import for rideshare drivers",
      features: ["Mileage tracking", "Expense categorization", "Quarterly filing reminders"],
    },
    {
      name: "Plaid",
      logo: "/images/partners/plaid.png",
      description: "Secure bank account verification and income tracking",
      features: ["Income verification", "Refund direct deposit", "Bank-level security"],
    },
    {
      name: "Stripe",
      logo: "/images/partners/stripe.png",
      description: "Business income tracking for online sellers",
      features: ["Revenue reporting", "Expense tracking", "1099-K integration"],
    },
  ]

  return (
    <div className="min-h-screen bg-background pt-20">
      {/* Hero */}
      <section className="py-20 px-4 border-b border-neon/20">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Integration Partners</h1>
          <p className="text-xl text-muted-foreground">Taxu works seamlessly with the tools you already use</p>
        </div>
      </section>

      {/* Partners Grid */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {partners.map((partner) => (
              <Card key={partner.name} className="p-8 border-neon/20 bg-card/50 backdrop-blur">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-20 h-20 rounded-xl bg-white flex items-center justify-center p-3 overflow-hidden border border-gray-100 flex-shrink-0">
                    <Image
                      src={partner.logo || "/placeholder.svg"}
                      alt={`${partner.name} logo`}
                      width={80}
                      height={80}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="pt-2">
                    <p className="text-base text-muted-foreground">{partner.description}</p>
                  </div>
                </div>
                {/* </CHANGE> */}
                <div className="space-y-3 mb-6">
                  {partner.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-neon flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
                <Button className="w-full bg-neon hover:bg-neon/90 text-background">Connect</Button>
                {/* </CHANGE> */}
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-gradient-to-b from-transparent to-neon/5">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold mb-6">Want to Partner with Taxu?</h2>
          <p className="text-xl text-muted-foreground mb-8">Join our growing ecosystem of integration partners</p>
          <Button size="lg" className="bg-neon hover:bg-neon/90 text-background text-lg px-8">
            Contact Partnerships Team
          </Button>
        </div>
      </section>
    </div>
  )
}
