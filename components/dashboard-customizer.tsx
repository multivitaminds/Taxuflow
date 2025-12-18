"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  LayoutDashboard,
  Save,
  Plus,
  Trash2,
  GripVertical,
  Eye,
  Settings,
  TrendingUp,
  DollarSign,
  FileText,
  Users,
  BarChart3,
  Clock,
  AlertCircle,
  Package,
} from "lucide-react"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"

const AVAILABLE_WIDGETS = [
  { id: "revenue", name: "Revenue Overview", icon: DollarSign, color: "green", size: "medium" },
  { id: "expenses", name: "Expense Tracker", icon: TrendingUp, color: "red", size: "medium" },
  { id: "invoices", name: "Recent Invoices", icon: FileText, color: "blue", size: "large" },
  { id: "customers", name: "Top Customers", icon: Users, color: "purple", size: "medium" },
  { id: "cash-flow", name: "Cash Flow Chart", icon: BarChart3, color: "cyan", size: "large" },
  { id: "overdue", name: "Overdue Invoices", icon: AlertCircle, color: "orange", size: "small" },
  { id: "products", name: "Product Performance", icon: Package, color: "pink", size: "medium" },
  { id: "time", name: "Time Tracking", icon: Clock, color: "indigo", size: "small" },
]

export function DashboardCustomizer({ user }: { user: any }) {
  const { toast } = useToast()
  const [dashboardName, setDashboardName] = useState("My Dashboard")
  const [activeWidgets, setActiveWidgets] = useState([
    { id: "revenue", position: 0 },
    { id: "expenses", position: 1 },
    { id: "invoices", position: 2 },
  ])
  const [savedViews, setSavedViews] = useState([
    { id: "1", name: "Default View", isActive: true },
    { id: "2", name: "Executive Summary", isActive: false },
  ])

  const addWidget = (widgetId: string) => {
    if (activeWidgets.find((w) => w.id === widgetId)) {
      toast({
        title: "Widget already added",
        description: "This widget is already on your dashboard",
        variant: "destructive",
      })
      return
    }

    setActiveWidgets([...activeWidgets, { id: widgetId, position: activeWidgets.length }])
    toast({
      title: "Widget added",
      description: "Widget successfully added to dashboard",
    })
  }

  const removeWidget = (widgetId: string) => {
    setActiveWidgets(activeWidgets.filter((w) => w.id !== widgetId))
    toast({
      title: "Widget removed",
      description: "Widget removed from dashboard",
    })
  }

  const saveView = () => {
    toast({
      title: "Dashboard saved",
      description: `"${dashboardName}" has been saved successfully`,
    })
  }

  const switchView = (viewId: string) => {
    setSavedViews(savedViews.map((v) => ({ ...v, isActive: v.id === viewId })))
    toast({
      title: "View switched",
      description: "Dashboard view has been updated",
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="container mx-auto px-6 py-8 space-y-8">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-4xl font-bold text-slate-900">Dashboard Customization</h1>
            <p className="text-slate-600">Design your perfect accounting dashboard</p>
          </div>
          <div className="flex gap-3">
            <Link href="/accounting">
              <Button variant="outline" className="bg-white">
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
            </Link>
            <Button onClick={saveView} className="bg-blue-600 hover:bg-blue-700 text-white">
              <Save className="h-4 w-4 mr-2" />
              Save Dashboard
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6 bg-white shadow-md">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="dashboard-name">Dashboard Name</Label>
                  <Input
                    id="dashboard-name"
                    value={dashboardName}
                    onChange={(e) => setDashboardName(e.target.value)}
                    className="mt-1"
                    placeholder="Enter dashboard name"
                  />
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Active Widgets</h3>
                  <div className="space-y-3">
                    {activeWidgets.length === 0 ? (
                      <div className="text-center py-12 bg-slate-50 rounded-lg">
                        <LayoutDashboard className="h-16 w-16 mx-auto mb-4 text-slate-300" />
                        <p className="text-slate-500 font-medium">No widgets added</p>
                        <p className="text-sm text-slate-400 mt-1">Add widgets from the panel on the right</p>
                      </div>
                    ) : (
                      activeWidgets.map((widget) => {
                        const widgetInfo = AVAILABLE_WIDGETS.find((w) => w.id === widget.id)
                        if (!widgetInfo) return null
                        const Icon = widgetInfo.icon

                        return (
                          <div
                            key={widget.id}
                            className="flex items-center justify-between p-4 bg-white border-2 border-slate-200 rounded-lg hover:border-blue-300 transition-all"
                          >
                            <div className="flex items-center gap-3">
                              <GripVertical className="h-5 w-5 text-slate-400 cursor-move" />
                              <div className={`p-2 bg-${widgetInfo.color}-100 rounded-lg`}>
                                <Icon className={`h-5 w-5 text-${widgetInfo.color}-600`} />
                              </div>
                              <div>
                                <p className="font-semibold text-slate-900">{widgetInfo.name}</p>
                                <p className="text-sm text-slate-500 capitalize">{widgetInfo.size} widget</p>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeWidget(widget.id)}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        )
                      })
                    )}
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-white shadow-md">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Saved Views</h3>
              <div className="space-y-2">
                {savedViews.map((view) => (
                  <button
                    key={view.id}
                    onClick={() => switchView(view.id)}
                    className={`w-full text-left p-4 rounded-lg transition-all ${
                      view.isActive
                        ? "bg-blue-50 border-2 border-blue-500"
                        : "bg-slate-50 border-2 border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <p className={`font-semibold ${view.isActive ? "text-blue-900" : "text-slate-900"}`}>
                        {view.name}
                      </p>
                      {view.isActive && (
                        <span className="text-xs bg-blue-600 text-white px-2 py-1 rounded-full">Active</span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="p-6 bg-white shadow-md">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Available Widgets</h3>
              <div className="space-y-2">
                {AVAILABLE_WIDGETS.map((widget) => {
                  const Icon = widget.icon
                  const isAdded = activeWidgets.find((w) => w.id === widget.id)

                  return (
                    <button
                      key={widget.id}
                      onClick={() => !isAdded && addWidget(widget.id)}
                      disabled={!!isAdded}
                      className={`w-full text-left p-4 rounded-lg transition-all ${
                        isAdded
                          ? "bg-slate-50 border-2 border-slate-200 opacity-50 cursor-not-allowed"
                          : "bg-white border-2 border-slate-200 hover:border-blue-400 hover:shadow-md"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-2 bg-${widget.color}-100 rounded-lg`}>
                          <Icon className={`h-5 w-5 text-${widget.color}-600`} />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-slate-900">{widget.name}</p>
                          <p className="text-xs text-slate-500 capitalize">{widget.size}</p>
                        </div>
                        {!isAdded && <Plus className="h-5 w-5 text-slate-400" />}
                      </div>
                    </button>
                  )
                })}
              </div>
            </Card>

            <Card className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Settings className="h-5 w-5 text-blue-600" />
                  <h3 className="font-semibold text-blue-900">Dashboard Settings</h3>
                </div>
                <p className="text-sm text-blue-700">
                  Customize widget positions, sizes, and refresh intervals to create your ideal workspace
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-2 border-blue-300 text-blue-700 hover:bg-blue-100 bg-transparent"
                >
                  Advanced Settings
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
