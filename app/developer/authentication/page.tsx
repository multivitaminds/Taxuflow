import { Shield, Key, Lock } from "lucide-react"

export default function AuthenticationPage() {
  return (
    <div className="max-w-4xl">
      <h1 className="text-4xl font-bold mb-4">Authentication</h1>
      <p className="text-xl text-muted-foreground mb-8">Secure your API requests with API keys and best practices</p>

      {/* API Keys */}
      <div className="rounded-2xl border border-border bg-card p-8 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <Key className="w-6 h-6 text-accent" />
          <h2 className="text-2xl font-bold">API Keys</h2>
        </div>
        <p className="text-muted-foreground mb-4">
          Authenticate your API requests by including your API key in the Authorization header.
        </p>
        <div className="rounded-lg bg-background border border-border p-4 font-mono text-sm mb-4">
          <div className="text-muted-foreground mb-2"># Example Request</div>
          <div>curl https://api.taxu.io/v1/returns \</div>
          <div className="pl-4">
            -H <div className="text-yellow-300 inline">"Authorization: Bearer YOUR_API_KEY"</div> \
          </div>
          <div className="pl-4">
            -H <div className="text-yellow-300 inline">"Content-Type: application/json"</div>
          </div>
        </div>
      </div>

      {/* Test vs Live Keys */}
      <div className="rounded-2xl border border-border bg-card p-8 mb-6">
        <h2 className="text-2xl font-bold mb-4">Test vs Live Keys</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 rounded-lg border border-border bg-background">
            <h3 className="font-semibold mb-2">Test Keys (pk_test_...)</h3>
            <p className="text-sm text-muted-foreground">
              Use test keys for development. No real tax returns are filed.
            </p>
          </div>
          <div className="p-4 rounded-lg border border-border bg-background">
            <h3 className="font-semibold mb-2">Live Keys (pk_live_...)</h3>
            <p className="text-sm text-muted-foreground">
              Use live keys in production. Real tax returns are filed with the IRS.
            </p>
          </div>
        </div>
      </div>

      {/* Security Best Practices */}
      <div className="rounded-2xl border border-accent/30 bg-card p-8 glow-neon">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="w-6 h-6 text-accent" />
          <h2 className="text-2xl font-bold">Security Best Practices</h2>
        </div>
        <ul className="space-y-3">
          <li className="flex items-start gap-3">
            <Lock className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold mb-1">Never expose API keys in client-side code</p>
              <p className="text-sm text-muted-foreground">Always make API calls from your server</p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <Lock className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold mb-1">Store keys securely</p>
              <p className="text-sm text-muted-foreground">
                Use environment variables, never commit to version control
              </p>
            </div>
          </li>
          <li className="flex items-start gap-3">
            <Lock className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold mb-1">Rotate keys regularly</p>
              <p className="text-sm text-muted-foreground">Generate new keys periodically and revoke old ones</p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  )
}
