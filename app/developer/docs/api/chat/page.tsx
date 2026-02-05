"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function ChatAPIPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold mb-4">Chat API</h1>
        <p className="text-lg text-muted-foreground">
          Integrate conversational AI tax assistance into your application with streaming responses.
        </p>
      </div>

      <Card className="p-8">
        <div className="flex items-center gap-3 mb-4">
          <Badge variant="default">POST</Badge>
          <code className="text-lg">/v1/chat</code>
        </div>
        <p className="text-muted-foreground mb-6">
          Send messages to AI tax agents and receive streaming responses in real-time.
        </p>

        <h3 className="font-semibold mb-3">Request Parameters</h3>
        <div className="space-y-3 mb-6">
          <div className="border-l-2 border-primary pl-4">
            <p className="font-mono text-sm mb-1">
              messages <span className="text-muted-foreground">(required)</span>
            </p>
            <p className="text-sm text-muted-foreground">Array of message objects with role and content</p>
          </div>
          <div className="border-l-2 border-muted pl-4">
            <p className="font-mono text-sm mb-1">
              agent <span className="text-muted-foreground">(optional)</span>
            </p>
            <p className="text-sm text-muted-foreground">
              Agent name: Sophie, Leo, Riley, Kai, Jordan. Default: Sophie
            </p>
          </div>
          <div className="border-l-2 border-muted pl-4">
            <p className="font-mono text-sm mb-1">
              model <span className="text-muted-foreground">(optional)</span>
            </p>
            <p className="text-sm text-muted-foreground">
              AI model: openai/gpt-4o-mini, openai/gpt-4o. Default: gpt-4o-mini
            </p>
          </div>
        </div>

        <h3 className="font-semibold mb-3">Example Request</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm mb-6">
          <code>{String.raw`curl https://api.taxu.io/v1/chat \
  -H "Authorization: Bearer your_api_key" \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {
        "role": "user",
        "content": "Can I deduct my home office expenses?"
      }
    ],
    "agent": "Riley"
  }'`}</code>
        </pre>

        <h3 className="font-semibold mb-3">Response (Streaming)</h3>
        <p className="text-sm text-muted-foreground mb-3">
          The API returns a streaming text response. Each chunk is sent as plain text:
        </p>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">
          <code>{String.raw`Yes, you can deduct home office expenses if you meet certain criteria...`}</code>
        </pre>
      </Card>

      <Card className="p-8">
        <h2 className="text-2xl font-bold mb-4">Available Agents</h2>
        <div className="space-y-4">
          <div className="border-l-2 border-primary pl-4">
            <h3 className="font-semibold mb-1">Sophie - Filing Assistant</h3>
            <p className="text-sm text-muted-foreground">
              Friendly and patient, helps with tax filing basics and explains complex concepts simply.
            </p>
          </div>
          <div className="border-l-2 border-primary pl-4">
            <h3 className="font-semibold mb-1">Jordan - Deduction Detective</h3>
            <p className="text-sm text-muted-foreground">
              Analytical expert who finds every legitimate deduction and credit opportunity.
            </p>
          </div>
          <div className="border-l-2 border-primary pl-4">
            <h3 className="font-semibold mb-1">Kai - Audit Shield</h3>
            <p className="text-sm text-muted-foreground">
              Meticulous specialist focused on minimizing audit risk and ensuring compliance.
            </p>
          </div>
          <div className="border-l-2 border-primary pl-4">
            <h3 className="font-semibold mb-1">Riley - Business Tax Pro</h3>
            <p className="text-sm text-muted-foreground">
              Savvy business tax specialist for self-employment and corporate structures.
            </p>
          </div>
          <div className="border-l-2 border-primary pl-4">
            <h3 className="font-semibold mb-1">Leo - Tax Strategist</h3>
            <p className="text-sm text-muted-foreground">
              Sophisticated planner for long-term tax optimization and wealth management.
            </p>
          </div>
        </div>
      </Card>

      <Card className="p-8 bg-muted/50">
        <h2 className="text-2xl font-bold mb-4">Integration Example</h2>
        <pre className="bg-background p-4 rounded-lg overflow-x-auto text-sm">
          <code>{String.raw`// JavaScript/Node.js example with streaming
const response = await fetch('https://api.taxu.io/v1/chat', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer your_api_key',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    messages: [
      { role: 'user', content: 'What deductions can I claim?' }
    ],
    agent: 'Riley'
  })
});

const reader = response.body.getReader();
const decoder = new TextDecoder();

while (true) {
  const { done, value } = await reader.read();
  if (done) break;
  
  const chunk = decoder.decode(value);
  console.log(chunk); // Process each chunk as it arrives
}`}</code>
        </pre>
      </Card>
    </div>
  )
}
