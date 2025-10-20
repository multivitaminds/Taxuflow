import { getSafeUser } from "@/lib/supabase/server"

export async function getBalanceSheetData() {
  try {
    const { supabase, user } = await getSafeUser()

    if (!user || !supabase) {
      return getMockBalanceSheetData()
    }

    // Fetch chart of accounts with balances
    const { data: accounts, error } = await supabase
      .from("chart_of_accounts")
      .select("*")
      .eq("user_id", user.id)
      .order("account_number")

    if (error) throw error

    // Calculate totals by account type
    const assets = accounts?.filter((a) => a.account_type === "Asset") || []
    const liabilities = accounts?.filter((a) => a.account_type === "Liability") || []
    const equity = accounts?.filter((a) => a.account_type === "Equity") || []

    const currentAssets = assets.filter((a) => a.account_subtype === "Current Asset")
    const fixedAssets = assets.filter((a) => a.account_subtype === "Fixed Asset")
    const currentLiabilities = liabilities.filter((a) => a.account_subtype === "Current Liability")
    const longTermLiabilities = liabilities.filter((a) => a.account_subtype === "Long-term Liability")

    return {
      assets: {
        current: currentAssets,
        fixed: fixedAssets,
        total: assets.reduce((sum, a) => sum + (a.balance || 0), 0),
      },
      liabilities: {
        current: currentLiabilities,
        longTerm: longTermLiabilities,
        total: liabilities.reduce((sum, l) => sum + (l.balance || 0), 0),
      },
      equity: {
        accounts: equity,
        total: equity.reduce((sum, e) => sum + (e.balance || 0), 0),
      },
    }
  } catch (error) {
    console.error("[v0] Error fetching balance sheet data:", error)
    return getMockBalanceSheetData()
  }
}

export async function getProfitLossData(startDate?: string, endDate?: string) {
  try {
    const { supabase, user } = await getSafeUser()

    if (!user || !supabase) {
      return getMockProfitLossData()
    }

    // Fetch revenue and expense accounts
    const { data: accounts, error } = await supabase
      .from("chart_of_accounts")
      .select("*")
      .eq("user_id", user.id)
      .in("account_type", ["Revenue", "Expense"])
      .order("account_number")

    if (error) throw error

    const revenue = accounts?.filter((a) => a.account_type === "Revenue") || []
    const expenses = accounts?.filter((a) => a.account_type === "Expense") || []

    const totalRevenue = revenue.reduce((sum, r) => sum + (r.balance || 0), 0)
    const totalExpenses = expenses.reduce((sum, e) => sum + (e.balance || 0), 0)

    return {
      revenue: {
        accounts: revenue,
        total: totalRevenue,
      },
      expenses: {
        accounts: expenses,
        total: totalExpenses,
      },
      netProfit: totalRevenue - totalExpenses,
    }
  } catch (error) {
    console.error("[v0] Error fetching P&L data:", error)
    return getMockProfitLossData()
  }
}

export async function getCashFlowData(startDate?: string, endDate?: string) {
  try {
    const { supabase, user } = await getSafeUser()

    if (!user || !supabase) {
      return getMockCashFlowData()
    }

    // Fetch bank transactions
    const { data: transactions, error } = await supabase
      .from("bank_transactions")
      .select("*, bank_accounts(*)")
      .eq("bank_accounts.user_id", user.id)
      .order("transaction_date", { ascending: false })

    if (error) throw error

    // Calculate cash flow by category
    const operating =
      transactions?.filter((t) =>
        ["Customer Payment", "Payroll", "Rent", "Utilities", "Software"].includes(t.category || ""),
      ) || []

    const investing = transactions?.filter((t) => ["Equipment Purchase", "Investment"].includes(t.category || "")) || []

    const financing = transactions?.filter((t) => ["Loan", "Owner Distribution"].includes(t.category || "")) || []

    const calculateNet = (txns: any[]) => {
      return txns.reduce((sum, t) => {
        return sum + (t.transaction_type === "credit" ? t.amount : -t.amount)
      }, 0)
    }

    return {
      operating: {
        transactions: operating,
        net: calculateNet(operating),
      },
      investing: {
        transactions: investing,
        net: calculateNet(investing),
      },
      financing: {
        transactions: financing,
        net: calculateNet(financing),
      },
    }
  } catch (error) {
    console.error("[v0] Error fetching cash flow data:", error)
    return getMockCashFlowData()
  }
}

export async function getARAgingData() {
  try {
    const { supabase, user } = await getSafeUser()

    if (!user || !supabase) {
      return getMockARAgingData()
    }

    // Fetch unpaid invoices with customer info
    const { data: invoices, error } = await supabase
      .from("invoices")
      .select("*, customers(*)")
      .eq("user_id", user.id)
      .neq("status", "paid")
      .order("due_date")

    if (error) throw error

    // Calculate aging buckets
    const today = new Date()
    const agingData =
      invoices?.map((inv) => {
        const dueDate = new Date(inv.due_date)
        const daysOverdue = Math.floor((today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24))

        return {
          customer: inv.customers?.company_name || "Unknown",
          invoiceNumber: inv.invoice_number,
          dueDate: inv.due_date,
          amount: inv.balance_due || 0,
          daysOverdue,
          bucket:
            daysOverdue <= 0
              ? "current"
              : daysOverdue <= 30
                ? "1-30"
                : daysOverdue <= 60
                  ? "31-60"
                  : daysOverdue <= 90
                    ? "61-90"
                    : "90+",
        }
      }) || []

    // Group by customer
    const customerMap = new Map()
    agingData.forEach((item) => {
      if (!customerMap.has(item.customer)) {
        customerMap.set(item.customer, {
          name: item.customer,
          current: 0,
          days30: 0,
          days60: 0,
          days90: 0,
          days90plus: 0,
          total: 0,
        })
      }
      const customer = customerMap.get(item.customer)
      customer.total += item.amount

      switch (item.bucket) {
        case "current":
          customer.current += item.amount
          break
        case "1-30":
          customer.days30 += item.amount
          break
        case "31-60":
          customer.days60 += item.amount
          break
        case "61-90":
          customer.days90 += item.amount
          break
        case "90+":
          customer.days90plus += item.amount
          break
      }
    })

    return Array.from(customerMap.values())
  } catch (error) {
    console.error("[v0] Error fetching AR aging data:", error)
    return getMockARAgingData()
  }
}

export async function getAPAgingData() {
  try {
    const { supabase, user } = await getSafeUser()

    if (!user || !supabase) {
      return getMockAPAgingData()
    }

    const { data: bills, error } = await supabase
      .from("bills")
      .select("*, vendors(*)")
      .eq("user_id", user.id)
      .neq("status", "paid")
      .order("due_date")

    if (error) throw error

    const today = new Date()
    const agingData =
      bills?.map((bill) => {
        const dueDate = new Date(bill.due_date)
        const daysOverdue = Math.floor((today.getTime() - dueDate.getTime()) / (1000 * 60 * 60 * 24))

        return {
          vendor: bill.vendors?.company_name || "Unknown",
          billNumber: bill.bill_number,
          dueDate: bill.due_date,
          amount: bill.balance_due || 0,
          daysOverdue,
          bucket:
            daysOverdue <= 0
              ? "current"
              : daysOverdue <= 30
                ? "1-30"
                : daysOverdue <= 60
                  ? "31-60"
                  : daysOverdue <= 90
                    ? "61-90"
                    : "90+",
        }
      }) || []

    const vendorMap = new Map()
    agingData.forEach((item) => {
      if (!vendorMap.has(item.vendor)) {
        vendorMap.set(item.vendor, {
          name: item.vendor,
          current: 0,
          days30: 0,
          days60: 0,
          days90: 0,
          total: 0,
        })
      }
      const vendor = vendorMap.get(item.vendor)
      vendor.total += item.amount

      switch (item.bucket) {
        case "current":
          vendor.current += item.amount
          break
        case "1-30":
          vendor.days30 += item.amount
          break
        case "31-60":
          vendor.days60 += item.amount
          break
        case "61-90":
        case "90+":
          vendor.days90 += item.amount
          break
      }
    })

    return Array.from(vendorMap.values())
  } catch (error) {
    console.error("[v0] Error fetching AP aging data:", error)
    return getMockAPAgingData()
  }
}

export async function getCustomerBalanceData() {
  try {
    const { supabase, user } = await getSafeUser()

    if (!user || !supabase) {
      return getMockCustomerBalanceData()
    }

    const { data: customers, error } = await supabase
      .from("customers")
      .select("*, invoices(*)")
      .eq("user_id", user.id)
      .order("company_name")

    if (error) throw error

    return (
      customers?.map((customer) => {
        const invoices = customer.invoices || []
        const totalInvoiced = invoices.reduce((sum: number, inv: any) => sum + (inv.total_amount || 0), 0)
        const totalPaid = invoices.reduce((sum: number, inv: any) => sum + (inv.amount_paid || 0), 0)

        return {
          name: customer.company_name,
          invoiced: totalInvoiced,
          paid: totalPaid,
          balance: totalInvoiced - totalPaid,
        }
      }) || []
    )
  } catch (error) {
    console.error("[v0] Error fetching customer balance data:", error)
    return getMockCustomerBalanceData()
  }
}

export async function getVendorBalanceData() {
  try {
    const { supabase, user } = await getSafeUser()

    if (!user || !supabase) {
      return getMockVendorBalanceData()
    }

    const { data: vendors, error } = await supabase
      .from("vendors")
      .select("*, bills(*)")
      .eq("user_id", user.id)
      .order("company_name")

    if (error) throw error

    return (
      vendors?.map((vendor) => {
        const bills = vendor.bills || []
        const totalBilled = bills.reduce((sum: number, bill: any) => sum + (bill.total_amount || 0), 0)
        const totalPaid = bills.reduce((sum: number, bill: any) => sum + (bill.amount_paid || 0), 0)

        return {
          name: vendor.company_name,
          billed: totalBilled,
          paid: totalPaid,
          balance: totalBilled - totalPaid,
        }
      }) || []
    )
  } catch (error) {
    console.error("[v0] Error fetching vendor balance data:", error)
    return getMockVendorBalanceData()
  }
}

export async function getSalesByCustomerData() {
  try {
    const { supabase, user } = await getSafeUser()

    if (!user || !supabase) {
      return getMockSalesByCustomerData()
    }

    const { data: invoices, error } = await supabase
      .from("invoices")
      .select("*, customers(*)")
      .eq("user_id", user.id)
      .eq("status", "paid")

    if (error) throw error

    const customerMap = new Map()
    let totalRevenue = 0

    invoices?.forEach((inv) => {
      const customerName = inv.customers?.company_name || "Unknown"
      const amount = inv.total_amount || 0
      totalRevenue += amount

      if (!customerMap.has(customerName)) {
        customerMap.set(customerName, 0)
      }
      customerMap.set(customerName, customerMap.get(customerName) + amount)
    })

    return Array.from(customerMap.entries())
      .map(([name, revenue]) => ({
        name,
        revenue,
        percentage: totalRevenue > 0 ? ((revenue / totalRevenue) * 100).toFixed(1) + "%" : "0%",
      }))
      .sort((a, b) => b.revenue - a.revenue)
  } catch (error) {
    console.error("[v0] Error fetching sales by customer data:", error)
    return getMockSalesByCustomerData()
  }
}

export async function getExpensesByVendorData() {
  try {
    const { supabase, user } = await getSafeUser()

    if (!user || !supabase) {
      return getMockExpensesByVendorData()
    }

    const { data: bills, error } = await supabase
      .from("bills")
      .select("*, vendors(*)")
      .eq("user_id", user.id)
      .eq("status", "paid")

    if (error) throw error

    const vendorMap = new Map()
    let totalExpenses = 0

    bills?.forEach((bill) => {
      const vendorName = bill.vendors?.company_name || "Unknown"
      const amount = bill.total_amount || 0
      totalExpenses += amount

      if (!vendorMap.has(vendorName)) {
        vendorMap.set(vendorName, 0)
      }
      vendorMap.set(vendorName, vendorMap.get(vendorName) + amount)
    })

    return Array.from(vendorMap.entries())
      .map(([name, amount]) => ({
        name,
        amount,
        percentage: totalExpenses > 0 ? ((amount / totalExpenses) * 100).toFixed(1) + "%" : "0%",
      }))
      .sort((a, b) => b.amount - a.amount)
  } catch (error) {
    console.error("[v0] Error fetching expenses by vendor data:", error)
    return getMockExpensesByVendorData()
  }
}

export async function getExpensesByCategoryData() {
  try {
    const { supabase, user } = await getSafeUser()

    if (!user || !supabase) {
      return getMockExpensesByCategoryData()
    }

    const { data: expenses, error } = await supabase
      .from("expenses")
      .select("*")
      .eq("user_id", user.id)
      .order("expense_date", { ascending: false })

    if (error) throw error

    const categoryMap = new Map()
    let totalExpenses = 0

    expenses?.forEach((exp) => {
      const category = exp.category || "Uncategorized"
      const amount = exp.amount || 0
      totalExpenses += amount

      if (!categoryMap.has(category)) {
        categoryMap.set(category, 0)
      }
      categoryMap.set(category, categoryMap.get(category) + amount)
    })

    return Array.from(categoryMap.entries())
      .map(([name, amount]) => ({
        name,
        amount,
        percentage: totalExpenses > 0 ? ((amount / totalExpenses) * 100).toFixed(1) + "%" : "0%",
      }))
      .sort((a, b) => b.amount - a.amount)
  } catch (error) {
    console.error("[v0] Error fetching expenses by category data:", error)
    return getMockExpensesByCategoryData()
  }
}

export async function getSalesByProductData() {
  try {
    const { supabase, user } = await getSafeUser()

    if (!user || !supabase) {
      return getMockSalesByProductData()
    }

    const { data: items, error } = await supabase
      .from("invoice_items")
      .select("*, invoices!inner(*), products(*)")
      .eq("invoices.user_id", user.id)
      .eq("invoices.status", "paid")

    if (error) throw error

    const productMap = new Map()
    let totalRevenue = 0

    items?.forEach((item) => {
      const productName = item.products?.name || item.description || "Unknown"
      const amount = (item.quantity || 0) * (item.unit_price || 0)
      totalRevenue += amount

      if (!productMap.has(productName)) {
        productMap.set(productName, 0)
      }
      productMap.set(productName, productMap.get(productName) + amount)
    })

    return Array.from(productMap.entries())
      .map(([name, revenue]) => ({
        name,
        revenue,
        percentage: totalRevenue > 0 ? ((revenue / totalRevenue) * 100).toFixed(1) + "%" : "0%",
      }))
      .sort((a, b) => b.revenue - a.revenue)
  } catch (error) {
    console.error("[v0] Error fetching sales by product data:", error)
    return getMockSalesByProductData()
  }
}

export async function getInvoiceListData() {
  try {
    const { supabase, user } = await getSafeUser()

    if (!user || !supabase) {
      return getMockInvoiceListData()
    }

    const { data: invoices, error } = await supabase
      .from("invoices")
      .select("*, customers(*)")
      .eq("user_id", user.id)
      .order("invoice_date", { ascending: false })
      .limit(50)

    if (error) throw error

    return (
      invoices?.map((inv) => ({
        number: inv.invoice_number,
        customer: inv.customers?.company_name || "Unknown",
        date: new Date(inv.invoice_date).toLocaleDateString(),
        amount: inv.total_amount || 0,
        status: inv.status || "pending",
      })) || []
    )
  } catch (error) {
    console.error("[v0] Error fetching invoice list data:", error)
    return getMockInvoiceListData()
  }
}

export async function getBillListData() {
  try {
    const { supabase, user } = await getSafeUser()

    if (!user || !supabase) {
      return getMockBillListData()
    }

    const { data: bills, error } = await supabase
      .from("bills")
      .select("*, vendors(*)")
      .eq("user_id", user.id)
      .order("bill_date", { ascending: false })
      .limit(50)

    if (error) throw error

    return (
      bills?.map((bill) => ({
        number: bill.bill_number,
        vendor: bill.vendors?.company_name || "Unknown",
        date: new Date(bill.bill_date).toLocaleDateString(),
        dueDate: new Date(bill.due_date).toLocaleDateString(),
        amount: bill.total_amount || 0,
        status: bill.status || "unpaid",
      })) || []
    )
  } catch (error) {
    console.error("[v0] Error fetching bill list data:", error)
    return getMockBillListData()
  }
}

export async function getSalesTaxData() {
  try {
    const { supabase, user } = await getSafeUser()

    if (!user || !supabase) {
      return getMockSalesTaxData()
    }

    const { data: invoices, error } = await supabase
      .from("invoices")
      .select("*")
      .eq("user_id", user.id)
      .eq("status", "paid")

    if (error) throw error

    const taxableAmount = invoices?.reduce((sum, inv) => sum + (inv.subtotal || 0), 0) || 0
    const taxCollected = invoices?.reduce((sum, inv) => sum + (inv.tax_amount || 0), 0) || 0

    return {
      taxableAmount,
      taxCollected,
      jurisdictions: [
        {
          name: "State Tax",
          rate: "7.25%",
          amount: taxCollected * 0.725,
        },
        {
          name: "County Tax",
          rate: "2.25%",
          amount: taxCollected * 0.225,
        },
        {
          name: "City Tax",
          rate: "0.50%",
          amount: taxCollected * 0.05,
        },
      ],
    }
  } catch (error) {
    console.error("[v0] Error fetching sales tax data:", error)
    return getMockSalesTaxData()
  }
}

export async function getTaxDeductionsData() {
  try {
    const { supabase, user } = await getSafeUser()

    if (!user || !supabase) {
      return getMockTaxDeductionsData()
    }

    const { data: expenses, error } = await supabase
      .from("expenses")
      .select("*")
      .eq("user_id", user.id)
      .eq("is_deductible", true)

    if (error) throw error

    const categoryMap = new Map()
    let totalDeductions = 0

    expenses?.forEach((exp) => {
      const category = exp.category || "Uncategorized"
      const amount = exp.amount || 0
      totalDeductions += amount

      if (!categoryMap.has(category)) {
        categoryMap.set(category, 0)
      }
      categoryMap.set(category, categoryMap.get(category) + amount)
    })

    return {
      deductions: Array.from(categoryMap.entries())
        .map(([category, amount]) => ({
          category,
          amount,
          percentage: totalDeductions > 0 ? ((amount / totalDeductions) * 100).toFixed(1) + "%" : "0%",
        }))
        .sort((a, b) => b.amount - a.amount),
      totalDeductions,
      estimatedTaxSavings: totalDeductions * 0.24,
    }
  } catch (error) {
    console.error("[v0] Error fetching tax deductions data:", error)
    return getMockTaxDeductionsData()
  }
}

// Mock data fallbacks
function getMockBalanceSheetData() {
  return {
    assets: {
      current: [
        { account_name: "Cash and Cash Equivalents", balance: 85420 },
        { account_name: "Accounts Receivable", balance: 42180 },
        { account_name: "Inventory", balance: 28500 },
      ],
      fixed: [
        { account_name: "Property and Equipment", balance: 125000 },
        { account_name: "Less: Accumulated Depreciation", balance: -25000 },
      ],
      total: 256100,
    },
    liabilities: {
      current: [
        { account_name: "Accounts Payable", balance: 32450 },
        { account_name: "Accrued Expenses", balance: 8200 },
      ],
      longTerm: [{ account_name: "Long-term Debt", balance: 75000 }],
      total: 115650,
    },
    equity: {
      accounts: [
        { account_name: "Owner's Equity", balance: 100000 },
        { account_name: "Retained Earnings", balance: 40450 },
      ],
      total: 140450,
    },
  }
}

function getMockProfitLossData() {
  return {
    revenue: {
      accounts: [
        { account_name: "Sales Revenue", balance: 125340 },
        { account_name: "Service Revenue", balance: 45200 },
      ],
      total: 170540,
    },
    expenses: {
      accounts: [
        { account_name: "Operating Expenses", balance: 42180 },
        { account_name: "Cost of Goods Sold", balance: 35000 },
      ],
      total: 77180,
    },
    netProfit: 93360,
  }
}

function getMockCashFlowData() {
  return {
    operating: {
      transactions: [],
      net: 94660,
    },
    investing: {
      transactions: [],
      net: -15000,
    },
    financing: {
      transactions: [],
      net: 20000,
    },
  }
}

function getMockARAgingData() {
  return [
    {
      name: "Acme Corporation",
      current: 5200,
      days30: 2400,
      days60: 0,
      days90: 0,
      days90plus: 0,
      total: 7600,
    },
    {
      name: "TechStart Inc",
      current: 8500,
      days30: 0,
      days60: 0,
      days90: 0,
      days90plus: 0,
      total: 8500,
    },
  ]
}

function getMockAPAgingData() {
  return [
    { name: "Office Depot", current: 3200, days30: 0, days60: 0, days90: 0, total: 3200 },
    { name: "Google Ads", current: 2800, days30: 0, days60: 0, days90: 0, total: 2800 },
    { name: "AWS", current: 0, days30: 2100, days60: 2000, days90: 0, total: 4100 },
  ]
}

function getMockCustomerBalanceData() {
  return [
    { name: "Acme Corporation", invoiced: 45200, paid: 37600, balance: 7600 },
    { name: "TechStart Inc", invoiced: 38500, paid: 30000, balance: 8500 },
  ]
}

function getMockVendorBalanceData() {
  return [
    { name: "Office Depot", billed: 15200, paid: 12000, balance: 3200 },
    { name: "Google Ads", billed: 12800, paid: 10000, balance: 2800 },
  ]
}

function getMockSalesByCustomerData() {
  return [
    { name: "Acme Corporation", revenue: 45200, percentage: "26.5%" },
    { name: "TechStart Inc", revenue: 38500, percentage: "22.6%" },
  ]
}

function getMockExpensesByVendorData() {
  return [
    { name: "Office Depot", amount: 15200, percentage: "19.7%" },
    { name: "Google Ads", amount: 12800, percentage: "16.6%" },
  ]
}

function getMockExpensesByCategoryData() {
  return [
    { name: "Operating Expenses", amount: 28400, percentage: "36.8%" },
    { name: "Marketing & Advertising", amount: 18200, percentage: "23.6%" },
  ]
}

function getMockSalesByProductData() {
  return [
    { name: "Professional Services", revenue: 65200, percentage: "38.2%" },
    { name: "Software Licenses", revenue: 48500, percentage: "28.4%" },
  ]
}

function getMockInvoiceListData() {
  return [
    { number: "INV-1045", customer: "Acme Corporation", date: "2024-03-15", amount: 12500, status: "paid" },
    { number: "INV-1044", customer: "TechStart Inc", date: "2024-03-12", amount: 8200, status: "paid" },
  ]
}

function getMockBillListData() {
  return [
    {
      number: "BILL-2045",
      vendor: "Office Depot",
      date: "2024-03-20",
      dueDate: "2024-04-20",
      amount: 3200,
      status: "unpaid",
    },
    {
      number: "BILL-2044",
      vendor: "Google Ads",
      date: "2024-03-15",
      dueDate: "2024-04-15",
      amount: 2800,
      status: "paid",
    },
  ]
}

function getMockSalesTaxData() {
  return {
    taxableAmount: 125340,
    taxCollected: 12534,
    jurisdictions: [
      { name: "State Tax", rate: "7.25%", amount: 9087.15 },
      { name: "County Tax", rate: "2.25%", amount: 2820.15 },
      { name: "City Tax", rate: "0.50%", amount: 626.7 },
    ],
  }
}

function getMockTaxDeductionsData() {
  return {
    deductions: [
      { category: "Office Expenses", amount: 12500, percentage: "27.3%" },
      { category: "Business Travel", amount: 9800, percentage: "21.4%" },
    ],
    totalDeductions: 45780,
    estimatedTaxSavings: 10987.2,
  }
}
