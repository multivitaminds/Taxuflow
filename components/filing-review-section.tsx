"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Info } from "lucide-react"

interface ReviewFieldProps {
  label: string
  value: string | number
  sensitive?: boolean
}

function ReviewField({ label, value, sensitive }: ReviewFieldProps) {
  const displayValue = sensitive ? "•".repeat(8) : value

  return (
    <div className="grid grid-cols-3 gap-4 py-3 border-b border-gray-200 last:border-b-0">
      <dt className="text-sm font-semibold text-gray-700">{label}</dt>
      <dd className="col-span-2 text-sm text-gray-900">{displayValue}</dd>
    </div>
  )
}

interface ReviewSectionProps {
  title: string
  fields: ReviewFieldProps[]
}

function ReviewSection({ title, fields }: ReviewSectionProps) {
  return (
    <div className="mb-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b-2 border-[#005ea2]">{title}</h3>
      <dl className="space-y-0">
        {fields.map((field, index) => (
          <ReviewField key={index} {...field} />
        ))}
      </dl>
    </div>
  )
}

interface FilingReviewSectionProps {
  sections: ReviewSectionProps[]
  formType: string
}

export function FilingReviewSection({ sections, formType }: FilingReviewSectionProps) {
  return (
    <div className="space-y-6">
      {/* Header Alert */}
      <Alert className="bg-blue-50 border-blue-200 border-l-4">
        <Info className="h-5 w-5 text-blue-800" />
        <AlertTitle className="text-blue-900 font-bold text-lg">Review your information before submitting.</AlertTitle>
        <AlertDescription className="text-blue-800 mt-2 space-y-2">
          <p>
            Please review the information you are about to submit. If any of the information below is incorrect, you
            will need to go back and make corrections.
          </p>
          <p className="font-semibold">
            Click the &quot;Submit to IRS&quot; button at the bottom of the page to send your {formType}. Once you
            submit, please wait while your application is being processed. It can take up to two minutes for your
            application to be processed.
          </p>
        </AlertDescription>
      </Alert>

      {/* Review Card */}
      <Card className="border-2 border-gray-300">
        <CardContent className="p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Review and Submit</h2>
          <p className="text-sm text-gray-600 mb-8">All fields marked with an asterisk (*) are required.</p>

          <div className="space-y-6">
            {sections.map((section, index) => (
              <ReviewSection key={index} {...section} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
