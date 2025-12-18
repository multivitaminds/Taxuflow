"use client"

import { useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"

export interface KeyboardShortcut {
  key: string
  ctrlKey?: boolean
  shiftKey?: boolean
  altKey?: boolean
  metaKey?: boolean
  action: () => void
  description: string
}

export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[]) {
  const router = useRouter()

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      const shortcut = shortcuts.find(
        (s) =>
          s.key.toLowerCase() === event.key.toLowerCase() &&
          (s.ctrlKey === undefined || s.ctrlKey === event.ctrlKey) &&
          (s.shiftKey === undefined || s.shiftKey === event.shiftKey) &&
          (s.altKey === undefined || s.altKey === event.altKey) &&
          (s.metaKey === undefined || s.metaKey === event.metaKey),
      )

      if (shortcut) {
        event.preventDefault()
        shortcut.action()
      }
    },
    [shortcuts],
  )

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [handleKeyDown])
}

// Global shortcuts hook
export function useGlobalShortcuts() {
  const router = useRouter()

  const shortcuts: KeyboardShortcut[] = [
    {
      key: "k",
      ctrlKey: true,
      action: () => {
        const searchInput = document.querySelector("[data-search-input]") as HTMLInputElement
        if (searchInput) searchInput.focus()
      },
      description: "Open search",
    },
    {
      key: "h",
      ctrlKey: true,
      action: () => router.push("/help"),
      description: "Open help center",
    },
    {
      key: "d",
      ctrlKey: true,
      action: () => router.push("/dashboard"),
      description: "Go to dashboard",
    },
    {
      key: "n",
      ctrlKey: true,
      action: () => router.push("/settings/notifications"),
      description: "Open notifications",
    },
    {
      key: "/",
      action: () => {
        const searchInput = document.querySelector("[data-search-input]") as HTMLInputElement
        if (searchInput) searchInput.focus()
      },
      description: "Focus search",
    },
  ]

  useKeyboardShortcuts(shortcuts)

  return shortcuts
}
