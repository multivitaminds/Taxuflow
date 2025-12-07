"use client"

import React from "react"

import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import "@testing-library/jest-dom"

// Mock invoice creation flow
const InvoiceCreationFlow = () => {
  const [step, setStep] = React.useState(1)
  const [invoice, setInvoice] = React.useState({
    customer: "",
    amount: 0,
    dueDate: "",
  })

  return (
    <div data-testid="invoice-flow">
      {step === 1 && (
        <div>
          <h2>Select Customer</h2>
          <input
            data-testid="customer-input"
            value={invoice.customer}
            onChange={(e) => setInvoice({ ...invoice, customer: e.target.value })}
          />
          <button onClick={() => setStep(2)}>Next</button>
        </div>
      )}
      {step === 2 && (
        <div>
          <h2>Enter Amount</h2>
          <input
            data-testid="amount-input"
            type="number"
            value={invoice.amount}
            onChange={(e) => setInvoice({ ...invoice, amount: Number(e.target.value) })}
          />
          <button onClick={() => setStep(3)}>Next</button>
        </div>
      )}
      {step === 3 && (
        <div>
          <h2>Review & Submit</h2>
          <p data-testid="review-customer">{invoice.customer}</p>
          <p data-testid="review-amount">${invoice.amount}</p>
          <button data-testid="submit-button">Create Invoice</button>
        </div>
      )}
    </div>
  )
}

describe("Invoice Creation Flow", () => {
  it("completes full invoice creation workflow", async () => {
    const user = userEvent.setup()
    render(<InvoiceCreationFlow />)

    // Step 1: Select customer
    expect(screen.getByText("Select Customer")).toBeInTheDocument()
    await user.type(screen.getByTestId("customer-input"), "Acme Corp")
    await user.click(screen.getByText("Next"))

    // Step 2: Enter amount
    await waitFor(() => {
      expect(screen.getByText("Enter Amount")).toBeInTheDocument()
    })
    await user.type(screen.getByTestId("amount-input"), "1500")
    await user.click(screen.getByText("Next"))

    // Step 3: Review and submit
    await waitFor(() => {
      expect(screen.getByText("Review & Submit")).toBeInTheDocument()
    })
    expect(screen.getByTestId("review-customer")).toHaveTextContent("Acme Corp")
    expect(screen.getByTestId("review-amount")).toHaveTextContent("$1500")
    expect(screen.getByTestId("submit-button")).toBeInTheDocument()
  })
})
