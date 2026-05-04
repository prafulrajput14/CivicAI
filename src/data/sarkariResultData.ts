// Sarkari Result data — parsed from scraped HTML (sarkariresult.com.cm)
// Last scraped: 2026-03-16

export type JobCategory =
  | "latest-jobs"
  | "results"
  | "admit-card"
  | "answer-key"
  | "admission"
  | "documents";

export interface SarkariJob {
  title: string;
  link: string;
  category: JobCategory;
  tag?: "New" | "Out" | "Soon" | "Start" | "Updated" | "Last Date Today" | "Date Extend" | "Link Active";
}

export const CATEGORY_META: Record<
  JobCategory,
  { label: string; labelHi: string; icon: string; color: string }
> = {
  "latest-jobs": {
    label: "Latest Jobs",
    labelHi: "नई नौकरियाँ",
    icon: "briefcase",
    color: "hsl(24 90% 50%)",
  },
  results: {
    label: "Results",
    labelHi: "परिणाम",
    icon: "trophy",
    color: "hsl(145 45% 45%)",
  },
  "admit-card": {
    label: "Admit Cards",
    labelHi: "प्रवेश पत्र",
    icon: "ticket",
    color: "hsl(210 80% 55%)",
  },
  "answer-key": {
    label: "Answer Keys",
    labelHi: "उत्तर कुंजी",
    icon: "key",
    color: "hsl(280 60% 55%)",
  },
  admission: {
    label: "Admissions",
    labelHi: "प्रवेश",
    icon: "graduation-cap",
    color: "hsl(350 70% 60%)",
  },
  documents: {
    label: "Documents",
    labelHi: "दस्तावेज़",
    icon: "file-text",
    color: "hsl(35 80% 50%)",
  },
};

function extractTag(title: string): SarkariJob["tag"] | undefined {
  const lower = title.toLowerCase();
  if (lower.includes("last date today")) return "Last Date Today";
  if (lower.includes("– start") || lower.includes("- start") || lower.endsWith("start")) return "Start";
  if (lower.includes("– out") || lower.includes("- out") || lower.endsWith("out")) return "Out";
  if (lower.includes("– soon") || lower.includes("- soon") || lower.endsWith("soon")) return "Soon";
  if (lower.includes("– updated") || lower.includes("- updated") || lower.endsWith("updated")) return "Updated";
  if (lower.includes("date extend")) return "Date Extend";
  if (lower.includes("link active")) return "Link Active";
  return undefined;
}

// ---------- LATEST JOBS ----------
const latestJobsRaw: [string, string][] = [
  ["AIIMS NORCET 10th Nursing Officer Online Form 2026 – Last Date Today", "https://sarkariresult.com.cm/aiims-norcet-10th-nursing-officer-2026/"],
  ["Indian Army NCC 124th October Course Online Form 2026 – Last Date Today", "https://sarkariresult.com.cm/indian-army-ncc-124th-october-course-2026/"],
  ["Allahabad HC Private Secretary Gr-I Online Form 2026", "https://sarkariresult.com.cm/allahabad-hc-private-secretary-gr-i-2026/"],
  ["BPSC School Teacher TRE 4.0 Online Form 2026 (44000+ Posts)", "https://sarkariresult.com.cm/bpsc-school-teacher-tre-4-0-2026/"],
  ["UPSSSC Teacher Cadre JTC Online Form 2026", "https://sarkariresult.com.cm/upsssc-teacher-cadre-jtc-2026/"],
  ["RRC SCR Apprentice Online Form 2026", "https://sarkariresult.com.cm/rrc-scr-apprentice-2026/"],
  ["Indian Navy Agniveer SSR / MR Online Form 2026 – Start", "https://sarkariresult.com.cm/indian-navy-agniveer-ssr-mr-2026/"],
  ["Indian Navy SSR Medical Online Form 2026 – Start", "https://sarkariresult.com.cm/indian-navy-ssr-medical-2026/"],
  ["MPESB Group 5 Paramedical Online Form 2026", "https://sarkariresult.com.cm/mpesb-group-5-paramedical-2026/"],
  ["Railway RRB Group D Online Form 2026 (22,195 Posts)", "https://sarkariresult.com.cm/railway-rrb-group-d-level-1-recruitment-2026-online/"],
  ["IDBI Bank JAM Online Form 2026 – Start", "https://sarkariresult.com.cm/idbi-bank-jam-2026/"],
  ["Indian Army Agniveer CEE Online Form 2026 – Start", "https://sarkariresult.com.cm/indian-army-agniveer-cee-2026/"],
  ["UPSRTC Bus Conductor Online Form 2026", "https://sarkariresult.com.cm/upsrtc-bus-conductor-2026/"],
  ["Railway RRC WR Apprentice Online Form 2026 (5349 Posts) – Start", "https://sarkariresult.com.cm/railway-rrc-wr-apprentice-2026/"],
  ["DSSSB Legal Asst, AE, JE, ASO Online Form 2026 – Start", "https://sarkariresult.com.cm/dsssb-legal-asst-ae-je-aso-2026/"],
  ["DSSSB Various Post Online Form 2026 – Start", "https://sarkariresult.com.cm/delhi-dsssb-various-post-2026/"],
  ["UP Anganwadi Bharti Online Form 2026 (Updated)", "https://sarkariresult.com.cm/up-anganwadi-bharti-2026/"],
  ["Bihar Police CSBC Constable Operator Online Form 2026", "https://sarkariresult.com.cm/bihar-police-csbc-constable-operator-2026/"],
  ["Railway RRC CR Apprentice Online Form 2026", "https://sarkariresult.com.cm/railway-rrc-cr-apprentice-2026/"],
  ["UPSSSC UP Pollution Control Board Various Post Online Form 2026", "https://sarkariresult.com.cm/upsssc-up-pollution-control-board-2026/"],
  ["UPSC Combined Medical Service CMS Online Form 2026", "https://sarkariresult.com.cm/upsc-cms-2026/"],
  ["UP Pollution Control Board AEE, ASO Online Form 2026", "https://sarkariresult.com.cm/uppcb-aee-aso-2026/"],
  ["UPSSSC Pharmacist Online Form 2026 – Start", "https://sarkariresult.com.cm/upsssc-pharmacist-2026/"],
  ["Bihar BPSC APO Online Form 2026 – Start", "https://sarkariresult.com.cm/bpsc-apo-2026/"],
  ["Bihar BPSC 33rd Judicial Services Online Form 2026 – Start", "https://sarkariresult.com.cm/bihar-bpsc-33rd-judicial-services-2026/"],
];

// ---------- RESULTS ----------
const resultsRaw: [string, string][] = [
  ["IBPS RRB XIV 14th Office Assistant Mains Result 2026 – Out", "https://sarkariresult.com.cm/ibps-rrb-officer-2026/"],
  ["Bihar Board Class 10th Result 2026 – Soon", "https://sarkariresult.com.cm/bihar-board-10th-result-2026/"],
  ["Bihar Board Class 12th Result 2026 – Soon", "https://sarkariresult.com.cm/bihar-board-12-result-2026/"],
  ["Railway RRB Group D Result 2026 – Soon", "https://sarkariresult.com.cm/railway-rrb-group-d-2026-chk-now/"],
  ["Jharkhand High Court Assistant Clerk Result 2026", "https://sarkariresult.com.cm/jharkhand-high-court-assistant-clerk-2025/"],
  ["UPPSC Computer Assistant Result 2026 – Out", "https://sarkariresult.com.cm/uppsc-computer-assistant-2026/"],
  ["CTET February Answer Key 2026 – Out", "https://sarkariresult.com.cm/ctet-february-2026/"],
  ["MPESB Police SI and Subedar Result 2026 – Out", "https://sarkariresult.com.cm/mpesb-police-si-and-subedar-2026/"],
  ["UPPSC LT Grade Assistant Teacher Result 2026 – Updated", "https://sarkariresult.com.cm/uppsc-lt-grade-assistant-teacher-2026/"],
  ["UPSSSC Junior Analyst Drugs 2024 Final Result – Out", "https://sarkariresult.com.cm/upsssc-junior-analyst-medicine-2024/"],
  ["Bihar BTSC SMO Final Result 2026 – Out", "https://sarkariresult.com.cm/bihar-btsc-smo-2025/"],
  ["Patna High Court Mazdoor Final Result 2026 – Out", "https://sarkariresult.com.cm/patna-high-court-mazdoor-2026/"],
  ["AFCAT 01/2026 Batch Result – Out", "https://sarkariresult.com.cm/afcat-01-2026/"],
  ["SBI Bank Clerk Mains Score Card 2026 – Out", "https://sarkariresult.com.cm/sbi-bank-clerk-mains-2025/"],
  ["Delhi DDA Various Posts Result 2026 – Updated", "https://sarkariresult.com.cm/dda-various-post-2026/"],
  ["BPSSC Bihar Police Enforcement SI Final Result 2026 – Out", "https://sarkariresult.com.cm/bpssc-bihar-police-enforcement-2026/"],
  ["UPSC Civil Services IAS Final Result With Marks 2026", "https://sarkariresult.com.cm/upsc-civil-services-2025/"],
  ["Bihar SHS Ophthalmic Assistant Result 2026 – Out", "https://sarkariresult.com.cm/bihar-shs-ophthalmic-assistant-2025/"],
  ["India Post GDS 1st Merit List 2026", "https://sarkariresult.com.cm/india-post-gds-2026/"],
  ["RRB Junior Engineer JE Answer Key 2026", "https://sarkariresult.com.cm/rrb-junior-engineer-je-2026/"],
  ["IB ACIO Gr-II Executive Tier-II Result 2026", "https://sarkariresult.com.cm/ib-acio-gr-ii-executive-2025/"],
  ["SSC MTS / Havaldar Answer Key 2026", "https://sarkariresult.com.cm/ssc-mts-havaldar-2026/"],
  ["UPSC Geo Scientist Pre Result 2026", "https://sarkariresult.com.cm/upsc-geo-scientist-2026/"],
  ["IBPS Clerk CSA XV Mains Result 2026", "https://sarkariresult.com.cm/ibps-clerk-csa-xv-2025/"],
  ["MPESB Primary School Teacher PSTST Result 2026", "https://sarkariresult.com.cm/mpesb-primary-school-teacher-pstst-2025/"],
];

// ---------- ADMIT CARDS ----------
const admitCardsRaw: [string, string][] = [
  ["UP Police SI Admit Card 2026 – Out", "https://sarkariresult.com.cm/up-police-si-2025/"],
  ["RRB NTPC Graduate Level CBT-I Admit Card 2026", "https://sarkariresult.com.cm/rrb-ntpc-graduate-level-2026/"],
  ["UP Police Constable Sports Quota DV / Sports Trial Admit Card 2026", "https://sarkariresult.com.cm/up-police-constable-sports-quota-2026/"],
  ["UPPSC Assistant Registrar Interview Letter 2026", "https://sarkariresult.com.cm/uppsc-assistant-registrar-2025/"],
  ["MPPSC SES Admit Card 2026 – Out", "https://sarkariresult.com.cm/mppsc-ses-2026/"],
  ["BSPHCL CC/ Store Assistant & Technical Gr-3 DV Schedule 2026", "https://sarkariresult.com.cm/bsphcl-cc-store-assistant-technical-gr-3-2025/"],
  ["RPSC Assistant Engineer Mains Exam City Details 2026", "https://sarkariresult.com.cm/rpsc-assistant-engineer-2025/"],
  ["JSSC Jharkhand ANM Admit Card 2026", "https://sarkariresult.com.cm/jharkhand-jssc-anm-2025/"],
  ["DRDO CEPTAM-11 Exam City Details 2026 – Out", "https://sarkariresult.com.cm/drdo-ceptam-11-2026/"],
  ["UPPSC Technical Education Principal Exam Date 2026", "https://sarkariresult.com.cm/uppsc-technical-education-principal-2025/"],
  ["Bihar Vidhan Parishad PA, DEO, LDC & Steno Exam Date 2026 – Out", "https://sarkariresult.com.cm/bihar-vidhan-parishad-pa-deo-ldc-steno-2026/"],
  ["UPPSC APO Admit Card 2026 – Out", "https://sarkariresult.com.cm/uppsc-apo-2025/"],
  ["Bank of Baroda Office Assistant Mains Admit Card 2026 – Out", "https://sarkariresult.com.cm/bank-of-baroda-office-assistant-2025/"],
  ["KVS NVS Teaching & Non-Teaching Tier-II Exam City Details 2026 – Out", "https://sarkariresult.com.cm/kvs-nvs-teaching-non-teaching-2026/"],
  ["SSC CHSL Tier-II Exam Date 2026 – Out", "https://sarkariresult.com.cm/ssc-chsl-2026/"],
  ["NTA CUET PG Admit Card 2026", "https://sarkariresult.com.cm/nta-cuet-pg-2026/"],
  ["UPPSC 2025 Mains Application Rejected List – Out", "https://sarkariresult.com.cm/uppsc-2025/"],
  ["NCERT Group A B C Exam Date 2026 – Out", "https://sarkariresult.com.cm/ncert-group-a-b-c-2026/"],
  ["Central Bank Specialist Officer Admit Card 2026 – Out", "https://sarkariresult.com.cm/central-bank-specialist-officer-2026/"],
  ["LIC AAO/AE Interview Letter 2026", "https://sarkariresult.com.cm/lic-aao-ae-2026/"],
  ["UPPSC Staff Nurse Unani Admit Card 2026", "https://sarkariresult.com.cm/uppsc-staff-nurse-unani-2025/"],
  ["SSC JE Engineer Tier-II Exam Date 2026 – Out", "https://sarkariresult.com.cm/ssc-jr-engineer-2025/"],
  ["UPSSSC Lekhpal Exam Date 2026", "https://sarkariresult.com.cm/upsssc-lekhpal-2026/"],
  ["CBSE Group A, B, C Tier-II Exam Date 2026", "https://sarkariresult.com.cm/cbse-group-a-b-c-2026/"],
  ["RRB Paramedical Staff Admit Card 2026", "https://sarkariresult.com.cm/rrb-paramedical-staff-2026/"],
];

// ---------- ANSWER KEYS ----------
const answerKeysRaw: [string, string][] = [
  ["CTET February Answer Key 2026 – Out", "https://sarkariresult.com.cm/ctet-february-2026/"],
  ["RRB Junior Engineer JE Answer Key 2026", "https://sarkariresult.com.cm/rrb-junior-engineer-je-2026/"],
  ["SSC MTS / Havaldar Answer Key 2026", "https://sarkariresult.com.cm/ssc-mts-havaldar-2026/"],
  ["RSSB REET Mains Primary Teacher Answer Key 2026", "https://sarkariresult.com.cm/rssb-reet-mains-primary-teacher-2026/"],
  ["RSSB REET Mains Upper Teacher Answer Key 2026", "https://sarkariresult.com.cm/rssb-reet-mains-upper-teacher-2026/"],
  ["CCRAS Group A B C Final Answer Key 2026", "https://sarkariresult.com.cm/ccras-group-a-b-c-2026/"],
  ["RRB Section Controller Answer Key 2026", "https://sarkariresult.com.cm/rrb-section-controller-2026/"],
  ["Bihar BPSC Special School Teacher Answer Key 2026", "https://sarkariresult.com.cm/bihar-bpsc-special-school-teacher-2026/"],
  ["RPSC Assistant Electrical Inspector Answer Key 2026", "https://sarkariresult.com.cm/rpsc-assistant-electrical-inspector-2026/"],
  ["RPSC Junior Chemist Answer Key 2026", "https://sarkariresult.com.cm/rpsc-junior-chemist-2026/"],
  ["CGPSC SSE PCS Pre Answer Key 2026", "https://sarkariresult.com.cm/cgpsc-sse-pcs-pre-2025/"],
  ["MPESB Group 1 Sub Group 2 Answer Key 2026", "https://sarkariresult.com.cm/mpesb-group-1-sub-group-2-2026/"],
  ["GATE 2026 Answer Key", "https://sarkariresult.com.cm/iit-gate-2026/"],
  ["NTA NIFTEE Stage-I Answer Key 2026 – Out", "https://sarkariresult.com.cm/nta-niftee-2026/"],
  ["MPESB Group 2 Sub Group 3 Answer Key 2026 – Out", "https://sarkariresult.com.cm/mpesb-group-2-sub-group-3-2026/"],
];

// ---------- ADMISSION ----------
const admissionRaw: [string, string][] = [
  ["Bihar ITI CAT Online Form 2026", "https://sarkariresult.com.cm/bihar-iti-cat-2026/"],
  ["NTA NEET UG Correction Form 2026 – Link Active", "https://sarkariresult.com.cm/nta-neet-ug-2026/"],
  ["DUVASU Mathura PVT Online Form 2026", "https://sarkariresult.com.cm/duvasu-mathura-pvt-2026/"],
  ["NTA NSSNET Online Form 2026", "https://sarkariresult.com.cm/nta-nssnet-2026/"],
  ["JCECEB Jharkhand BEd Online Form 2026", "https://sarkariresult.com.cm/jceceb-jharkhand-bed-2026/"],
  ["BHU CHS SET Online Form 2026 – Start", "https://sarkariresult.com.cm/bhu-chs-set-2026/"],
  ["AIBE 21th Exam Online Form 2026 – Start", "https://sarkariresult.com.cm/aibe-21th-exam-2026/"],
  ["MP CPCT Admission Online Form 2026", "https://sarkariresult.com.cm/mp-cpct-2026/"],
  ["IMU CET Admissions Form 2026", "https://sarkariresult.com.cm/imu-cet-2026/"],
  ["UPBEd Online Form 2026 – Start", "https://sarkariresult.com.cm/upbed-2026/"],
  ["UP RTE Online Form 2026", "https://sarkariresult.com.cm/up-rte-free-admission-2026/"],
  ["NTA NCHMJEE Online Form 2026 – Date Extend", "https://sarkariresult.com.cm/nta-nchmjee-online-form-2026-date-extend/"],
  ["UP Polytechnic JEECUP Online Form 2026", "https://sarkariresult.com.cm/up-polytechnic-jeecup-online-form-2026/"],
  ["Bihar BSEB DELED Spot Admission 2025-27", "https://sarkariresult.com.cm/bihar-bseb-deled-spot-admission-2025-27/"],
  ["BCECE Mop-Up Revised Counselling Schedule 2025", "https://sarkariresult.com.cm/bcece-online-mop-up-counselling-2025/"],
];

// ---------- DOCUMENTS ----------
const documentsRaw: [string, string][] = [
  ["BPSC Exam Calendar 2026", "https://sarkariresult.com.cm/bpsc-exam-calendar-2026/"],
  ["UPPSC Exam Calendar 2026", "https://sarkariresult.com.cm/uppsc-exam-calendar-2026/"],
  ["SSC Exam Calendar 2026-27", "https://sarkariresult.com.cm/ssc-exam-calendar-2026-27/"],
  ["RPSC Exam Calendar 2026", "https://sarkariresult.com.cm/rpsc-exam-calendar-2026/"],
  ["UP Scholarship Online Form 2025-26", "https://sarkariresult.com.cm/up-scholarship-online-form-2025-26/"],
  ["UP Police OTR Registration 2025", "https://sarkariresult.com.cm/up-police-upprpb-one-time-registration-otr-online-form-2025/"],
  ["UP Police SI, ASI Syllabus / Exam Pattern 2025 – Out", "https://sarkariresult.com.cm/up-police-si-asi-syllabus-exam-pattern-2025/"],
  ["UP Police Recruitment Calendar 2025-26", "https://sarkariresult.com.cm/up-police-recruitment-calendar-2025-26/"],
  ["PAN Card Registration, Correction & Other Service 2026", "https://sarkariresult.com.cm/pan-card-registration-correction-other-service-2026/"],
  ["Aadhar Card Download, Correction, Status 2026", "https://sarkariresult.com.cm/aadhar-card-download-correction-status-2026/"],
  ["UP Income, Cast, Residential Certificate Online Verification 2026", "https://sarkariresult.com.cm/up-income-cast-residential-certificate-online-verification-2026/"],
  ["Bihar Income, Cast, Residential Certificate Online Apply & Verification 2026", "https://sarkariresult.com.cm/bihar-income-cast-residential-certificate-online-apply-verification-2026/"],
  ["Voter ID Registration & Other Voter Service 2026", "https://sarkariresult.com.cm/voter-id-registration-other-voter-service-2026/"],
  ["Bihar Dakhil Kharij, Registration Online 2026", "https://sarkariresult.com.cm/bihar-dakhil-kharij-registration-online-2026/"],
  ["UP Dakhil Kharij, Registration Online 2026", "https://sarkariresult.com.cm/up-dakhil-kharij-registration-online-2026/"],
];

// ---------- Build full dataset ----------
function buildJobs(raw: [string, string][], category: JobCategory): SarkariJob[] {
  return raw.map(([title, link]) => ({
    title,
    link,
    category,
    tag: extractTag(title),
  }));
}

export const sarkariJobs: SarkariJob[] = [
  ...buildJobs(latestJobsRaw, "latest-jobs"),
  ...buildJobs(resultsRaw, "results"),
  ...buildJobs(admitCardsRaw, "admit-card"),
  ...buildJobs(answerKeysRaw, "answer-key"),
  ...buildJobs(admissionRaw, "admission"),
  ...buildJobs(documentsRaw, "documents"),
];

export const ALL_CATEGORIES: JobCategory[] = [
  "latest-jobs",
  "results",
  "admit-card",
  "answer-key",
  "admission",
  "documents",
];

export function getJobsByCategory(category: JobCategory): SarkariJob[] {
  return sarkariJobs.filter((j) => j.category === category);
}

export function searchJobs(query: string): SarkariJob[] {
  const q = query.toLowerCase().trim();
  if (!q) return sarkariJobs;
  return sarkariJobs.filter((j) => j.title.toLowerCase().includes(q));
}

export const LAST_UPDATED = "10 Mar 2026";
