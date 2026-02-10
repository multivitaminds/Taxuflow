import Link from "next/link"
import { ArrowLeft, Package, Code2, Zap, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function SwiftSDKPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        {/* Back Navigation */}
        <Link
          href="/developers"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Developers
        </Link>

        {/* Header */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-12 w-12 rounded-lg bg-[#F05138]/10 flex items-center justify-center">
              <Package className="h-6 w-6 text-[#F05138]" />
            </div>
            <h1 className="text-4xl font-bold">Swift SDK</h1>
          </div>
          <p className="text-xl text-muted-foreground">
            Official Swift library for iOS, macOS, and watchOS. Built with modern Swift concurrency.
          </p>
        </div>

        {/* Installation */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Installation</h2>

          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-3">Swift Package Manager</h3>
              <div className="bg-card border border-border rounded-lg p-6">
                <pre className="text-sm overflow-x-auto">
                  <code className="text-foreground">{`dependencies: [
    .package(url: "https://github.com/multivitaminds/taxu-swift", from: "1.0.0")
]`}</code>
                </pre>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-3">CocoaPods</h3>
              <div className="bg-card border border-border rounded-lg p-6">
                <pre className="text-sm overflow-x-auto">
                  <code className="text-foreground">pod 'TaxuSDK', '~&gt; 1.0'</code>
                </pre>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Start */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Quick Start</h2>
          <div className="bg-card border border-border rounded-lg p-6">
            <pre className="text-sm overflow-x-auto">
              <code className="text-foreground">{`import TaxuSDK

// Initialize client
let taxu = TaxuClient(apiKey: "your_api_key")

// Create a tax return
Task {
    do {
        let taxReturn = try await taxu.taxReturns.create(
            year: 2024,
            filingStatus: .single,
            income: 75000
        )
        
        print("Tax Return ID: \\(taxReturn.id)")
        print("Estimated Refund: $\\(taxReturn.estimatedRefund)")
    } catch {
        print("Error: \\(error)")
    }
}`}</code>
            </pre>
          </div>
        </section>

        {/* Features */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Features</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-card border border-border rounded-lg p-6">
              <Code2 className="h-8 w-8 text-primary mb-3" />
              <h3 className="font-semibold mb-2">Swift Concurrency</h3>
              <p className="text-sm text-muted-foreground">Built with async/await for modern Swift apps</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-6">
              <Zap className="h-8 w-8 text-primary mb-3" />
              <h3 className="font-semibold mb-2">SwiftUI Ready</h3>
              <p className="text-sm text-muted-foreground">Seamless integration with SwiftUI views</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-6">
              <Shield className="h-8 w-8 text-primary mb-3" />
              <h3 className="font-semibold mb-2">Type-Safe</h3>
              <p className="text-sm text-muted-foreground">Full type safety with Swift's strong typing</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-6">
              <Package className="h-8 w-8 text-primary mb-3" />
              <h3 className="font-semibold mb-2">Multi-Platform</h3>
              <p className="text-sm text-muted-foreground">iOS, macOS, watchOS, and tvOS support</p>
            </div>
          </div>
        </section>

        {/* SwiftUI Example */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">SwiftUI Integration</h2>
          <div className="bg-card border border-border rounded-lg p-6">
            <pre className="text-sm overflow-x-auto">
              <code className="text-foreground">{`import SwiftUI
import TaxuSDK

struct RefundCalculatorView: View {
    @StateObject private var viewModel = RefundViewModel()
    @State private var income: String = ""
    @State private var deductions: String = ""
    
    var body: some View {
        Form {
            Section("Income Information") {
                TextField("Annual Income", text: $income)
                    .keyboardType(.numberPad)
                TextField("Deductions", text: $deductions)
                    .keyboardType(.numberPad)
            }
            
            Section {
                Button("Calculate Refund") {
                    Task {
                        await viewModel.calculateRefund(
                            income: Double(income) ?? 0,
                            deductions: Double(deductions) ?? 0
                        )
                    }
                }
            }
            
            if let estimate = viewModel.estimate {
                Section("Estimated Refund") {
                    HStack {
                        Text("Federal")
                        Spacer()
                        Text("$\\(estimate.federalRefund, specifier: "%.2f")")
                            .fontWeight(.bold)
                    }
                    HStack {
                        Text("State")
                        Spacer()
                        Text("$\\(estimate.stateRefund, specifier: "%.2f")")
                            .fontWeight(.bold)
                    }
                }
            }
        }
        .navigationTitle("Refund Calculator")
    }
}

@MainActor
class RefundViewModel: ObservableObject {
    @Published var estimate: RefundEstimate?
    private let taxu = TaxuClient(apiKey: "your_api_key")
    
    func calculateRefund(income: Double, deductions: Double) async {
        do {
            estimate = try await taxu.calculations.estimateRefund(
                income: income,
                deductions: deductions,
                filingStatus: .single
            )
        } catch {
            print("Error: \\(error)")
        }
    }
}
`}</code>
            </pre>
          </div>
        </section>

        {/* Advanced Examples */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Advanced Usage</h2>

          <div className="space-y-6">
            {/* Document Upload */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Upload Tax Document</h3>
              <div className="bg-card border border-border rounded-lg p-6">
                <pre className="text-sm overflow-x-auto">
                  <code className="text-foreground">{`// Upload from UIImage
let image = UIImage(named: "w2")!
let document = try await taxu.documents.upload(
    image: image,
    type: .w2,
    taxYear: 2024
)

print("Document ID: \\(document.id)")
print("Status: \\(document.status)")

// Upload from file URL
let fileURL = URL(fileURLWithPath: "/path/to/w2.pdf")
let document = try await taxu.documents.upload(
    fileURL: fileURL,
    type: .w2,
    taxYear: 2024
)`}</code>
                </pre>
              </div>
            </div>

            {/* AI Chat Stream */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Streaming AI Chat</h3>
              <div className="bg-card border border-border rounded-lg p-6">
                <pre className="text-sm overflow-x-auto">
                  <code className="text-foreground">{`let stream = try await taxu.ai.chatStream(
    message: "How do I claim the child tax credit?",
    agent: .sophie
)

for try await chunk in stream {
    print(chunk.content, terminator: "")
}
print() // New line after stream completes`}</code>
                </pre>
              </div>
            </div>

            {/* Combine Integration */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Combine Publishers</h3>
              <div className="bg-card border border-border rounded-lg p-6">
                <pre className="text-sm overflow-x-auto">
                  <code className="text-foreground">{`import Combine

class TaxReturnService {
    private let taxu = TaxuClient(apiKey: "your_api_key")
    private var cancellables = Set<AnyCancellable>()
    
    func fetchTaxReturn(id: String) -> AnyPublisher<TaxReturn, Error> {
        Future { promise in
            Task {
                do {
                    let taxReturn = try await self.taxu.taxReturns.get(id: id)
                    promise(.success(taxReturn))
                } catch {
                    promise(.failure(error))
                }
            }
        }
        .eraseToAnyPublisher()
    }
}
`}</code>
                </pre>
              </div>
            </div>
          </div>
        </section>

        {/* Error Handling */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Error Handling</h2>
          <div className="bg-card border border-border rounded-lg p-6">
            <pre className="text-sm overflow-x-auto">
              <code className="text-foreground">{`do {
    let taxReturn = try await taxu.taxReturns.get(id: "return_123")
    print("Tax Return: \\(taxReturn)")
} catch let error as TaxuError {
    switch error {
    case .notFound:
        print("Tax return not found")
    case .rateLimit(let retryAfter):
        print("Rate limited. Retry after \\(retryAfter) seconds")
    case .invalidRequest(let message):
        print("Invalid request: \\(message)")
    case .unauthorized:
        print("Invalid API key")
    case .serverError:
        print("Server error occurred")
    }
} catch {
    print("Unexpected error: \\(error)")
}`}</code>
            </pre>
          </div>
        </section>

        {/* Configuration */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Configuration</h2>
          <div className="bg-card border border-border rounded-lg p-6">
            <pre className="text-sm overflow-x-auto">
              <code className="text-foreground">{`// Custom configuration
let config = TaxuConfiguration(
    apiKey: "your_api_key",
    baseURL: URL(string: "https://api.taxu.ai/v1")!,
    timeout: 30,
    maxRetries: 3
)

let taxu = TaxuClient(configuration: config)

// Enable logging
taxu.enableLogging(level: .debug)`}</code>
            </pre>
          </div>
        </section>

        {/* Resources */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Resources</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Link
              href="https://github.com/multivitaminds/taxu-swift"
              className="bg-card border border-border rounded-lg p-6 hover:border-primary transition-colors"
            >
              <h3 className="font-semibold mb-2">GitHub Repository</h3>
              <p className="text-sm text-muted-foreground">View source code and contribute</p>
            </Link>
            <Link
              href="/api-docs"
              className="bg-card border border-border rounded-lg p-6 hover:border-primary transition-colors"
            >
              <h3 className="font-semibold mb-2">API Reference</h3>
              <p className="text-sm text-muted-foreground">Complete API documentation</p>
            </Link>
            <Link
              href="https://swiftpackageindex.com/taxu/taxu-swift"
              className="bg-card border border-border rounded-lg p-6 hover:border-primary transition-colors"
            >
              <h3 className="font-semibold mb-2">Swift Package Index</h3>
              <p className="text-sm text-muted-foreground">Package documentation and versions</p>
            </Link>
            <Link
              href="/sandbox"
              className="bg-card border border-border rounded-lg p-6 hover:border-primary transition-colors"
            >
              <h3 className="font-semibold mb-2">Try in Sandbox</h3>
              <p className="text-sm text-muted-foreground">Test API calls safely</p>
            </Link>
          </div>
        </section>

        {/* CTA */}
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Build?</h2>
          <p className="text-muted-foreground mb-6">Get your API key and start integrating Taxu into your iOS app</p>
          <div className="flex gap-4 justify-center">
            <Button asChild size="lg">
              <Link href="/developer-portal">Get API Key</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/api-docs">View API Docs</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
