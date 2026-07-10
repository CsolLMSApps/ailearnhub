// seed-ai-beginners-quiz.js
// Replaces all per-module quizzes for "AI for Beginners (Zero to Hero)"
// with a single Course Final Quiz on the last module (module 6).
// 12 questions, 2 per module, technical theory drawn directly from course content.
//
// Usage: node seed-ai-beginners-quiz.js "SERVICE_ROLE_KEY"

const https = require('https')
function sanitize(str) { return str.replace(/[^\x20-\x7E]/g, '').trim() }

const SUPABASE_URL = 'https://jqlynkmzduibfivycmze.supabase.co'
const SERVICE_KEY = sanitize(process.argv[2] || '')

if (!SERVICE_KEY) {
  console.error('Usage: node seed-ai-beginners-quiz.js "YOUR_SERVICE_ROLE_KEY"')
  process.exit(1)
}

function request(method, path, body) {
  return new Promise((resolve, reject) => {
    const payload = body ? JSON.stringify(body) : null
    const url = new URL(SUPABASE_URL + path)
    const options = {
      hostname: url.hostname, path: url.pathname + url.search, method,
      headers: {
        'apikey': SERVICE_KEY, 'Authorization': `Bearer ${SERVICE_KEY}`,
        'Content-Type': 'application/json', 'Prefer': 'return=representation',
      },
    }
    if (payload) options.headers['Content-Length'] = Buffer.byteLength(payload)
    const req = https.request(options, res => {
      let d = ''; res.on('data', c => d += c)
      res.on('end', () => { try { resolve({ status: res.statusCode, body: JSON.parse(d) }) } catch { resolve({ status: res.statusCode, body: d }) } })
    })
    req.on('error', reject)
    if (payload) req.write(payload)
    req.end()
  })
}

// 12 questions — 2 per module, technical theory from course content
const FINAL_QUIZ_QUESTIONS = [

  // --- Module 1: AI Demystified ---
  {
    id: "q1",
    question: "What is the fundamental difference between AI and regular (traditional) software?",
    options: [
      "AI only works with images, while regular software works with text",
      "Regular software follows fixed rules, while AI learns and adapts from data",
      "AI requires a paid subscription, while regular software is always free",
      "AI runs on the cloud only, while regular software runs locally"
    ],
    correct: 1,
    explanation: "Traditional software executes a fixed set of rules (like a recipe). AI learns patterns from data and adapts — for example, Netflix recommendations improve the more you watch."
  },
  {
    id: "q2",
    question: "Which of the following correctly orders the relationship between AI, Machine Learning, and Deep Learning?",
    options: [
      "Machine Learning is the broadest field, containing AI and Deep Learning",
      "AI is the broadest field; Machine Learning is a subset of AI; Deep Learning is a subset of Machine Learning",
      "Deep Learning and Machine Learning are the same thing",
      "AI and Machine Learning are unrelated technologies"
    ],
    correct: 1,
    explanation: "AI is the broadest concept (machines mimicking human intelligence). Machine Learning is a subset of AI that learns from data. Deep Learning is a subset of ML that uses neural networks."
  },

  // --- Module 2: Getting Started with ChatGPT ---
  {
    id: "q3",
    question: "What AI model powers the free version of ChatGPT?",
    options: [
      "GPT-2",
      "GPT-4",
      "GPT-3.5",
      "BERT"
    ],
    correct: 2,
    explanation: "The free tier of ChatGPT uses GPT-3.5, which is fast and capable for most tasks. GPT-4 (smarter and more capable) requires a ChatGPT Plus subscription at $20/month."
  },
  {
    id: "q4",
    question: "When writing a ChatGPT prompt, which approach consistently produces the best results?",
    options: [
      "Keep prompts as short as possible — one or two words",
      "Ask only yes/no questions so the AI doesn't get confused",
      "Provide specific context: role, task, format, tone, and any constraints",
      "Use technical jargon so the AI knows you are experienced"
    ],
    correct: 2,
    explanation: "The more context and specifics you provide — who you are, what you need, the format, tone, and length — the more accurate and useful the AI's response will be."
  },

  // --- Module 3: AI for Everyday Life ---
  {
    id: "q5",
    question: "When prompting ChatGPT to create a weekly meal plan, which combination of details produces the most useful output?",
    options: [
      "Just say 'make me a meal plan'",
      "Specify number of people, dietary restrictions, cooking time limit, and nutritional goals",
      "Only list the ingredients you have available",
      "Ask for a meal plan and let the AI decide all the details"
    ],
    correct: 1,
    explanation: "Specific constraints — family size, dietary needs, time available, and health goals — give the AI the information it needs to produce a practical, personalized meal plan."
  },
  {
    id: "q6",
    question: "How does ChatGPT handle recipe modifications for dietary restrictions?",
    options: [
      "It connects to a live food database to verify ingredients",
      "It requires a paid subscription for dietary features",
      "You paste the recipe and specify the restriction; it substitutes ingredients accordingly",
      "It can only handle one restriction at a time (e.g., gluten-free OR vegan, not both)"
    ],
    correct: 2,
    explanation: "ChatGPT modifies recipes by understanding the original ingredients and substituting them based on the dietary restriction you specify — no internet connection or database needed."
  },

  // --- Module 4: AI at Work ---
  {
    id: "q7",
    question: "According to the course, which elements should a workplace email prompt include for the best professional output?",
    options: [
      "Only the recipient's name and the topic",
      "Recipient, topic, desired tone, target length, and key points to cover",
      "A full draft of the email you want AI to 'clean up'",
      "The subject line only — AI infers the rest"
    ],
    correct: 1,
    explanation: "A complete email prompt specifies who you're writing to, what about, the tone (formal/friendly), approximate length, and the key points — giving the AI everything it needs to produce a usable draft."
  },
  {
    id: "q8",
    question: "What is the primary advantage of using AI to create a meeting agenda?",
    options: [
      "The AI automatically joins and runs the meeting on your behalf",
      "It schedules the meeting in your calendar without you doing anything",
      "It quickly structures goals, duration, attendee roles, and discussion points into a clear format",
      "It replaces the need for human communication entirely"
    ],
    correct: 2,
    explanation: "AI can rapidly turn raw inputs (topic, duration, attendees, goals) into a structured agenda — saving time while ensuring nothing important is missed."
  },

  // --- Module 5: Creative & Personal Uses ---
  {
    id: "q9",
    question: "When using ChatGPT for story development, which prompt produces the richest output?",
    options: [
      "'Write me a story'",
      "Specifying genre, theme, character roles, unique twists, and a 3-act structure request",
      "'Give me something creative'",
      "Listing only the story title and letting AI decide everything else"
    ],
    correct: 1,
    explanation: "Detailed creative prompts — genre, theme, character roles, plot constraints, structure — give the AI creative constraints to work within, which consistently produces more original and coherent output."
  },
  {
    id: "q10",
    question: "In AI-assisted creative writing, what does 'character development' specifically refer to?",
    options: [
      "Having the AI write the full novel automatically",
      "Building a detailed character profile including role, traits, backstory, and motivations",
      "Using AI to generate illustrations of characters",
      "Automatically selecting character names from a database"
    ],
    correct: 1,
    explanation: "Character development means creating depth: the character's role (protagonist/antagonist), personality traits, backstory, motivations, and arc — all of which you can prompt ChatGPT to help build."
  },

  // --- Module 6: Next Steps & Simple Tools ---
  {
    id: "q11",
    question: "According to the course, which AI tool is built into Microsoft Edge, integrated with Bing Search, and provides real-time information?",
    options: [
      "ChatGPT",
      "Gemini (Google)",
      "Microsoft Copilot",
      "Canva AI"
    ],
    correct: 2,
    explanation: "Microsoft Copilot is the AI integrated directly into the Edge browser and Bing Search, giving it access to real-time internet information — unlike ChatGPT's free tier which has a knowledge cutoff."
  },
  {
    id: "q12",
    question: "Which of the following is a key ethical principle the course emphasizes when using AI-generated content?",
    options: [
      "AI output is always accurate, so no verification is needed",
      "Always keep your AI usage completely secret from others",
      "Verify AI-generated information before relying on it, as AI can produce incorrect output",
      "Avoid using AI for any task that involves writing"
    ],
    correct: 2,
    explanation: "AI models can 'hallucinate' — produce plausible-sounding but incorrect information. The course emphasizes always fact-checking AI output before using it in professional or important contexts."
  }
]

async function run() {
  console.log('\n=== AI for Beginners — Final Quiz Seeder ===\n')

  // 1. Find course
  console.log('1. Looking up course: ai-for-beginners')
  const res = await request('GET', '/rest/v1/courses?slug=eq.ai-for-beginners&select=id,title', null)
  if (!Array.isArray(res.body)) { console.error('API error:', res.body); process.exit(1) }
  if (!res.body.length) {
    console.log('   Course slug not found. Listing all courses:')
    const all = await request('GET', '/rest/v1/courses?select=slug,title', null)
    all.body?.forEach(c => console.log('  -', c.slug, '|', c.title))
    process.exit(1)
  }
  const course = res.body[0]
  console.log(`   Found: ${course.title} (${course.id})`)

  // 2. Get last module
  console.log('\n2. Getting last module number')
  const mods = await request('GET', `/rest/v1/course_modules?course_id=eq.${course.id}&select=module_number&order=module_number.desc&limit=1`, null)
  const lastModule = mods.body?.[0]?.module_number
  if (!lastModule) { console.error('No modules found.'); process.exit(1) }
  console.log(`   Last module: ${lastModule}`)

  // 3. Delete existing quizzes
  console.log('\n3. Deleting existing quizzes')
  const del = await request('DELETE', `/rest/v1/quizzes?course_id=eq.${course.id}`, null)
  console.log(`   Deleted (status ${del.status})`)

  // 4. Insert final quiz
  console.log(`\n4. Inserting Course Final Quiz on module ${lastModule}`)
  const ins = await request('POST', '/rest/v1/quizzes', {
    course_id: course.id,
    module_number: lastModule,
    questions: { questions: FINAL_QUIZ_QUESTIONS },
    pass_percentage: 70,
  })
  if (ins.status === 201) {
    console.log(`   ✅ Final quiz inserted — ${FINAL_QUIZ_QUESTIONS.length} questions, 70% pass threshold`)
    console.log('   2 questions per module (modules 1–6), technical theory from course content')
  } else {
    console.error(`   ❌ Insert failed (${ins.status}):`, ins.body)
    process.exit(1)
  }

  console.log('\n=== Done ===\n')
}

run().catch(e => { console.error('Fatal:', e); process.exit(1) })
