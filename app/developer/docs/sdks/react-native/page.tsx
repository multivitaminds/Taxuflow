import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"

export default function ReactNativeSDKPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      <div className="pt-24 pb-16">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="mb-12">
            <h1 className="text-4xl font-bold mb-4">React Native SDK</h1>
            <p className="text-lg text-muted-foreground">
              Coming soon. React Native SDK documentation will be available here.
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}
