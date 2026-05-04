/**
 * Category Guard — keyword-based intent detection + category enforcement middleware.
 * Intercepts user queries BEFORE they hit the AI to enforce strict category boundaries.
 */

export type AppCategory = "government" | "farming" | "health" | "education" | "govt-jobs";

/** Human-readable labels per category (Hindi + English) */
const CATEGORY_LABELS: Record<AppCategory, { en: string; hi: string }> = {
  government: { en: "Government Schemes", hi: "सरकारी योजनाएं" },
  farming: { en: "Farming", hi: "खेती-किसानी" },
  health: { en: "Health", hi: "स्वास्थ्य" },
  education: { en: "Education", hi: "शिक्षा" },
  "govt-jobs": { en: "Government Jobs", hi: "सरकारी नौकरी" },
};

/**
 * Keyword maps — each category has English + Hindi keywords.
 * These are checked against the user's query (case-insensitive).
 */
const CATEGORY_KEYWORDS: Record<AppCategory, string[]> = {
  government: [
    // English
    "scheme", "schemes", "yojana", "yojna", "subsidy", "subsidies", "policy", "policies",
    "pm kisan", "pm-kisan", "pension", "ayushman", "ayushman bharat", "ujjwala",
    "awas yojana", "mudra loan", "mudra", "jan dhan", "ration card", "bpl",
    "aadhar", "aadhaar", "voter id", "government scheme", "sarkari yojana",
    "benefit", "benefits", "welfare", "social security", "scholarship",
    "pradhan mantri", "pradhanmantri", "mukhyamantri", "free gas",
    "sukanya samriddhi", "kisan samman", "fasal bima", "crop insurance",
    "labour card", "eshram", "e-shram", "nrega", "mnrega",
    // Hindi
    "योजना", "योजनाएं", "सब्सिडी", "पेंशन", "आयुष्मान", "उज्ज्वला",
    "आवास", "मुद्रा", "जन धन", "राशन कार्ड", "बीपीएल", "आधार",
    "वोटर", "सरकारी योजना", "लाभ", "कल्याण", "छात्रवृत्ति",
    "प्रधानमंत्री", "मुख्यमंत्री", "सुकन्या", "किसान सम्मान",
    "फसल बीमा", "श्रम कार्ड", "नरेगा", "मनरेगा",
  ],
  farming: [
    // English
    "crop", "crops", "fertilizer", "fertiliser", "manure", "khad",
    "irrigation", "sinchai", "seed", "seeds", "beej", "pesticide", "pest",
    "keet", "insect", "fungus", "soil", "mitti", "harvest", "yield",
    "farming", "kheti", "agriculture", "tractor", "plough", "organic",
    "jaivik", "urea", "dap", "potash", "nitrogen", "compost",
    "wheat", "gehu", "rice", "dhan", "chawal", "sugarcane", "ganna",
    "cotton", "kapas", "soybean", "maize", "makka", "mustard", "sarso",
    "onion", "potato", "aloo", "tomato", "tamatar", "vegetable", "sabzi",
    "mandi", "market rate", "crop rate", "weather", "mausam", "rain", "barish",
    "drought", "flood", "kharif", "rabi", "zaid",
    "drip irrigation", "sprinkler", "greenhouse",
    // Hindi
    "फसल", "खाद", "उर्वरक", "सिंचाई", "बीज", "कीटनाशक", "कीड़ा", "कीट",
    "मिट्टी", "पैदावार", "खेती", "किसानी", "कृषि", "ट्रैक्टर", "हल",
    "जैविक", "यूरिया", "डीएपी", "पोटाश", "नाइट्रोजन", "कम्पोस्ट",
    "गेहूं", "धान", "चावल", "गन्ना", "कपास", "सोयाबीन",
    "मक्का", "सरसों", "प्याज", "आलू", "टमाटर", "सब्जी",
    "मंडी", "भाव", "मौसम", "बारिश", "सूखा", "बाढ़",
    "खरीफ", "रबी", "जायद",
  ],
  health: [
    // English
    "health", "doctor", "hospital", "medicine", "dawai", "symptom", "symptoms",
    "disease", "bimari", "fever", "bukhar", "cold", "cough", "khansi",
    "headache", "sir dard", "stomach", "pet dard", "diarrhea", "dast",
    "blood pressure", "bp", "diabetes", "sugar", "heart", "dil",
    "pregnancy", "garbh", "vaccine", "tika", "vaccination",
    "first aid", "prathmik upchar", "hygiene", "safai", "sanitation",
    "nutrition", "poshan", "vitamin", "calcium", "iron", "protein",
    "malaria", "dengue", "typhoid", "tuberculosis", "tb", "covid",
    "eye", "aankh", "skin", "chamdi", "dental", "daant",
    "mental health", "stress", "depression", "anxiety", "yoga",
    "ayurveda", "homeopathy", "allopathy",
    // Hindi
    "स्वास्थ्य", "डॉक्टर", "अस्पताल", "दवाई", "दवा", "लक्षण",
    "बीमारी", "बुखार", "सर्दी", "खांसी", "सिरदर्द", "सिर दर्द",
    "पेट दर्द", "दस्त", "ब्लड प्रेशर", "शुगर", "मधुमेह",
    "दिल", "हृदय", "गर्भ", "गर्भावस्था", "टीका", "टीकाकरण",
    "प्राथमिक उपचार", "स्वच्छता", "साफ सफाई", "पोषण",
    "विटामिन", "कैल्शियम", "आयरन", "प्रोटीन",
    "मलेरिया", "डेंगू", "टाइफाइड", "टीबी",
    "आंख", "त्वचा", "दांत", "मानसिक स्वास्थ्य",
    "तनाव", "योग", "आयुर्वेद",
  ],
  education: [
    // English
    "study", "studies", "exam", "exams", "class", "ncert", "cbse",
    "math", "maths", "mathematics", "science", "physics", "chemistry",
    "biology", "english", "hindi subject", "social science", "history",
    "geography", "economics", "civics", "political science",
    "chapter", "lesson", "formula", "theorem", "equation",
    "homework", "assignment", "question paper", "sample paper",
    "board exam", "jee", "neet", "entrance", "competitive exam",
    "newton", "periodic table", "photosynthesis", "algebra",
    "geometry", "trigonometry", "calculus", "statistics",
    "grammar", "essay", "paragraph", "literature",
    "school", "college", "university", "teacher", "student",
    "tuition", "coaching", "notes", "syllabus", "curriculum",
    // Hindi
    "पढ़ाई", "परीक्षा", "कक्षा", "एनसीईआरटी", "सीबीएसई",
    "गणित", "विज्ञान", "भौतिक विज्ञान", "रसायन", "जीव विज्ञान",
    "अंग्रेजी विषय", "हिंदी विषय", "सामाजिक विज्ञान", "इतिहास",
    "भूगोल", "अर्थशास्त्र", "नागरिक शास्त्र",
    "अध्याय", "पाठ", "सूत्र", "प्रमेय", "समीकरण",
    "होमवर्क", "प्रश्न पत्र", "बोर्ड परीक्षा",
    "न्यूटन", "आवर्त सारणी", "प्रकाश संश्लेषण",
    "बीजगणित", "ज्यामिति", "त्रिकोणमिति",
    "व्याकरण", "निबंध", "साहित्य",
    "स्कूल", "कॉलेज", "विश्वविद्यालय", "शिक्षक", "छात्र",
    "ट्यूशन", "कोचिंग", "नोट्स", "पाठ्यक्रम",
  ],
  "govt-jobs": [
    // English
    "sarkari result", "sarkari naukri", "government job", "govt job",
    "recruitment", "bharti", "vacancy", "vacancies", "post", "posts",
    "admit card", "hall ticket", "answer key", "result", "merit list",
    "cut off", "cutoff", "ssc", "upsc", "ias", "ips", "railway", "rrb",
    "bank po", "bank clerk", "ibps", "sbi", "lic", "police", "army",
    "navy", "airforce", "air force", "defense", "defence",
    "state psc", "bpsc", "uppsc", "mppsc", "rpsc", "cgpsc",
    "constable", "si", "inspector", "teacher recruitment",
    "staff selection", "public service", "civil service",
    "apply online", "online form", "last date", "age limit",
    "selection process", "notification", "syllabus exam",
    "upsssc", "dsssb", "drdo", "isro", "ntpc", "clerk",
    // Hindi
    "सरकारी नौकरी", "सरकारी रिजल्ट", "भर्ती", "रिक्ति",
    "प्रवेश पत्र", "एडमिट कार्ड", "उत्तर कुंजी", "परिणाम", "मेरिट लिस्ट",
    "कटऑफ", "एसएससी", "यूपीएससी", "रेलवे",
    "बैंक", "पुलिस", "सेना", "नौसेना", "वायुसेना",
    "कांस्टेबल", "इंस्पेक्टर", "शिक्षक भर्ती",
    "ऑनलाइन फॉर्म", "अंतिम तिथि", "आयु सीमा",
    "चयन प्रक्रिया", "अधिसूचना", "नोटिफिकेशन",
  ],
};

/**
 * Detect which category a user query most likely belongs to.
 * Returns the detected category or null if ambiguous/unclear.
 */
export function detectQueryCategory(query: string): AppCategory | null {
  const q = query.toLowerCase().trim();

  // Score each category by counting keyword matches
  const scores: Record<AppCategory, number> = {
    government: 0,
    farming: 0,
    health: 0,
    education: 0,
    "govt-jobs": 0,
  };

  for (const [cat, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    for (const kw of keywords) {
      if (q.includes(kw.toLowerCase())) {
        // Longer keywords get higher score (more specific = more confident)
        scores[cat as AppCategory] += kw.length;
      }
    }
  }

  // Find the highest scoring category
  let bestCat: AppCategory | null = null;
  let bestScore = 0;

  for (const [cat, score] of Object.entries(scores)) {
    if (score > bestScore) {
      bestScore = score;
      bestCat = cat as AppCategory;
    }
  }

  // Only return if we have a meaningful match (minimum threshold)
  if (bestScore < 3) return null; // Too ambiguous — allow it through
  return bestCat;
}

/** Result from the category guard check */
export interface GuardResult {
  blocked: boolean;
  detectedCategory: AppCategory | null;
  redirectMessage: string;
  suggestedCategoryLabel: string;
  suggestedCategoryId: string;
}

/**
 * Guard: check if the user query matches the active category.
 * Returns null if allowed, or a GuardResult with redirect info if blocked.
 */
export function guardCategory(
  query: string,
  activeCategory: string | undefined,
  language: string = "Hindi"
): GuardResult | null {
  // If no category is set, allow everything
  if (!activeCategory) return null;

  const detected = detectQueryCategory(query);

  // If we couldn't detect a category — let it through (ambiguous queries are OK)
  if (!detected) return null;

  // Normalize: "govt-jobs" might come as "government-jobs" or similar
  const normalizedActive = normalizeCategory(activeCategory);

  // If the detected category matches the active one — allow
  if (detected === normalizedActive) return null;

  // BLOCKED — build redirect message
  const detectedLabel = CATEGORY_LABELS[detected];
  const activeLabel = CATEGORY_LABELS[normalizedActive] || { en: activeCategory, hi: activeCategory };

  const isHindi = language === "Hindi";

  const redirectMessage = isHindi
    ? `🚫 यह प्रश्न **${detectedLabel.hi}** श्रेणी से संबंधित है।\n\nआप अभी **${activeLabel.hi}** श्रेणी में हैं। सही जानकारी पाने के लिए कृपया **${detectedLabel.hi}** सेक्शन में जाएं।\n\n> 💡 सही श्रेणी चुनने से आपको सबसे सटीक और उपयोगी जानकारी मिलेगी।`
    : `🚫 This question belongs to the **${detectedLabel.en}** category.\n\nYou are currently in **${activeLabel.en}**. Please switch to the **${detectedLabel.en}** section for accurate information.\n\n> 💡 Selecting the right category ensures you get the most relevant and accurate answers.`;

  return {
    blocked: true,
    detectedCategory: detected,
    redirectMessage,
    suggestedCategoryLabel: isHindi ? detectedLabel.hi : detectedLabel.en,
    suggestedCategoryId: detected,
  };
}

/** Normalize category strings to our internal AppCategory type */
function normalizeCategory(cat: string): AppCategory {
  const map: Record<string, AppCategory> = {
    government: "government",
    "gov-schemes": "government",
    "government-schemes": "government",
    schemes: "government",
    farming: "farming",
    agriculture: "farming",
    health: "health",
    education: "education",
    "govt-jobs": "govt-jobs",
    "government-jobs": "govt-jobs",
    jobs: "govt-jobs",
  };
  return map[cat.toLowerCase()] || (cat as AppCategory);
}
