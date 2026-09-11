# AI Lesson Planner

A simple web app for teachers: fill a form (subject, class, topic) and get a full lesson plan generated instantly. Built to run entirely on free tiers.

## Stack (all free tier)
- Framework: Next.js (frontend + backend API route in one project)
- Hosting: Vercel (free tier)
- AI: Groq API (free tier, very fast inference)
- Storage: none needed for v1, lesson plans saved in the browser (localStorage)

## 1. Get a free Groq API key
1. Go to https://console.groq.com
2. Sign up (free)
3. Create an API key

## 2. Deploy to Vercel (free)
1. Go to https://vercel.com and import this GitHub repo
2. In the project's Environment Variables settings, add:
   - GROQ_API_KEY = your key from step 1
3. Deploy. You'll get a free yourapp.vercel.app URL.

## Next steps
- Add Supabase (free tier) for teacher accounts + saving plans across devices
- Add Paystack for a paid tier once you have real usage
