"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { UserIcon } from "lucide-react"

export function ProfileForm({ user, profile }: any) {
  const [theme, setTheme] = useState("system")

  return (
    <div className="space-y-6">
      {/* Profile Photo */}
      <div className="border border-[#e0e6ed] rounded-lg p-6 bg-white">
        <div className="flex items-start justify-between">
          <div className="flex gap-4">
            <Avatar className="w-16 h-16">
              <AvatarImage src={profile?.avatar_url || "/placeholder.svg"} />
              <AvatarFallback className="bg-[#635bff] text-white">
                <UserIcon className="w-8 h-8" />
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="text-sm font-medium text-[#0f172a] mb-1">Profile photo</h3>
              <p className="text-sm text-[#64748b]">This image will appear on your profile</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="text-[#635bff] hover:text-[#5146e5]">
            Edit
          </Button>
        </div>
      </div>

      {/* Personal Information */}
      <div className="border border-[#e0e6ed] rounded-lg p-6 bg-white space-y-6">
        <div className="flex items-start justify-between border-b border-[#e0e6ed] pb-4">
          <div>
            <Label className="text-sm font-medium text-[#0f172a]">Full legal name</Label>
            <p className="text-sm text-[#64748b] mt-1">{profile?.full_name || "Not set"}</p>
            <p className="text-xs text-[#64748b] mt-2">Required for tax forms and legal documents</p>
          </div>
          <Button variant="ghost" size="sm" className="text-[#635bff] hover:text-[#5146e5]">
            Edit
          </Button>
        </div>

        <div className="flex items-start justify-between border-b border-[#e0e6ed] pb-4">
          <div>
            <Label className="text-sm font-medium text-[#0f172a]">Email address</Label>
            <p className="text-sm text-[#64748b] mt-1">{user?.email}</p>
            <Badge variant="secondary" className="mt-2 bg-[#10b981] text-white text-xs">
              Verified
            </Badge>
          </div>
          <Button variant="ghost" size="sm" className="text-[#635bff] hover:text-[#5146e5]">
            Edit
          </Button>
        </div>

        <div className="flex items-start justify-between border-b border-[#e0e6ed] pb-4">
          <div>
            <Label className="text-sm font-medium text-[#0f172a]">Phone number</Label>
            <p className="text-sm text-[#64748b] mt-1">Not set</p>
          </div>
          <Button variant="ghost" size="sm" className="text-[#635bff] hover:text-[#5146e5]">
            Edit
          </Button>
        </div>

        <div className="flex items-start justify-between border-b border-[#e0e6ed] pb-4">
          <div>
            <Label className="text-sm font-medium text-[#0f172a]">Residential address</Label>
            <p className="text-sm text-[#64748b] mt-1">Not set</p>
          </div>
          <Button variant="ghost" size="sm" className="text-[#635bff] hover:text-[#5146e5]">
            Edit
          </Button>
        </div>

        <div className="flex items-start justify-between">
          <div>
            <Label className="text-sm font-medium text-[#0f172a]">Mailing address</Label>
            <p className="text-sm text-[#64748b] mt-1">Same as residential address</p>
          </div>
          <Button variant="ghost" size="sm" className="text-[#635bff] hover:text-[#5146e5]">
            Edit
          </Button>
        </div>
      </div>

      {/* Linked Taxu Accounts */}
      <div className="border border-[#e0e6ed] rounded-lg p-6 bg-white">
        <h3 className="text-sm font-medium text-[#0f172a] mb-4">Linked Taxu accounts</h3>
        <div className="space-y-3">
          {["Tax Filing", "Neobank", "Investment", "Accounting"].map((account) => (
            <div key={account} className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#635bff] flex items-center justify-center">
                  <span className="text-white text-xs font-semibold">{account[0]}</span>
                </div>
                <span className="text-sm text-[#0f172a]">{account}</span>
              </div>
              <Badge variant="secondary" className="bg-[#10b981] text-white text-xs">
                Active
              </Badge>
            </div>
          ))}
        </div>
      </div>

      {/* Appearance */}
      <div className="border border-[#e0e6ed] rounded-lg p-6 bg-white">
        <h3 className="text-sm font-medium text-[#0f172a] mb-4">Appearance</h3>
        <div className="space-y-3">
          {[
            { value: "system", label: "System default" },
            { value: "light", label: "Light mode" },
            { value: "dark", label: "Dark mode" },
          ].map((option) => (
            <div key={option.value} className="flex items-center justify-between py-2">
              <Label htmlFor={option.value} className="text-sm text-[#0f172a] cursor-pointer">
                {option.label}
              </Label>
              <Switch
                id={option.value}
                checked={theme === option.value}
                onCheckedChange={() => setTheme(option.value)}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
