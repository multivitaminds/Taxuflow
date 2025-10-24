// Factory to create the appropriate e-file provider

import type { EFileProvider } from "./types"
import { MockEFileProvider } from "./providers/mock-provider"
import { TaxBanditsProvider } from "./providers/taxbandits-provider"

export function createEFileProvider(): EFileProvider {
  const providerType = process.env.EFILE_PROVIDER || "mock"

  console.log("[v0] Creating e-file provider:", providerType)

  switch (providerType.toLowerCase()) {
    case "taxbandits":
      return new TaxBanditsProvider()
    case "mock":
    default:
      return new MockEFileProvider()
  }
}
