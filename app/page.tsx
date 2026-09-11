"use client";

import { useEffect, useState } from "react";

type SavedPlan = {
  id: string;
  subject: string;
  topic: string;
  grade: string;
  createdAt: string;
  content: string;
};

export default function Home() {
  const [subject, setSubject] = useState("");
  const [grade, setGrade] = useState("");
  const [topic, setTopic] = useState("");
  const [duration, setDuration] = useState("40 minutes");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [saved, setSaved] = useState<SavedPlan[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem("lesson_plans");
    if (raw) setSaved(JSON.parse(raw));
  }, []);

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setResult("");
    if (!subject || !grade || !topic) {
      setError("Please fill in subject, class/grade, and topic.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, grade, topic, duration, notes }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      setResult(data.content);

      const entry: SavedPlan = {
        id: crypto.randomUUID(),
        subject,
        topic,
        grade,
        createdAt: new Date().toISOString(),
        content: data.content,
      };
      const updated = [entry, ...saved].slice(0, 50);
      setSaved(updated);
      localStorage.setItem("lesson_plans", JSON.stringify(updated));
    } catch (err: any) {
      setError(err.message || "Failed to generate lesson plan.");
    } finally {
      setLoading(false);
    }
  }

  function downloadTxt() {
    const blob = new Blob([result], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${subject}-${topic}-lesson-plan.txt`.replace(/\s+/g, "_");
    a.click();
    URL.revokeObjectURL(url);
  }

  function copyToClipboard() {
    navigator.clipboard.writeText(result);
  }

  return (
    <div className="container">
      <header>
        <h1>AI Lesson Planner</h1>
        <p>Turn a topic into a full lesson plan in seconds.</p>
      </header>

      <div className="card">
        <form onSubmit={handleGenerate}>
          <label>Subject</label>
          <input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="e.g. Mathematics" />

          <label>Class / Grade</label>
          <input value={grade} onChange={(e) => setGrade(e.target.value)} placeholder="e.g. JSS 2" />

          <label>Topic</label>
          <input value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="e.g. Simultaneous Equations" />

          <label>Duration</label>
          <select value={duration} onChange={(e) => setDuration(e.target.value)}>
            <option>30 minutes</option>
            <option>40 minutes</option>
            <option>60 minutes</option>
            <option>80 minutes</option>
          </select>

          <label>Extra notes (optional)</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. Focus on practical examples, low-resource classroom"
          />

          <button type="submit" disabled={loading}>
            {loading ? "Generating..." : "Generate Lesson Plan"}
          </button>
          {error && <div className="error">{error}</div>}
        </form>
      </div>

      {result && (
        <div className="card">
          <div className="output">{result}</div>
          <div className="output-actions">
            <button onClick={copyToClipboard}>Copy</button>
            <button onClick={downloadTxt}>Download .txt</button>
          </div>
        </div>
      )}

      {saved.length > 0 && (
        <div className="card">
          <label>Recent lesson plans (saved on this device)</label>
          <div className="saved-list">
            {saved.map((s) => (
              <div key={s.id} className="saved-item" onClick={() => setResult(s.content)}>
                <div className="title">{s.subject} — {s.topic}</div>
                <div className="sub">{s.grade} · {new Date(s.createdAt).toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
