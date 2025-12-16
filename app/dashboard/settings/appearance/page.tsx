"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Sun, Moon, Monitor, Palette, Type, LayoutGrid, Check } from "lucide-react"
import { cn } from "@/lib/utils"

export default function AppearancePage() {
  const [theme, setTheme] = useState<"light" | "dark" | "system">("light")
  const [density, setDensity] = useState<"comfortable" | "compact">("comfortable")
  const [accentColor, setAccentColor] = useState("#635bff")

  const colorPresets = [
    { name: "Purple", value: "#635bff", description: "Taxu default" },
    { name: "Blue", value: "#3b82f6", description: "Professional" },
    { name: "Green", value: "#10b981", description: "Fresh" },
    { name: "Orange", value: "#f97316", description: "Energetic" },
    { name: "Pink", value: "#ec4899", description: "Modern" },
    { name: "Slate", value: "#64748b", description: "Minimal" },
  ]

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="pb-6 border-b border-slate-200">
        <h1 className="text-4xl font-bold text-slate-900 tracking-tight mb-3">Appearance</h1>
        <p className="text-slate-600 leading-relaxed">Customize how Taxu looks and feels across your devices</p>
      </div>

      {/* Theme */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-lg bg-slate-50 flex items-center justify-center">
              <Palette className="w-4 h-4 text-slate-700" />
            </div>
            <h2 className="text-base font-semibold text-slate-900">Theme mode</h2>
          </div>
          <p className="text-sm text-slate-500 ml-12">
            Choose your preferred color theme or sync with your system settings
          </p>
        </div>

        <div className="ml-12 grid grid-cols-3 gap-4">
          {[
            { id: "light", label: "Light", icon: Sun, preview: "bg-white border-slate-200" },
            { id: "dark", label: "Dark", icon: Moon, preview: "bg-slate-900 border-slate-700" },
            { id: "system", label: "System", icon: Monitor, preview: "bg-gradient-to-r from-white to-slate-900" },
          ].map((option) => {
            const Icon = option.icon
            const isSelected = theme === option.id
            return (
              <button
                key={option.id}
                onClick={() => setTheme(option.id as typeof theme)}
                className={cn(
                  "relative p-4 rounded-lg border-2 transition-all hover:shadow-md",
                  isSelected ? "border-[#635bff] bg-[#635bff]/5 shadow-sm" : "border-slate-200 hover:border-slate-300",
                )}
              >
                {isSelected && (
                  <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#635bff] flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}
                <div className={cn("w-full h-20 rounded-md mb-3 border", option.preview)} />
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4 text-slate-700" />
                  <span className="text-sm font-medium text-slate-900">{option.label}</span>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Accent Color */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-lg bg-slate-50 flex items-center justify-center">
              <Palette className="w-4 h-4 text-slate-700" />
            </div>
            <h2 className="text-base font-semibold text-slate-900">Accent color</h2>
          </div>
          <p className="text-sm text-slate-500 ml-12">Choose the primary color used throughout the interface</p>
        </div>

        <div className="ml-12 grid grid-cols-3 gap-3">
          {colorPresets.map((color) => {
            const isSelected = accentColor === color.value
            return (
              <button
                key={color.value}
                onClick={() => setAccentColor(color.value)}
                className={cn(
                  "relative p-4 rounded-lg border-2 transition-all hover:shadow-md",
                  isSelected ? "border-[#635bff] bg-[#635bff]/5 shadow-sm" : "border-slate-200 hover:border-slate-300",
                )}
              >
                {isSelected && (
                  <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#635bff] flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-lg shadow-sm" style={{ backgroundColor: color.value }} />
                  <div className="text-left">
                    <div className="text-sm font-medium text-slate-900">{color.name}</div>
                    <div className="text-xs text-slate-500">{color.description}</div>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Density */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-lg bg-slate-50 flex items-center justify-center">
              <LayoutGrid className="w-4 h-4 text-slate-700" />
            </div>
            <h2 className="text-base font-semibold text-slate-900">Interface density</h2>
          </div>
          <p className="text-sm text-slate-500 ml-12">Adjust spacing and sizing of interface elements</p>
        </div>

        <div className="ml-12 grid grid-cols-2 gap-4">
          {[
            {
              id: "comfortable",
              label: "Comfortable",
              description: "More spacing, easier to scan",
              preview: "space-y-3",
            },
            {
              id: "compact",
              label: "Compact",
              description: "Less spacing, more content",
              preview: "space-y-1",
            },
          ].map((option) => {
            const isSelected = density === option.id
            return (
              <button
                key={option.id}
                onClick={() => setDensity(option.id as typeof density)}
                className={cn(
                  "relative p-4 rounded-lg border-2 transition-all hover:shadow-md text-left",
                  isSelected ? "border-[#635bff] bg-[#635bff]/5 shadow-sm" : "border-slate-200 hover:border-slate-300",
                )}
              >
                {isSelected && (
                  <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[#635bff] flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}
                <div className="font-medium text-slate-900 mb-1">{option.label}</div>
                <div className="text-sm text-slate-600 mb-3">{option.description}</div>
                <div className={cn(option.preview)}>
                  {[1, 2, 3].map((i) => (
                    <div key={i} className={cn("bg-slate-100 rounded", option.id === "comfortable" ? "h-8" : "h-6")} />
                  ))}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Font Settings */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-lg bg-slate-50 flex items-center justify-center">
              <Type className="w-4 h-4 text-slate-700" />
            </div>
            <h2 className="text-base font-semibold text-slate-900">Typography</h2>
          </div>
          <p className="text-sm text-slate-500 ml-12">Customize font size and style preferences</p>
        </div>

        <div className="ml-12 space-y-6">
          <div>
            <label className="text-sm font-medium text-slate-900 mb-3 block">Font size</label>
            <div className="flex items-center gap-3">
              <input type="range" min="12" max="18" defaultValue="14" className="flex-1 accent-[#635bff]" />
              <span className="text-sm text-slate-600 font-mono min-w-[40px]">14px</span>
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-slate-900 mb-3 block">Font family</label>
            <select className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-900">
              <option>System Default</option>
              <option>Inter</option>
              <option>SF Pro</option>
              <option>Roboto</option>
            </select>
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="mb-5">
          <h2 className="text-base font-semibold text-slate-900 mb-1">Preview</h2>
          <p className="text-sm text-slate-500">See how your settings look</p>
        </div>

        <div className="p-6 bg-slate-50 rounded-lg border border-slate-200">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-slate-900 mb-1">Sample heading</h3>
            <p className="text-slate-600">
              This is how regular text will appear with your selected settings. Buttons, links, and interactive elements
              will use your chosen accent color.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button style={{ backgroundColor: accentColor }} className="text-white hover:opacity-90">
              Primary Button
            </Button>
            <Button variant="outline" className="bg-transparent">
              Secondary Button
            </Button>
            <Badge variant="secondary" style={{ backgroundColor: `${accentColor}15`, color: accentColor }}>
              Badge
            </Badge>
          </div>
        </div>
      </div>
    </div>
  )
}
