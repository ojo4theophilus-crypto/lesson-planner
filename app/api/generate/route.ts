import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { subject, grade, topic, duration, notes } = await req.json();

    if (!subject || !grade || !topic) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Server is missing GROQ_API_KEY. Add it in your hosting provider's environment variables." },
        { status: 500 }
      );
    }

    const prompt = `You are an experienced teacher creating a lesson plan for a Nigerian classroom.

Subject: ${subject}
Class/Grade: ${grade}
Topic: ${topic}
Duration: ${duration}
Extra notes: ${notes || "none"}

Write a complete, practical lesson plan with these sections, clearly labeled:
1. Learning Objectives (3 bullet points)
2. Materials Needed (keep it low-cost/accessible where possible)
3. Introduction / Warm-up (5 min)
4. Main Teaching Activity (step by step, timed)
5. Class Activity or Exercise
6. Conclusion / Recap
7. Homework/Assignment
8. Three sample evaluation questions

Keep the tone practical and the language simple enough for a busy teacher to use directly in class. Do not use markdown symbols like # or **, just plain text with clear section headings.`;

    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.6,
        max_tokens: 1500,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("Groq API error:", errText);
      return NextResponse.json({ error: "AI provider error. Please try again." }, { status: 502 });
    }

    const data = await res.json();
    const content = data.choices?.[0]?.message?.content || "";

    return NextResponse.json({ content });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Unexpected server error" }, { status: 500 });
  }
}
