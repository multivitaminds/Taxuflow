"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Copy, Mail } from "lucide-react"

export default function ReferralsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Referrals</h1>
      </div>

      {/* Referral Bonus Card */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-8 text-white">
        <div className="text-center">
          <div className="text-5xl font-bold mb-2">$250.00</div>
          <div className="text-slate-300">Referral Bonus</div>
        </div>
      </div>

      {/* Why Refer */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Why refer someone?</h2>
        <ul className="space-y-3">
          <li className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-green-600 text-sm">✓</span>
            </div>
            <span className="text-sm text-slate-700">
              You each get $250 when your referral deposits $10K within 90 days
            </span>
          </li>
          <li className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-green-600 text-sm">✓</span>
            </div>
            <span className="text-sm text-slate-700">They get to skip the line with expedited application review.</span>
          </li>
        </ul>
      </div>

      {/* Referral URL */}
      <div className="bg-white rounded-lg border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Referral URL</h2>
        <div className="flex gap-2">
          <Input value="taxu.com/r/taxu" readOnly className="font-mono text-sm" />
          <Button variant="outline" size="icon">
            <Copy className="w-4 h-4" />
          </Button>
          <Button className="bg-[#635bff] hover:bg-[#5246e0]">
            <Mail className="w-4 h-4 mr-2" />
            Invite via Email
          </Button>
        </div>
      </div>

      {/* Referral History */}
      <div className="bg-white rounded-lg border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900">Referral history</h2>
        </div>

        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50">
              <TableHead className="font-semibold text-slate-900">Company</TableHead>
              <TableHead className="font-semibold text-slate-900">Application started</TableHead>
              <TableHead className="font-semibold text-slate-900">Status</TableHead>
              <TableHead className="font-semibold text-slate-900">Payout</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[
              { company: "Widgets Inc.", date: "Mar 4, 2018", status: "Paid", payout: "$250 paid on Mar 4, 2018" },
              { company: "Pluto Import & Export", date: "Mar 4, 2018", status: "Started", payout: "—" },
              { company: "Razer Capital", date: "Mar 4, 2018", status: "Applied", payout: "—" },
              { company: "Wanda's Brooms", date: "Mar 4, 2018", status: "Approved", payout: "—" },
              { company: "Rick's Shoes", date: "Mar 4, 2018", status: "Closed", payout: "—" },
              { company: "Chocolate Frontiers", date: "Mar 4, 2018", status: "Expired", payout: "—" },
            ].map((referral, idx) => (
              <TableRow key={idx} className="hover:bg-slate-50">
                <TableCell className="font-medium text-slate-900">{referral.company}</TableCell>
                <TableCell className="text-slate-600 text-sm">{referral.date}</TableCell>
                <TableCell>
                  <Badge
                    variant={referral.status === "Paid" ? "default" : "secondary"}
                    className={
                      referral.status === "Paid"
                        ? "bg-green-100 text-green-700 border-green-200"
                        : referral.status === "Started"
                          ? "bg-blue-100 text-blue-700 border-blue-200"
                          : "bg-slate-100 text-slate-700"
                    }
                  >
                    {referral.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-slate-600 text-sm">{referral.payout}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
