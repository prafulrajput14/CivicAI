/**
 * Express API server for Sarkari Result jobs
 * Runs on port 3001, serves /api/jobs and /api/scrape endpoints
 */
import "dotenv/config";
import express from "express";
import cors from "cors";
import { getStoredJobs } from "./scraper.js";
import { startCronJob, triggerManualScrape } from "./cron.js";
import authRouter from "./auth.js";

const app = express();
const PORT = process.env.SERVER_PORT || 3001;
const ZENROWS_API_KEY = process.env.ZENROWS_API_KEY;

// Middleware
app.use(cors());
app.use(express.json());

// Auth routes
app.use("/api/auth", authRouter);

// ===== API ENDPOINTS =====

/**
 * GET /api/jobs
 * Returns all jobs. Optional query params:
 *   ?category=latest-jobs|results|admit-card|answer-key|admission|documents
 *   ?search=keyword
 */
app.get("/api/jobs", (req, res) => {
  try {
    const data = getStoredJobs();
    let jobs = data.jobs || [];

    // Filter by category
    const category = req.query.category;
    if (category) {
      jobs = jobs.filter((j) => j.category === category);
    }

    // Filter by search query
    const search = req.query.search;
    if (search) {
      const q = search.toLowerCase();
      jobs = jobs.filter((j) => j.title.toLowerCase().includes(q));
    }

    res.json({
      success: true,
      lastUpdated: data.lastUpdated,
      totalJobs: jobs.length,
      totalAll: data.totalJobs,
      jobs,
    });
  } catch (err) {
    console.error("[API] Error fetching jobs:", err.message);
    res.status(500).json({ success: false, error: "Failed to load jobs" });
  }
});

/**
 * GET /api/jobs/stats
 * Returns category-wise counts and metadata
 */
app.get("/api/jobs/stats", (req, res) => {
  try {
    const data = getStoredJobs();
    const jobs = data.jobs || [];

    const categories = {};
    jobs.forEach((job) => {
      if (!categories[job.category]) {
        categories[job.category] = { count: 0, newCount: 0 };
      }
      categories[job.category].count++;
      if (job.isNew) categories[job.category].newCount++;
    });

    res.json({
      success: true,
      lastUpdated: data.lastUpdated,
      totalJobs: data.totalJobs,
      scrapeTimeMs: data.scrapeTimeMs,
      categories,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/scrape
 * Manually trigger a scrape (for admin use)
 * ZenRows API key is optional — direct fetch works without it
 */
app.post("/api/scrape", async (req, res) => {
  try {
    const result = await triggerManualScrape(ZENROWS_API_KEY || null);
    res.json({ success: true, ...result });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * GET /api/health
 * Health check endpoint
 */
app.get("/api/health", (req, res) => {
  const data = getStoredJobs();
  res.json({
    status: "ok",
    uptime: process.uptime(),
    lastUpdated: data.lastUpdated,
    totalJobs: data.totalJobs,
    zenrowsConfigured: !!ZENROWS_API_KEY,
    scrapeMode: ZENROWS_API_KEY ? "zenrows" : "direct-fetch",
  });
});

// ===== START SERVER =====
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`\n🚀 Sarkari Jobs API Server running on http://localhost:${PORT}`);
    console.log(`   📋 GET  /api/jobs        — All jobs`);
    console.log(`   📋 GET  /api/jobs?category=results  — Filter by category`);
    console.log(`   📊 GET  /api/jobs/stats   — Category stats`);
    console.log(`   🔄 POST /api/scrape       — Manual scrape trigger`);
    console.log(`     GET  /api/health       — Health check\n`);

    // Always start cron job — scraper works with or without ZenRows
    startCronJob(ZENROWS_API_KEY || null);
  });
}

export default app;
