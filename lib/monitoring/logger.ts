import { createClient } from "@/lib/supabase/server"

export enum LogLevel {
  DEBUG = "debug",
  INFO = "info",
  WARN = "warn",
  ERROR = "error",
  CRITICAL = "critical",
}

export interface LogContext {
  userId?: string
  organizationId?: string
  resource?: string
  operation?: string
  duration?: number
  [key: string]: any
}

class Logger {
  private async log(level: LogLevel, message: string, context?: LogContext) {
    const timestamp = new Date().toISOString()

    // Console logging
    const logMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}`
    const logData = context ? { ...context } : {}

    switch (level) {
      case LogLevel.DEBUG:
        console.debug(logMessage, logData)
        break
      case LogLevel.INFO:
        console.info(logMessage, logData)
        break
      case LogLevel.WARN:
        console.warn(logMessage, logData)
        break
      case LogLevel.ERROR:
      case LogLevel.CRITICAL:
        console.error(logMessage, logData)
        break
    }

    // Database logging for errors and critical issues
    if (level === LogLevel.ERROR || level === LogLevel.CRITICAL) {
      try {
        const supabase = await createClient()
        await supabase.from("security_logs").insert({
          event_type: "application_error",
          severity: level,
          details: {
            message,
            ...context,
            timestamp,
          },
          user_id: context?.userId,
        })
      } catch (dbError) {
        console.error("[v0] Failed to log to database:", dbError)
      }
    }
  }

  debug(message: string, context?: LogContext) {
    this.log(LogLevel.DEBUG, message, context)
  }

  info(message: string, context?: LogContext) {
    this.log(LogLevel.INFO, message, context)
  }

  warn(message: string, context?: LogContext) {
    this.log(LogLevel.WARN, message, context)
  }

  error(message: string, context?: LogContext) {
    this.log(LogLevel.ERROR, message, context)
  }

  critical(message: string, context?: LogContext) {
    this.log(LogLevel.CRITICAL, message, context)
  }

  // Performance logging
  async logPerformance(operation: string, duration: number, context?: LogContext) {
    this.info(`Performance: ${operation} completed in ${duration}ms`, {
      ...context,
      operation,
      duration,
    })

    // Log slow queries
    if (duration > 1000) {
      this.warn(`Slow operation detected: ${operation} took ${duration}ms`, {
        ...context,
        operation,
        duration,
      })
    }
  }
}

export const logger = new Logger()
