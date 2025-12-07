import { generateObject } from "ai"

interface ReceiptData {
  vendor: string
  date: string
  total: number
  tax: number
  category: string
  paymentMethod: string
  items: Array<{
    description: string
    quantity: number
    price: number
    total: number
  }>
}

export async function extractReceiptData(imageBase64: string): Promise<ReceiptData> {
  const { object } = await generateObject({
    model: "openai/gpt-4o",
    schema: {
      type: "object",
      properties: {
        vendor: { type: "string" },
        date: { type: "string" },
        total: { type: "number" },
        tax: { type: "number" },
        category: { type: "string" },
        paymentMethod: { type: "string" },
        items: {
          type: "array",
          items: {
            type: "object",
            properties: {
              description: { type: "string" },
              quantity: { type: "number" },
              price: { type: "number" },
              total: { type: "number" },
            },
            required: ["description", "quantity", "price", "total"],
          },
        },
      },
      required: ["vendor", "date", "total", "tax", "category", "paymentMethod", "items"],
    },
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "Extract all data from this receipt image. Identify the vendor, date, total amount, tax, suggested expense category, payment method, and all line items with descriptions, quantities, prices, and totals.",
          },
          {
            type: "image",
            image: imageBase64,
          },
        ],
      },
    ],
  })

  return object as ReceiptData
}
