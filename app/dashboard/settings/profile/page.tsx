"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useDashboard } from "@/components/dashboard-provider"
import { Pencil, Upload, Mail, UserIcon, Calendar, Phone, MapPin, Building2, Sun, Moon, Monitor } from "lucide-react"
import { cn } from "@/lib/utils"

export default function ProfilePage() {
  const { user, profile } = useDashboard()
  const [isEditing, setIsEditing] = useState<string | null>(null)
  const [theme, setTheme] = useState<"light" | "dark" | "system">("light")

  const sections = [
    {
      id: "profile-picture",
      title: "Profile picture",
      icon: UserIcon,
      content: (
        <div className="flex items-center gap-6">
          <Avatar className="w-24 h-24 ring-4 ring-slate-100">
            <AvatarImage src={profile?.avatar_url || "/placeholder.svg"} />
            <AvatarFallback className="bg-gradient-to-br from-[#635bff] to-[#5246e0] text-white text-3xl font-semibold">
              {profile?.full_name?.charAt(0) || user?.email?.charAt(0)?.toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          <div>
            <Button variant="outline" size="sm" className="gap-2 mb-2 bg-transparent">
              <Upload className="w-4 h-4" />
              Upload new photo
            </Button>
            <p className="text-xs text-slate-500">JPG, PNG or GIF. Max size 2MB.</p>
          </div>
        </div>
      ),
    },
    {
      id: "email",
      title: "Email address",
      icon: Mail,
      value: user?.email || "Not set",
      description: "Your primary email for account access and notifications",
    },
    {
      id: "full-name",
      title: "Full name",
      icon: UserIcon,
      value: profile?.full_name || "Tim Lights",
      description: "Your name as it appears on legal documents",
    },
    {
      id: "dob",
      title: "Date of birth",
      icon: Calendar,
      value: "01/31/1990",
      description: "Required for tax filing purposes",
    },
    {
      id: "phone",
      title: "Phone number",
      icon: Phone,
      value: "+1 (330) 678-3920",
      description: "For account security and support",
    },
    {
      id: "address",
      title: "Residential address",
      icon: MapPin,
      value: (
        <div className="space-y-0.5 text-slate-900 leading-relaxed">
          <p>660 Mission St, Floor 4</p>
          <p>San Francisco, CA 94105</p>
          <p>United States</p>
        </div>
      ),
      description: "Your primary residence for tax purposes",
    },
    {
      id: "business",
      title: "Business information",
      icon: Building2,
      value: (
        <div className="space-y-1.5">
          <p className="font-medium text-slate-900">Taxu Inc.</p>
          <p className="text-sm text-slate-600">EIN: 12-3456789</p>
          <p className="text-sm text-slate-600">Entity type: S-Corporation</p>
        </div>
      ),
      description: "Your business entity details for tax filing",
    },
  ]

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="pb-6 border-b border-slate-200">
        <div className="flex items-center gap-3 mb-3">
          <h1 className="text-4xl font-bold text-slate-900 tracking-tight">{profile?.full_name || "My Profile"}</h1>
          <Badge variant="secondary" className="bg-[#635bff]/10 text-[#635bff] border-[#635bff]/20 px-3 py-1">
            Business Account
          </Badge>
        </div>
        <p className="text-slate-600 leading-relaxed">Manage your personal information and account preferences</p>
      </div>

      {/* Profile Sections */}
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
                    {section.description && <p className="text-sm text-slate-500 mb-4 ml-12">{section.description}</p>}
                    <div className="ml-12">
                      {section.content || <div className="text-slate-900 leading-relaxed">{section.value}</div>}
                    </div>
                  </div>
                  {!section.content && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-[#635bff] hover:text-[#5246e0] hover:bg-[#635bff]/5 gap-2 flex-shrink-0"
                      onClick={() => setIsEditing(section.id)}
                    >
                      <Pencil className="w-3.5 h-3.5" />
                      Edit
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Linked Products */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="mb-5">
          <h2 className="text-base font-semibold text-slate-900 mb-1">Linked Taxu products</h2>
          <p className="text-sm text-slate-500">All services connected to your account</p>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { name: "Tax Filing", status: "active", description: "2024 returns in progress", color: "green" },
            { name: "Neobank", status: "active", description: "Checking account active", color: "blue" },
            { name: "Investment", status: "inactive", description: "Not configured", color: "slate" },
            { name: "Accounting", status: "active", description: "QuickBooks connected", color: "purple" },
          ].map((product) => (
            <div
              key={product.name}
              className="flex items-start gap-4 p-4 rounded-lg border border-slate-200 hover:bg-slate-50/50 transition-colors group"
            >
              <div className="flex-shrink-0 mt-0.5">
                <div
                  className={cn(
                    "w-2.5 h-2.5 rounded-full",
                    product.status === "active" ? "bg-green-500 shadow-sm shadow-green-500/50" : "bg-slate-300",
                  )}
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm text-slate-900 mb-0.5">{product.name}</div>
                <div className="text-xs text-slate-600">{product.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Appearance */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="mb-5">
          <h2 className="text-base font-semibold text-slate-900 mb-1">Appearance</h2>
          <p className="text-sm text-slate-500">Customize your interface theme preference</p>
        </div>
        <div className="inline-flex rounded-lg border border-slate-200 p-1 bg-slate-50">
          <Button
            variant={theme === "light" ? "secondary" : "ghost"}
            size="sm"
            className="rounded-md gap-2"
            onClick={() => setTheme("light")}
          >
            <Sun className="w-4 h-4" />
            Light
          </Button>
          <Button
            variant={theme === "dark" ? "secondary" : "ghost"}
            size="sm"
            className="rounded-md gap-2"
            onClick={() => setTheme("dark")}
          >
            <Moon className="w-4 h-4" />
            Dark
          </Button>
          <Button
            variant={theme === "system" ? "secondary" : "ghost"}
            size="sm"
            className="rounded-md gap-2"
            onClick={() => setTheme("system")}
          >
            <Monitor className="w-4 h-4" />
            System
          </Button>
        </div>
      </div>
    </div>
  )
}
