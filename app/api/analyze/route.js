import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { resume, jobDescription, mode } = await request.json();

    if (!resume?.trim()) {
      return NextResponse.json({ error: 'Resume is required' }, { status: 400 });
    }

    const isMatch = mode === 'match' && jobDescription?.trim();

    const prompt = isMatch
      ? `You are an expert ATS and career coach. Analyze this resume against the job description. Return ONLY valid JSON, no markdown, no explanation.

Resume:
${resume}

Job Description:
${jobDescription}

Return exactly this JSON:
{
  "ats_score": <0-100, match percentage>,
  "summary": "<2-3 sentence match overview>",
  "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "weaknesses": ["<gap 1>", "<gap 2>", "<gap 3>"],
  "missing_keywords": ["<keyword 1>", "<keyword 2>"],
  "suggestions": ["<suggestion 1>", "<suggestion 2>", "<suggestion 3>", "<suggestion 4>", "<suggestion 5>"],
  "section_scores": { "experience": <0-100>, "skills": <0-100>, "education": <0-100>, "formatting": <0-100> }
}`
      : `You are an expert ATS and career coach. Analyze this resume. Return ONLY valid JSON, no markdown, no explanation.

Resume:
${resume}

Return exactly this JSON:
{
  "ats_score": <0-100, overall ATS score>,
  "summary": "<2-3 sentence overview>",
  "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "weaknesses": ["<weakness 1>", "<weakness 2>", "<weakness 3>"],
  "missing_keywords": ["<keyword 1>", "<keyword 2>"],
  "suggestions": ["<suggestion 1>", "<suggestion 2>", "<suggestion 3>", "<suggestion 4>", "<suggestion 5>"],
  "section_scores": { "experience": <0-100>, "skills": <0-100>, "education": <0-100>, "formatting": <0-100> }
}`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'system',
            content: 'You are an expert resume analyzer. Always respond with valid raw JSON only — no markdown, no code blocks, no extra text.',
          },
          { role: 'user', content: prompt },
        ],
        temperature: 0.3,
        max_tokens: 1500,
      }),
    });

    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error?.message || 'Groq API error');
    }

    const groqData = await response.json();
    const raw = groqData.choices[0].message.content.trim()
      .replace(/^```json\n?/, '').replace(/\n?```$/, '').trim();

    try {
      return NextResponse.json(JSON.parse(raw));
    } catch {
      return NextResponse.json({ error: 'Failed to parse analysis. Try again.' }, { status: 500 });
    }
  } catch (error) {
    console.error('Analyze API error:', error);
    return NextResponse.json({ error: error.message || 'Analysis failed' }, { status: 500 });
  }
}