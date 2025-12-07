/**
 * Dynamic imports for code splitting
 */

// Lazy load heavy chart libraries
export const loadCharts = () => import("recharts")

// Lazy load PDF generation
export const loadPDFGenerator = () => import("jspdf")

// Lazy load Excel export
export const loadExcelExport = () => import("xlsx")

// Lazy load rich text editor
export const loadRichTextEditor = () => import("@tiptap/react")

// Lazy load AI features
export const loadAIFeatures = () => import("@/lib/ai/agent-intelligence")

/**
 * Prefetch critical resources
 */
export function prefetchCriticalResources() {
  if (typeof window !== "undefined") {
    // Prefetch dashboard data
    const link = document.createElement("link")
    link.rel = "prefetch"
    link.href = "/api/dashboard/stats"
    document.head.appendChild(link)
  }
}

/**
 * Image optimization utilities
 */
export const imageConfig = {
  domains: ["blob.vercel-storage.com", "avatars.githubusercontent.com"],
  formats: ["image/avif", "image/webp"],
  deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
}

/**
 * Route-based code splitting recommendations
 */
export const routeSplitConfig = {
  // Accounting routes
  "/accounting": ["accounting-core"],
  "/accounting/invoices": ["pdf-generator", "excel-export"],
  "/accounting/reports": ["charts", "analytics"],

  // Neobank routes
  "/neobank": ["neobank-core"],
  "/neobank/investments": ["charts", "real-time-data"],
  "/neobank/crypto": ["crypto-api", "charts"],
}
