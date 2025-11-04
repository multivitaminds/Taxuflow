import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/server"
import { jsPDF } from "jspdf"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { formType, filingType, formData, taxYear } = await request.json()

    console.log("[v0] Generating paper filing package for:", { formType, filingType, taxYear })

    // Create PDF with jsPDF
    const doc = new jsPDF()
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
    doc.text(`Name: ${formData.employerName}`, 25, yPos)
    yPos += 7
    doc.text(`EIN: ${formData.employerEIN}`, 25, yPos)
    yPos += 7
    doc.text(`Address: ${formData.employerAddress}`, 25, yPos)
    yPos += 7
    doc.text(`City, State ZIP: ${formData.employerCity}, ${formData.employerState} ${formData.employerZip}`, 25, yPos)
    yPos += 12

    // Employee Information
    doc.setFontSize(14)
    doc.setFont("helvetica", "bold")
    doc.text("Employee Information", 20, yPos)
    yPos += 10

    doc.setFontSize(11)
    doc.setFont("helvetica", "normal")
    doc.text(
      `Name: ${formData.employeeFirstName} ${formData.employeeMiddleInitial ? formData.employeeMiddleInitial + ". " : ""}${formData.employeeLastName}`,
      25,
      yPos,
    )
    yPos += 7
    doc.text(`SSN: ${formData.employeeSSN}`, 25, yPos)
    yPos += 7
    doc.text(`Address: ${formData.employeeAddress}`, 25, yPos)
    yPos += 7
    doc.text(`City, State ZIP: ${formData.employeeCity}, ${formData.employeeState} ${formData.employeeZip}`, 25, yPos)
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

    // Generate PDF as blob
    const pdfBlob = doc.output("blob")

    // Upload to Vercel Blob
    const formDataBlob = new FormData()
    formDataBlob.append("file", pdfBlob, `w2-paper-package-${taxYear}.pdf`)

    const uploadResponse = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/upload`, {
      method: "POST",
      body: formDataBlob,
    })

    if (!uploadResponse.ok) {
      throw new Error("Failed to upload PDF")
    }

    const { url } = await uploadResponse.json()

    console.log("[v0] Paper package generated and uploaded:", url)

    // Save to database
    await supabase.from("tax_filings").insert({
      user_id: user.id,
      form_type: formType,
      tax_year: Number.parseInt(taxYear),
      filing_status: "paper_generated",
      filing_method: "paper",
      form_data: formData,
      document_url: url,
    })

    return NextResponse.json({
      success: true,
      packageUrl: url,
    })
  } catch (error: any) {
    console.error("[v0] Paper package generation error:", error)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
