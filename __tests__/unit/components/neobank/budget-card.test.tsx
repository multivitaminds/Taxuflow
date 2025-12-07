import { render, screen } from "@testing-library/react"
import "@testing-library/jest-dom"

// Mock budget card component for testing
const BudgetCard = ({
  category,
  spent,
  budget,
  trend,
}: {
  category: string
  spent: number
  budget: number
  trend: string
}) => {
  const percentage = (spent / budget) * 100
  const remaining = budget - spent

  return (
    <div data-testid="budget-card">
      <h3>{category}</h3>
      <div data-testid="spent">${spent}</div>
      <div data-testid="budget">${budget}</div>
      <div data-testid="remaining">${remaining}</div>
      <div data-testid="percentage">{percentage}%</div>
      <div data-testid="trend">{trend}</div>
    </div>
  )
}

describe("BudgetCard Component", () => {
  it("renders budget information correctly", () => {
    render(<BudgetCard category="Groceries" spent={450} budget={600} trend="+12%" />)

    expect(screen.getByText("Groceries")).toBeInTheDocument()
    expect(screen.getByTestId("spent")).toHaveTextContent("$450")
    expect(screen.getByTestId("budget")).toHaveTextContent("$600")
  })

  it("calculates remaining amount correctly", () => {
    render(<BudgetCard category="Dining" spent={200} budget={300} trend="-5%" />)

    expect(screen.getByTestId("remaining")).toHaveTextContent("$100")
  })

  it("calculates percentage correctly", () => {
    render(<BudgetCard category="Entertainment" spent={75} budget={100} trend="+3%" />)

    expect(screen.getByTestId("percentage")).toHaveTextContent("75%")
  })

  it("displays trend information", () => {
    render(<BudgetCard category="Transportation" spent={180} budget={200} trend="-2%" />)

    expect(screen.getByTestId("trend")).toHaveTextContent("-2%")
  })
})
