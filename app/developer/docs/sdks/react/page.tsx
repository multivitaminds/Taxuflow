import type { Metadata } from "next"
import ClientPage from "./client-page"

export const metadata: Metadata = {
  title: "React SDK - Taxu Developer Docs",
  description: "Official React library for the Taxu API with hooks and components for seamless integration.",
}

export default function ReactSDKPage() {
  return <ClientPage />
}
