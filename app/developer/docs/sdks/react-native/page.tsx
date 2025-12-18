import type { Metadata } from "next"
import ReactNativeSDKPageClient from "./page.client"

export const metadata: Metadata = {
  title: "React Native SDK - Taxu Developer Docs",
  description: "Official React Native library for the Taxu API for iOS and Android apps.",
}

export default function ReactNativeSDKPage() {
  return <ReactNativeSDKPageClient />
}
