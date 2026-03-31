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
      systemPrompt =
        "You are Vish.AI, an expert resume analyst and ATS optimization specialist with 15+ years of experience in talent acquisition at top tech companies. You analyze resumes with precision, actionable feedback, and honest scoring. Always respond in structured markdown. Be specific — never give generic advice.";

      userPrompt =
        "Analyze the following resume thoroughly and provide a comprehensive ATS report.\n\n" +
        "RESUME:\n" +
        resumeText +
        "\n\nProvide your analysis in this EXACT markdown structure (do not skip any section):\n\n" +
        "## Overall ATS Score: [X/100]\n\n" +
        "### Section Scores\n" +
        "| Section | Score | Status |\n" +
        "|---|---|---|\n" +
        "| Professional Summary | X/10 | Strong or Needs Work or Weak |\n" +
        "| Work Experience | X/10 | Strong or Needs Work or Weak |\n" +
        "| Skills | X/10 | Strong or Needs Work or Weak |\n" +
        "| Projects | X/10 | Strong or Needs Work or Weak |\n" +
        "| Education | X/10 | Strong or Needs Work or Weak |\n" +
        "| Formatting & ATS | X/10 | Strong or Needs Work or Weak |\n\n" +
        "### Strengths\n" +
        "- (3-5 specific strengths with context from the resume)\n\n" +
        "### Action Verb Analysis\n" +
        "- (Check if bullet points start with strong action verbs like Led, Built, Reduced, Increased, Designed, Implemented. List weak or passive phrases found and suggest replacements. Example: Responsible for managing -> Managed)\n\n" +
        "### Areas to Improve\n" +
        "- (3-5 specific, actionable improvement points with examples)\n\n" +
        "### Missing Keywords\n" +
        "- (List 5-8 high-value industry keywords missing from this resume that ATS systems look for)\n\n" +
        "### Suggestions\n" +
        "- (3-5 concrete suggestions to immediately strengthen this resume)\n\n" +
        "### ATS Compatibility\n" +
        "(2-3 sentences on ATS friendliness — formatting, keyword density, section headers)\n\n" +
        "### Priority Actions This Week\n" +
        "1. (Most impactful action)\n" +
        "2. (Second most impactful)\n" +
        "3. (Third most impactful)";

    } else if (mode === "match") {
      if (!jobDescription || jobDescription.trim().length < 30) {
        return Response.json(
          { error: "Please provide a valid job description for matching." },
          { status: 400 }
        );
      }

      systemPrompt =
        "You are Vish.AI, an expert in resume-to-job matching and ATS optimization. You compare resumes against job descriptions with surgical precision. Always respond in structured markdown. Be specific and honest about match quality.";

      userPrompt =
        "Compare the resume against the job description and provide a detailed match analysis.\n\n" +
        "RESUME:\n" +
        resumeText +
        "\n\nJOB DESCRIPTION:\n" +
        jobDescription +
        "\n\nProvide your analysis in this EXACT markdown structure:\n\n" +
        "## Job Match Score: [X%]\n\n" +
        "### Match Summary\n" +
        "(2-3 honest sentences about overall fit and whether to apply)\n\n" +
        "### Matching Keywords and Skills\n" +
        "- (List every keyword/skill present in both resume and JD)\n\n" +
        "### Missing Keywords and Skills\n" +
        "- (List critical keywords/skills in JD that are absent from resume)\n\n" +
        "### Action Verb Analysis\n" +
        "- (Check resume bullet points — identify weak/passive phrases and suggest stronger action verbs that align with the JD language)\n\n" +
        "### Requirements Gap Analysis\n" +
        "| Requirement | Status | Recommendation |\n" +
        "|---|---|---|\n" +
        "| (key requirement from JD) | Met or Partial or Missing | (specific action) |\n\n" +
        "### How to Tailor Your Resume\n" +
        "- (4-5 specific edits to make this resume match this exact JD better)\n\n" +
        "### Application Strategy\n" +
        "(Concrete advice: should they apply now, what to highlight in cover letter, what to address proactively)";

    } else {
      return Response.json(
        { error: "Invalid mode. Use analyze or match." },
        { status: 400 }
      );
    }

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 2048,
    });

    const result = completion.choices[0]?.message?.content;
    return Response.json({ result });

  } catch (err) {
    console.error("Vish.AI API error:", err);
    return Response.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}