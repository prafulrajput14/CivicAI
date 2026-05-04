import { useState, useMemo, useEffect, useCallback } from "react";
import {
  ArrowLeft,
  Briefcase,
  ExternalLink,
  Search,
  Trophy,
  Ticket,
  KeyRound,
  GraduationCap,
  FileText,
  TrendingUp,
  Clock,
  X,
  RefreshCw,
  Wifi,
  WifiOff,
  Sparkles,
} from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { ScrollArea } from "./ui/scroll-area";
import {
  type JobCategory,
  type SarkariJob,
  ALL_CATEGORIES,
  CATEGORY_META,
  sarkariJobs as staticJobs,
  LAST_UPDATED as STATIC_LAST_UPDATED,
} from "../data/sarkariResultData";

const REFETCH_INTERVAL_MS = 5 * 60 * 1000;

interface GovtJobsBoardProps {
  onBack: () => void;
}

interface ApiResponse {
  success: boolean;
  lastUpdated: string | null;
  totalJobs: number;
  totalAll: number;
  jobs: ApiJob[];
}

interface ApiJob {
  title: string;
  link: string;
  category: JobCategory;
  tag?: string | null;
  isNew?: boolean;
  lastSeen?: string;
}

const CATEGORY_ICONS: Record<JobCategory, React.ReactNode> = {
  "latest-jobs": <Briefcase className="h-4 w-4" />,
  results: <Trophy className="h-4 w-4" />,
  "admit-card": <Ticket className="h-4 w-4" />,
  "answer-key": <KeyRound className="h-4 w-4" />,
  admission: <GraduationCap className="h-4 w-4" />,
  documents: <FileText className="h-4 w-4" />,
};

function getTagStyle(tag: string | null | undefined): string {
  switch (tag) {
    case "Out":
      return "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800";
    case "New":
      return "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300 border-orange-200 dark:border-orange-800";
    case "Start":
      return "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 border-blue-200 dark:border-blue-800";
    case "Soon":
      return "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 border-amber-200 dark:border-amber-800";
    case "Updated":
      return "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300 border-violet-200 dark:border-violet-800";
    case "Last Date Today":
      return "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300 border-red-200 dark:border-red-800 animate-pulse";
    case "Date Extend":
      return "bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300 border-teal-200 dark:border-teal-800";
    case "Link Active":
      return "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300 border-green-200 dark:border-green-800";
    default:
      return "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400";
  }
}

function timeAgo(dateStr: string | null): string {
  if (!dateStr) return "N/A";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

function JobItem({ job, index }: { job: ApiJob | SarkariJob; index: number }) {
  const tag = job.tag;
  const isNewFromApi = "isNew" in job && job.isNew;

  return (
    <div
      className="group flex items-start gap-3 p-3 sm:p-4 rounded-xl border border-transparent hover:border-border hover:bg-card/80 hover:shadow-soft transition-all duration-200 cursor-pointer"
      onClick={() => window.open(job.link, "_blank", "noopener")}
    >
      <div className={`flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-semibold transition-colors duration-200 ${
        isNewFromApi
          ? "bg-primary text-primary-foreground"
          : "bg-muted text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground"
      }`}>
        {isNewFromApi ? "✦" : index + 1}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium leading-snug text-foreground group-hover:text-primary transition-colors duration-200 line-clamp-2">
          {job.title}
        </p>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        {tag && (
          <span className={`text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded-full border ${getTagStyle(tag)}`}>
            {tag}
          </span>
        )}
        <ExternalLink className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity duration-200 hidden sm:block" />
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="space-y-2 p-4">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="flex items-start gap-3 p-3 animate-pulse">
          <div className="w-7 h-7 rounded-lg bg-muted" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-muted rounded w-3/4" />
            <div className="h-3 bg-muted rounded w-1/2" />
          </div>
          <div className="h-5 w-12 bg-muted rounded-full" />
        </div>
      ))}
    </div>
  );
}

export function GovtJobsBoard({ onBack }: GovtJobsBoardProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [jobs, setJobs] = useState<(ApiJob | SarkariJob)[]>(staticJobs);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [isLive, setIsLive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchJobs = useCallback(async (showLoading = false) => {
    if (showLoading) setIsLoading(true);
    else setIsRefreshing(true);
    try {
      const res = await fetch("/api/jobs");
      if (!res.ok) throw new Error("API not available");
      const data: ApiResponse = await res.json();
      if (data.success && data.jobs.length > 0) {
        setJobs(data.jobs);
        setLastUpdated(data.lastUpdated);
        setIsLive(true);
      }
    } catch {
      setIsLive(false);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchJobs(true);
    const interval = setInterval(() => fetchJobs(false), REFETCH_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [fetchJobs]);

  const { categoryCounts, categoryJobs, searchResults } = useMemo(() => {
    const counts: Record<string, number> = {};
    const catJobs: Record<string, (ApiJob | SarkariJob)[]> = {};
    ALL_CATEGORIES.forEach((cat) => {
      const filtered = jobs.filter((j) => j.category === cat);
      counts[cat] = filtered.length;
      catJobs[cat] = filtered;
    });
    let results: (ApiJob | SarkariJob)[] = [];
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      results = jobs.filter((j) => j.title.toLowerCase().includes(q));
    }
    return { categoryCounts: counts, categoryJobs: catJobs, searchResults: results };
  }, [jobs, searchQuery]);

  const totalJobs = jobs.length;
  const displayLastUpdated = isLive ? timeAgo(lastUpdated) : STATIC_LAST_UPDATED;

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-5xl mx-auto">
      {/* ===== HEADER ===== */}
      <div className="sticky top-0 z-20 backdrop-blur-xl bg-background/80 border-b">
        <div className="flex items-center gap-3 p-3 sm:p-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="rounded-full hover:bg-muted flex-shrink-0"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>

          {isSearchOpen ? (
            <div className="flex-1 flex items-center gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  autoFocus
                  placeholder="Search jobs, results, admit cards..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border bg-card focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                />
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full flex-shrink-0"
                onClick={() => { setIsSearchOpen(false); setSearchQuery(""); }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="h-10 w-10 flex items-center justify-center rounded-xl gradient-hero text-white shadow-soft flex-shrink-0">
                  <Briefcase className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <h2 className="font-bold text-foreground text-base sm:text-lg truncate">
                    सरकारी नौकरी बोर्ड
                  </h2>
                  <p className="text-[11px] text-muted-foreground hidden sm:block">
                    Live Sarkari Jobs, Results & Admit Cards
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5">
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full flex-shrink-0"
                  onClick={() => fetchJobs(false)}
                  disabled={isRefreshing}
                >
                  <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full flex-shrink-0"
                  onClick={() => setIsSearchOpen(true)}
                >
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </>
          )}
        </div>

        {/* Stats strip */}
        <div className="flex items-center gap-4 px-4 pb-3 text-[11px] text-muted-foreground overflow-x-auto scrollbar-none">
          <div className={`flex items-center gap-1.5 whitespace-nowrap font-medium ${
            isLive ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"
          }`}>
            {isLive ? <Wifi className="h-3.5 w-3.5" /> : <WifiOff className="h-3.5 w-3.5" />}
            {isLive ? "LIVE" : "OFFLINE"}
          </div>
          <div className="h-3 w-px bg-border" />
          <div className="flex items-center gap-1.5 whitespace-nowrap">
            <TrendingUp className="h-3.5 w-3.5 text-primary" />
            <span className="font-bold text-foreground">{totalJobs}</span> Listings
          </div>
          <div className="h-3 w-px bg-border" />
          <div className="flex items-center gap-1.5 whitespace-nowrap">
            <Clock className="h-3.5 w-3.5 text-secondary" />
            Updated: {displayLastUpdated}
          </div>
          <div className="h-3 w-px bg-border" />
          <div className="flex items-center gap-1.5 whitespace-nowrap">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            Sarkari Result
          </div>
        </div>
      </div>

      {/* ===== CONTENT ===== */}
      <ScrollArea className="flex-1">
        <div className="p-3 sm:p-4">
          {isLoading ? (
            <LoadingSkeleton />
          ) : searchQuery.trim() ? (
            <div>
              {searchResults.length === 0 ? (
                <div className="text-center py-12">
                  <div className="h-16 w-16 mx-auto mb-4 rounded-2xl bg-muted flex items-center justify-center">
                    <Search className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground font-medium">"{searchQuery}" ke liye koi result nahi mila</p>
                  <p className="text-xs text-muted-foreground mt-1">Doosre keywords se khojein</p>
                </div>
              ) : (
                <>
                  <p className="text-xs text-muted-foreground px-1 py-2">
                    <span className="font-semibold text-foreground">{searchResults.length}</span> results for "{searchQuery}"
                  </p>
                  <div className="bg-card rounded-2xl border shadow-card overflow-hidden divide-y divide-border/50">
                    {searchResults.map((job, i) => (
                      <JobItem key={`search-${job.link}-${i}`} job={job} index={i} />
                    ))}
                  </div>
                </>
              )}
            </div>
          ) : (
            <Tabs defaultValue="latest-jobs" className="w-full">
              <TabsList className="w-full h-auto flex-wrap gap-1.5 bg-muted/50 p-1.5 rounded-xl mb-4">
                {ALL_CATEGORIES.map((cat) => {
                  const meta = CATEGORY_META[cat];
                  return (
                    <TabsTrigger
                      key={cat}
                      value={cat}
                      className="flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm rounded-lg data-[state=active]:shadow-soft data-[state=active]:bg-background transition-all duration-200"
                    >
                      {CATEGORY_ICONS[cat]}
                      <span className="hidden sm:inline">{meta.label}</span>
                      <span className="sm:hidden">{meta.label.split(" ")[0]}</span>
                      <Badge variant="secondary" className="h-5 min-w-[20px] px-1.5 text-[10px] rounded-full ml-0.5">
                        {categoryCounts[cat] || 0}
                      </Badge>
                    </TabsTrigger>
                  );
                })}
              </TabsList>

              {ALL_CATEGORIES.map((cat) => {
                const meta = CATEGORY_META[cat];
                const catJobsList = categoryJobs[cat] || [];
                return (
                  <TabsContent key={cat} value={cat} className="mt-0">
                    <div className="flex items-center justify-between mb-3 px-1">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg flex items-center justify-center text-white" style={{ backgroundColor: meta.color }}>
                          {CATEGORY_ICONS[cat]}
                        </div>
                        <div>
                          <h3 className="font-semibold text-sm text-foreground">{meta.label}</h3>
                          <p className="text-[11px] text-muted-foreground">{meta.labelHi}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="text-xs">{categoryCounts[cat] || 0} updates</Badge>
                    </div>

                    <div className="bg-card rounded-2xl border shadow-card overflow-hidden">
                      {catJobsList.length === 0 ? (
                        <div className="text-center py-12">
                          <div className="h-16 w-16 mx-auto mb-4 rounded-2xl bg-muted flex items-center justify-center">
                            <FileText className="h-8 w-8 text-muted-foreground" />
                          </div>
                          <p className="text-muted-foreground">Is category mein abhi koi update nahi hai.</p>
                        </div>
                      ) : (
                        <div className="divide-y divide-border/50">
                          {catJobsList.map((job, i) => (
                            <JobItem key={`${cat}-${job.link}-${i}`} job={job} index={i} />
                          ))}
                        </div>
                      )}
                    </div>
                  </TabsContent>
                );
              })}
            </Tabs>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
