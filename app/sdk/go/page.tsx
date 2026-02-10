import Link from "next/link"
import { ArrowLeft, Package, Code2, Zap, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function GoSDKPage() {
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
            <div className="h-12 w-12 rounded-lg bg-[#00ADD8]/10 flex items-center justify-center">
              <Package className="h-6 w-6 text-[#00ADD8]" />
            </div>
            <h1 className="text-4xl font-bold">Go SDK</h1>
          </div>
          <p className="text-xl text-muted-foreground">
            Official Go library for the Taxu API. Built for performance and type safety.
          </p>
        </div>

        {/* Installation */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Installation</h2>
          <div className="bg-card border border-border rounded-lg p-6">
            <pre className="text-sm overflow-x-auto">
              <code className="text-foreground">go get github.com/multivitaminds/taxu-go</code>
            </pre>
          </div>
        </section>

        {/* Quick Start */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Quick Start</h2>
          <div className="bg-card border border-border rounded-lg p-6">
            <pre className="text-sm overflow-x-auto">
              <code className="text-foreground">{`package main

import (
    "context"
    "fmt"
    "log"
    
    "github.com/multivitaminds/taxu-go"
)

func main() {
    // Initialize client
    client := taxu.NewClient("your_api_key")
    
    // Create a tax return
    ctx := context.Background()
    taxReturn, err := client.TaxReturns.Create(ctx, &taxu.TaxReturnParams{
        Year:         2024,
        FilingStatus: "single",
        Income:       75000,
    })
    
    if err != nil {
        log.Fatal(err)
    }
    
    fmt.Printf("Tax Return ID: %s\\n", taxReturn.ID)
    fmt.Printf("Estimated Refund: $%.2f\\n", taxReturn.EstimatedRefund)
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
              <h3 className="font-semibold mb-2">Type-Safe</h3>
              <p className="text-sm text-muted-foreground">Full type definitions with compile-time safety</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-6">
              <Zap className="h-8 w-8 text-primary mb-3" />
              <h3 className="font-semibold mb-2">High Performance</h3>
              <p className="text-sm text-muted-foreground">Optimized for speed with connection pooling</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-6">
              <Shield className="h-8 w-8 text-primary mb-3" />
              <h3 className="font-semibold mb-2">Context Support</h3>
              <p className="text-sm text-muted-foreground">Built-in context.Context for cancellation and timeouts</p>
            </div>
            <div className="bg-card border border-border rounded-lg p-6">
              <Package className="h-8 w-8 text-primary mb-3" />
              <h3 className="font-semibold mb-2">Idiomatic Go</h3>
              <p className="text-sm text-muted-foreground">Follows Go best practices and conventions</p>
            </div>
          </div>
        </section>

        {/* Advanced Examples */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Advanced Usage</h2>

          <div className="space-y-6">
            {/* Calculate Refund */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Calculate Refund Estimate</h3>
              <div className="bg-card border border-border rounded-lg p-6">
                <pre className="text-sm overflow-x-auto">
                  <code className="text-foreground">{`estimate, err := client.Calculations.EstimateRefund(ctx, &taxu.RefundParams{
    Income:       85000,
    Deductions:   12000,
    Credits:      2000,
    FilingStatus: "married_joint",
})

if err != nil {
    log.Fatal(err)
}

fmt.Printf("Federal Refund: $%.2f\\n", estimate.FederalRefund)
fmt.Printf("State Refund: $%.2f\\n", estimate.StateRefund)
fmt.Printf("Confidence: %.1f%%\\n", estimate.Confidence*100)`}</code>
                </pre>
              </div>
            </div>

            {/* Upload Document */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Upload Tax Document</h3>
              <div className="bg-card border border-border rounded-lg p-6">
                <pre className="text-sm overflow-x-auto">
                  <code className="text-foreground">{`file, err := os.Open("w2.pdf")
if err != nil {
    log.Fatal(err)
}
defer file.Close()

doc, err := client.Documents.Upload(ctx, &taxu.DocumentParams{
    File:     file,
    Type:     "w2",
    TaxYear:  2024,
    UserID:   "user_123",
})

if err != nil {
    log.Fatal(err)
}

fmt.Printf("Document ID: %s\\n", doc.ID)
fmt.Printf("Status: %s\\n", doc.Status)`}</code>
                </pre>
              </div>
            </div>

            {/* AI Chat */}
            <div>
              <h3 className="text-lg font-semibold mb-3">AI Tax Assistant</h3>
              <div className="bg-card border border-border rounded-lg p-6">
                <pre className="text-sm overflow-x-auto">
                  <code className="text-foreground">{`response, err := client.AI.Chat(ctx, &taxu.ChatParams{
    Message:  "Can I deduct home office expenses?",
    Agent:    "sophie",
    Context: map[string]interface{}{
        "filing_status": "single",
        "has_w2":        true,
    },
})

if err != nil {
    log.Fatal(err)
}

fmt.Println(response.Message)
// Output: "Yes! As a W-2 employee working from home..."`}</code>
                </pre>
              </div>
            </div>

            {/* Webhook Verification */}
            <div>
              <h3 className="text-lg font-semibold mb-3">Verify Webhook Signatures</h3>
              <div className="bg-card border border-border rounded-lg p-6">
                <pre className="text-sm overflow-x-auto">
                  <code className="text-foreground">{`func handleWebhook(w http.ResponseWriter, r *http.Request) {
    payload, err := io.ReadAll(r.Body)
    if err != nil {
        http.Error(w, "Error reading body", 400)
        return
    }
    
    signature := r.Header.Get("X-Taxu-Signature")
    
    event, err := taxu.VerifyWebhook(payload, signature, webhookSecret)
    if err != nil {
        http.Error(w, "Invalid signature", 401)
        return
    }
    
    switch event.Type {
    case "return.completed":
        handleReturnCompleted(event.Data)
    case "refund.issued":
        handleRefundIssued(event.Data)
    }
    
    w.WriteHeader(200)
}`}</code>
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
              <code className="text-foreground">{`taxReturn, err := client.TaxReturns.Get(ctx, "return_123")
if err != nil {
    if taxuErr, ok := err.(*taxu.Error); ok {
        switch taxuErr.Code {
        case "not_found":
            fmt.Println("Tax return not found")
        case "rate_limit":
            fmt.Println("Rate limit exceeded")
        case "invalid_request":
            fmt.Printf("Invalid request: %s\\n", taxuErr.Message)
        default:
            fmt.Printf("API error: %s\\n", taxuErr.Message)
        }
    } else {
        log.Fatal(err)
    }
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
client := taxu.NewClient(
    "your_api_key",
    taxu.WithBaseURL("https://api.taxu.ai/v1"),
    taxu.WithTimeout(30*time.Second),
    taxu.WithRetries(3),
    taxu.WithHTTPClient(&http.Client{
        Transport: &http.Transport{
            MaxIdleConns:    10,
            IdleConnTimeout: 90 * time.Second,
        },
    }),
)`}</code>
            </pre>
          </div>
        </section>

        {/* Resources */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Resources</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <Link
              href="https://github.com/multivitaminds/taxu-go"
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
              href="https://pkg.go.dev/github.com/multivitaminds/taxu-go"
              className="bg-card border border-border rounded-lg p-6 hover:border-primary transition-colors"
            >
              <h3 className="font-semibold mb-2">Go Package Docs</h3>
              <p className="text-sm text-muted-foreground">Full package documentation</p>
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
          <p className="text-muted-foreground mb-6">
            Get your API key and start integrating Taxu into your Go application
          </p>
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
