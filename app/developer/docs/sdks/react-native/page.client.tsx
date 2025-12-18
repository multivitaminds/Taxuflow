"use client"

import Link from "next/link"
import { Copy, Terminal, ExternalLink, Smartphone } from "lucide-react"

export default function ReactNativeSDKPageClient() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <div className="border-b border-white/10 bg-slate-950/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/developer/docs/sdks" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-pink-400 to-purple-500 flex items-center justify-center">
                <Smartphone className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="text-sm font-semibold text-white">React Native SDK</div>
                <div className="text-xs text-slate-400">iOS & Android Support</div>
              </div>
            </Link>
            <div className="flex items-center gap-4">
              <Link
                href="https://www.npmjs.com/package/@taxu/react-native"
                target="_blank"
                className="text-sm text-slate-300 hover:text-white transition-colors flex items-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                npm
              </Link>
              <Link
                href="/developer/api-explorer"
                className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-sm font-medium transition-colors"
              >
                API Explorer
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-1">
              <a href="#installation" className="block px-3 py-2 text-sm text-purple-400 bg-purple-500/10 rounded-lg">
                Installation
              </a>
              <a
                href="#setup"
                className="block px-3 py-2 text-sm text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              >
                Setup
              </a>
              <a
                href="#usage"
                className="block px-3 py-2 text-sm text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              >
                Usage
              </a>
              <a
                href="#hooks"
                className="block px-3 py-2 text-sm text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              >
                Hooks
              </a>
              <a
                href="#examples"
                className="block px-3 py-2 text-sm text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
              >
                Examples
              </a>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-16">
            <section>
              <h1 className="text-4xl font-bold text-white mb-6">React Native SDK</h1>

              <div className="space-y-6 mb-8">
                <p className="text-lg text-slate-300">
                  Build cross-platform mobile tax and finance applications for iOS and Android with the Taxu React
                  Native SDK.
                </p>

                {/* What is the SDK explainer */}
                <div className="p-6 rounded-2xl bg-gradient-to-br from-pink-500/5 to-purple-500/5 border border-white/10">
                  <h3 className="text-lg font-semibold text-white mb-3">What is the Taxu React Native SDK?</h3>
                  <p className="text-slate-300 leading-relaxed mb-4">
                    The Taxu React Native SDK is a comprehensive mobile library for building tax and financial
                    applications on both iOS and Android platforms. It provides native performance with React
                    Native&apos;s familiar development experience, including mobile-optimized hooks, components, and
                    utilities.
                  </p>
                  <p className="text-slate-300 leading-relaxed">
                    Perfect for mobile-first applications, the React Native SDK handles platform-specific features like
                    camera access for document scanning, biometric authentication, push notifications for filing
                    updates, and offline-first data management. Build sophisticated mobile tax apps with native
                    performance and cross-platform code sharing.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.08]">
                    <h4 className="text-sm font-semibold text-white mb-2">Ideal For:</h4>
                    <ul className="text-sm text-slate-400 space-y-1.5">
                      <li>• iOS and Android mobile apps</li>
                      <li>• Cross-platform tax applications</li>
                      <li>• On-the-go document scanning</li>
                      <li>• Mobile-first financial tools</li>
                    </ul>
                  </div>

                  <div className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.08]">
                    <h4 className="text-sm font-semibold text-white mb-2">Mobile Features:</h4>
                    <ul className="text-sm text-slate-400 space-y-1.5">
                      <li>• Camera & document scanning</li>
                      <li>• Biometric authentication</li>
                      <li>• Offline-first support</li>
                      <li>• Push notifications</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="px-4 py-2 rounded-lg bg-pink-500/10 border border-pink-500/20 text-pink-400 text-sm font-medium">
                  v1.5.0
                </div>
                <div className="px-4 py-2 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm font-medium">
                  React Native 0.72+
                </div>
              </div>
            </section>

            {/* Installation */}
            <section id="installation" className="scroll-mt-24">
              <h2 className="text-3xl font-bold text-white mb-6">Installation</h2>

              <div className="space-y-4">
                <div className="rounded-xl border border-white/10 bg-slate-900/50 overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 bg-slate-950/50 border-b border-white/10">
                    <div className="flex items-center gap-2">
                      <Terminal className="w-4 h-4 text-slate-400" />
                      <span className="text-sm text-slate-400">npm</span>
                    </div>
                    <Copy className="w-4 h-4 text-slate-400 hover:text-white cursor-pointer" />
                  </div>
                  <div className="p-4">
                    <code className="text-green-400 font-mono text-sm">npm install @taxu/react-native</code>
                  </div>
                </div>

                <div className="rounded-xl border border-white/10 bg-slate-900/50 overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 bg-slate-950/50 border-b border-white/10">
                    <div className="flex items-center gap-2">
                      <Terminal className="w-4 h-4 text-slate-400" />
                      <span className="text-sm text-slate-400">iOS setup</span>
                    </div>
                    <Copy className="w-4 h-4 text-slate-400 hover:text-white cursor-pointer" />
                  </div>
                  <div className="p-4">
                    <code className="text-green-400 font-mono text-sm">cd ios && pod install</code>
                  </div>
                </div>
              </div>
            </section>

            {/* Setup */}
            <section id="setup" className="scroll-mt-24">
              <h2 className="text-3xl font-bold text-white mb-6">Setup</h2>
              <p className="text-slate-300 mb-6">Wrap your app with the TaxuProvider in your root component:</p>

              <div className="rounded-xl border border-white/10 bg-slate-900/50 overflow-hidden">
                <div className="p-6">
                  <pre className="font-mono text-sm text-slate-200 leading-relaxed">
                    {`import { TaxuProvider } from '@taxu/react-native';

export default function App() {
  return (
    <TaxuProvider apiKey="your_publishable_key">
      <YourApp />
    </TaxuProvider>
  );
}`}
                  </pre>
                </div>
              </div>
            </section>

            {/* Usage */}
            <section id="usage" className="scroll-mt-24">
              <h2 className="text-3xl font-bold text-white mb-6">Usage</h2>
              <p className="text-slate-300 mb-6">Use the useTaxu hook to access Taxu API methods:</p>

              <div className="rounded-xl border border-white/10 bg-slate-900/50 overflow-hidden">
                <div className="p-6">
                  <pre className="font-mono text-sm text-slate-200 leading-relaxed">
                    {`import { useTaxu } from '@taxu/react-native';
import { View, Button, Text } from 'react-native';

export default function TaxScreen() {
  const { submitForm1099, loading } = useTaxu();

  const handleSubmit = async () => {
    const result = await submitForm1099({
      year: 2024,
      recipientName: 'John Doe',
      recipientTIN: '123-45-6789',
      amount: 5000
    });
    console.log('Form submitted:', result);
  };

  return (
    <View>
      <Button 
        title="Submit Form" 
        onPress={handleSubmit}
        disabled={loading}
      />
    </View>
  );
}`}
                  </pre>
                </div>
              </div>
            </section>

            {/* Hooks */}
            <section id="hooks" className="scroll-mt-24">
              <h2 className="text-3xl font-bold text-white mb-6">Hooks</h2>

              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">useTaxu</h3>
                  <p className="text-slate-300 mb-4">
                    Access all Taxu API methods with built-in loading and error states.
                  </p>
                  <div className="rounded-xl border border-white/10 bg-slate-900/50 overflow-hidden">
                    <div className="p-6">
                      <pre className="font-mono text-sm text-slate-200 leading-relaxed">
                        {`const { 
  submitForm1099,
  getFormStatus,
  uploadDocument,
  loading,
  error 
} = useTaxu();`}
                      </pre>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-semibold text-white mb-4">useDocumentScanner</h3>
                  <p className="text-slate-300 mb-4">Mobile-optimized document scanning with camera access.</p>
                  <div className="rounded-xl border border-white/10 bg-slate-900/50 overflow-hidden">
                    <div className="p-6">
                      <pre className="font-mono text-sm text-slate-200 leading-relaxed">
                        {`import { useDocumentScanner } from '@taxu/react-native';

const { scanDocument, scannedImage } = useDocumentScanner();

const handleScan = async () => {
  const result = await scanDocument({
    documentType: 'w2',
    year: 2024
  });
};`}
                      </pre>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Examples */}
            <section id="examples" className="scroll-mt-24">
              <h2 className="text-3xl font-bold text-white mb-6">Complete Example</h2>

              <div className="rounded-xl border border-white/10 bg-slate-900/50 overflow-hidden">
                <div className="p-6">
                  <pre className="font-mono text-sm text-slate-200 leading-relaxed">
                    {`import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTaxu, useDocumentScanner } from '@taxu/react-native';

export default function TaxFilingScreen() {
  const { submitForm1099, loading, error } = useTaxu();
  const { scanDocument } = useDocumentScanner();

  const handleScanAndSubmit = async () => {
    // Scan document
    const scanned = await scanDocument({ documentType: 'w2' });
    
    // Submit to Taxu
    if (scanned.success) {
      await submitForm1099({
        year: 2024,
        documentId: scanned.id,
        recipientName: 'John Doe',
        recipientTIN: '123-45-6789',
        amount: 5000
      });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tax Filing</Text>
      <TouchableOpacity 
        style={styles.button}
        onPress={handleScanAndSubmit}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Processing...' : 'Scan & Submit'}
        </Text>
      </TouchableOpacity>
      {error && <Text style={styles.error}>{error.message}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  button: { 
    backgroundColor: '#8B5CF6', 
    padding: 16, 
    borderRadius: 8 
  },
  buttonText: { color: 'white', textAlign: 'center', fontSize: 16 },
  error: { color: 'red', marginTop: 10 }
});`}
                  </pre>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
