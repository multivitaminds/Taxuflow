"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Gift } from "lucide-react"

export function AtmLocatorEnhanced() {
  const [activeTab, setActiveTab] = useState("nearby")

  const rewardsData = {
    pointsEarned: 1250,
    cashback: 12.5,
    freeWithdrawals: 8,
    tier: "Gold",
  }

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-amber-500 to-orange-600 text-white border-none">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Gift className="h-5 w-5" />
                <span className="text-sm font-medium uppercase tracking-wider">ATM Rewards Program</span>
              </div>
              <h3 className="text-2xl font-bold mb-1">{rewardsData.pointsEarned} Points Earned</h3>
              <p className="text-amber-100 text-sm mb-3">
                Use fee-free ATMs to earn points | {rewardsData.tier} Status
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-amber-100">Cashback Earned</p>
                  <p className="text-lg font-bold">${rewardsData.cashback}</p>
                </div>
                <div>
                  <p className="text-xs text-amber-100">Free Withdrawals</p>
                  <p className="text-lg font-bold">{rewardsData.freeWithdrawals} this month</p>
                </div>
              </div>
            </div>
            <Button variant="secondary" className="bg-white text-orange-600 hover:bg-amber-50">
              Redeem Points
            </Button>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:w-[500px]">
          <TabsTrigger value="nearby">Nearby ATMs</TabsTrigger>
          <TabsTrigger value="favorites">Favorites</TabsTrigger>
          <TabsTrigger value="recent">Recent</TabsTrigger>
        </TabsList>

        <TabsContent value="nearby" className="space-y-6">
          {/* ... existing ATM list code ... */}
        </TabsContent>
      </Tabs>
    </div>
  )
}
