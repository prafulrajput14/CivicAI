/**
 * Cron job — runs the scraper every 1 hour
 * API key is optional now (direct fetch works without it)
 */
import cron from "node-cron";
import { scrapeAndUpdate } from "./scraper.js";

let isRunning = false;

export function startCronJob(apiKey) {
  // API key is now optional — direct fetch works without it
  console.log("[Cron] Starting auto-scrape system...");
  console.log(`[Cron] ZenRows API key: ${apiKey ? "configured ✅" : "not set (using direct fetch) ⚡"}`);

  // Run immediately on startup
  console.log("[Cron] Running initial scrape...");
  runScrape(apiKey);

  // Schedule every 1 hour: "0 * * * *"
  cron.schedule("0 * * * *", () => {
    console.log(`[Cron] ⏰ Scheduled scrape triggered at ${new Date().toLocaleString()}`);
    runScrape(apiKey);
  });

  console.log("[Cron] ✅ Scheduled scrape every 1 hour (at minute 0).");
}

async function runScrape(apiKey) {
  if (isRunning) {
    console.log("[Cron] Scrape already in progress, skipping...");
    return;
  }

  isRunning = true;
  try {
    const result = await scrapeAndUpdate(apiKey);
    console.log(
      `[Cron] ✅ Scrape complete: ${result.newCount} new jobs, ${result.totalJobs} total`
    );
  } catch (err) {
    console.error("[Cron] ❌ Scrape failed:", err.message);
  } finally {
    isRunning = false;
  }
}

/**
 * Manually trigger a scrape (for the /api/scrape endpoint)
 */
export async function triggerManualScrape(apiKey) {
  if (isRunning) {
    return { status: "already_running", message: "A scrape is already in progress" };
  }
  isRunning = true;
  try {
    const result = await scrapeAndUpdate(apiKey);
    return { status: "success", ...result };
  } catch (err) {
    return { status: "error", message: err.message };
  } finally {
    isRunning = false;
  }
}
