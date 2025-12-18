"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function ReactNativeSDKPageClient() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-4">React Native SDK</h1>
        <p className="text-xl text-muted-foreground mb-4">
          Official React Native library for the Taxu API for iOS and Android apps.
        </p>
        <div className="flex gap-2">
          <Badge>v1.0.0</Badge>
          <Badge variant="outline">iOS</Badge>
          <Badge variant="outline">Android</Badge>
        </div>
      </div>

      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">Installation</h2>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
          <code>npm install @taxu/react-native</code>
        </pre>
      </Card>

      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">Quick Start</h2>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
          <code>{`import { TaxuClient } from '@taxu/react-native';

const client = new TaxuClient({
  apiKey: 'your_api_key',
});

// Calculate tax refund
const refund = await client.refunds.estimate({
  income: 75000,
  filingStatus: 'single',
  deductions: ['standard']
});`}</code>
        </pre>
      </Card>

      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">Key Features</h2>
        <ul className="space-y-2 list-disc list-inside">
          <li>Full TypeScript support with type definitions</li>
          <li>Works with both iOS and Android platforms</li>
          <li>Async/await API for all operations</li>
          <li>Automatic error handling and retries</li>
          <li>Support for React Native 0.64+</li>
        </ul>
      </Card>

      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">Platform-Specific Setup</h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold mb-2">iOS</h3>
            <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
              <code>cd ios && pod install</code>
            </pre>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Android</h3>
            <p className="text-muted-foreground">No additional setup required.</p>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">Need Help?</h2>
        <p className="text-muted-foreground mb-4">
          Check out our comprehensive documentation or reach out to our support team.
        </p>
        <div className="flex gap-4">
          <a href="/developer/docs" className="text-primary hover:underline">
            View Documentation
          </a>
          <a href="/contact" className="text-primary hover:underline">
            Contact Support
          </a>
        </div>
      </Card>
    </div>
  )
}
