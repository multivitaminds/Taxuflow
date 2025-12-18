import Link from "next/link"
import { TrendingUp, LineChart, PieChart, DollarSign } from "lucide-react"

export default function InvestmentAPIPage() {
  const endpoints = [
    {
      method: "GET",
      path: "/v1/market/quote/:symbol",
      description: "Real-time stock quotes with bid/ask spread and market depth",
    },
    {
      method: "POST",
      path: "/v1/orders/market",
      description: "Execute market orders for stocks, ETFs, and crypto",
    },
    {
      method: "POST",
      path: "/v1/orders/limit",
      description: "Place limit orders with custom price targets",
    },
    {
      method: "GET",
      path: "/v1/portfolio/:id",
      description: "Retrieve portfolio holdings, performance, and allocation",
    },
    {
      method: "GET",
      path: "/v1/market/historical/:symbol",
      description: "Historical price data with OHLCV bars",
    },
    {
      method: "POST",
      path: "/v1/watchlist",
      description: "Create and manage watchlists with price alerts",
    },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 bg-[#f6f9fc]">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center gap-3 text-sm text-gray-600 mb-4">
            <Link href="/developer" className="hover:text-[#635bff]">
              Developers
            </Link>
            <span>/</span>
            <Link href="/developer/docs" className="hover:text-[#635bff]">
              Docs
            </Link>
            <span>/</span>
            <Link href="/developer/docs/api/overview" className="hover:text-[#635bff]">
              API
            </Link>
            <span>/</span>
            <span className="text-[#0a2540] font-medium">Investment</span>
          </div>
          <h1 className="text-5xl font-bold text-[#0a2540] mb-4">Investment API</h1>
          <p className="text-xl text-gray-600 max-w-3xl">
            Trade stocks, ETFs, and crypto with real-time market data, fractional shares, and commission-free execution
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-4 gap-12">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 space-y-8">
              <div>
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4">On this page</h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a href="#overview" className="text-gray-600 hover:text-[#635bff]">
                      Overview
                    </a>
                  </li>
                  <li>
                    <a href="#endpoints" className="text-gray-600 hover:text-[#635bff]">
                      Endpoints
                    </a>
                  </li>
                  <li>
                    <a href="#examples" className="text-gray-600 hover:text-[#635bff]">
                      Code Examples
                    </a>
                  </li>
                  <li>
                    <a href="#market-data" className="text-gray-600 hover:text-[#635bff]">
                      Market Data
                    </a>
                  </li>
                </ul>
              </div>

              <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <TrendingUp className="w-5 h-5 text-purple-600 mt-0.5" />
                  <div>
                    <div className="font-bold text-purple-900 text-sm mb-1">Commission-Free</div>
                    <div className="text-sm text-purple-700">Trade stocks and ETFs with $0 commission fees</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-12">
            {/* Overview */}
            <section id="overview">
              <h2 className="text-3xl font-bold text-[#0a2540] mb-6">Overview</h2>
              <div className="prose prose-lg max-w-none">
                <p className="text-gray-700 leading-relaxed mb-6">
                  The Investment API enables programmatic trading and portfolio management. Access real-time market
                  data, execute trades, and build sophisticated investment applications with institutional-grade
                  infrastructure.
                </p>

                <div className="grid md:grid-cols-3 gap-6 my-8">
                  <div className="p-6 border border-gray-200 rounded-lg">
                    <div className="w-12 h-12 bg-[#635bff]/10 rounded-lg flex items-center justify-center mb-4">
                      <LineChart className="w-6 h-6 text-[#635bff]" />
                    </div>
                    <h3 className="font-bold text-[#0a2540] mb-2">Real-time Data</h3>
                    <p className="text-sm text-gray-600">Live market quotes and price streaming</p>
                  </div>

                  <div className="p-6 border border-gray-200 rounded-lg">
                    <div className="w-12 h-12 bg-[#00d4ff]/10 rounded-lg flex items-center justify-center mb-4">
                      <DollarSign className="w-6 h-6 text-[#00d4ff]" />
                    </div>
                    <h3 className="font-bold text-[#0a2540] mb-2">Fractional Shares</h3>
                    <p className="text-sm text-gray-600">Buy any dollar amount of stocks</p>
                  </div>

                  <div className="p-6 border border-gray-200 rounded-lg">
                    <div className="w-12 h-12 bg-[#ff5c35]/10 rounded-lg flex items-center justify-center mb-4">
                      <PieChart className="w-6 h-6 text-[#ff5c35]" />
                    </div>
                    <h3 className="font-bold text-[#0a2540] mb-2">Portfolio Analytics</h3>
                    <p className="text-sm text-gray-600">Performance tracking and allocation insights</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Endpoints */}
            <section id="endpoints">
              <h2 className="text-3xl font-bold text-[#0a2540] mb-6">API Endpoints</h2>
              <div className="space-y-4">
                {endpoints.map((endpoint, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 rounded-lg p-6 hover:border-[#635bff] transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      <span
                        className={`px-3 py-1 rounded text-xs font-bold ${
                          endpoint.method === "POST" ? "bg-[#635bff] text-white" : "bg-[#00d4ff] text-[#0a2540]"
                        }`}
                      >
                        {endpoint.method}
                      </span>
                      <div className="flex-1">
                        <code className="text-[#0a2540] font-mono font-semibold">{endpoint.path}</code>
                        <p className="text-gray-600 mt-2">{endpoint.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Code Examples */}
            <section id="examples">
              <h2 className="text-3xl font-bold text-[#0a2540] mb-6">Code Examples</h2>

              {/* Example 1: Get Quote */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-[#0a2540] mb-4">Get Real-time Quote</h3>
                <div className="bg-[#0d1117] rounded-xl p-6 border border-gray-800 overflow-x-auto">
                  <pre className="font-mono text-sm text-white">
                    <code>{`// Get real-time stock quote
const taxu = require('@taxu/taxu-js')('your_api_key');

const quote = await taxu.investment.market.quote('AAPL');

console.log(quote);
// {
//   symbol: 'AAPL',
//   price: 178.45,
//   change: 2.35,
//   changePercent: 1.33,
//   bid: 178.42,
//   ask: 178.48,
//   volume: 52341876,
//   marketCap: 2780000000000,
//   high: 179.23,
//   low: 176.89,
//   open: 177.10,
//   previousClose: 176.10,
//   timestamp: '2024-01-15T15:45:30Z'
// }`}</code>
                  </pre>
                </div>
              </div>

              {/* Example 2: Place Order */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-[#0a2540] mb-4">Place Market Order</h3>
                <div className="bg-[#0d1117] rounded-xl p-6 border border-gray-800 overflow-x-auto">
                  <pre className="font-mono text-sm text-white">
                    <code>{`// Buy fractional shares
const order = await taxu.investment.orders.market({
  symbol: 'TSLA',
  side: 'buy',
  notional: 500, // Buy $500 worth
  timeInForce: 'day'
});

console.log(order);
// {
//   id: 'ord_xyz123',
//   symbol: 'TSLA',
//   side: 'buy',
//   quantity: 1.95, // Fractional shares
//   filledQuantity: 1.95,
//   averagePrice: 256.41,
//   totalCost: 500.00,
//   status: 'filled',
//   filledAt: '2024-01-15T15:46:12Z'
// }`}</code>
                  </pre>
                </div>
              </div>
            </section>

            {/* Market Data */}
            <section id="market-data">
              <h2 className="text-3xl font-bold text-[#0a2540] mb-6">Market Data</h2>
              <div className="border border-gray-200 rounded-lg p-6">
                <h3 className="font-bold text-[#0a2540] mb-4">Real-time Streaming</h3>
                <p className="text-gray-700 mb-4">
                  Subscribe to WebSocket streams for live price updates, order book changes, and trade executions:
                </p>
                <div className="bg-[#0d1117] rounded-xl p-6 border border-gray-800 overflow-x-auto">
                  <pre className="font-mono text-sm text-white">
                    <code>{`// Subscribe to real-time quotes
const stream = taxu.investment.market.stream(['AAPL', 'GOOGL', 'MSFT']);

stream.on('quote', (data) => {
  console.log(data);
  // { symbol: 'AAPL', price: 178.52, timestamp: '...' }
});`}</code>
                  </pre>
                </div>
              </div>
            </section>

            {/* Next Steps */}
            <div className="border-t border-gray-200 pt-12">
              <h3 className="text-2xl font-bold text-[#0a2540] mb-6">Next steps</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <Link
                  href="/developer/docs/api/accounting"
                  className="p-6 border border-gray-200 rounded-lg hover:border-[#635bff] hover:shadow-md transition-all group"
                >
                  <h4 className="text-lg font-bold text-[#0a2540] group-hover:text-[#635bff] mb-2">Accounting API →</h4>
                  <p className="text-gray-600 text-sm">Manage invoices, expenses, and financial records</p>
                </Link>
                <Link
                  href="/developer/playground"
                  className="p-6 border border-gray-200 rounded-lg hover:border-[#635bff] hover:shadow-md transition-all group"
                >
                  <h4 className="text-lg font-bold text-[#0a2540] group-hover:text-[#635bff] mb-2">
                    Try it in Playground →
                  </h4>
                  <p className="text-gray-600 text-sm">Test the Investment API interactively</p>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
