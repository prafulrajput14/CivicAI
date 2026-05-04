/**
 * Sarkari Result Scraper — fetches and parses job data from sarkariresult.com.cm
 * Supports both ZenRows API and direct fetch (fallback)
 */
import axios from "axios";
import * as cheerio from "cheerio";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, "data", "jobs.json");

// Ensure data directory exists
const dataDir = path.join(__dirname, "data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const TARGET_URL = "https://sarkariresult.com.cm/";

// Realistic browser headers to avoid blocking
const BROWSER_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36",
  Accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
  "Accept-Language": "en-US,en;q=0.9,hi;q=0.8",
  "Accept-Encoding": "gzip, deflate, br",
  "Cache-Control": "no-cache",
  Pragma: "no-cache",
  "Sec-Ch-Ua": '"Chromium";v="125", "Not.A/Brand";v="24", "Google Chrome";v="125"',
  "Sec-Ch-Ua-Mobile": "?0",
  "Sec-Ch-Ua-Platform": '"Windows"',
  "Sec-Fetch-Dest": "document",
  "Sec-Fetch-Mode": "navigate",
  "Sec-Fetch-Site": "none",
  "Sec-Fetch-User": "?1",
  "Upgrade-Insecure-Requests": "1",
};

/** Extract status tag from a job title */
function extractTag(title) {
  const lower = title.toLowerCase();
  if (lower.includes("last date today")) return "Last Date Today";
  if (lower.includes("– start") || lower.includes("- start") || lower.endsWith("start")) return "Start";
  if (lower.includes("– out") || lower.includes("- out") || lower.endsWith("out")) return "Out";
  if (lower.includes("– soon") || lower.includes("- soon") || lower.endsWith("soon")) return "Soon";
  if (lower.includes("– updated") || lower.includes("- updated") || lower.endsWith("updated")) return "Updated";
  if (lower.includes("– declared") || lower.includes("- declared") || lower.endsWith("declared")) return "Declared";
  if (lower.includes("date extend")) return "Date Extend";
  if (lower.includes("link active")) return "Link Active";
  if (lower.includes("re-open") || lower.includes("reopen")) return "Re-open";
  if (lower.includes("cancelled") || lower.includes("canceled")) return "Cancelled";
  return null;
}

/**
 * Category detection by section heading found above the <ul>
 */
const SECTION_MAP = {
  results: "results",
  result: "results",
  "admit cards": "admit-card",
  "admit card": "admit-card",
  "latest jobs": "latest-jobs",
  "latest job": "latest-jobs",
  "answer key": "answer-key",
  "answer keys": "answer-key",
  documents: "documents",
  document: "documents",
  admission: "admission",
  admissions: "admission",
  syllabus: "syllabus",
};

function detectCategory(headingText) {
  const lower = (headingText || "").toLowerCase().trim();
  for (const [key, value] of Object.entries(SECTION_MAP)) {
    if (lower.includes(key)) return value;
  }
  return "latest-jobs"; // default
}

/**
 * Fetch HTML — tries direct fetch first, then ZenRows as fallback
 */
async function fetchHTML(apiKey) {
  // Method 1: Direct fetch (no API key needed)
  try {
    console.log(`[Scraper] Trying direct fetch of ${TARGET_URL}...`);
    const response = await axios.get(TARGET_URL, {
      headers: BROWSER_HEADERS,
      timeout: 30000,
      maxRedirects: 5,
    });
    if (response.data && response.data.length > 1000) {
      console.log(`[Scraper] Direct fetch successful (${response.data.length} chars)`);
      return response.data;
    }
  } catch (err) {
    console.log(`[Scraper] Direct fetch failed: ${err.message}`);
  }

  // Method 2: ZenRows API (if key is available)
  if (apiKey) {
    try {
      console.log(`[Scraper] Trying ZenRows API...`);
      const zenrowsUrl = `https://api.zenrows.com/v1/?apikey=${apiKey}&url=${encodeURIComponent(TARGET_URL)}&js_render=false`;
      const response = await axios.get(zenrowsUrl, { timeout: 30000 });
      if (response.data && response.data.length > 1000) {
        console.log(`[Scraper] ZenRows fetch successful (${response.data.length} chars)`);
        return response.data;
      }
    } catch (err) {
      console.log(`[Scraper] ZenRows fetch failed: ${err.message}`);
    }
  }

  // Method 3: Try with different user agent
  try {
    console.log(`[Scraper] Trying alternate user agent...`);
    const response = await axios.get(TARGET_URL, {
      headers: {
        "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:128.0) Gecko/20100101 Firefox/128.0",
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
      timeout: 30000,
    });
    if (response.data && response.data.length > 1000) {
      console.log(`[Scraper] Alternate fetch successful (${response.data.length} chars)`);
      return response.data;
    }
  } catch (err) {
    console.log(`[Scraper] Alternate fetch failed: ${err.message}`);
  }

  throw new Error("All fetch methods failed. Could not retrieve HTML from Sarkari Result.");
}

/**
 * Parse HTML and extract job listings — supports multiple HTML structures
 */
function parseJobs(html) {
  const $ = cheerio.load(html);
  const jobs = [];
  const seenLinks = new Set();

  function addJob(title, href, category, extraTag) {
    if (!title || !href) return;
    const normalizedLink = href.replace(/\/$/, "").toLowerCase();
    if (seenLinks.has(normalizedLink)) return;
    // Skip non-job links
    if (
      href.includes("contact") ||
      href.includes("privacy") ||
      href.includes("disclaimer") ||
      href.includes("whatsapp.com") ||
      href.includes("youtube.com") ||
      href.includes("telegram") ||
      href.includes("instagram") ||
      href.includes("facebook") ||
      href.includes("twitter") ||
      href.includes("x.com") ||
      href.includes("play.google.com") ||
      href === TARGET_URL ||
      href === "http://sarkariresult.com.cm/" ||
      href === "https://sarkariresult.com.cm/"
    ) {
      return;
    }
    seenLinks.add(normalizedLink);
    jobs.push({
      title: title.trim(),
      link: href,
      category,
      tag: extraTag || extractTag(title),
    });
  }

  // Strategy 1: GenerateBlocks grid structure (original selectors)
  $(".gb-grid-wrapper-180dce95 .gb-grid-column").each((_, column) => {
    const $col = $(column);
    const headingText = $col.find(".gb-headline-text").first().text().trim();
    const category = detectCategory(headingText);

    $col.find(".wp-block-latest-posts__list a, ul.wp-block-latest-posts a").each((__, link) => {
      const $link = $(link);
      addJob($link.text().trim(), $link.attr("href"), category, null);
    });
  });

  // Strategy 2: Any gb-grid-column (in case class name changed)
  $(".gb-grid-column").each((_, column) => {
    const $col = $(column);
    const headingText = $col.find(".gb-headline-text, h2, h3").first().text().trim();
    const category = detectCategory(headingText);

    $col.find("ul a, .wp-block-latest-posts__list a").each((__, link) => {
      const $link = $(link);
      addJob($link.text().trim(), $link.attr("href"), category, null);
    });
  });

  // Strategy 3: Featured/highlighted jobs at top
  $(".gb-container-0d9861a2 .gb-headline-text a").each((_, link) => {
    const $link = $(link);
    addJob($link.text().trim(), $link.attr("href"), "latest-jobs", extractTag($link.text()) || "New");
  });

  // Strategy 4: Broader fallback — look for sections by heading text
  const sections = ["Results", "Admit Cards", "Latest Jobs", "Answer Key", "Documents", "Admission"];
  sections.forEach((sectionName) => {
    const category = detectCategory(sectionName);

    // Find heading elements containing the section name
    $("h2, h3, .gb-headline-text, .gb-headline").each((_, heading) => {
      const $heading = $(heading);
      const headText = $heading.text().trim();

      if (headText.toLowerCase().includes(sectionName.toLowerCase())) {
        // Look for the nearest ul after this heading
        const $container = $heading.closest(".gb-grid-column, .gb-container, .wp-block-group, div");
        if ($container.length) {
          $container.find("ul a, .wp-block-latest-posts__list a").each((__, link) => {
            const $link = $(link);
            addJob($link.text().trim(), $link.attr("href"), category, null);
          });
        }

        // Also check next sibling elements
        let $next = $heading.parent().next();
        for (let i = 0; i < 5 && $next.length; i++) {
          $next.find("a").each((__, link) => {
            const $link = $(link);
            const href = $link.attr("href");
            if (href && href.includes("sarkariresult.com.cm/")) {
              addJob($link.text().trim(), href, category, null);
            }
          });
          if ($next.find("h2, h3, .gb-headline-text").length > 0) break;
          $next = $next.next();
        }
      }
    });
  });

  // Strategy 5: Ultimate fallback — grab ALL sarkariresult.com.cm links
  if (jobs.length < 10) {
    console.log("[Scraper] Using fallback: extracting all site links...");
    $("a").each((_, link) => {
      const $link = $(link);
      const href = $link.attr("href");
      const text = $link.text().trim();

      if (
        href &&
        text &&
        text.length > 10 &&
        href.includes("sarkariresult.com.cm/") &&
        !href.endsWith("sarkariresult.com.cm/")
      ) {
        // Try to guess category from URL
        let cat = "latest-jobs";
        if (href.includes("/result")) cat = "results";
        else if (href.includes("/admit-card")) cat = "admit-card";
        else if (href.includes("/answer-key")) cat = "answer-key";
        else if (href.includes("/admission")) cat = "admission";
        else if (href.includes("/syllabus")) cat = "documents";

        addJob(text, href, cat, null);
      }
    });
  }

  return jobs;
}

/**
 * Load existing jobs from disk
 */
function loadExistingJobs() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, "utf-8");
      const data = JSON.parse(raw);
      if (data && Array.isArray(data.jobs)) {
        return data;
      }
    }
  } catch (err) {
    console.error("[Scraper] Error loading existing jobs:", err.message);
  }
  return { lastUpdated: null, totalJobs: 0, jobs: [] };
}

/**
 * Save jobs to disk
 */
function saveJobs(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
}

/**
 * Main scrape function — fetches, parses, deduplicates, and saves
 * @param {string|null} apiKey - ZenRows API key (optional now)
 * @returns {{ newCount: number, totalJobs: number }} stats
 */
export async function scrapeAndUpdate(apiKey) {
  const startTime = Date.now();

  try {
    // 1. Fetch HTML (direct or via ZenRows)
    const html = await fetchHTML(apiKey);
    console.log(`[Scraper] Fetched HTML (${html.length} chars) in ${Date.now() - startTime}ms`);

    // 2. Parse jobs from HTML
    const freshJobs = parseJobs(html);
    console.log(`[Scraper] Parsed ${freshJobs.length} jobs from HTML`);

    if (freshJobs.length === 0) {
      console.warn("[Scraper] WARNING: No jobs parsed from HTML. Site structure may have changed.");
      console.warn("[Scraper] Keeping existing data unchanged.");
      const existing = loadExistingJobs();
      return { newCount: 0, totalJobs: existing.totalJobs || 0 };
    }

    // 3. Load existing data
    const existing = loadExistingJobs();
    const existingLinks = new Set(
      existing.jobs.map((j) => j.link.replace(/\/$/, "").toLowerCase())
    );

    // 4. Find truly new jobs
    const newJobs = freshJobs.filter(
      (j) => !existingLinks.has(j.link.replace(/\/$/, "").toLowerCase())
    );

    // 5. Merge: fresh jobs replace old data, keep any old jobs not in fresh list
    const freshLinks = new Set(
      freshJobs.map((j) => j.link.replace(/\/$/, "").toLowerCase())
    );
    const oldOnlyJobs = existing.jobs.filter(
      (j) => !freshLinks.has(j.link.replace(/\/$/, "").toLowerCase())
    );

    // Deduplicate: fresh first, then old-only
    const seenMerge = new Set();
    const merged = [];
    [...freshJobs, ...oldOnlyJobs].forEach((job) => {
      const key = job.link.replace(/\/$/, "").toLowerCase();
      if (!seenMerge.has(key)) {
        seenMerge.add(key);
        merged.push(job);
      }
    });

    // 6. Mark new jobs
    const now = new Date().toISOString();
    const markedJobs = merged.map((job) => {
      const isNew = newJobs.some(
        (nj) => nj.link.replace(/\/$/, "").toLowerCase() === job.link.replace(/\/$/, "").toLowerCase()
      );
      return {
        ...job,
        isNew: isNew || false,
        lastSeen: now,
      };
    });

    // 7. Save
    const data = {
      lastUpdated: now,
      totalJobs: markedJobs.length,
      scrapeTimeMs: Date.now() - startTime,
      jobs: markedJobs,
    };
    saveJobs(data);

    console.log(
      `[Scraper] ✅ Done! ${newJobs.length} new jobs, ${markedJobs.length} total. Took ${Date.now() - startTime}ms`
    );

    return { newCount: newJobs.length, totalJobs: markedJobs.length };
  } catch (err) {
    console.error("[Scraper] ❌ Error during scrape:", err.message);
    throw err;
  }
}

/**
 * Get all stored jobs (read from disk)
 */
export function getStoredJobs() {
  return loadExistingJobs();
}
