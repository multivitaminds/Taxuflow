"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Shield, Users, Eye, Edit, DollarSign, FileText, Settings, Plus, Trash2, Lock, Database } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"

interface Permission {
  id: string
  name: string
  description: string
  icon: any
  category: string
}

interface FieldPermission {
  field: string
  module: string
  canView: boolean
  canEdit: boolean
}

interface Role {
  id: string
  name: string
  description: string
  userCount: number
  isCustom: boolean
  permissions: Record<string, boolean>
  fieldPermissions: FieldPermission[]
}

const availablePermissions: Permission[] = [
  { id: "view_reports", name: "View Reports", description: "Access financial reports", icon: Eye, category: "Reports" },
  {
    id: "export_reports",
    name: "Export Reports",
    description: "Download and export reports",
    icon: FileText,
    category: "Reports",
  },
  {
    id: "edit_transactions",
    name: "Edit Transactions",
    description: "Create and modify transactions",
    icon: Edit,
    category: "Transactions",
  },
  {
    id: "delete_transactions",
    name: "Delete Transactions",
    description: "Remove transactions",
    icon: Trash2,
    category: "Transactions",
  },
  {
    id: "approve_payments",
    name: "Approve Payments",
    description: "Approve payment requests",
    icon: DollarSign,
    category: "Payments",
  },
  {
    id: "process_payments",
    name: "Process Payments",
    description: "Execute payments",
    icon: DollarSign,
    category: "Payments",
  },
  {
    id: "manage_invoices",
    name: "Manage Invoices",
    description: "Create and send invoices",
    icon: FileText,
    category: "Invoices",
  },
  { id: "void_invoices", name: "Void Invoices", description: "Cancel invoices", icon: FileText, category: "Invoices" },
  {
    id: "manage_customers",
    name: "Manage Customers",
    description: "Create and edit customers",
    icon: Users,
    category: "Customers",
  },
  {
    id: "view_customer_details",
    name: "View Customer Details",
    description: "Access customer information",
    icon: Eye,
    category: "Customers",
  },
  {
    id: "manage_vendors",
    name: "Manage Vendors",
    description: "Create and edit vendors",
    icon: Users,
    category: "Vendors",
  },
  {
    id: "manage_products",
    name: "Manage Products",
    description: "Create and edit products",
    icon: Database,
    category: "Products",
  },
  {
    id: "manage_settings",
    name: "Manage Settings",
    description: "Configure system settings",
    icon: Settings,
    category: "Settings",
  },
  { id: "manage_users", name: "Manage Users", description: "Add and remove users", icon: Users, category: "Settings" },
]

const fieldLevelOptions = [
  { module: "Invoices", field: "Amount", description: "Invoice total amount" },
  { module: "Invoices", field: "Customer Name", description: "Customer information" },
  { module: "Invoices", field: "Payment Terms", description: "Payment terms and conditions" },
  { module: "Customers", field: "Credit Limit", description: "Customer credit limit" },
  { module: "Customers", field: "Payment History", description: "Historical payment data" },
  { module: "Transactions", field: "Amount", description: "Transaction amount" },
  { module: "Transactions", field: "Account", description: "Associated account" },
  { module: "Employees", field: "Salary", description: "Employee compensation" },
  { module: "Employees", field: "Bank Details", description: "Banking information" },
]

export function UserRolesClient() {
  const { toast } = useToast()
  const [roles, setRoles] = useState<Role[]>([
    {
      id: "admin",
      name: "Administrator",
      description: "Full access to all features",
      userCount: 2,
      isCustom: false,
      permissions: {
        view_reports: true,
        export_reports: true,
        edit_transactions: true,
        delete_transactions: true,
        approve_payments: true,
        process_payments: true,
        manage_invoices: true,
        void_invoices: true,
        manage_customers: true,
        view_customer_details: true,
        manage_vendors: true,
        manage_products: true,
        manage_settings: true,
        manage_users: true,
      },
      fieldPermissions: fieldLevelOptions.map((f) => ({
        field: f.field,
        module: f.module,
        canView: true,
        canEdit: true,
      })),
    },
    {
      id: "accountant",
      name: "Accountant",
      description: "Can manage transactions and view reports",
      userCount: 5,
      isCustom: false,
      permissions: {
        view_reports: true,
        export_reports: true,
        edit_transactions: true,
        delete_transactions: false,
        approve_payments: false,
        process_payments: true,
        manage_invoices: true,
        void_invoices: false,
        manage_customers: true,
        view_customer_details: true,
        manage_vendors: true,
        manage_products: true,
        manage_settings: false,
        manage_users: false,
      },
      fieldPermissions: fieldLevelOptions.map((f) => ({
        field: f.field,
        module: f.module,
        canView: true,
        canEdit: !f.field.includes("Salary") && !f.field.includes("Bank Details"),
      })),
    },
    {
      id: "viewer",
      name: "Viewer",
      description: "Read-only access to reports",
      userCount: 12,
      isCustom: false,
      permissions: {
        view_reports: true,
        export_reports: false,
        edit_transactions: false,
        delete_transactions: false,
        approve_payments: false,
        process_payments: false,
        manage_invoices: false,
        void_invoices: false,
        manage_customers: false,
        view_customer_details: true,
        manage_vendors: false,
        manage_products: false,
        manage_settings: false,
        manage_users: false,
      },
      fieldPermissions: fieldLevelOptions.map((f) => ({
        field: f.field,
        module: f.module,
        canView: !f.field.includes("Salary") && !f.field.includes("Bank Details") && !f.field.includes("Credit Limit"),
        canEdit: false,
      })),
    },
  ])

  const [selectedRole, setSelectedRole] = useState<Role>(roles[0])
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [newRoleName, setNewRoleName] = useState("")
  const [newRoleDescription, setNewRoleDescription] = useState("")

  const togglePermission = (permissionId: string) => {
    const updatedRole = {
      ...selectedRole,
      permissions: {
        ...selectedRole.permissions,
        [permissionId]: !selectedRole.permissions[permissionId],
      },
    }
    setSelectedRole(updatedRole)
    setRoles(roles.map((r) => (r.id === updatedRole.id ? updatedRole : r)))
    toast({ title: "Permission updated", description: "Role permissions have been saved." })
  }

  const toggleFieldPermission = (module: string, field: string, type: "view" | "edit") => {
    const updatedFieldPermissions = selectedRole.fieldPermissions.map((fp) => {
      if (fp.module === module && fp.field === field) {
        if (type === "view") {
          return { ...fp, canView: !fp.canView, canEdit: !fp.canView ? fp.canEdit : false }
        } else {
          return { ...fp, canEdit: !fp.canEdit }
        }
      }
      return fp
    })

    const updatedRole = {
      ...selectedRole,
      fieldPermissions: updatedFieldPermissions,
    }
    setSelectedRole(updatedRole)
    setRoles(roles.map((r) => (r.id === updatedRole.id ? updatedRole : r)))
    toast({ title: "Field permission updated", description: "Field-level security has been saved." })
  }

  const createCustomRole = () => {
    if (!newRoleName.trim()) {
      toast({ title: "Error", description: "Role name is required", variant: "destructive" })
      return
    }

    const newRole: Role = {
      id: `custom_${Date.now()}`,
      name: newRoleName,
      description: newRoleDescription,
      userCount: 0,
      isCustom: true,
      permissions: Object.fromEntries(availablePermissions.map((p) => [p.id, false])),
      fieldPermissions: fieldLevelOptions.map((f) => ({
        field: f.field,
        module: f.module,
        canView: false,
        canEdit: false,
      })),
    }

    setRoles([...roles, newRole])
    setSelectedRole(newRole)
    setNewRoleName("")
    setNewRoleDescription("")
    setIsCreateDialogOpen(false)
    toast({ title: "Role created", description: `${newRoleName} has been created successfully.` })
  }

  const deleteRole = (roleId: string) => {
    const role = roles.find((r) => r.id === roleId)
    if (!role?.isCustom) {
      toast({ title: "Error", description: "Cannot delete system roles", variant: "destructive" })
      return
    }

    setRoles(roles.filter((r) => r.id !== roleId))
    setSelectedRole(roles[0])
    toast({ title: "Role deleted", description: "Custom role has been removed." })
  }

  const permissionsByCategory = availablePermissions.reduce(
    (acc, permission) => {
      if (!acc[permission.category]) {
        acc[permission.category] = []
      }
      acc[permission.category].push(permission)
      return acc
    },
    {} as Record<string, Permission[]>,
  )

  return (
    <div className="min-h-screen bg-background p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <Link
            href="/accounting/settings"
            className="text-sm text-muted-foreground hover:text-foreground mb-2 inline-block"
          >
            ← Back to Settings
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">User Roles & Permissions</h1>
          <p className="text-muted-foreground mt-2">Configure access control and field-level security</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#635bff] hover:bg-[#5851df] text-white">
              <Plus className="mr-2 h-4 w-4" />
              Create Custom Role
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Custom Role</DialogTitle>
              <DialogDescription>Define a new role with specific permissions</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="roleName">Role Name</Label>
                <Input
                  id="roleName"
                  placeholder="e.g., Sales Manager"
                  value={newRoleName}
                  onChange={(e) => setNewRoleName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="roleDescription">Description</Label>
                <Textarea
                  id="roleDescription"
                  placeholder="Describe what this role can do..."
                  value={newRoleDescription}
                  onChange={(e) => setNewRoleDescription(e.target.value)}
                />
              </div>
              <Button onClick={createCustomRole} className="w-full">
                Create Role
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="p-6 md:col-span-1">
          <h2 className="text-lg font-semibold mb-4">Roles</h2>
          <div className="space-y-2">
            {roles.map((role) => (
              <div key={role.id} className="relative group">
                <button
                  onClick={() => setSelectedRole(role)}
                  className={`w-full text-left p-4 rounded-lg border transition-all ${
                    selectedRole.id === role.id
                      ? "border-[#635bff] bg-[#635bff]/5"
                      : "border-border hover:border-[#635bff]/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-[#635bff]" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium">{role.name}</h3>
                        {role.isCustom && (
                          <Badge variant="outline" className="text-xs">
                            Custom
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{role.userCount} users</p>
                    </div>
                  </div>
                </button>
                {role.isCustom && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation()
                      deleteRole(role.id)
                    }}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6 md:col-span-2">
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">{selectedRole.name}</h2>
                <p className="text-sm text-muted-foreground">{selectedRole.description}</p>
              </div>
              <Button variant="outline" asChild>
                <Link href={`/accounting/permissions/${selectedRole.id}/users`}>
                  <Users className="mr-2 h-4 w-4" />
                  Manage Users
                </Link>
              </Button>
            </div>
          </div>

          <Tabs defaultValue="module" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="module">Module Permissions</TabsTrigger>
              <TabsTrigger value="field">Field-Level Security</TabsTrigger>
            </TabsList>

            <TabsContent value="module" className="space-y-4">
              {Object.entries(permissionsByCategory).map(([category, permissions]) => (
                <div key={category} className="space-y-3">
                  <h3 className="text-sm font-semibold text-muted-foreground">{category}</h3>
                  <div className="space-y-2">
                    {permissions.map((permission) => {
                      const Icon = permission.icon
                      return (
                        <div key={permission.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-[#635bff]/10 rounded-lg flex items-center justify-center">
                              <Icon className="h-5 w-5 text-[#635bff]" />
                            </div>
                            <div>
                              <Label htmlFor={permission.id} className="font-medium cursor-pointer">
                                {permission.name}
                              </Label>
                              <p className="text-sm text-muted-foreground">{permission.description}</p>
                            </div>
                          </div>
                          <Switch
                            id={permission.id}
                            checked={selectedRole.permissions[permission.id] || false}
                            onCheckedChange={() => togglePermission(permission.id)}
                          />
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="field" className="space-y-4">
              <div className="flex items-center gap-2 p-4 bg-muted/50 rounded-lg">
                <Lock className="h-5 w-5 text-[#635bff]" />
                <div>
                  <p className="text-sm font-medium">Field-Level Security</p>
                  <p className="text-xs text-muted-foreground">Control access to specific fields within modules</p>
                </div>
              </div>

              {Object.entries(
                fieldLevelOptions.reduce(
                  (acc, option) => {
                    if (!acc[option.module]) acc[option.module] = []
                    acc[option.module].push(option)
                    return acc
                  },
                  {} as Record<string, typeof fieldLevelOptions>,
                ),
              ).map(([module, fields]) => (
                <div key={module} className="space-y-3">
                  <h3 className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
                    <Database className="h-4 w-4" />
                    {module}
                  </h3>
                  <div className="space-y-2">
                    {fields.map((fieldOption) => {
                      const fieldPerm = selectedRole.fieldPermissions.find(
                        (fp) => fp.module === fieldOption.module && fp.field === fieldOption.field,
                      )
                      return (
                        <div key={`${fieldOption.module}-${fieldOption.field}`} className="p-4 border rounded-lg">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <Label className="font-medium">{fieldOption.field}</Label>
                              <p className="text-sm text-muted-foreground">{fieldOption.description}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2">
                              <Switch
                                id={`${fieldOption.module}-${fieldOption.field}-view`}
                                checked={fieldPerm?.canView || false}
                                onCheckedChange={() =>
                                  toggleFieldPermission(fieldOption.module, fieldOption.field, "view")
                                }
                              />
                              <Label
                                htmlFor={`${fieldOption.module}-${fieldOption.field}-view`}
                                className="text-sm cursor-pointer"
                              >
                                <Eye className="h-4 w-4 inline mr-1" />
                                Can View
                              </Label>
                            </div>
                            <div className="flex items-center gap-2">
                              <Switch
                                id={`${fieldOption.module}-${fieldOption.field}-edit`}
                                checked={fieldPerm?.canEdit || false}
                                disabled={!fieldPerm?.canView}
                                onCheckedChange={() =>
                                  toggleFieldPermission(fieldOption.module, fieldOption.field, "edit")
                                }
                              />
                              <Label
                                htmlFor={`${fieldOption.module}-${fieldOption.field}-edit`}
                                className={`text-sm ${!fieldPerm?.canView ? "opacity-50" : "cursor-pointer"}`}
                              >
                                <Edit className="h-4 w-4 inline mr-1" />
                                Can Edit
                              </Label>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  )
}
