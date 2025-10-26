// Factory to create the appropriate e-file provider

import type { EFileProvider } from "./types"
import { MockEFileProvider } from "./providers/mock-provider"
import { TaxBanditsProvider } from "./providers/taxbandits-provider"

export function createEFileProvider(): EFileProvider {
  const hasTaxBanditsConfig = process.env.TAXBANDITS_API_KEY && process.env.TAXBANDITS_API_SECRET

  console.log("[v0] Creating e-file provider:", hasTaxBanditsConfig ? "taxbandits" : "mock")

  if (hasTaxBanditsConfig) {
    return new TaxBanditsProvider()
  }

  return new MockEFileProvider()
}
