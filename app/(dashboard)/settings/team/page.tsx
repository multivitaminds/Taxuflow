"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function TeamPage() {
  const teamMembers = [
    { name: "Jane Smith", email: "jane@taxu.com", role: "Admin", department: "Executive", status: "Active" },
    { name: "John Doe", email: "john@taxu.com", role: "Manager", department: "Finance", status: "Active" },
    { name: "Sarah Wilson", email: "sarah@taxu.com", role: "Member", department: "Operations", status: "Active" },
    { name: "Mike Johnson", email: "mike@taxu.com", role: "Member", department: "Finance", status: "Invited" },
  ]

  const departments = [
    { name: "Executive", members: 2, budget: "$50,000" },
    { name: "Finance", members: 5, budget: "$30,000" },
    { name: "Operations", members: 8, budget: "$40,000" },
    { name: "Engineering", members: 12, budget: "$60,000" },
  ]

  return (
    <div className="mx-auto max-w-6xl p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground mb-2">Team & Departments</h1>
          <p className="text-sm text-muted-foreground">Manage team members, roles, and department organization.</p>
        </div>
        <Button className="h-8 text-xs">+ Invite Member</Button>
      </div>

      <Tabs defaultValue="members" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="members">Team Members</TabsTrigger>
          <TabsTrigger value="departments">Departments</TabsTrigger>
        </TabsList>

        <TabsContent value="members">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-border hover:bg-transparent">
                    <TableHead className="text-xs font-medium text-muted-foreground">Name</TableHead>
                    <TableHead className="text-xs font-medium text-muted-foreground">Email</TableHead>
                    <TableHead className="text-xs font-medium text-muted-foreground">Role</TableHead>
                    <TableHead className="text-xs font-medium text-muted-foreground">Department</TableHead>
                    <TableHead className="text-xs font-medium text-muted-foreground">Status</TableHead>
                    <TableHead className="w-[100px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teamMembers.map((member, index) => (
                    <TableRow key={index} className="border-b border-border hover:bg-muted/50">
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="text-xs">
                              {member.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm font-medium">{member.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{member.email}</TableCell>
                      <TableCell className="text-sm">{member.role}</TableCell>
                      <TableCell className="text-sm">{member.department}</TableCell>
                      <TableCell>
                        <Badge variant={member.status === "Active" ? "default" : "secondary"} className="text-[10px]">
                          {member.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" className="h-7 text-xs">
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="departments">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-border hover:bg-transparent">
                    <TableHead className="text-xs font-medium text-muted-foreground">Department</TableHead>
                    <TableHead className="text-xs font-medium text-muted-foreground">Members</TableHead>
                    <TableHead className="text-xs font-medium text-muted-foreground">Monthly Budget</TableHead>
                    <TableHead className="w-[100px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {departments.map((dept, index) => (
                    <TableRow key={index} className="border-b border-border hover:bg-muted/50">
                      <TableCell className="font-medium text-sm">{dept.name}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{dept.members} members</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{dept.budget}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" className="h-7 text-xs">
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
