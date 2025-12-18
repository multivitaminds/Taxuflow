import { z } from "zod"

// User schemas
export const userProfileSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  full_name: z.string().min(1, "Full name is required"),
  company_name: z.string().optional(),
  phone: z.string().optional(),
  avatar_url: z.string().url().optional(),
  user_type: z.enum(["individual", "business", "accountant"]).default("individual"),
  industry: z.string().optional(),
  company_size: z.string().optional(),
})

export const invoiceSchema = z.object({
  invoice_number: z.string().min(1, "Invoice number is required"),
  customer_id: z.string().uuid("Invalid customer ID"),
  invoice_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
  due_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
  subtotal: z.number().min(0, "Subtotal must be positive"),
  tax_amount: z.number().min(0, "Tax amount must be positive"),
  total_amount: z.number().min(0, "Total amount must be positive"),
  status: z.enum(["draft", "sent", "paid", "overdue", "cancelled"]).default("draft"),
  notes: z.string().optional(),
})

export const expenseSchema = z.object({
  amount: z.number().positive("Amount must be greater than 0"),
  expense_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
  category_id: z.string().uuid("Invalid category ID").optional(),
  vendor_id: z.string().uuid("Invalid vendor ID").optional(),
  description: z.string().min(1, "Description is required"),
  payment_method: z.enum(["cash", "credit_card", "debit_card", "check", "bank_transfer"]).optional(),
  is_tax_deductible: z.boolean().default(false),
  receipt_url: z.string().url("Invalid URL").optional(),
})

export const neobankAccountSchema = z.object({
  account_type: z.enum(["checking", "savings", "money_market"]),
  currency: z.string().length(3, "Currency must be 3 characters").default("USD"),
  routing_number: z.string().regex(/^\d{9}$/, "Invalid routing number"),
  account_number: z.string().min(8, "Account number must be at least 8 characters"),
})

export const transferSchema = z.object({
  from_account_id: z.string().uuid("Invalid from account ID").optional(),
  to_account_id: z.string().uuid("Invalid to account ID").optional(),
  external_account_id: z.string().uuid("Invalid external account ID").optional(),
  amount: z.number().positive("Amount must be greater than 0"),
  currency: z.string().length(3).default("USD"),
  transfer_type: z.enum(["internal", "external", "ach", "wire"]),
  scheduled_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
  memo: z.string().max(500).optional(),
})

export const taxFilingSchema = z.object({
  tax_year: z
    .number()
    .int()
    .min(2000)
    .max(new Date().getFullYear() + 1),
  form_type: z.enum(["1040", "941", "1099-NEC", "W-2"]),
  filing_status: z
    .enum(["single", "married_filing_jointly", "married_filing_separately", "head_of_household", "qualifying_widow"])
    .optional(),
  total_income: z.number().optional(),
  total_deductions: z.number().optional(),
  tax_liability: z.number().optional(),
})

// Validation helper
export function validateData<T>(
  schema: z.ZodSchema<T>,
  data: unknown,
): { success: boolean; data?: T; errors?: string[] } {
  try {
    const validated = schema.parse(data)
    return { success: true, data: validated }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.errors.map((err) => `${err.path.join(".")}: ${err.message}`),
      }
    }
    return { success: false, errors: ["Validation failed"] }
  }
}
