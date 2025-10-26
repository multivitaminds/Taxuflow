import { AlertTriangle, Info, XCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface ErrorMessageProps {
  title?: string
  message: string
  variant?: "error" | "warning" | "info"
  className?: string
}

export function ErrorMessage({ title, message, variant = "error", className }: ErrorMessageProps) {
  const icons = {
    error: XCircle,
    warning: AlertTriangle,
    info: Info,
  }

  const variants = {
    error: "destructive",
    warning: "default",
    info: "default",
  }

  const Icon = icons[variant]

  return (
    <Alert variant={variants[variant] as any} className={className}>
      <Icon className="h-4 w-4" />
      {title && <AlertTitle>{title}</AlertTitle>}
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  )
}
