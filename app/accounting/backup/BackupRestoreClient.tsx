"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Database,
  Download,
  Upload,
  Calendar,
  CheckCircle2,
  Clock,
  Shield,
  HardDrive,
  RotateCcw,
  AlertCircle,
  Settings,
  Play,
  Trash2,
} from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Backup {
  id: string
  name: string
  size: string
  date: string
  time: string
  type: "automatic" | "manual"
  status: "completed" | "in-progress" | "failed"
  records: number
  duration: string
}

export default function BackupRestoreClient() {
  const [autoBackup, setAutoBackup] = useState(true)
  const [backupFrequency, setBackupFrequency] = useState("daily")
  const [retentionDays, setRetentionDays] = useState("30")
  const [selectedBackup, setSelectedBackup] = useState<string | null>(null)

  const backups: Backup[] = [
    {
      id: "1",
      name: "Automatic Backup - January 2025",
      size: "2.4 GB",
      date: "2025-01-15",
      time: "02:00 AM",
      type: "automatic",
      status: "completed",
      records: 145230,
      duration: "12m 34s",
    },
    {
      id: "2",
      name: "Manual Backup - Pre-Tax Filing",
      size: "2.3 GB",
      date: "2025-01-10",
      time: "10:30 AM",
      type: "manual",
      status: "completed",
      records: 142150,
      duration: "11m 45s",
    },
    {
      id: "3",
      name: "Automatic Backup - December 2024",
      size: "2.2 GB",
      date: "2024-12-31",
      time: "02:00 AM",
      type: "automatic",
      status: "completed",
      records: 138920,
      duration: "10m 58s",
    },
    {
      id: "4",
      name: "Manual Backup - Year End Close",
      size: "2.2 GB",
      date: "2024-12-28",
      time: "05:15 PM",
      type: "manual",
      status: "completed",
      records: 137840,
      duration: "11m 20s",
    },
    {
      id: "5",
      name: "Automatic Backup - November 2024",
      size: "2.0 GB",
      date: "2024-11-30",
      time: "02:00 AM",
      type: "automatic",
      status: "completed",
      records: 132500,
      duration: "10m 15s",
    },
  ]

  const stats = {
    totalBackups: 48,
    totalSize: "112.5 GB",
    lastBackup: "2 hours ago",
    nextBackup: "Tonight at 2:00 AM",
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-4 w-4 text-green-600" />
      case "in-progress":
        return <Clock className="h-4 w-4 text-blue-600" />
      case "failed":
        return <AlertCircle className="h-4 w-4 text-red-600" />
      default:
        return null
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-700"
      case "in-progress":
        return "bg-blue-100 text-blue-700"
      case "failed":
        return "bg-red-100 text-red-700"
      default:
        return "bg-slate-100 text-slate-700"
    }
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Backup & Restore</h1>
          <p className="text-slate-600 mt-1">Manage automated backups and restore your data</p>
        </div>
        <Button className="bg-[#635bff] hover:bg-[#5147e6]">
          <Play className="h-4 w-4 mr-2" />
          Create Backup Now
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Total Backups</p>
              <p className="text-2xl font-bold mt-1">{stats.totalBackups}</p>
            </div>
            <Database className="h-8 w-8 text-[#635bff]" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Total Size</p>
              <p className="text-2xl font-bold mt-1">{stats.totalSize}</p>
            </div>
            <HardDrive className="h-8 w-8 text-blue-600" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Last Backup</p>
              <p className="text-2xl font-bold mt-1">{stats.lastBackup}</p>
            </div>
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600">Next Backup</p>
              <p className="text-xl font-bold mt-1">{stats.nextBackup}</p>
            </div>
            <Clock className="h-8 w-8 text-orange-600" />
          </div>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="backups" className="space-y-6">
        <TabsList>
          <TabsTrigger value="backups">Backup History</TabsTrigger>
          <TabsTrigger value="restore">Restore</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Backup History Tab */}
        <TabsContent value="backups" className="space-y-4">
          <Card className="p-6">
            <div className="space-y-4">
              {backups.map((backup) => (
                <div
                  key={backup.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-start gap-4 flex-1">
                    <div className="p-3 bg-slate-100 rounded-lg">
                      <Database className="h-6 w-6 text-slate-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium">{backup.name}</h3>
                        <Badge variant="secondary" className={getStatusColor(backup.status)}>
                          <span className="flex items-center gap-1">
                            {getStatusIcon(backup.status)}
                            {backup.status}
                          </span>
                        </Badge>
                        <Badge variant="outline">{backup.type === "automatic" ? "Auto" : "Manual"}</Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-slate-600">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {backup.date} at {backup.time}
                        </span>
                        <span className="flex items-center gap-1">
                          <HardDrive className="h-4 w-4" />
                          {backup.size}
                        </span>
                        <span className="flex items-center gap-1">
                          <Database className="h-4 w-4" />
                          {backup.records.toLocaleString()} records
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {backup.duration}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                    <Button variant="outline" size="sm">
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Restore
                    </Button>
                    <Button variant="outline" size="sm">
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        {/* Restore Tab */}
        <TabsContent value="restore" className="space-y-4">
          <Card className="p-6">
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <RotateCcw className="h-5 w-5 text-[#635bff]" />
                <h2 className="text-xl font-semibold">Point-in-Time Recovery</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <Label>Select Backup to Restore</Label>
                  <Select value={selectedBackup || ""} onValueChange={setSelectedBackup}>
                    <SelectTrigger className="mt-2">
                      <SelectValue placeholder="Choose a backup" />
                    </SelectTrigger>
                    <SelectContent>
                      {backups.map((backup) => (
                        <SelectItem key={backup.id} value={backup.id}>
                          {backup.name} - {backup.date}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedBackup && (
                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                      <div className="flex-1">
                        <p className="font-medium text-amber-900">Warning</p>
                        <p className="text-sm text-amber-700 mt-1">
                          Restoring from a backup will replace all current data with the data from the selected backup
                          point. This action cannot be undone. We recommend creating a backup of your current data
                          before proceeding.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-4">
                  <Button variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Backup Current Data First
                  </Button>
                  <Button className="bg-[#635bff] hover:bg-[#5147e6]" disabled={!selectedBackup}>
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Start Restore
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Upload className="h-5 w-5 text-[#635bff]" />
                <h2 className="text-xl font-semibold">Upload Backup File</h2>
              </div>

              <p className="text-sm text-slate-600">
                Restore from a backup file that was previously downloaded. Only .bak files are supported.
              </p>

              <div className="border-2 border-dashed rounded-lg p-8 text-center">
                <Upload className="h-12 w-12 text-slate-400 mx-auto mb-4" />
                <p className="text-sm text-slate-600 mb-2">Drag and drop your backup file here, or click to browse</p>
                <Button variant="outline" className="mt-2 bg-transparent">
                  Choose File
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-4">
          <Card className="p-6">
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <Settings className="h-5 w-5 text-[#635bff]" />
                <h2 className="text-xl font-semibold">Backup Configuration</h2>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="autoBackup">Automatic Backups</Label>
                    <p className="text-sm text-slate-600">Enable automated daily backups of all your data</p>
                  </div>
                  <Switch id="autoBackup" checked={autoBackup} onCheckedChange={setAutoBackup} />
                </div>

                {autoBackup && (
                  <>
                    <div className="space-y-2">
                      <Label>Backup Frequency</Label>
                      <Select value={backupFrequency} onValueChange={setBackupFrequency}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="hourly">Every Hour</SelectItem>
                          <SelectItem value="every-6-hours">Every 6 Hours</SelectItem>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-sm text-slate-600">How often automatic backups should be created</p>
                    </div>

                    <div className="space-y-2">
                      <Label>Backup Time</Label>
                      <Input type="time" defaultValue="02:00" />
                      <p className="text-sm text-slate-600">
                        Time of day to perform automatic backups (for daily/weekly/monthly)
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label>Retention Period</Label>
                      <Select value={retentionDays} onValueChange={setRetentionDays}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="7">7 Days</SelectItem>
                          <SelectItem value="14">14 Days</SelectItem>
                          <SelectItem value="30">30 Days</SelectItem>
                          <SelectItem value="60">60 Days</SelectItem>
                          <SelectItem value="90">90 Days</SelectItem>
                          <SelectItem value="180">180 Days</SelectItem>
                          <SelectItem value="365">1 Year</SelectItem>
                          <SelectItem value="forever">Forever</SelectItem>
                        </SelectContent>
                      </Select>
                      <p className="text-sm text-slate-600">How long to keep automatic backups before deleting</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-[#635bff]" />
                <h2 className="text-xl font-semibold">Backup Notifications</h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-slate-600">Receive email notifications when backups complete or fail</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Backup Failure Alerts</Label>
                    <p className="text-sm text-slate-600">Get immediate alerts if a backup fails</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Weekly Backup Summary</Label>
                    <p className="text-sm text-slate-600">Receive a weekly summary of all backup activity</p>
                  </div>
                  <Switch />
                </div>
              </div>
            </div>
          </Card>

          <div className="flex justify-end">
            <Button className="bg-[#635bff] hover:bg-[#5147e6]">Save Settings</Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
