export default function CLIInstallPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Header */}
        <div className="mb-12">
          <div className="text-sm text-slate-400 mb-4">
            <a href="/developer" className="hover:text-blue-400 transition-colors">
              Developer resources
            </a>
            <span className="mx-2">/</span>
            <a href="/developer/docs/cli" className="hover:text-blue-400 transition-colors">
              Taxu CLI
            </a>
            <span className="mx-2">/</span>
            <span className="text-slate-300">Install</span>
          </div>
          <h1 className="text-5xl font-bold text-white mb-6">Install the Taxu CLI</h1>
          <p className="text-xl text-slate-300 max-w-3xl">
            Install the Taxu CLI on macOS, Windows, or Linux to manage your Taxu resources from the command line.
          </p>
        </div>

        {/* Installation Methods */}
        <div className="space-y-12">
          {/* macOS */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center">
                <svg className="w-6 h-6 text-slate-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-white">macOS</h2>
            </div>

            <div className="space-y-6">
              {/* Homebrew */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Homebrew (Recommended)</h3>
                <div className="bg-slate-950 rounded-lg p-4 font-mono text-sm mb-3">
                  <span className="text-blue-400">brew install taxu/tap/taxu</span>
                </div>
                <p className="text-slate-400 text-sm">
                  The easiest way to install and keep the Taxu CLI up to date on macOS.
                </p>
              </div>

              {/* Manual Installation */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Manual Installation</h3>
                <div className="bg-slate-950 rounded-lg p-4 font-mono text-sm space-y-2">
                  <div>
                    <span className="text-slate-400"># Download the latest release</span>
                  </div>
                  <div>
                    <span className="text-blue-400">
                      curl -L https://github.com/taxu/taxu-cli/releases/latest/download/taxu-macos.tar.gz -o taxu.tar.gz
                    </span>
                  </div>
                  <div className="mt-2">
                    <span className="text-slate-400"># Extract and install</span>
                  </div>
                  <div>
                    <span className="text-blue-400">tar -xzf taxu.tar.gz</span>
                  </div>
                  <div>
                    <span className="text-blue-400">sudo mv taxu /usr/local/bin/</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Windows */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center">
                <svg className="w-6 h-6 text-slate-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-12.9-1.801" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-white">Windows</h2>
            </div>

            <div className="space-y-6">
              {/* Scoop */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Scoop (Recommended)</h3>
                <div className="bg-slate-950 rounded-lg p-4 font-mono text-sm space-y-2">
                  <div>
                    <span className="text-blue-400">scoop bucket add taxu https://github.com/taxu/scoop-taxu</span>
                  </div>
                  <div>
                    <span className="text-blue-400">scoop install taxu</span>
                  </div>
                </div>
              </div>

              {/* MSI Installer */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">MSI Installer</h3>
                <p className="text-slate-400 text-sm mb-3">
                  Download and run the Windows installer for a guided setup experience.
                </p>
                <a
                  href="https://github.com/taxu/taxu-cli/releases/latest/download/taxu-windows-x64.msi"
                  className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Download Taxu CLI for Windows
                </a>
              </div>

              {/* PowerShell */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">PowerShell</h3>
                <div className="bg-slate-950 rounded-lg p-4 font-mono text-sm">
                  <span className="text-blue-400">iwr https://taxu.com/install.ps1 | iex</span>
                </div>
              </div>
            </div>
          </div>

          {/* Linux */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center">
                <svg className="w-6 h-6 text-slate-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.504 0c-.155 0-.315.008-.480.021-4.226.333-3.105 4.807-3.17 6.298-.076 1.092-.3 1.953-1.05 3.02-.885 1.051-2.127 2.75-2.716 4.521-.278.84-.415 1.117-.971 2.132-.35.64-.566 1.555-.566 2.212 0 1.524 1.084 2.765 2.42 2.765.833 0 1.556-.375 2.071-.971.515-.596.771-1.36.771-2.133 0-.428-.061-.84-.183-1.224l.015-.015c.183-.386.366-.771.549-1.157.731-1.545 1.524-3.226 2.517-4.807 1.478-2.35 2.132-4.807 2.132-6.298C13.347 2.765 12.504 0 12.504 0z" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-white">Linux</h2>
            </div>

            <div className="space-y-6">
              {/* Debian/Ubuntu */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Debian/Ubuntu (APT)</h3>
                <div className="bg-slate-950 rounded-lg p-4 font-mono text-sm space-y-2">
                  <div>
                    <span className="text-slate-400"># Add Taxu's package repository</span>
                  </div>
                  <div>
                    <span className="text-blue-400">
                      curl -fsSL https://packages.taxu.com/gpg.key | sudo gpg --dearmor -o /usr/share/keyrings/taxu.gpg
                    </span>
                  </div>
                  <div>
                    <span className="text-blue-400">
                      echo "deb [signed-by=/usr/share/keyrings/taxu.gpg] https://packages.taxu.com/apt stable main" |
                      sudo tee /etc/apt/sources.list.d/taxu.list
                    </span>
                  </div>
                  <div className="mt-2">
                    <span className="text-slate-400"># Install Taxu CLI</span>
                  </div>
                  <div>
                    <span className="text-blue-400">sudo apt update && sudo apt install taxu</span>
                  </div>
                </div>
              </div>

              {/* Fedora/RHEL */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Fedora/RHEL (YUM)</h3>
                <div className="bg-slate-950 rounded-lg p-4 font-mono text-sm space-y-2">
                  <div>
                    <span className="text-slate-400"># Add repository</span>
                  </div>
                  <div>
                    <span className="text-blue-400">sudo rpm --import https://packages.taxu.com/gpg.key</span>
                  </div>
                  <div>
                    <span className="text-blue-400">
                      sudo yum-config-manager --add-repo https://packages.taxu.com/yum/taxu.repo
                    </span>
                  </div>
                  <div className="mt-2">
                    <span className="text-slate-400"># Install</span>
                  </div>
                  <div>
                    <span className="text-blue-400">sudo yum install taxu</span>
                  </div>
                </div>
              </div>

              {/* Binary Installation */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Binary Installation</h3>
                <div className="bg-slate-950 rounded-lg p-4 font-mono text-sm space-y-2">
                  <div>
                    <span className="text-blue-400">
                      curl -L https://github.com/taxu/taxu-cli/releases/latest/download/taxu-linux-x64.tar.gz -o
                      taxu.tar.gz
                    </span>
                  </div>
                  <div>
                    <span className="text-blue-400">tar -xzf taxu.tar.gz</span>
                  </div>
                  <div>
                    <span className="text-blue-400">sudo mv taxu /usr/local/bin/</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* npm/yarn */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center">
                <svg className="w-6 h-6 text-slate-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M0 0v24h24V0M6.167 3.5h11.666v6.167h-5.833v5.833H6.167" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-white">npm / yarn</h2>
            </div>

            <div className="space-y-4">
              <p className="text-slate-400">
                Install the Taxu CLI as a Node.js package for use in JavaScript/TypeScript projects.
              </p>
              <div className="bg-slate-950 rounded-lg p-4 font-mono text-sm space-y-2">
                <div>
                  <span className="text-slate-400"># npm</span>
                </div>
                <div>
                  <span className="text-blue-400">npm install -g @taxu/cli</span>
                </div>
                <div className="mt-2">
                  <span className="text-slate-400"># yarn</span>
                </div>
                <div>
                  <span className="text-blue-400">yarn global add @taxu/cli</span>
                </div>
                <div className="mt-2">
                  <span className="text-slate-400"># pnpm</span>
                </div>
                <div>
                  <span className="text-blue-400">pnpm add -g @taxu/cli</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Verify Installation */}
        <div className="mt-12 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-white mb-4">Verify Installation</h2>
          <p className="text-slate-300 mb-4">After installation, verify that the Taxu CLI is working correctly:</p>
          <div className="bg-slate-950 rounded-lg p-4 font-mono text-sm mb-4">
            <div>
              <span className="text-blue-400">taxu --version</span>
            </div>
            <div className="text-green-400 mt-2">taxu version 2.8.0</div>
          </div>
          <p className="text-slate-400 text-sm">
            If you see the version number, you're all set! Continue to{" "}
            <a href="/developer/docs/cli/usage" className="text-blue-400 hover:text-blue-300">
              CLI Usage
            </a>{" "}
            to learn how to use the Taxu CLI.
          </p>
        </div>

        {/* Next Steps */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-white mb-6">Next Steps</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <a
              href="/developer/docs/cli/login"
              className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 hover:border-blue-500/50 transition-all"
            >
              <h3 className="text-lg font-semibold text-white mb-2">Login to Taxu</h3>
              <p className="text-slate-400 text-sm">Authenticate the CLI with your Taxu account</p>
            </a>
            <a
              href="/developer/docs/cli/usage"
              className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 hover:border-blue-500/50 transition-all"
            >
              <h3 className="text-lg font-semibold text-white mb-2">CLI Usage Guide</h3>
              <p className="text-slate-400 text-sm">Learn essential CLI commands and workflows</p>
            </a>
            <a
              href="/developer/docs/cli/autocomplete"
              className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 hover:border-blue-500/50 transition-all"
            >
              <h3 className="text-lg font-semibold text-white mb-2">Enable Autocomplete</h3>
              <p className="text-slate-400 text-sm">Set up shell autocompletion for faster development</p>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
