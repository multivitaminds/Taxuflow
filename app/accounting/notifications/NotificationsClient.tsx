"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Bell,
  AlertCircle,
  Clock,
  CheckCircle,
  Info,
  TrendingUp,
  Calendar,
  FileText,
  CreditCard,
  Package,
  AlertTriangle,
} from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow, format } from "date-fns"

interface Notification {
  id: string
  type: "alert" | "reminder" | "info" | "success" | "warning"
  category: "invoice" | "bill" | "payment" | "tax" | "inventory" | "bank" | "system"
  title: string
  message: string
  read: boolean
  timestamp: Date
  link?: string
  actionRequired?: boolean
}

export default function NotificationsClient() {
  const [filter, setFilter] = useState<"all" | "unread">("all")
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "warning",
      category: "invoice",
      title: "Overdue Invoice",
      message: "Invoice #INV-001 from Acme Corp is 5 days overdue. Amount: $3,250",
      read: false,
      timestamp: new Date(Date.now() - 3600000),
      link: "/accounting/invoices",
      actionRequired: true,
    },
    {
      id: "2",
      type: "reminder",
      category: "bill",
      title: "Upcoming Payment Due",
      message: "Bill #BILL-045 payment of $1,890 is due in 2 days",
      read: false,
      timestamp: new Date(Date.now() - 7200000),
      link: "/accounting/bills",
      actionRequired: true,
    },
    {
      id: "3",
      type: "success",
      category: "payment",
      title: "Payment Received",
      message: "Payment of $2,450 received from Tech Solutions LLC",
      read: false,
      timestamp: new Date(Date.now() - 10800000),
      link: "/accounting/payments",
      actionRequired: false,
    },
    {
      id: "4",
      type: "alert",
      category: "tax",
      title: "Quarterly Tax Deadline Approaching",
      message: "Q1 2025 estimated tax payment due in 7 days",
      read: false,
      timestamp: new Date(Date.now() - 14400000),
      link: "/accounting/tax/quarterly",
      actionRequired: true,
    },
    {
      id: "5",
      type: "info",
      category: "bank",
      title: "Bank Reconciliation Pending",
      message: "15 transactions need to be reconciled for Chase Business Account",
      read: true,
      timestamp: new Date(Date.now() - 86400000),
      link: "/accounting/bank-feeds/reconciliation",
      actionRequired: true,
    },
    {
      id: "6",
      type: "alert",
      category: "inventory",
      title: "Low Inventory Alert",
      message: "5 items are below reorder point. Immediate action recommended",
      read: true,
      timestamp: new Date(Date.now() - 172800000),
      link: "/accounting/inventory",
      actionRequired: true,
    },
    {
      id: "7",
      type: "success",
      category: "invoice",
      title: "Invoice Paid",
      message: "Invoice #INV-089 has been paid in full by Global Industries",
      read: true,
      timestamp: new Date(Date.now() - 259200000),
      link: "/accounting/invoices",
      actionRequired: false,
    },
    {
      id: "8",
      type: "info",
      category: "system",
      title: "System Maintenance Scheduled",
      message: "Scheduled maintenance on Sunday at 2 AM EST (estimated 2 hours)",
      read: true,
      timestamp: new Date(Date.now() - 345600000),
      actionRequired: false,
    },
    {
      id: "9",
      type: "warning",
      category: "payment",
      title: "Failed Payment Attempt",
      message: "Automatic payment for Bill #BILL-033 failed. Please update payment method",
      read: true,
      timestamp: new Date(Date.now() - 432000000),
      link: "/accounting/bills",
      actionRequired: true,
    },
    {
      id: "10",
      type: "reminder",
      category: "tax",
      title: "Monthly Sales Tax Report Due",
      message: "Sales tax report for January 2025 due by end of business day",
      read: true,
      timestamp: new Date(Date.now() - 518400000),
      link: "/accounting/reports/sales-tax",
      actionRequired: true,
    },
  ])

  const filteredNotifications = filter === "unread" ? notifications.filter((n) => !n.read) : notifications

  const unreadCount = notifications.filter((n) => !n.read).length
  const actionRequiredCount = notifications.filter((n) => n.actionRequired && !n.read).length

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  const getTypeIcon = (type: Notification["type"]) => {
    switch (type) {
      case "alert":
        return <AlertCircle className="h-5 w-5 text-red-600" />
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-orange-600" />
      case "reminder":
        return <Clock className="h-5 w-5 text-blue-600" />
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case "info":
        return <Info className="h-5 w-5 text-gray-600" />
    }
  }

  const getCategoryIcon = (category: Notification["category"]) => {
    switch (category) {
      case "invoice":
        return <FileText className="h-4 w-4" />
      case "bill":
        return <FileText className="h-4 w-4" />
      case "payment":
        return <CreditCard className="h-4 w-4" />
      case "tax":
        return <Calendar className="h-4 w-4" />
      case "inventory":
        return <Package className="h-4 w-4" />
      case "bank":
        return <TrendingUp className="h-4 w-4" />
      case "system":
        return <Bell className="h-4 w-4" />
    }
  }

  const getTypeColor = (type: Notification["type"]) => {
    switch (type) {
      case "alert":
        return "bg-red-100 text-red-700 border-red-200"
      case "warning":
        return "bg-orange-100 text-orange-700 border-orange-200"
      case "reminder":
        return "bg-blue-100 text-blue-700 border-blue-200"
      case "success":
        return "bg-green-100 text-green-700 border-green-200"
      case "info":
        return "bg-gray-100 text-gray-700 border-gray-200"
    }
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#635bff] to-[#4f46e5] bg-clip-text text-transparent">
            Notifications
          </h1>
          <p className="text-muted-foreground mt-1">Stay updated with important alerts and reminders</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Notifications</p>
              <p className="text-3xl font-bold">{notifications.length}</p>
            </div>
            <Bell className="h-12 w-12 text-[#635bff] opacity-80" />
          </div>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setFilter("unread")}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Unread</p>
              <p className="text-3xl font-bold">{unreadCount}</p>
            </div>
            <AlertCircle className="h-12 w-12 text-orange-500 opacity-80" />
          </div>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Action Required</p>
              <p className="text-3xl font-bold">{actionRequiredCount}</p>
            </div>
            <AlertTriangle className="h-12 w-12 text-red-500 opacity-80" />
          </div>
        </Card>
      </div>

      {/* Notifications List */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">All Notifications</h2>
          <div className="flex items-center gap-2">
            <Button variant={filter === "all" ? "default" : "outline"} size="sm" onClick={() => setFilter("all")}>
              All
            </Button>
            <Button variant={filter === "unread" ? "default" : "outline"} size="sm" onClick={() => setFilter("unread")}>
              Unread ({unreadCount})
            </Button>
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" onClick={markAllAsRead}>
                Mark all read
              </Button>
            )}
          </div>
        </div>

        <div className="space-y-3">
          {filteredNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 rounded-lg border-2 transition-all hover:shadow-md ${
                !notification.read ? "bg-blue-50 border-blue-200" : "bg-white border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="mt-1">{getTypeIcon(notification.type)}</div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold">{notification.title}</h3>
                      <Badge variant="secondary" className={`text-xs ${getTypeColor(notification.type)}`}>
                        {notification.type}
                      </Badge>
                      <Badge variant="outline" className="text-xs flex items-center gap-1">
                        {getCategoryIcon(notification.category)}
                        {notification.category}
                      </Badge>
                      {notification.actionRequired && (
                        <Badge variant="destructive" className="text-xs">
                          Action Required
                        </Badge>
                      )}
                    </div>
                    {!notification.read && <div className="h-3 w-3 rounded-full bg-blue-600 flex-shrink-0" />}
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{notification.message}</p>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(notification.timestamp, { addSuffix: true })} •{" "}
                      {format(notification.timestamp, "MMM d, yyyy h:mm a")}
                    </p>
                    <div className="flex items-center gap-2">
                      {notification.link && (
                        <Link href={notification.link}>
                          <Button variant="ghost" size="sm" className="h-8" onClick={() => markAsRead(notification.id)}>
                            View Details
                          </Button>
                        </Link>
                      )}
                      {!notification.read && (
                        <Button variant="ghost" size="sm" className="h-8" onClick={() => markAsRead(notification.id)}>
                          Mark as Read
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={() => deleteNotification(notification.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {filteredNotifications.length === 0 && (
            <div className="text-center py-12">
              <Bell className="h-16 w-16 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium text-gray-600">No notifications</p>
              <p className="text-sm text-muted-foreground mt-1">
                {filter === "unread" ? "All caught up! No unread notifications." : "You're all caught up!"}
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
