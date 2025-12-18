import Link from "next/link"
import { Package, Check, ArrowRight, Tag, Layers, DollarSign } from "lucide-react"

export default function ProductsServicesPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-yellow-50 to-amber-50">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-100 text-yellow-700 rounded-full text-sm font-medium mb-6">
            <Package className="w-4 h-4" />
            Products & Services
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-6 text-balance">
            Manage Your Product Catalog and Pricing
          </h1>
          <p className="text-xl text-gray-600 mb-8 text-pretty">
            Create a comprehensive catalog of products and services with pricing, descriptions, and inventory tracking.
            Add items to invoices with one click.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/login"
              className="px-8 py-4 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors font-semibold"
            >
              Start Free Trial
            </Link>
            <Link
              href="/accounting/products"
              className="px-8 py-4 bg-white text-yellow-600 border-2 border-yellow-600 rounded-lg hover:bg-yellow-50 transition-colors font-semibold"
            >
              View Demo
            </Link>
          </div>
        </div>

        {/* Key Benefits */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {[
            {
              icon: Tag,
              title: "Consistent Pricing",
              desc: "Set standard prices and never worry about pricing errors on invoices",
            },
            {
              icon: Layers,
              title: "Inventory Tracking",
              desc: "Track stock levels and get alerts when inventory runs low",
            },
            {
              icon: DollarSign,
              title: "Profitability Analysis",
              desc: "Track costs and margins to understand which products are most profitable",
            },
          ].map((benefit) => (
            <div key={benefit.title} className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
              <benefit.icon className="w-12 h-12 text-yellow-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{benefit.title}</h3>
              <p className="text-gray-600">{benefit.desc}</p>
            </div>
          ))}
        </div>

        {/* Features List */}
        <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100 mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Complete Product Management</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              "Unlimited products & services",
              "Custom pricing tiers",
              "Inventory tracking",
              "Low stock alerts",
              "Product categories",
              "SKU management",
              "Cost & margin tracking",
              "Product images & descriptions",
              "Tax settings per product",
              "Bulk import/export",
              "Sales analytics by product",
              "Bundled products",
            ].map((feature) => (
              <div key={feature} className="flex items-start gap-3">
                <Check className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5" />
                <span className="text-gray-700">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Related Services */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Works Great With</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "Invoicing",
                desc: "Add products to invoices with one click",
                href: "/services/invoicing",
              },
              {
                title: "Project Tracking",
                desc: "Track product usage by project",
                href: "/services/project-tracking",
              },
              {
                title: "Financial Reports",
                desc: "Analyze product profitability",
                href: "/services/financial-reports",
              },
            ].map((service) => (
              <Link
                key={service.title}
                href={service.href}
                className="p-6 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-yellow-600 transition-colors">
                  {service.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4">{service.desc}</p>
                <div className="flex items-center text-yellow-600 text-sm font-medium">
                  Learn more <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-yellow-600 to-amber-600 rounded-2xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Organize Your Product Catalog?</h2>
          <p className="text-xl text-yellow-100 mb-8">Start tracking inventory and profitability today</p>
          <Link
            href="/login"
            className="inline-block px-8 py-4 bg-white text-yellow-600 rounded-lg hover:bg-gray-100 transition-colors font-semibold"
          >
            Start Free Trial
          </Link>
        </div>
      </div>
    </main>
  )
}
