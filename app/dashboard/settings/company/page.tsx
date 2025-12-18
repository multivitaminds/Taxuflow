"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Building2, FileText, Hash, Phone, MapPin, Scale, Pencil } from "lucide-react"

export default function CompanyProfilePage() {
  const sections = [
    {
      id: "legal-name",
      title: "Legal name",
      icon: Building2,
      value: "Taxu, Inc.",
      description: "Your registered business name from formation documents",
    },
    {
      id: "dba",
      title: "Doing business as (DBA)",
      icon: FileText,
      value: (
        <div className="flex items-center gap-2">
          <span>Taxu</span>
          <Badge variant="secondary" className="text-xs bg-slate-100 text-slate-700 border-slate-200">
            Default
          </Badge>
        </div>
      ),
      description: "Trade name your business operates under",
    },
    {
      id: "ein",
      title: "Federal EIN",
      icon: Hash,
      value: "••-•••1234",
      description: "Employer Identification Number for tax purposes",
    },
    {
      id: "phone",
      title: "Company phone number",
      icon: Phone,
      value: "+1 (555) 123-4567",
      description: "Primary contact number for your business",
    },
    {
      id: "mailing",
      title: "Company mailing address",
      icon: MapPin,
      value: (
        <div className="space-y-0.5 text-slate-900 leading-relaxed">
          <p>900 SW 5th Ave, Floor 7</p>
          <p>Portland, OR 97204</p>
          <p>United States</p>
        </div>
      ),
      description: "Where we'll send physical cards and correspondence",
    },
    {
      id: "legal-address",
      title: "Company legal address",
      icon: Scale,
      value: (
        <div className="space-y-0.5 text-slate-900 leading-relaxed">
          <p>650 Mission St, Floor 4</p>
          <p>San Francisco, CA 94105</p>
          <p>United States</p>
        </div>
      ),
      description: "Address from formation documents appearing on statements",
    },
  ]

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="pb-6 border-b border-slate-200">
        <div className="flex items-center gap-3 mb-3">
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight">Company Profile</h1>
          <Badge variant="secondary" className="bg-[#635bff]/10 text-[#635bff] border-[#635bff]/20 px-3 py-1">
            S-Corp
          </Badge>
        </div>
        <p className="text-slate-600 leading-relaxed">Manage your company information and business details</p>
      </div>

      {/* Company Logo */}
      <div className="bg-white rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all duration-200">
        <div className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-9 h-9 rounded-lg bg-slate-50 flex items-center justify-center">
                  <Building2 className="w-4 h-4 text-slate-700" />
                </div>
                <h2 className="text-base font-semibold text-slate-900">Company logo</h2>
              </div>
              <p className="text-sm text-slate-500 mb-4 ml-12">Appears next to your company name throughout Taxu</p>
              <div className="ml-12 flex items-center gap-6">
                <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-[#635bff] to-[#5246e0] flex items-center justify-center text-white font-bold text-3xl shadow-lg shadow-[#635bff]/20">
                  T
                </div>
                <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                  <Pencil className="w-3.5 h-3.5" />
                  Change logo
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Company Details */}
      <div className="space-y-6">
        {sections.map((section) => {
          const Icon = section.icon
          return (
            <div
              key={section.id}
              className="bg-white rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all duration-200"
            >
              <div className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-9 h-9 rounded-lg bg-slate-50 flex items-center justify-center">
                        <Icon className="w-4 h-4 text-slate-700" />
                      </div>
                      <h2 className="text-base font-semibold text-slate-900">{section.title}</h2>
                    </div>
                    <p className="text-sm text-slate-500 mb-4 ml-12">{section.description}</p>
                    <div className="ml-12 text-slate-900 leading-relaxed">{section.value}</div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-[#635bff] hover:text-[#5246e0] hover:bg-[#635bff]/5 gap-2 flex-shrink-0"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    Edit
                  </Button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Terms and Conditions */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-9 h-9 rounded-lg bg-slate-50 flex items-center justify-center">
                <FileText className="w-4 h-4 text-slate-700" />
              </div>
              <h2 className="text-base font-semibold text-slate-900">Terms and Conditions</h2>
            </div>
            <p className="text-sm text-slate-500 ml-12">Review your agreement and service terms</p>
          </div>
          <Button variant="outline" size="sm" className="bg-transparent">
            View Document
          </Button>
        </div>
      </div>
    </div>
  )
}
