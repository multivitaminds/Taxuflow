"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { FileText, Check, Clock, Webhook, ChevronRight, Search, Copy, Menu } from "lucide-react"
import { useState, useEffect } from "react"
import Link from "next/link"

export default function DocumentsAPIPage() {
  const [activeSection, setActiveSection] = useState("upload")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Scrollspy logic
  useEffect(() => {
    const handleScroll = () => {
      const sections = ["upload", "retrieve", "delete", "supported-types", "processing-details"]
      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const rect = element.getBoundingClientRect()
          if (rect.top >= 0 && rect.top <= 300) {
            setActiveSection(section)
            break
          }
        }
      }
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-[#f6f9fc] font-sans text-[#0a2540]">
      {/* Sticky Sidebar Navigation */}
      <aside
        className={`fixed bottom-0 top-16 left-0 z-30 w-64 transform border-r border-slate-200 bg-white transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col overflow-y-auto px-4 py-6">
          <div className="relative mb-8 px-2">
            <Search className="absolute left-5 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full rounded-md border border-slate-200 bg-slate-50 py-2 pl-9 pr-4 text-sm outline-none transition-all focus:border-[#635bff] focus:bg-white focus:ring-1 focus:ring-[#635bff]"
            />
          </div>

          <nav className="space-y-6">
            <div className="px-2">
              <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Document API</h4>
              <ul className="space-y-1">
                <li>
                  <a
                    href="#upload"
                    className={`block rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                      activeSection === "upload"
                        ? "bg-[#635bff]/10 text-[#635bff]"
                        : "text-slate-600 hover:bg-slate-50 hover:text-[#0a2540]"
                    }`}
                  >
                    Upload Document
                  </a>
                </li>
                <li>
                  <a
                    href="#retrieve"
                    className={`block rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                      activeSection === "retrieve"
                        ? "bg-[#635bff]/10 text-[#635bff]"
                        : "text-slate-600 hover:bg-slate-50 hover:text-[#0a2540]"
                    }`}
                  >
                    Retrieve Document
                  </a>
                </li>
                <li>
                  <a
                    href="#delete"
                    className={`block rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                      activeSection === "delete"
                        ? "bg-[#635bff]/10 text-[#635bff]"
                        : "text-slate-600 hover:bg-slate-50 hover:text-[#0a2540]"
                    }`}
                  >
                    Delete Document
                  </a>
                </li>
              </ul>
            </div>

            <div className="px-2">
              <h4 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Reference</h4>
              <ul className="space-y-1">
                <li>
                  <a
                    href="#supported-types"
                    className={`block rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                      activeSection === "supported-types"
                        ? "bg-[#635bff]/10 text-[#635bff]"
                        : "text-slate-600 hover:bg-slate-50 hover:text-[#0a2540]"
                    }`}
                  >
                    Supported Types
                  </a>
                </li>
                <li>
                  <a
                    href="#processing-details"
                    className={`block rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                      activeSection === "processing-details"
                        ? "bg-[#635bff]/10 text-[#635bff]"
                        : "text-slate-600 hover:bg-slate-50 hover:text-[#0a2540]"
                    }`}
                  >
                    Processing Details
                  </a>
                </li>
              </ul>
            </div>
          </nav>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="sticky top-16 z-30 flex h-14 items-center justify-between border-b bg-white px-4 lg:hidden">
        <div className="flex items-center gap-2 font-bold text-[#0a2540]">
          <span className="text-sm">On this page</span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-slate-500">
          <Menu className="h-6 w-6" />
        </button>
      </div>

      {/* Main Content */}
      <main className="lg:pl-64">
        {/* API Overview Header */}
        <header className="border-b border-slate-200 bg-white px-6 py-16 lg:px-12">
          <div className="mx-auto max-w-5xl">
            <div className="mb-6 flex flex-wrap gap-2">
              <Badge
                variant="outline"
                className="border-[#635bff]/30 bg-[#635bff]/10 text-[#635bff] hover:bg-[#635bff]/20"
              >
                REST API
              </Badge>
              <Badge variant="outline" className="border-slate-200 bg-slate-50 text-slate-600">
                v1
              </Badge>
            </div>
            <h1 className="mb-4 text-4xl font-bold tracking-tight text-[#0a2540] sm:text-5xl">
              Document Processing API
            </h1>
            <p className="max-w-2xl text-lg leading-relaxed text-slate-500">
              Upload, analyze, and extract structured data from tax documents using our AI-powered OCR engine.
            </p>
          </div>
        </header>

        <div className="mx-auto max-w-6xl px-6 py-12 lg:px-12">
          <div className="space-y-24">
            {/* ENDPOINT: /upload */}
            <section id="upload" className="grid scroll-mt-24 gap-8 lg:grid-cols-2 lg:gap-12">
              {/* Left Column: Documentation */}
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <span className="rounded bg-[#0a2540] px-2 py-1 text-xs font-bold text-white uppercase tracking-wider">
                    POST
                  </span>
                  <h2 className="font-mono text-xl font-medium text-[#0a2540]">/v1/documents/upload</h2>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  Upload a tax document file for asynchronous processing. The API accepts standard image formats and
                  PDFs up to 10MB.
                </p>

                <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
                  <h3 className="border-b border-slate-100 bg-slate-50 px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">
                    Attributes
                  </h3>
                  <div className="divide-y divide-slate-100">
                    <div className="p-4">
                      <div className="mb-1 flex items-baseline gap-2">
                        <code className="font-mono text-sm font-bold text-[#0a2540]">file</code>
                        <span className="text-xs font-medium text-red-500">REQUIRED</span>
                      </div>
                      <p className="text-sm text-slate-500">
                        The binary file content to be uploaded. Supported formats: PDF, JPG, PNG.
                      </p>
                    </div>
                    <div className="p-4">
                      <div className="mb-1 flex items-baseline gap-2">
                        <code className="font-mono text-sm font-bold text-[#0a2540]">type</code>
                        <span className="text-xs font-medium text-slate-400">OPTIONAL</span>
                      </div>
                      <p className="text-sm text-slate-500">
                        A hint for the document type to improve classification accuracy.
                        <br />
                        <span className="mt-2 inline-flex gap-2">
                          <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs text-slate-600">w2</code>
                          <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs text-slate-600">1099</code>
                          <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs text-slate-600">receipt</code>
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Code Examples */}
              <div className="relative">
                <div className="sticky top-24 overflow-hidden rounded-lg bg-[#0a2540] shadow-xl ring-1 ring-black/5">
                  <div className="flex items-center justify-between border-b border-white/10 bg-white/5 px-4 py-3">
                    <div className="flex gap-1.5">
                      <div className="h-3 w-3 rounded-full bg-[#ff5f57]" />
                      <div className="h-3 w-3 rounded-full bg-[#febc2e]" />
                      <div className="h-3 w-3 rounded-full bg-[#28c840]" />
                    </div>
                    <div className="text-xs font-medium text-white/50">Request</div>
                  </div>

                  <Tabs defaultValue="curl" className="w-full">
                    <div className="flex items-center justify-between border-b border-white/10 px-2">
                      <TabsList className="h-9 bg-transparent p-0">
                        <TabsTrigger
                          value="curl"
                          className="rounded-none border-b-2 border-transparent bg-transparent px-4 pb-2 pt-2 text-xs text-white/60 data-[state=active]:border-primary data-[state=active]:text-white"
                        >
                          cURL
                        </TabsTrigger>
                        <TabsTrigger
                          value="node"
                          className="rounded-none border-b-2 border-transparent bg-transparent px-4 pb-2 pt-2 text-xs text-white/60 data-[state=active]:border-primary data-[state=active]:text-white"
                        >
                          Node.js
                        </TabsTrigger>
                        <TabsTrigger
                          value="python"
                          className="rounded-none border-b-2 border-transparent bg-transparent px-4 pb-2 pt-2 text-xs text-white/60 data-[state=active]:border-primary data-[state=active]:text-white"
                        >
                          Python
                        </TabsTrigger>
                      </TabsList>
                      <button className="p-2 text-white/40 hover:text-white">
                        <Copy className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="p-0">
                      <TabsContent value="curl" className="m-0">
                        <pre className="overflow-x-auto p-4 text-sm text-white font-mono leading-relaxed">
                          <code>
                            <span className="text-[#c792ea]">curl</span> https://api.taxu.io/v1/documents/upload \{"\n"}
                            <span className="pl-4 text-white/60">-H</span> "Authorization: Bearer sk_test_..." \{"\n"}
                            <span className="pl-4 text-white/60">-F</span> "file=@w2_2024.pdf" \{"\n"}
                            <span className="pl-4 text-white/60">-F</span> "type=w2"
                          </code>
                        </pre>
                      </TabsContent>
                      <TabsContent value="node" className="m-0">
                        <pre className="overflow-x-auto p-4 text-sm text-white font-mono leading-relaxed">
                          <code>
                            <span className="text-[#c792ea]">const</span> form ={" "}
                            <span className="text-[#82aaff]">new</span> FormData();
                            {"\n"}form.append(<span className="text-[#7fdaf7]">'file'</span>, fs.createReadStream(
                            <span className="text-[#7fdaf7]">'w2.pdf'</span>));
                            {"\n"}form.append(<span className="text-[#7fdaf7]">'type'</span>,{" "}
                            <span className="text-[#7fdaf7]">'w2'</span>);
                            {"\n"}
                            {"\n"}
                            <span className="text-[#c792ea]">await</span> axios.post(
                            <span className="text-[#7fdaf7]">'/documents/upload'</span>, form);
                          </code>
                        </pre>
                      </TabsContent>
                      <TabsContent value="python" className="m-0">
                        <pre className="overflow-x-auto p-4 text-sm text-white font-mono leading-relaxed">
                          <code>
                            files = <span className="text-[#f6f07b]">{"{"}</span>
                            <span className="text-[#7fdaf7]">'file'</span>: open(
                            <span className="text-[#7fdaf7]">'w2.pdf'</span>,{" "}
                            <span className="text-[#7fdaf7]">'rb'</span>)<span className="text-[#f6f07b]">{"}"}</span>
                            {"\n"}data = <span className="text-[#f6f07b]">{"{"}</span>
                            <span className="text-[#7fdaf7]">'type'</span>: <span className="text-[#7fdaf7]">'w2'</span>
                            <span className="text-[#f6f07b]">{"}"}</span>
                            {"\n"}requests.post(url, files=files, data=data)
                          </code>
                        </pre>
                      </TabsContent>
                    </div>
                  </Tabs>

                  <div className="border-t border-white/10 bg-white/5 p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-white/50">Response</span>
                      <span className="text-xs text-green-400">200 OK</span>
                    </div>
                    <pre className="overflow-x-auto font-mono text-sm text-emerald-400">
                      {`{
  "id": "doc_1234567890",
  "object": "document",
  "created": 1704067200,
  "status": "processing",
  "file_name": "w2_2024.pdf"
}`}
                    </pre>
                  </div>
                </div>
              </div>
            </section>

            <hr className="border-slate-200" />

            {/* ENDPOINT: /retrieve */}
            <section id="retrieve" className="grid scroll-mt-24 gap-8 lg:grid-cols-2 lg:gap-12">
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <span className="rounded bg-[#28c840] px-2 py-1 text-xs font-bold text-white uppercase tracking-wider">
                    GET
                  </span>
                  <h2 className="font-mono text-xl font-medium text-[#0a2540]">/v1/documents/:id</h2>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  Retrieves the details of an existing document. If the document processing is complete, the extracted
                  data will be included in the response.
                </p>

                <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
                  <h3 className="border-b border-slate-100 bg-slate-50 px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">
                    Parameters
                  </h3>
                  <div className="p-4">
                    <div className="mb-1 flex items-baseline gap-2">
                      <code className="font-mono text-sm font-bold text-[#0a2540]">id</code>
                      <span className="text-xs font-medium text-red-500">REQUIRED</span>
                    </div>
                    <p className="text-sm text-slate-500">The unique identifier of the document to retrieve.</p>
                  </div>
                </div>
              </div>

              <div className="relative">
                <div className="sticky top-24 overflow-hidden rounded-lg bg-[#0a2540] shadow-xl ring-1 ring-black/5">
                  <div className="flex items-center justify-between border-b border-white/10 bg-white/5 px-4 py-3">
                    <div className="flex gap-1.5">
                      <div className="h-3 w-3 rounded-full bg-[#ff5f57]" />
                      <div className="h-3 w-3 rounded-full bg-[#febc2e]" />
                      <div className="h-3 w-3 rounded-full bg-[#28c840]" />
                    </div>
                    <div className="text-xs font-medium text-white/50">Request</div>
                  </div>
                  <pre className="overflow-x-auto p-4 text-sm text-white font-mono leading-relaxed">
                    <code>
                      <span className="text-[#c792ea]">curl</span> https://api.taxu.io/v1/documents/doc_123456 \{"\n"}
                      <span className="pl-4 text-white/60">-H</span> "Authorization: Bearer sk_test_..."
                    </code>
                  </pre>

                  <div className="border-t border-white/10 bg-white/5 p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-white/50">Response</span>
                      <span className="text-xs text-green-400">200 OK</span>
                    </div>
                    <pre className="max-h-[400px] overflow-auto font-mono text-sm text-emerald-400">
                      {`{
  "id": "doc_1234567890",
  "status": "completed",
  "document_type": "w2",
  "confidence": 0.98,
  "extracted_data": {
    "employer": "ACME CORP",
    "ein": "12-3456789",
    "wages": 75000.00,
    "federal_tax": 12500.00,
    "ss_wages": 75000.00
  }
}`}
                    </pre>
                  </div>
                </div>
              </div>
            </section>

            <hr className="border-slate-200" />

            {/* ENDPOINT: /delete */}
            <section id="delete" className="grid scroll-mt-24 gap-8 lg:grid-cols-2 lg:gap-12">
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <span className="rounded bg-[#ff5f57] px-2 py-1 text-xs font-bold text-white uppercase tracking-wider">
                    DELETE
                  </span>
                  <h2 className="font-mono text-xl font-medium text-[#0a2540]">/v1/documents/:id</h2>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  Permanently deletes a document and all its extracted data. This action cannot be undone.
                </p>
              </div>

              <div className="relative">
                <div className="sticky top-24 overflow-hidden rounded-lg bg-[#0a2540] shadow-xl ring-1 ring-black/5">
                  <div className="flex items-center justify-between border-b border-white/10 bg-white/5 px-4 py-3">
                    <div className="flex gap-1.5">
                      <div className="h-3 w-3 rounded-full bg-[#ff5f57]" />
                      <div className="h-3 w-3 rounded-full bg-[#febc2e]" />
                      <div className="h-3 w-3 rounded-full bg-[#28c840]" />
                    </div>
                    <div className="text-xs font-medium text-white/50">Request</div>
                  </div>
                  <pre className="overflow-x-auto p-4 text-sm text-white font-mono leading-relaxed">
                    <code>
                      <span className="text-[#c792ea]">curl</span> -X DELETE https://api.taxu.io/v1/documents/doc_123...
                    </code>
                  </pre>
                  <div className="border-t border-white/10 bg-white/5 p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-wider text-white/50">Response</span>
                      <span className="text-xs text-green-400">200 OK</span>
                    </div>
                    <pre className="overflow-x-auto font-mono text-sm text-emerald-400">
                      {`{
  "id": "doc_1234567890",
  "deleted": true
}`}
                    </pre>
                  </div>
                </div>
              </div>
            </section>

            {/* SUPPORTED TYPES SECTION */}
            <section id="supported-types" className="scroll-mt-24">
              <div className="mb-10">
                <h2 className="mb-4 text-2xl font-bold tracking-tight text-[#0a2540]">Supported Document Types</h2>
                <p className="max-w-3xl text-lg text-slate-500">
                  Our AI model is trained on millions of tax documents to ensure high accuracy across various formats.
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card className="group border-slate-200 bg-white p-6 transition-all hover:border-[#635bff]/50 hover:shadow-md">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-[#635bff]">
                    <FileText className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 text-lg font-bold text-[#0a2540]">W-2 Forms</h3>
                  <p className="text-slate-500 leading-relaxed">
                    Standard wage and tax statements from employers. Support for multi-page PDFs.
                  </p>
                </Card>

                <Card className="group border-slate-200 bg-white p-6 transition-all hover:border-[#635bff]/50 hover:shadow-md">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                    <FileText className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 text-lg font-bold text-[#0a2540]">1099 Series</h3>
                  <p className="text-slate-500 leading-relaxed">
                    Includes 1099-NEC, 1099-MISC, 1099-INT, and 1099-DIV forms.
                  </p>
                </Card>

                <Card className="group border-slate-200 bg-white p-6 transition-all hover:border-[#635bff]/50 hover:shadow-md">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                    <FileText className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 text-lg font-bold text-[#0a2540]">Bank Statements</h3>
                  <p className="text-slate-500 leading-relaxed">
                    Extracts transactions, balances, and account info from major bank PDFs.
                  </p>
                </Card>
              </div>
            </section>

            {/* PROCESSING DETAILS SECTION */}
            <section
              id="processing-details"
              className="scroll-mt-24 rounded-2xl border border-slate-200 bg-white p-8 lg:p-12 shadow-sm"
            >
              <div className="grid gap-12 lg:grid-cols-2">
                <div>
                  <h2 className="mb-6 text-2xl font-bold tracking-tight text-[#0a2540]">AI Processing Details</h2>
                  <div className="space-y-8">
                    <div className="flex gap-5">
                      <div className="mt-1 flex h-10 w-10 flex-none items-center justify-center rounded-full bg-[#635bff]/10 text-[#635bff]">
                        <Clock className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-[#0a2540] mb-1">Processing Time</h3>
                        <p className="text-slate-600 leading-relaxed">
                          Most documents process in <span className="font-semibold text-[#0a2540]">5-15 seconds</span>.
                          Complex or multi-page PDFs may take up to 30 seconds.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-5">
                      <div className="mt-1 flex h-10 w-10 flex-none items-center justify-center rounded-full bg-[#635bff]/10 text-[#635bff]">
                        <Check className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-[#0a2540] mb-1">Accuracy Score</h3>
                        <p className="text-slate-600 leading-relaxed">
                          Every field returns a{" "}
                          <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs text-slate-700">confidence</code>{" "}
                          score (0-1.0). We recommend manual review for scores below 0.85.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-6">
                  <div className="mb-6 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white shadow-sm border border-slate-100 text-[#635bff]">
                      <Webhook className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-[#0a2540]">Webhook Events</h3>
                      <p className="text-xs text-slate-500">Real-time updates</p>
                    </div>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-between rounded-md border border-slate-200 bg-white px-4 py-3 shadow-sm">
                      <code className="text-sm font-semibold text-[#0a2540]">document.processed</code>
                      <div className="flex items-center gap-1.5 rounded-full bg-emerald-100 px-2 py-0.5">
                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500"></div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">Active</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between rounded-md border border-slate-200 bg-white px-4 py-3 shadow-sm">
                      <code className="text-sm font-semibold text-[#0a2540]">document.failed</code>
                      <div className="flex items-center gap-1.5 rounded-full bg-emerald-100 px-2 py-0.5">
                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500"></div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">Active</span>
                      </div>
                    </div>
                  </div>

                  <Link
                    href="/developer/docs/webhooks"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-[#635bff] hover:text-[#5851df] transition-colors group"
                  >
                    Configure Webhooks
                    <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  )
}
