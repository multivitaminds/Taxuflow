"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, MapPin } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface Nexus {
  id: string
  state: string
  nexus_type: string
  established_date: string
  is_active: boolean
}

export function TaxNexusManager() {
  const [nexus, setNexus] = useState<Nexus[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    loadNexus()
  }, [])

  async function loadNexus() {
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user) return

    const { data } = await supabase.from("sales_tax_nexus").select("*").eq("user_id", user.id).order("state")

    if (data) setNexus(data)
    setLoading(false)
  }

  if (loading) {
    return <div>Loading nexus...</div>
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold">Tax Nexus Locations</h3>
          <p className="text-sm text-muted-foreground">Manage where your business has tax obligations</p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Nexus
        </Button>
      </div>

      <div className="space-y-3">
        {nexus.length === 0 ? (
          <div className="text-center py-12">
            <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No tax nexus locations defined</p>
            <p className="text-sm text-muted-foreground mt-1">Add locations where you have tax obligations</p>
          </div>
        ) : (
          nexus.map((n) => (
            <div key={n.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">{n.state}</p>
                  <p className="text-sm text-muted-foreground">
                    {n.nexus_type} • Established {new Date(n.established_date).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <Badge variant={n.is_active ? "default" : "secondary"}>{n.is_active ? "Active" : "Inactive"}</Badge>
            </div>
          ))
        )}
      </div>
    </Card>
  )
}
