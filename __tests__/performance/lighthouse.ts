import lighthouse from "lighthouse"
import * as chromeLauncher from "chrome-launcher"

async function runLighthouse(url: string) {
  const chrome = await chromeLauncher.launch({ chromeFlags: ["--headless"] })
  const options = {
    logLevel: "info" as const,
    output: "html" as const,
    onlyCategories: ["performance", "accessibility", "best-practices", "seo"],
    port: chrome.port,
  }

  const runnerResult = await lighthouse(url, options)

  // Extract scores
  const scores = {
    performance: runnerResult?.lhr.categories.performance.score! * 100,
    accessibility: runnerResult?.lhr.categories.accessibility.score! * 100,
    bestPractices: runnerResult?.lhr.categories["best-practices"].score! * 100,
    seo: runnerResult?.lhr.categories.seo.score! * 100,
  }

  console.log("\n=== Lighthouse Scores ===")
  console.log(`Performance: ${scores.performance}`)
  console.log(`Accessibility: ${scores.accessibility}`)
  console.log(`Best Practices: ${scores.bestPractices}`)
  console.log(`SEO: ${scores.seo}`)

  // Fail if performance is below 90
  if (scores.performance < 90) {
    console.error("❌ Performance score below threshold!")
    process.exit(1)
  }

  await chrome.kill()
  return scores
}

// Run for key pages
const pagesToTest = ["http://localhost:3000", "http://localhost:3000/neobank", "http://localhost:3000/accounting"]

async function runAll() {
  for (const url of pagesToTest) {
    console.log(`\nTesting: ${url}`)
    await runLighthouse(url)
  }
}

runAll().catch(console.error)
