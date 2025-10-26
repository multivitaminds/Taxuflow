"use client"

import { Component, type ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, RefreshCw, Home } from "lucide-react"

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error("[v0] Error boundary caught error:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-purple-500/5">
          <Card className="max-w-lg w-full border-red-500/20 bg-gradient-to-br from-background via-background to-red-500/5">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="h-12 w-12 rounded-full bg-red-500/10 flex items-center justify-center">
                  <AlertTriangle className="h-6 w-6 text-red-500" />
                </div>
                <div>
                  <CardTitle className="text-2xl">Something went wrong</CardTitle>
                  <CardDescription>We encountered an unexpected error</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-lg bg-red-500/5 border border-red-500/20">
                <p className="text-sm font-mono text-red-500">{this.state.error?.message || "Unknown error"}</p>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => window.location.reload()}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-orange-600 hover:from-purple-700 hover:to-orange-700"
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Reload Page
                </Button>
                <Button onClick={() => (window.location.href = "/")} variant="outline" className="flex-1">
                  <Home className="mr-2 h-4 w-4" />
                  Go Home
                </Button>
              </div>

              <p className="text-xs text-muted-foreground text-center">
                If this problem persists, please contact support at{" "}
                <a href="mailto:support@taxu.com" className="text-purple-500 hover:underline">
                  support@taxu.com
                </a>
              </p>
            </CardContent>
          </Card>
        </div>
      )
    }

    return this.props.children
  }
}
