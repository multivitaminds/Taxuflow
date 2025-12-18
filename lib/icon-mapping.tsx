import {
  DashboardIcon,
  ReportsIcon,
  InvoiceIcon,
  WalletIcon,
  CardIcon,
  InvestmentIcon,
  SecurityIcon,
  AnalyticsIcon,
  SettingsIcon,
  NotificationIcon,
  AIIcon,
  DocumentIcon,
  TaxIcon,
  TransferIcon,
  GoalIcon,
  BudgetIcon,
  LoanIcon,
} from "@/components/icons/custom-icons"

// Map common lucide icon names to custom icons
export const iconMap = {
  LayoutDashboard: DashboardIcon,
  BarChart3: ReportsIcon,
  FileText: InvoiceIcon,
  Receipt: InvoiceIcon,
  Wallet: WalletIcon,
  CreditCard: CardIcon,
  TrendingUp: InvestmentIcon,
  Shield: SecurityIcon,
  Activity: AnalyticsIcon,
  Settings: SettingsIcon,
  Bell: NotificationIcon,
  Sparkles: AIIcon,
  File: DocumentIcon,
  Calculator: TaxIcon,
  ArrowLeftRight: TransferIcon,
  Target: GoalIcon,
  PieChart: BudgetIcon,
  Coins: LoanIcon,
}

// Helper component to use custom icons with same API as lucide
export const Icon = ({
  name,
  className,
  size = 24,
}: { name: keyof typeof iconMap; className?: string; size?: number }) => {
  const IconComponent = iconMap[name]
  if (!IconComponent) return null

  return (
    <div className={className} style={{ width: size, height: size }}>
      <IconComponent />
    </div>
  )
}
