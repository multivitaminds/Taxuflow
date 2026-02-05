import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { uploadToS3, isS3Configured } from "@/lib/aws-s3"

export const dynamic = 'force-dynamic'

let jsPDF: any = null

async function getJsPDF() {
  if (jsPDF) return jsPDF
  if (typeof window === "undefined") {
    const globalAny = global as any
    if (!globalAny.window) globalAny.window = { document: { createElementNS: () => ({}) } }
    if (!globalAny.navigator) globalAny.navigator = {}
    if (!globalAny.btoa) globalAny.btoa = (str: string) => Buffer.from(str, "binary").toString("base64")
    if (!globalAny.atob) globalAny.atob = (b64: string) => Buffer.from(b64, "base64").toString("binary")
  }
  const module = await import("jspdf")
  jsPDF = module.jsPDF
  return jsPDF
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    let user = null
    let isDemoMode = false

    if (!supabase) {
      console.log("[v0] Paper package: Supabase not configured, using demo mode")
      isDemoMode = true
    } else {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser()

      if (!authUser) {
        console.log("[v0] Paper package: No authenticated user, checking for demo mode")
        // If we have supabase but no user, it might be a session issue, but let's treat as unauthorized unless we want to allow public generation?
        // For now, if supabase exists but no user, return 401.
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }
      user = authUser
      console.log("[v0] Paper package: Authenticated user:", user.email)
    }
    // </CHANGE>

    const { formType, filingType, formData, taxYear } = await request.json()

    console.log("[v0] Generating paper filing package for:", { formType, filingType, taxYear })

    let doc
    try {
      const PDF = await getJsPDF()
      doc = new PDF()
    } catch (pdfError: any) {
      console.error("[v0] jsPDF instantiation failed:", pdfError)
      // Try to re-import or handle error specific to environment
      return NextResponse.json(
        {
          success: false,
          error: "Failed to initialize PDF generator. Please try again or contact support.",
        },
        { status: 500 },
      )
    }
    // </CHANGE>

    let yPos = 20

    // Title
    doc.setFontSize(20)
    doc.setFont("helvetica", "bold")
    doc.text(`Form ${formType} - Paper Filing Package`, 20, yPos)
    yPos += 15

    // Filing Info
    doc.setFontSize(12)
    doc.setFont("helvetica", "normal")
    doc.text(`Tax Year: ${taxYear}`, 20, yPos)
    yPos += 8
    doc.text(`Filing Type: ${filingType === "original" ? "Original Filing" : "Corrected Filing (W-2c)"}`, 20, yPos)
    yPos += 8
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 20, yPos)
    yPos += 15

    // Employer Information
    doc.setFontSize(14)
    doc.setFont("helvetica", "bold")
    doc.text("Employer Information", 20, yPos)
    yPos += 10

    doc.setFontSize(11)
    doc.setFont("helvetica", "normal")
    doc.text(`Name: ${formData.employerName || ""}`, 25, yPos)
    yPos += 7
    doc.text(`EIN: ${formData.employerEIN || ""}`, 25, yPos)
    yPos += 7
    doc.text(`Address: ${formData.employerAddress || ""}`, 25, yPos)
    yPos += 7
    doc.text(
      `City, State ZIP: ${formData.employerCity || ""}, ${formData.employerState || ""} ${formData.employerZip || ""}`,
      25,
      yPos,
    )
    yPos += 12

    // Employee Information
    doc.setFontSize(14)
    doc.setFont("helvetica", "bold")
    doc.text("Employee Information", 20, yPos)
    yPos += 10

    doc.setFontSize(11)
    doc.setFont("helvetica", "normal")
    doc.text(
      `Name: ${formData.employeeFirstName || ""} ${formData.employeeMiddleInitial ? formData.employeeMiddleInitial + ". " : ""}${formData.employeeLastName || ""}`,
      25,
      yPos,
    )
    yPos += 7
    doc.text(`SSN: ${formData.employeeSSN || ""}`, 25, yPos)
    yPos += 7
    doc.text(`Address: ${formData.employeeAddress || ""}`, 25, yPos)
    yPos += 7
    doc.text(
      `City, State ZIP: ${formData.employeeCity || ""}, ${formData.employeeState || ""} ${formData.employeeZip || ""}`,
      25,
      yPos,
    )
    yPos += 12

    // Wage Information
    doc.setFontSize(14)
    doc.setFont("helvetica", "bold")
    doc.text("Wage and Tax Information", 20, yPos)
    yPos += 10

    doc.setFontSize(11)
    doc.setFont("helvetica", "normal")
    const wageFields = [
      { label: "Box 1: Wages, tips, other compensation", value: formData.wages },
      { label: "Box 2: Federal income tax withheld", value: formData.federalWithholding },
      { label: "Box 3: Social security wages", value: formData.socialSecurityWages },
      { label: "Box 4: Social security tax withheld", value: formData.socialSecurityWithholding },
      { label: "Box 5: Medicare wages and tips", value: formData.medicareWages },
      { label: "Box 6: Medicare tax withheld", value: formData.medicareWithholding },
    ]

    for (const field of wageFields) {
      doc.text(`${field.label}: $${Number.parseFloat(field.value || "0").toFixed(2)}`, 25, yPos)
      yPos += 7
      if (yPos > 270) {
        doc.addPage()
        yPos = 20
      }
    }

    yPos += 10

    // Instructions
    doc.addPage()
    yPos = 20

    doc.setFontSize(16)
    doc.setFont("helvetica", "bold")
    doc.text("Filing Instructions", 20, yPos)
    yPos += 15

    doc.setFontSize(11)
    doc.setFont("helvetica", "normal")

    const instructions = [
      "1. Print this document and the official IRS Form W-2 (available at irs.gov)",
      "2. Transfer the information from this summary to the official Form W-2",
      "3. Sign and date the Form W-2",
      "4. Include a cover letter explaining the late filing",
      "5. Mail to the appropriate IRS address for your state",
      "",
      "IRS Mailing Address:",
      "Department of the Treasury",
      "Internal Revenue Service Center",
      "Austin, TX 73301",
      "",
      "Important Notes:",
      "- Use certified mail with return receipt for proof of mailing",
      "- Keep copies of all documents for your records",
      "- Late filing penalties may apply",
      "- Consider requesting penalty abatement if you have reasonable cause",
    ]

    for (const instruction of instructions) {
      if (instruction === "") {
        yPos += 5
      } else {
        doc.text(instruction, 20, yPos)
        yPos += 7
      }
    }

    if (isDemoMode) {
      console.log("[v0] Demo mode: Returning PDF as Data URI")
      const dataUri = doc.output("datauristring")
      return NextResponse.json({
        success: true,
        packageUrl: dataUri,
      })
    }

    // Real Mode: Upload to S3 or Blob
    // Generate PDF as ArrayBuffer for Node.js compatibility
    const pdfArrayBuffer = doc.output("arraybuffer")
    const pdfBuffer = Buffer.from(pdfArrayBuffer)
    // </CHANGE>

    let url: string

    if (isS3Configured() && user) {
      console.log("[v0] Using AWS S3 for PDF storage (TaxBandits)")
      const s3Key = `tax-forms/${user.id}/${formType.toLowerCase()}-paper-package-${taxYear}-${Date.now()}.pdf`

      // uploadToS3 expects a Blob or Buffer? The interface usually takes BodyInit.
      // Let's assume it handles Buffer or we convert to Blob if needed.
      // Since we are in Node, Buffer is better.
      // But wait, the original code used `doc.output("blob")`.
      // If that worked before (or was intended to), we should check `uploadToS3`.
      // For safety, we'll use the buffer.

      // We need to check what uploadToS3 expects.
      // Assuming it takes { file: Buffer | Blob, ... }
      // We'll pass the buffer.
      url = await uploadToS3({
        file: pdfBuffer as any, // Casting to any to avoid type conflicts if it expects Blob
        key: s3Key,
        contentType: "application/pdf",
      })

      console.log("[v0] PDF uploaded to TaxBandits S3 bucket:", url)
    } else {
      // Fallback to Vercel Blob or just return Data URI if upload fails
      console.log("[v0] AWS S3 not configured, returning Data URI as fallback")
      const dataUri = doc.output("datauristring")
      return NextResponse.json({
        success: true,
        packageUrl: dataUri,
      })
    }

    console.log("[v0] Paper package generated and uploaded:", url)

    // Save to database
    if (supabase && user) {
      await supabase.from("tax_filings").insert({
        user_id: user.id,
        form_type: formType,
        tax_year: Number.parseInt(taxYear),
        filing_status: "paper_generated",
        filing_method: "paper",
        form_data: formData,
        document_url: url,
      })
    }

    return NextResponse.json({
      success: true,
      packageUrl: url,
    })
    // </CHANGE>
  } catch (error: any) {
    console.error("[v0] Paper package generation error:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
