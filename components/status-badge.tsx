import Link from "next/link"

export function StatusBadge() {
  return (
    <Link
      href="/developer-portal/status"
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 hover:border-green-500/40 transition-colors"
    >
      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
      <span className="text-xs font-medium text-green-500">All Systems Operational</span>
    </Link>
  )
}
