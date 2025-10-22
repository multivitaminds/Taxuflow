"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Shield, Key, Lock, CheckCircle2, AlertCircle, Code2 } from "lucide-react"

export default function OAuthPage() {
  const authorizationExample = `GET https://api.taxu.io/oauth/authorize?
  client_id=YOUR_CLIENT_ID&
  redirect_uri=https://yourapp.com/callback&
  response_type=code&
  scope=tax:read tax:write documents:read&
  state=random_string_for_security`

  const tokenExample = `POST https://api.taxu.io/oauth/token
Content-Type: application/x-www-form-urlencoded

grant_type=authorization_code&
code=AUTHORIZATION_CODE&
client_id=YOUR_CLIENT_ID&
client_secret=YOUR_CLIENT_SECRET&
redirect_uri=https://yourapp.com/callback`

  const refreshExample = `POST https://api.taxu.io/oauth/token
Content-Type: application/x-www-form-urlencoded

grant_type=refresh_token&
refresh_token=YOUR_REFRESH_TOKEN&
client_id=YOUR_CLIENT_ID&
client_secret=YOUR_CLIENT_SECRET`

  const scopes = [
    { name: "tax:read", description: "Read tax returns and calculations" },
    { name: "tax:write", description: "Create and update tax returns" },
    { name: "documents:read", description: "Read uploaded documents" },
    { name: "documents:write", description: "Upload and manage documents" },
    { name: "refunds:read", description: "Read refund estimates" },
    { name: "accounting:read", description: "Read accounting data" },
    { name: "accounting:write", description: "Create and update accounting records" },
    { name: "webhooks:read", description: "Read webhook configurations" },
    { name: "webhooks:write", description: "Create and manage webhooks" },
  ]

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      <div className="max-w-5xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <Badge className="mb-4 bg-purple-500/10 text-purple-400 border-purple-500/20">OAuth 2.0</Badge>
          <h1 className="text-4xl font-bold mb-4">OAuth 2.0 Authentication</h1>
          <p className="text-xl text-gray-400">
            Allow users to securely authorize your application to access their Taxu data
          </p>
        </div>

        {/* Overview */}
        <Card className="bg-[#111] border-gray-800 p-8 mb-8">
          <div className="flex items-start gap-4 mb-6">
            <Shield className="w-8 h-8 text-purple-400 flex-shrink-0" />
            <div>
              <h2 className="text-2xl font-bold mb-2">Why OAuth 2.0?</h2>
              <p className="text-gray-400">
                OAuth 2.0 allows your application to access user data without storing their credentials. Users authorize
                your app through Taxu's secure login, and you receive an access token to make API requests on their
                behalf.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-[#0A0A0A] p-4 rounded-lg border border-gray-800">
              <Lock className="w-6 h-6 text-green-400 mb-2" />
              <h3 className="font-semibold mb-1">Secure</h3>
              <p className="text-sm text-gray-400">No password storage required</p>
            </div>
            <div className="bg-[#0A0A0A] p-4 rounded-lg border border-gray-800">
              <Key className="w-6 h-6 text-blue-400 mb-2" />
              <h3 className="font-semibold mb-1">Scoped Access</h3>
              <p className="text-sm text-gray-400">Request only needed permissions</p>
            </div>
            <div className="bg-[#0A0A0A] p-4 rounded-lg border border-gray-800">
              <CheckCircle2 className="w-6 h-6 text-purple-400 mb-2" />
              <h3 className="font-semibold mb-1">User Control</h3>
              <p className="text-sm text-gray-400">Users can revoke access anytime</p>
            </div>
          </div>
        </Card>

        {/* Authorization Flow */}
        <Card className="bg-[#111] border-gray-800 p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6">Authorization Flow</h2>

          <div className="space-y-6">
            {/* Step 1 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
                1
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-2">Redirect User to Authorization URL</h3>
                <p className="text-gray-400 mb-4">
                  Send users to Taxu's authorization page with your client ID and requested scopes.
                </p>
                <div className="bg-[#0A0A0A] p-4 rounded-lg border border-gray-800 overflow-x-auto">
                  <pre className="text-sm text-gray-300">{authorizationExample}</pre>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
                2
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-2">User Authorizes Your Application</h3>
                <p className="text-gray-400">
                  The user logs in to Taxu and approves the requested permissions. They're then redirected back to your
                  application with an authorization code.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
                3
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-2">Exchange Code for Access Token</h3>
                <p className="text-gray-400 mb-4">
                  Make a server-side request to exchange the authorization code for an access token.
                </p>
                <div className="bg-[#0A0A0A] p-4 rounded-lg border border-gray-800 overflow-x-auto">
                  <pre className="text-sm text-gray-300">{tokenExample}</pre>
                </div>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold">
                4
              </div>
              <div className="flex-1">
                <h3 className="font-semibold mb-2">Make API Requests</h3>
                <p className="text-gray-400">
                  Use the access token to make authenticated API requests on behalf of the user.
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Scopes */}
        <Card className="bg-[#111] border-gray-800 p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6">Available Scopes</h2>
          <p className="text-gray-400 mb-6">
            Request only the permissions your application needs. Users will see which scopes you're requesting during
            authorization.
          </p>

          <div className="space-y-3">
            {scopes.map((scope) => (
              <div
                key={scope.name}
                className="flex items-center justify-between p-4 bg-[#0A0A0A] rounded-lg border border-gray-800"
              >
                <div>
                  <code className="text-purple-400 font-mono text-sm">{scope.name}</code>
                  <p className="text-sm text-gray-400 mt-1">{scope.description}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Token Refresh */}
        <Card className="bg-[#111] border-gray-800 p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6">Refreshing Access Tokens</h2>
          <p className="text-gray-400 mb-4">
            Access tokens expire after 1 hour. Use the refresh token to obtain a new access token without requiring the
            user to re-authorize.
          </p>

          <div className="bg-[#0A0A0A] p-4 rounded-lg border border-gray-800 overflow-x-auto mb-4">
            <pre className="text-sm text-gray-300">{refreshExample}</pre>
          </div>

          <div className="flex items-start gap-3 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-300">
              <strong>Best Practice:</strong> Refresh tokens are valid for 90 days. Store them securely and never expose
              them in client-side code.
            </div>
          </div>
        </Card>

        {/* Security Best Practices */}
        <Card className="bg-[#111] border-gray-800 p-8">
          <h2 className="text-2xl font-bold mb-6">Security Best Practices</h2>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold mb-1">Use HTTPS</h3>
                <p className="text-sm text-gray-400">Always use HTTPS for redirect URIs and API requests</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold mb-1">Validate State Parameter</h3>
                <p className="text-sm text-gray-400">Use the state parameter to prevent CSRF attacks</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold mb-1">Store Tokens Securely</h3>
                <p className="text-sm text-gray-400">Never expose access or refresh tokens in client-side code</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="font-semibold mb-1">Request Minimal Scopes</h3>
                <p className="text-sm text-gray-400">Only request the permissions your application actually needs</p>
              </div>
            </div>
          </div>
        </Card>

        {/* CTA */}
        <div className="mt-12 text-center">
          <Button className="bg-purple-600 hover:bg-purple-700">
            <Code2 className="w-4 h-4 mr-2" />
            View OAuth Examples
          </Button>
        </div>
      </div>
    </div>
  )
}
