"use server"

import { createClient } from "@/lib/supabase/server"

export async function seedDemoData(userId: string) {
  const supabase = await createClient()
  if (!supabase) {
    return { success: false, error: "Supabase not configured" }
  }

  try {
    // Check if user already has data
    const { data: existingAccounts } = await supabase
      .from("neobank_accounts")
      .select("id")
      .eq("user_id", userId)
      .limit(1)

    if (existingAccounts && existingAccounts.length > 0) {
      return { success: true, message: "User already has demo data" }
    }

    // Create demo neobank accounts
    const { data: checkingAccount, error: checkingError } = await supabase
      .from("neobank_accounts")
      .insert({
        user_id: userId,
        account_name: "Demo Checking Account",
        account_type: "checking",
        balance: 45000,
        currency: "USD",
        status: "active",
      })
      .select()
      .single()

    if (checkingError) throw checkingError

    const { data: savingsAccount, error: savingsError } = await supabase
      .from("neobank_accounts")
      .insert({
        user_id: userId,
        account_name: "Demo Savings Account",
        account_type: "savings",
        balance: 125000,
        currency: "USD",
        status: "active",
      })
      .select()
      .single()

    if (savingsError) throw savingsError

    // Create demo transactions for checking account
    const transactions = [
      {
        account_id: checkingAccount.id,
        user_id: userId,
        type: "credit",
        amount: 8500,
        description: "Payroll Deposit - Acme Corp",
        category: "Income",
        status: "completed",
        transaction_date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        account_id: checkingAccount.id,
        user_id: userId,
        type: "debit",
        amount: 2400,
        description: "Rent Payment",
        category: "Housing",
        status: "completed",
        transaction_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        account_id: checkingAccount.id,
        user_id: userId,
        type: "debit",
        amount: 450,
        description: "Whole Foods Market",
        category: "Groceries",
        status: "completed",
        transaction_date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        account_id: checkingAccount.id,
        user_id: userId,
        type: "debit",
        amount: 89.99,
        description: "Internet Service - Comcast",
        category: "Utilities",
        status: "completed",
        transaction_date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        account_id: checkingAccount.id,
        user_id: userId,
        type: "debit",
        amount: 12.5,
        description: "Starbucks Coffee",
        category: "Food & Dining",
        status: "completed",
        transaction_date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ]

    await supabase.from("neobank_transactions").insert(transactions)

    // Create demo organization
    const { data: org, error: orgError } = await supabase
      .from("organizations")
      .insert({
        name: "Demo Business Inc",
        industry: "Technology",
        tax_id: "12-3456789",
      })
      .select()
      .single()

    if (!orgError && org) {
      // Link user to organization
      await supabase.from("organization_memberships").insert({
        user_id: userId,
        organization_id: org.id,
        role: "admin",
      })

      // Create demo customers
      const { data: customers } = await supabase
        .from("customers")
        .insert([
          {
            user_id: userId,
            organization_id: org.id,
            company_name: "Acme Corporation",
            contact_name: "John Smith",
            email: "john.smith@acme.com",
            phone: "(555) 123-4567",
            address_line1: "123 Business Ave",
            city: "San Francisco",
            state: "CA",
            zip_code: "94102",
            is_active: true,
          },
          {
            user_id: userId,
            organization_id: org.id,
            company_name: "Tech Solutions LLC",
            contact_name: "Jane Doe",
            email: "jane.doe@techsolutions.com",
            phone: "(555) 987-6543",
            address_line1: "456 Innovation Blvd",
            city: "Palo Alto",
            state: "CA",
            zip_code: "94301",
            is_active: true,
          },
          {
            user_id: userId,
            organization_id: org.id,
            company_name: "Global Enterprises",
            contact_name: "Bob Johnson",
            email: "bob.j@globalent.com",
            phone: "(555) 246-8135",
            address_line1: "789 Commerce St",
            city: "San Jose",
            state: "CA",
            zip_code: "95113",
            is_active: true,
          },
        ])
        .select()

      // Create demo vendors
      const { data: vendors } = await supabase
        .from("vendors")
        .insert([
          {
            user_id: userId,
            organization_id: org.id,
            company_name: "Office Depot",
            contact_name: "Sarah Williams",
            email: "sarah@officedepot.com",
            phone: "(555) 111-2222",
            is_active: true,
          },
          {
            user_id: userId,
            organization_id: org.id,
            company_name: "Cloud Services Pro",
            contact_name: "Mike Chen",
            email: "mike@cloudservices.com",
            phone: "(555) 333-4444",
            is_active: true,
          },
        ])
        .select()

      // Create demo invoices if customers were created
      if (customers && customers.length > 0) {
        await supabase.from("invoices").insert([
          {
            user_id: userId,
            organization_id: org.id,
            customer_id: customers[0].id,
            invoice_date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
            due_date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
            subtotal: 5000,
            tax_amount: 450,
            total_amount: 5450,
            status: "sent",
            description: "Q4 Consulting Services",
          },
          {
            user_id: userId,
            organization_id: org.id,
            customer_id: customers[1].id,
            invoice_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            due_date: new Date(Date.now() - 1).toISOString(),
            subtotal: 8500,
            tax_amount: 765,
            total_amount: 9265,
            status: "paid",
            description: "Website Development Project",
          },
        ])
      }

      // Create demo expenses
      await supabase.from("expenses").insert([
        {
          user_id: userId,
          organization_id: org.id,
          amount: 1200,
          description: "Office Rent - December",
          category: "Rent",
          expense_date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
          status: "approved",
        },
        {
          user_id: userId,
          organization_id: org.id,
          amount: 450,
          description: "AWS Cloud Services",
          category: "Software & Subscriptions",
          expense_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          status: "approved",
        },
      ])

      // Create demo employees
      await supabase.from("employees").insert([
        {
          organization_id: org.id,
          first_name: "Alice",
          last_name: "Anderson",
          email: "alice@demobiz.com",
          position: "Senior Developer",
          hire_date: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString(),
          salary: 120000,
          employment_type: "full-time",
          is_active: true,
        },
        {
          organization_id: org.id,
          first_name: "Carlos",
          last_name: "Rodriguez",
          email: "carlos@demobiz.com",
          position: "Marketing Manager",
          hire_date: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(),
          salary: 95000,
          employment_type: "full-time",
          is_active: true,
        },
      ])
    }

    // Create demo investment portfolio
    const { data: portfolio, error: portfolioError } = await supabase
      .from("investment_portfolios")
      .insert({
        user_id: userId,
        name: "Demo Investment Portfolio",
        description: "My diversified investment portfolio",
        is_active: true,
      })
      .select()
      .single()

    if (!portfolioError && portfolio) {
      // Create demo investment holdings
      await supabase.from("investment_holdings").insert([
        {
          user_id: userId,
          portfolio_id: portfolio.id,
          symbol: "AAPL",
          name: "Apple Inc.",
          asset_type: "stock",
          shares: 50,
          average_cost_basis: 150,
          current_price: 185,
          market_value: 9250,
          purchase_date: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
          is_active: true,
        },
        {
          user_id: userId,
          portfolio_id: portfolio.id,
          symbol: "MSFT",
          name: "Microsoft Corporation",
          asset_type: "stock",
          shares: 30,
          average_cost_basis: 300,
          current_price: 370,
          market_value: 11100,
          purchase_date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
          is_active: true,
        },
        {
          user_id: userId,
          portfolio_id: portfolio.id,
          symbol: "TSLA",
          name: "Tesla Inc.",
          asset_type: "stock",
          shares: 20,
          average_cost_basis: 200,
          current_price: 245,
          market_value: 4900,
          purchase_date: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
          is_active: true,
        },
      ])
    }

    return { success: true, message: "Demo data seeded successfully with comprehensive examples" }
  } catch (error) {
    console.error("[v0] Error seeding demo data:", error)
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}
