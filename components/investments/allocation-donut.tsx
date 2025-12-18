"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"

export function AllocationDonut() {
  const data = [
    { name: "Stocks", value: 65, color: "hsl(var(--primary))" },
    { name: "Bonds", value: 20, color: "hsl(var(--accent))" },
    { name: "Real Estate", value: 10, color: "hsl(var(--chart-3))" },
    { name: "Cash", value: 5, color: "hsl(var(--muted))" },
  ]

  return (
    <div className="space-y-4">
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={2} dataKey="value">
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "hsl(var(--card))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "8px",
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="grid grid-cols-2 gap-3">
        {data.map((item) => (
          <div key={item.name} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
            <div className="flex-1">
              <p className="text-xs text-muted-foreground">{item.name}</p>
              <p className="text-sm font-semibold">{item.value}%</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
