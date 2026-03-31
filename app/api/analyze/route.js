import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req) {
  try {
    const { mode, resumeText, jobDescription } = await req.json();

    if (!resumeText || resumeText.trim().length < 50) {
      return Response.json(
        { error: "Please provide a valid resume text (minimum 50 characters)." },
        { status: 400 }
      );
    }

    let systemPrompt = "";
    let userPrompt = "";

    if (mode === "analyze") {
      systemPrompt = `You are Vish.AI, an expert resume analyst and ATS optimization specialist with 15+ years of experience in talent acquisition at top tech companies. You analyze resumes with precision, actionable feedback, and honest scoring. Always respond in structured markdown. Be specific — never give generic advice.`;

      userPrompt = `Analyze the following resume thoroughly and provide a comprehensive ATS report.

RESUME:
${resumeText}

Provide your analysis in this EXACT markdown structure (do not skip any section):

## Overall ATS Score: [X/100]

### Section Scores
| Section | Score | Status |
|---|---|---|
| Professional Summary | X/10 | ✅ Strong / ⚠️ Needs Work / ❌ Weak |
| Work Experience | X/10 | ✅ Strong / ⚠️ Needs Work / ❌ Weak |
| Skills | X/10 | ✅ Strong / ⚠️ Needs Work / ❌ Weak |
| Projects | X/10 | ✅ Strong / ⚠️ Needs Work / ❌ Weak |
| Education | X/10 | ✅ Strong / ⚠️ Needs Work / ❌ Weak |
| Formatting & ATS | X/10 | ✅ Strong / ⚠️ Needs Work / ❌ Weak |

### ✅ Strengths
- (3-5 specific strengths with context from the resume)

### ⚠️ Action Verb Analysis
- (Check if bullet points start with strong action verbs like "Led", "Built", "Reduced", "Increased", "Designed", "Implemented". List weak or passive phrases found and suggest replacements. Example: "Responsible for managing" → "Managed")

### 🔧 Areas to Improve
- (3-5 specific, actionable improvement points with examples)

### 🎯 Missing Keywords
- (List 5-8 high-value industry keywords missing from this resume that ATS systems look for)

### 💡 Suggestions
- (3-5 concrete suggestions to immediately strengthen this resume)

