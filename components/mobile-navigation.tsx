"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, BarChart3, CreditCard, FileText, Settings, Menu } from "lucide-react"
import { cn } from "@/lib/utils"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

const navigationItems = [
  { icon: Home, label: "Home", href: "/" },
  { icon: BarChart3, label: "Accounting", href: "/accounting" },
  { icon: CreditCard, label: "Banking", href: "/neobank" },
  { icon: FileText, label: "Reports", href: "/accounting/reports" },
  { icon: Settings, label: "Settings", href: "/accounting/settings" },
]

export function MobileNavigation() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  // Only show on mobile
  if (typeof window !== "undefined" && window.innerWidth >= 768) {
    return null
  }

  return (
    <>
      {/* Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 z-40 safe-area-inset-bottom">
        <div className="flex items-center justify-around h-16">
          {navigationItems.slice(0, 4).map((item) => {
            const Icon = item.icon
            const isActive = pathname?.startsWith(item.href)

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center flex-1 h-full gap-1 transition-colors touch-manipulation",
                  isActive ? "text-primary" : "text-gray-500 hover:text-gray-900 dark:hover:text-gray-100",
                )}
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            )
          })}

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <button className="flex flex-col items-center justify-center flex-1 h-full gap-1 text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 transition-colors touch-manipulation">
                <Menu className="h-5 w-5" />
                <span className="text-xs font-medium">More</span>
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-64">
              <div className="flex flex-col gap-4 pt-8">
                <h2 className="text-lg font-semibold px-4">Menu</h2>
                {navigationItems.map((item) => {
                  const Icon = item.icon
                  const isActive = pathname?.startsWith(item.href)

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-4 py-3 rounded-lg transition-colors touch-manipulation",
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800",
                      )}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  )
                })}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>

      {/* Spacer to prevent content from being hidden behind bottom nav */}
      <div className="md:hidden h-16" />
    </>
  )
}
