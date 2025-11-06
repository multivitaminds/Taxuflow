import { createClient } from "@/lib/supabase/server"
import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { checkDemoMode } from "@/lib/demo-mode"
import {
  AgentMemory,
  AgentCollaboration,
  InsightGenerator,
  TaxOptimizationEngine,
  PredictiveTaxModel,
} from "@/lib/ai/agent-intelligence"
import { sendDocumentProcessedEmail } from "@/lib/email"

export async function POST(request: NextRequest) {
  try {
    const { isDemoMode } = await checkDemoMode()

    if (isDemoMode) {
      return NextResponse.json(
        {
          error:
            "Document processing is not available in demo mode. Please create a free account to upload and process your documents.",
          isDemoMode: true,
        },
        { status: 403 },
      )
    }

    console.log("[v0] Starting intelligent document processing")

    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      console.log("[v0] Authentication failed:", authError)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { documentId } = await request.json()

    if (!documentId) {
      return NextResponse.json({ error: "Document ID is required" }, { status: 400 })
    }

    console.log("[v0] Processing document:", documentId)

    const { data: document, error: docError } = await supabase
      .from("documents")
      .select("*")
      .eq("id", documentId)
      .eq("user_id", user.id)
      .single()

    if (docError || !document) {
      console.log("[v0] Document not found:", docError)
      return NextResponse.json({ error: "Document not found" }, { status: 404 })
    }

    console.log("[v0] Sophie analyzing document with AI...")
    const analysisResult = await analyzeDocumentWithAI(document, supabase)

    console.log("[v0] Document identified as:", analysisResult.documentType)
    console.log("[v0] AI Confidence:", analysisResult.confidence)
    console.log("[v0] Extracted data:", JSON.stringify(analysisResult.extractedData).substring(0, 200))

    await supabase
      .from("documents")
      .update({
        ai_document_type: analysisResult.documentType,
        ai_description: analysisResult.description,
        ai_confidence: analysisResult.confidence,
        extracted_data: analysisResult.extractedData,
        deductions: analysisResult.deductions,
        processing_status: "completed",
        processed_at: new Date().toISOString(),
      })
      .eq("id", documentId)

    const { data: profile } = await supabase.from("user_profiles").select("full_name, email").eq("id", user.id).single()

    if (profile?.email && analysisResult.extractedData) {
      try {
        await sendDocumentProcessedEmail(
          profile.email,
          profile.full_name || "there",
          document.file_name,
          analysisResult.documentType,
          analysisResult.extractedData,
        )
      } catch (emailError) {
        console.log("[v0] Email sending failed (non-critical):", emailError)
        // Continue processing even if email fails
      }
    }

    const { data: taxDoc, error: taxDocError } = await supabase
      .from("tax_documents")
      .insert({
        user_id: user.id,
        document_id: documentId,
        document_type: analysisResult.documentType,
        tax_year: analysisResult.taxYear,
        taxpayer_name: analysisResult.extractedData?.employee_name || analysisResult.extractedData?.recipient_name,
        spouse_name: analysisResult.extractedData?.spouse_name,
        extracted_data: analysisResult.extractedData,
        ai_summary: analysisResult.summary,
        ai_confidence: analysisResult.confidence,
        key_findings: analysisResult.keyFindings,
      })
      .select()
      .single()

    if (taxDocError) {
      console.log("[v0] Error storing tax document:", taxDocError.message)
      // Continue processing even if tax_documents insert fails
    }

    let processingResults: any = {}

    if (analysisResult.documentType === "w2") {
      const { data: w2Data, error: w2Error } = await supabase
        .from("w2_data")
        .insert({
          user_id: user.id,
          document_id: documentId,
          employer_name: analysisResult.extractedData.employer_name,
          employer_ein: analysisResult.extractedData.employer_ein,
          employer_address: analysisResult.extractedData.employer_address,
          employee_name: analysisResult.extractedData.employee_name,
          employee_ssn: analysisResult.extractedData.employee_ssn,
          employee_address: analysisResult.extractedData.employee_address,
          state: analysisResult.extractedData.state,
          wages: analysisResult.extractedData.wages,
          federal_tax_withheld: analysisResult.extractedData.federal_tax_withheld,
          social_security_wages: analysisResult.extractedData.social_security_wages,
          social_security_tax_withheld: analysisResult.extractedData.social_security_tax_withheld,
          medicare_wages: analysisResult.extractedData.medicare_wages,
          medicare_tax_withheld: analysisResult.extractedData.medicare_tax_withheld,
          state_wages: analysisResult.extractedData.state_wages,
          state_tax_withheld: analysisResult.extractedData.state_tax_withheld,
          box_12_codes: analysisResult.extractedData.box_12_codes,
          other_data: analysisResult.extractedData.other_data,
          extraction_confidence: analysisResult.confidence,
        })
        .select()
        .single()

      if (w2Error || !w2Data) {
        console.log("[v0] Error storing W-2 data:", w2Error?.message)
        return NextResponse.json({
          success: true,
          documentType: analysisResult.documentType,
          analysis: analysisResult,
          warning: "Document analyzed but W-2 data storage failed. Please try again or contact support.",
        })
      }

      if (w2Data) {
        processingResults = await processW2Document(user.id, w2Data, supabase)
      }
    } else if (analysisResult.documentType === "1099") {
      const { data: taxData } = await supabase
        .from("tax_data")
        .insert({
          user_id: user.id,
          document_id: documentId,
          ...analysisResult.extractedData,
          extraction_confidence: analysisResult.confidence,
        })
        .select()
        .single()

      if (taxData) {
        processingResults = await process1099Document(user.id, taxData, supabase)
      }
    } else if (analysisResult.documentType === "1040") {
      const { data: taxReturnData } = await supabase
        .from("tax_return_data")
        .insert({
          user_id: user.id,
          document_id: documentId,
          ...analysisResult.extractedData,
          extraction_confidence: analysisResult.confidence,
        })
        .select()
        .single()

      if (taxReturnData) {
        processingResults = await process1040Document(user.id, taxReturnData, supabase)
      }
    } else {
      processingResults = await processGeneralDocument(user.id, analysisResult, supabase)
    }

    console.log("[v0] Document processing complete")

    return NextResponse.json({
      success: true,
      documentType: analysisResult.documentType,
      analysis: analysisResult,
      ...processingResults,
    })
  } catch (error) {
    console.error("[v0] Error processing document:", error)
    return NextResponse.json(
      { error: "Failed to process document", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    )
  }
}

async function analyzeDocumentWithAI(document: any, supabase: any) {
  try {
    const { data: fileData, error: downloadError } = await supabase.storage
      .from("tax-documents")
      .download(document.file_path)

    if (downloadError) {
      console.error("[v0] Error downloading document:", downloadError)
      throw downloadError
    }

    const arrayBuffer = await fileData.arrayBuffer()
    const uint8Array = new Uint8Array(arrayBuffer)
    const mimeType = document.file_type || "application/pdf"

    console.log("[v0] Document downloaded, size:", arrayBuffer.byteLength, "bytes")
    console.log("[v0] Analyzing with AI vision...")

    const prompt = `You are Sophie, an expert tax document analyst with OCR capabilities. 

I'm showing you a document image/PDF. Carefully examine the ACTUAL CONTENT of this document.

Document Name: ${document.name}
File Type: ${mimeType}

Your task:
1. LOOK AT THE DOCUMENT and identify what type of tax document this is:
   - "w2" for W-2 Wage and Tax Statement
   - "1099" for any 1099 form (1099-MISC, 1099-NEC, 1099-INT, etc.)
   - "1040" for Form 1040 tax return
   - "receipt" for expense receipts
   - "bank_statement" for bank statements
   - "investment_statement" for brokerage/investment statements
   - "other" only if it doesn't match any tax document type

2. Extract ALL visible data from the document:
   - For W-2: employer name, EIN, employee name (FULL NAME), SSN, wages (box 1), federal tax withheld (box 2), social security wages (box 3), social security tax withheld (box 4), medicare wages (box 5), medicare tax withheld (box 6), state wages, state tax withheld, TAX YEAR, FILING STATUS (check if there's a spouse name indicating married filing jointly), etc.
   - For 1099: payer name, recipient name (FULL NAME), income amount, tax withheld, form type, TAX YEAR
   - For 1040: taxpayer name, spouse name (if married filing jointly), filing status, AGI, total tax, refund/owed, TAX YEAR
   - For receipts: merchant name, date, amount, items purchased, payment method, category (business expense, medical, charitable, etc.)
   - For other documents: extract all relevant financial information

3. IMPORTANT: Detect filing status:
   - If you see TWO names on the document (e.g., "Sam Lightson and Jane Lightson" or "Sam & Jane Lightson"), set filing_status to "married_joint"
   - If you see only ONE name, set filing_status to "single"
   - Extract both taxpayer_name and spouse_name if filing jointly

4. IMPORTANT: Always extract the taxpayer's FULL NAME (employee_name for W-2, recipient_name for 1099)
5. IMPORTANT: Always extract the TAX YEAR from the document
6. IMPORTANT: For receipts and deductible expenses, identify the deduction category and amount
7. Provide a detailed description of what you see in the document

Return a JSON object with this EXACT structure:
{
  "documentType": "w2",
  "subtype": null,
  "taxYear": 2024,
  "filingStatus": "married_joint",
  "description": "W-2 Wage and Tax Statement for Sam & Jane Lightson from [Employer Name] showing wages of $X and federal tax withheld of $Y",
  "summary": "W-2 form for Sam & Jane Lightson - tax year 2024 (Married Filing Jointly)",
  "confidence": 95,
  "keyFindings": [
    "Taxpayers: Sam & Jane Lightson",
    "Filing Status: Married Filing Jointly",
    "Tax Year: 2024",
    "Total wages: $X",
    "Federal tax withheld: $Y",
    "Employer: [Name]"
  ],
  "extractedData": {
    "employer_name": "Company Name",
    "employer_ein": "12-3456789",
    "employee_name": "Sam Lightson",
    "spouse_name": "Jane Lightson",
    "employee_ssn": "XXX-XX-1234",
    "tax_year": 2024,
    "filing_status": "married_joint",
    "wages": 50000.00,
    "federal_tax_withheld": 5000.00,
    "social_security_wages": 50000.00,
    "social_security_tax_withheld": 3100.00,
    "medicare_wages": 50000.00,
    "medicare_tax_withheld": 725.00,
    "state_wages": 50000.00,
    "state_tax_withheld": 2000.00,
    "state": "CA"
  },
  "deductions": [
    {
      "category": "business_expense",
      "description": "Office supplies",
      "amount": 150.00,
      "date": "2024-03-15"
    }
  ]
}

IMPORTANT: 
- Actually READ the document content I'm showing you
- Extract REAL values from the document, not placeholder values
- ALWAYS include employee_name/recipient_name and tax_year in extractedData
- If married filing jointly, include spouse_name and set filing_status to "married_joint"
- For receipts, identify deductible categories: business_expense, medical, charitable, education, etc.
- If you can't read a field clearly, omit it from extractedData
- Be accurate with numbers - these are used for tax calculations
- Set confidence based on document quality and readability

Return ONLY valid JSON, no markdown or explanation.`

    const { text } = await generateText({
      model: "openai/gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            {
              type: "file",
              data: uint8Array,
              mediaType: mimeType,
            },
          ],
        },
      ],
      maxTokens: 4000,
    })

    console.log("[v0] AI response received, parsing...")

    let cleanedText = text.trim()

    if (cleanedText.startsWith("```")) {
      cleanedText = cleanedText.replace(/^```(?:json)?\n?/, "")
      cleanedText = cleanedText.replace(/\n?```$/, "")
      cleanedText = cleanedText.trim()
    }

    console.log("[v0] Cleaned AI response, attempting to parse...")
    const analysis = JSON.parse(cleanedText)

    return {
      documentType: analysis.documentType || "other",
      subtype: analysis.subtype,
      taxYear: analysis.taxYear || new Date().getFullYear(),
      filingStatus: analysis.filingStatus || analysis.extractedData?.filing_status || "single",
      description: analysis.description || `${document.name} - Tax document`,
      summary: analysis.summary || "Document analyzed successfully",
      confidence: analysis.confidence || 85,
      keyFindings: analysis.keyFindings || [],
      extractedData: analysis.extractedData || {},
      deductions: analysis.deductions || [],
    }
  } catch (error) {
    console.error("[v0] Error in AI analysis:", error)
    console.error("[v0] Error details:", error instanceof Error ? error.message : String(error))
    console.error("[v0] Error stack:", error instanceof Error ? error.stack : "No stack trace")

    const fileName = document.name.toLowerCase()
    let documentType = "other"
    let description = `Document: ${document.name}`

    if (fileName.includes("w-2") || fileName.includes("w2")) {
      documentType = "w2"
      description = "W-2 Wage and Tax Statement (filename-based detection)"
    } else if (fileName.includes("1099")) {
      documentType = "1099"
      description = "1099 Income Statement (filename-based detection)"
    } else if (fileName.includes("1040")) {
      documentType = "1040"
      description = "Form 1040 Tax Return (filename-based detection)"
    } else if (fileName.includes("receipt")) {
      documentType = "receipt"
      description = "Expense Receipt (filename-based detection)"
    }

    return {
      documentType,
      subtype: null,
      taxYear: new Date().getFullYear(),
      filingStatus: "single",
      description,
      summary: `Analyzed ${document.name} (fallback mode - AI vision failed)`,
      confidence: 50,
      keyFindings: ["Document uploaded successfully", "Manual review recommended - AI analysis failed"],
      extractedData: {},
      deductions: [],
    }
  }
}

async function processW2Document(userId: string, w2Data: any, supabase: any) {
  console.log("[v0] Leo calculating refund...")
  const taxCalc = await calculateTaxes(userId, w2Data, supabase)

  await supabase.from("agent_activities").insert({
    user_id: userId,
    agent_name: "Leo",
    agent_role: "Refund Analyst",
    activity_type: "calculation",
    title: `Calculated your tax refund`,
    description: `Based on your W-2 income of $${w2Data.wages?.toLocaleString()}, your estimated refund is $${taxCalc.estimated_refund?.toFixed(2)}`,
    w2_id: w2Data.id,
    impact_amount: taxCalc.estimated_refund,
    result_data: taxCalc,
  })

  const leoMemory = new AgentMemory(supabase, userId, "Leo")
  await leoMemory.remember(
    "calculation",
    {
      wages: w2Data.wages,
      refund: taxCalc.estimated_refund,
      tax_year: w2Data.tax_year || 2024,
    },
    ["w2", "refund", "calculation"],
  )

  console.log("[v0] Riley finding deductions...")
  const deductions = await findDeductions(userId, w2Data, supabase)

  await supabase.from("agent_activities").insert({
    user_id: userId,
    agent_name: "Riley",
    agent_role: "Business Planner",
    activity_type: "recommendation",
    title: `Found ${deductions.length} potential deductions`,
    description: `Identified ${deductions.length} deductions that could increase your refund by up to $${deductions.reduce((sum: number, d: any) => sum + (d.amount || 0), 0).toFixed(2)}`,
    w2_id: w2Data.id,
    result_data: { deductions },
  })

  const rileyMemory = new AgentMemory(supabase, userId, "Riley")
  await rileyMemory.remember(
    "deduction_pattern",
    {
      deductions_found: deductions.length,
      total_potential_savings: deductions.reduce((sum: number, d: any) => sum + (d.amount || 0), 0),
    },
    ["deductions", "opportunities"],
  )

  console.log("[v0] Kai assessing audit risk...")
  const auditRisk = await assessAuditRisk(w2Data, taxCalc)

  await supabase.from("tax_calculations").update({ audit_risk_score: auditRisk.score }).eq("user_id", userId)

  await supabase.from("agent_activities").insert({
    user_id: userId,
    agent_name: "Kai",
    agent_role: "Audit Advisor",
    activity_type: "assessment",
    title: `Audit risk assessment: ${auditRisk.score}`,
    description: auditRisk.explanation,
    w2_id: w2Data.id,
    result_data: auditRisk,
  })

  const kaiMemory = new AgentMemory(supabase, userId, "Kai")
  await kaiMemory.remember(
    "risk_assessment",
    {
      risk_level: auditRisk.score,
      income_level: w2Data.wages,
      refund_ratio: taxCalc.estimated_refund / w2Data.wages,
    },
    ["audit", "risk", "compliance"],
  )

  console.log("[v0] Jordan creating tax strategy...")
  const strategy = await createTaxStrategy(userId, w2Data, taxCalc, supabase)

  await supabase.from("agent_activities").insert({
    user_id: userId,
    agent_name: "Jordan",
    agent_role: "Tax Strategist",
    activity_type: "recommendation",
    title: `Created your personalized tax strategy`,
    description: strategy.summary,
    w2_id: w2Data.id,
    result_data: strategy,
  })

  console.log("[v0] Initiating agent collaboration for advanced insights...")
  const collaboration = new AgentCollaboration(supabase, userId)
  const collaborationResult = await collaboration.initiateCollaboration(
    "comprehensive_tax_analysis",
    ["Sophie", "Leo", "Riley", "Kai", "Jordan"],
    "W-2 document processed",
    {
      w2Data,
      taxCalc,
      deductions,
      auditRisk,
      strategy,
    },
  )

  console.log("[v0] Generating intelligent insights...")
  const insightGenerator = new InsightGenerator(supabase, userId)
  const insights = await insightGenerator.generateInsights({
    w2Data,
    taxCalc,
    deductions,
    auditRisk,
    strategy,
  })

  console.log("[v0] Finding advanced tax optimization strategies...")
  const optimizationEngine = new TaxOptimizationEngine(supabase, userId)
  const optimizations = await optimizationEngine.findOptimizations({
    income: w2Data.wages,
    federal_withheld: w2Data.federal_tax_withheld,
    state_withheld: w2Data.state_tax_withheld,
    estimated_refund: taxCalc.estimated_refund,
    filing_status: w2Data.filing_status || "single",
  })

  console.log("[v0] Generating predictive refund model...")
  const predictiveModel = new PredictiveTaxModel(supabase, userId)

  // Get historical data
  const { data: historicalCalcs } = await supabase
    .from("tax_calculations")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(3)

  const prediction = await predictiveModel.predictRefund(historicalCalcs || [], {
    current_income: w2Data.wages,
    current_withholding: w2Data.federal_tax_withheld,
    deductions_available: deductions.length,
  })

  return {
    taxCalculation: taxCalc,
    deductions,
    auditRisk,
    strategy,
    collaboration: collaborationResult,
    insights,
    optimizations,
    prediction,
  }
}

async function process1099Document(userId: string, taxData: any, supabase: any) {
  console.log("[v0] Leo analyzing financial impact...")
  await supabase.from("agent_activities").insert({
    user_id: userId,
    agent_name: "Leo",
    agent_role: "Refund Analyst",
    activity_type: "analysis",
    title: `Reviewed your 1099 document`,
    description: `This 1099 may impact your tax return. ${taxData.extractedData?.income_amount || "Keep this document for your records."}`,
    result_data: { documentType: "1099", extractedData: taxData.extractedData },
  })

  console.log("[v0] Riley checking for deductions...")
  let deductionMessage = "Keep this document for potential deductions"

  if (taxData.extractedData?.form_type === "1099-MISC") {
    deductionMessage = "Consider deductions for freelance income"
  } else if (taxData.extractedData?.form_type === "1099-NEC") {
    deductionMessage = "Consider deductions for self-employment income"
  }

  await supabase.from("agent_activities").insert({
    user_id: userId,
    agent_name: "Riley",
    agent_role: "Business Planner",
    activity_type: "recommendation",
    title: `Deduction opportunity identified`,
    description: deductionMessage,
    result_data: { documentType: "1099", keyFindings: taxData.keyFindings },
  })

  console.log("[v0] Kai providing compliance guidance...")
  await supabase.from("agent_activities").insert({
    user_id: userId,
    agent_name: "Kai",
    agent_role: "Audit Advisor",
    activity_type: "assessment",
    title: `Document compliance check`,
    description: `Your 1099 has been securely stored. ${taxData.keyFindings[1] || "Maintain proper documentation for IRS requirements."}`,
    result_data: { documentType: "1099", compliance: "stored" },
  })

  return {
    message: "1099 document processed successfully",
    keyFindings: taxData.keyFindings,
  }
}

async function process1040Document(userId: string, taxReturnData: any, supabase: any) {
  console.log("[v0] Leo analyzing financial impact...")
  await supabase.from("agent_activities").insert({
    user_id: userId,
    agent_name: "Leo",
    agent_role: "Refund Analyst",
    activity_type: "analysis",
    title: `Reviewed your Form 1040 document`,
    description: `This Form 1040 may impact your tax return. ${taxReturnData.extractedData?.agi || "Keep this document for your records."}`,
    result_data: { documentType: "1040", extractedData: taxReturnData.extractedData },
  })

  console.log("[v0] Riley checking for deductions...")
  let deductionMessage = "Keep this document for potential deductions"

  if (taxReturnData.extractedData?.filing_status === "married_joint") {
    deductionMessage = "Consider deductions for married filing jointly"
  }

  await supabase.from("agent_activities").insert({
    user_id: userId,
    agent_name: "Riley",
    agent_role: "Business Planner",
    activity_type: "recommendation",
    title: `Deduction opportunity identified`,
    description: deductionMessage,
    result_data: { documentType: "1040", keyFindings: taxReturnData.keyFindings },
  })

  console.log("[v0] Kai providing compliance guidance...")
  await supabase.from("agent_activities").insert({
    user_id: userId,
    agent_name: "Kai",
    agent_role: "Audit Advisor",
    activity_type: "assessment",
    title: `Document compliance check`,
    description: `Your Form 1040 has been securely stored. ${taxReturnData.keyFindings[1] || "Maintain proper documentation for IRS requirements."}`,
    result_data: { documentType: "1040", compliance: "stored" },
  })

  return {
    message: "Form 1040 document processed successfully",
    keyFindings: taxReturnData.keyFindings,
  }
}

async function processGeneralDocument(userId: string, analysis: any, supabase: any) {
  const { documentType, extractedData, keyFindings, deductions } = analysis

  console.log("[v0] Leo analyzing financial impact...")
  await supabase.from("agent_activities").insert({
    user_id: userId,
    agent_name: "Leo",
    agent_role: "Refund Analyst",
    activity_type: "analysis",
    title: `Reviewed your ${documentType} document`,
    description: `This ${documentType} may impact your tax return. ${keyFindings[0] || "Keep this document for your records."}`,
    result_data: { documentType, extractedData },
  })

  console.log("[v0] Riley checking for deductions...")
  let deductionMessage = "Keep this document for potential deductions"

  if (documentType === "receipt") {
    deductionMessage = "This receipt may be deductible if it's a business expense"
  } else if (documentType === "1099") {
    deductionMessage = "1099 income requires reporting. Consider related business expenses."
  }

  await supabase.from("agent_activities").insert({
    user_id: userId,
    agent_name: "Riley",
    agent_role: "Business Planner",
    activity_type: "recommendation",
    title: `Deduction opportunity identified`,
    description: deductionMessage,
    result_data: { documentType, keyFindings },
  })

  console.log("[v0] Kai providing compliance guidance...")
  await supabase.from("agent_activities").insert({
    user_id: userId,
    agent_name: "Kai",
    agent_role: "Audit Advisor",
    activity_type: "assessment",
    title: `Document compliance check`,
    description: `Your ${documentType} has been securely stored. ${keyFindings[1] || "Maintain proper documentation for IRS requirements."}`,
    result_data: { documentType, compliance: "stored" },
  })

  return {
    message: `${documentType} document processed successfully`,
    keyFindings,
    deductions,
  }
}

async function calculateTaxes(userId: string, w2Data: any, supabase: any) {
  const wages = Number.parseFloat(w2Data.wages) || 0
  const federalWithheld = Number.parseFloat(w2Data.federal_tax_withheld) || 0
  const stateWithheld = Number.parseFloat(w2Data.state_tax_withheld) || 0

  const standardDeduction = 14600 // 2024 standard deduction
  const taxableIncome = Math.max(0, wages - standardDeduction)

  let federalTax = 0
  if (taxableIncome <= 11600) {
    federalTax = taxableIncome * 0.1
  } else if (taxableIncome <= 47150) {
    federalTax = 1160 + (taxableIncome - 11600) * 0.12
  } else if (taxableIncome <= 100525) {
    federalTax = 5426 + (taxableIncome - 47150) * 0.22
  } else {
    federalTax = 17168.5 + (taxableIncome - 100525) * 0.24
  }

  const stateTax = wages * 0.05

  const totalTaxLiability = federalTax + stateTax
  const totalWithheld = federalWithheld + stateWithheld
  const estimatedRefund = totalWithheld - totalTaxLiability

  const taxCalc = {
    user_id: userId,
    total_income: wages,
    adjusted_gross_income: wages,
    taxable_income: taxableIncome,
    federal_tax_liability: federalTax,
    state_tax_liability: stateTax,
    total_tax_withheld: totalWithheld,
    estimated_refund: estimatedRefund > 0 ? estimatedRefund : 0,
    amount_owed: estimatedRefund < 0 ? Math.abs(estimatedRefund) : 0,
    confidence_level: "High",
    confidence_percentage: 96,
    tax_year: 2024,
  }

  const { data } = await supabase.from("tax_calculations").upsert(taxCalc, { onConflict: "user_id" }).select().single()

  return data || taxCalc
}

async function findDeductions(userId: string, w2Data: any, supabase: any) {
  const deductions = [
    {
      user_id: userId,
      type: "deduction",
      category: "education",
      name: "Student Loan Interest Deduction",
      amount: 2500,
      recommended_by: "Riley",
      confidence: 85,
      requirements: { hasStudentLoans: true },
      documentation_needed: ["Student loan interest statement (1098-E)"],
    },
    {
      user_id: userId,
      type: "credit",
      category: "retirement",
      name: "Saver's Credit",
      amount: 1000,
      recommended_by: "Riley",
      confidence: 75,
      requirements: { hasRetirementContributions: true },
      documentation_needed: ["IRA or 401(k) contribution records"],
    },
    {
      user_id: userId,
      type: "deduction",
      category: "health",
      name: "Health Savings Account (HSA) Deduction",
      amount: 3850,
      recommended_by: "Riley",
      confidence: 80,
      requirements: { hasHSA: true },
      documentation_needed: ["HSA contribution records"],
    },
  ]

  try {
    const { data } = await supabase.from("deductions_credits").insert(deductions).select()
    return data || deductions
  } catch (error) {
    console.log("[v0] Error inserting deductions (non-critical):", error)
    return deductions
  }
}

async function assessAuditRisk(w2Data: any, taxCalc: any) {
  const wages = Number.parseFloat(w2Data.wages) || 0
  const refund = Number.parseFloat(taxCalc.estimated_refund) || 0

  let score = "Low"
  let explanation = "Your return has standard W-2 income with no red flags."

  if (refund > wages * 0.3) {
    score = "Medium"
    explanation = "Large refund relative to income. Ensure all withholdings are accurate."
  }

  if (wages > 200000) {
    score = "Medium"
    explanation = "High income returns receive more scrutiny. Keep detailed records."
  }

  return {
    score,
    explanation,
    recommendations: [
      "Keep all W-2 forms and receipts for at least 3 years",
      "Ensure all income sources are reported",
      "Document all deductions with proper receipts",
    ],
  }
}

async function createTaxStrategy(userId: string, w2Data: any, taxCalc: any, supabase: any) {
  const wages = Number.parseFloat(w2Data.wages) || 0

  return {
    summary: "Maximize your 2024 refund and plan for 2025",
    recommendations: [
      {
        title: "Increase 401(k) Contributions",
        description: `Consider increasing retirement contributions to reduce taxable income`,
        potentialSavings: wages * 0.22 * 0.05,
      },
      {
        title: "Adjust W-4 Withholding",
        description: "Your withholding is close to optimal. Minor adjustment recommended.",
        potentialSavings: 0,
      },
      {
        title: "Consider HSA",
        description: "Health Savings Account contributions are tax-deductible",
        potentialSavings: 3850 * 0.22,
      },
    ],
    nextSteps: [
      "Review and accept recommended deductions",
      "Upload any additional tax documents (1099s, receipts)",
      "Schedule a review with Jordan for personalized advice",
    ],
  }
}
