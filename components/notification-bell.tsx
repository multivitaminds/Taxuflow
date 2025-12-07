"use client"

import { useState } from "react"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"

interface Notification {
  id: string
  type: "alert" | "reminder" | "info" | "success" | "warning"
  title: string
  message: string
  read: boolean
  timestamp: Date
  link?: string
}

export function NotificationBell() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "warning",
      title: "Overdue Invoice",
      message: "Invoice #INV-001 is 5 days overdue",
      read: false,
      timestamp: new Date(Date.now() - 3600000),
      link: "/accounting/invoices",
    },
    {
      id: "2",
      type: "reminder",
      title: "Upcoming Payment",
      message: "Payment for Bill #BILL-045 due in 2 days",
      read: false,
      timestamp: new Date(Date.now() - 7200000),
      link: "/accounting/bills",
    },
    {
      id: "3",
      type: "success",
      title: "Payment Received",
      message: "Payment of $2,450 received from Acme Corp",
      read: false,
      timestamp: new Date(Date.now() - 10800000),
      link: "/accounting/payments",
    },
    {
      id: "4",
      type: "info",
      title: "Bank Reconciliation",
      message: "15 transactions need to be reconciled",
      read: true,
      timestamp: new Date(Date.now() - 86400000),
      link: "/accounting/bank-feeds/reconciliation",
    },
    {
      id: "5",
      type: "alert",
      title: "Low Inventory Alert",
      message: "5 items are below reorder point",
      read: true,
      timestamp: new Date(Date.now() - 172800000),
      link: "/accounting/inventory",
    },
  ])

  const unreadCount = notifications.filter((n) => !n.read).length

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const getTypeColor = (type: Notification["type"]) => {
    switch (type) {
      case "alert":
        return "bg-red-100 text-red-700"
      case "warning":
        return "bg-orange-100 text-orange-700"
      case "reminder":
        return "bg-blue-100 text-blue-700"
      case "success":
        return "bg-green-100 text-green-700"
      case "info":
        return "bg-gray-100 text-gray-700"
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[400px] p-0">
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="font-semibold">Notifications</h3>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" className="text-xs h-7" onClick={markAllAsRead}>
                Mark all read
              </Button>
            )}
            <Link href="/accounting/notifications">
              <Button variant="ghost" size="sm" className="text-xs h-7">
                View all
              </Button>
            </Link>
          </div>
        </div>
        <div className="max-h-[400px] overflow-y-auto">
          {notifications.slice(0, 5).map((notification) => (
            <Link
              key={notification.id}
              href={notification.link || "/accounting/notifications"}
              onClick={() => markAsRead(notification.id)}
            >
              <div
                className={`p-4 border-b hover:bg-slate-50 transition-colors cursor-pointer ${
                  !notification.read ? "bg-blue-50" : ""
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2 flex-1">
                    <Badge variant="secondary" className={`text-xs ${getTypeColor(notification.type)}`}>
                      {notification.type}
                    </Badge>
                    <h4 className="font-medium text-sm">{notification.title}</h4>
                  </div>
                  {!notification.read && <div className="h-2 w-2 rounded-full bg-blue-600 mt-1" />}
                </div>
                <p className="text-sm text-muted-foreground mb-1">{notification.message}</p>
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
                </p>
              </div>
            </Link>
          ))}
        </div>
        {notifications.length === 0 && (
          <div className="p-8 text-center text-muted-foreground">
            <Bell className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No notifications</p>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
