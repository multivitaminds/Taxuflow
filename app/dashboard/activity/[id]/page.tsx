import { redirect, notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowLeft, Calendar, User } from "lucide-react"
import Link from "next/link"

interface ActivityPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function ActivityPage({ params }: ActivityPageProps) {
  const supabase = await createClient()

  if (!supabase) {
    redirect("/login")
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { id } = await params

  // Fetch the activity from the database
  const { data: activity, error } = await supabase
    .from("agent_activities")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single()

  if (error || !activity) {
    notFound()
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    })
  }

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <Link href="/dashboard">
          <Button variant="ghost" className="mb-6 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>

        <Card className="p-8 border-neon/20 bg-card/50 backdrop-blur">
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 rounded-full bg-neon/10 flex items-center justify-center flex-shrink-0">
              <User className="w-6 h-6 text-neon" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold">{activity.agent_name}</h1>
                <span className="px-2 py-1 rounded-full bg-neon/10 text-neon text-xs font-medium">AI Agent</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(activity.created_at)}</span>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold mb-3">{activity.title}</h2>
              {activity.description && <p className="text-muted-foreground leading-relaxed">{activity.description}</p>}
            </div>

            {activity.metadata && (
              <div className="pt-6 border-t border-border">
                <h3 className="font-semibold mb-3">Activity Details</h3>
                <div className="bg-background/50 rounded-lg p-4">
                  <pre className="text-sm text-muted-foreground overflow-x-auto">
                    {JSON.stringify(activity.metadata, null, 2)}
                  </pre>
                </div>
              </div>
            )}

            {activity.result && (
              <div className="pt-6 border-t border-border">
                <h3 className="font-semibold mb-3">Result</h3>
                <div className="bg-background/50 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground">{activity.result}</p>
                </div>
              </div>
            )}
          </div>

          <div className="mt-8 pt-6 border-t border-border">
            <Link href={`/chat?agent=${activity.agent_name.toLowerCase()}`}>
              <Button className="bg-neon hover:bg-neon/90 text-background">Chat with {activity.agent_name}</Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  )
}
