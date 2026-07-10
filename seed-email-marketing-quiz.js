// seed-email-marketing-quiz.js
// Creates a single Course Final Quiz on the last module of "Email Marketing with AI"
// 10 questions, 2 per module, technical theory drawn directly from course content.
//
// Usage: node seed-email-marketing-quiz.js "SERVICE_ROLE_KEY"

const https = require('https')
function sanitize(str) { return str.replace(/[^\x20-\x7E]/g, '').trim() }

const SUPABASE_URL = 'https://jqlynkmzduibfivycmze.supabase.co'
const SERVICE_KEY = sanitize(process.argv[2] || '')

if (!SERVICE_KEY) {
  console.error('Usage: node seed-email-marketing-quiz.js "YOUR_SERVICE_ROLE_KEY"')
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

// 10 questions — 2 per module, directly from course content
const FINAL_QUIZ_QUESTIONS = [

  // --- Module 1: Email Marketing Strategy with AI ---
  {
    id: "q1",
    question: "According to the course, what is the average ROI of email marketing for every $1 spent?",
    options: ["$10", "$18", "$36", "$52"],
    correct: 2,
    explanation: "Email marketing delivers an average $36 return for every $1 spent — the highest ROI of any digital marketing channel, which is why it remains central to AI-powered marketing strategies."
  },
  {
    id: "q2",
    question: "What is the key strategic advantage of owning your email list compared to social media followers?",
    options: [
      "Email lists cost more to build, which signals higher value",
      "Social platforms restrict email marketing for competitors",
      "You own direct access to subscribers — the platform cannot take it away",
      "Email lists automatically grow without any effort"
    ],
    correct: 2,
    explanation: "Unlike social media, where the platform controls your reach and can change algorithms or remove your account, an email list gives you direct, owned access to your audience."
  },

  // --- Module 2: AI-Powered Email Writing ---
  {
    id: "q3",
    question: "What does the course's subject line formula — [Emotion/Curiosity] + [Value/Benefit] + [Urgency] — primarily aim to achieve?",
    options: [
      "Make the email longer so it appears more professional",
      "Trigger higher open rates by combining psychological drivers",
      "Ensure the email passes spam filters automatically",
      "Match the email's tone to the sender's brand color"
    ],
    correct: 1,
    explanation: "The formula combines emotion or curiosity (to grab attention), clear value (why they should open it), and optional urgency (to act now) — three proven psychological triggers that increase open rates by 30%+."
  },
  {
    id: "q4",
    question: "In the context of email copywriting, what does an effective Call-To-Action (CTA) primarily do?",
    options: [
      "Increases the email's word count to appear authoritative",
      "Automatically unsubscribes inactive readers",
      "Tells the reader exactly what action to take next and why",
      "Adds social media icons to the footer"
    ],
    correct: 2,
    explanation: "A CTA guides the reader to a single, clear next step (click here, download now, get your discount). Optimized CTAs can increase click-through rates by 28%+ according to the course."
  },

  // --- Module 3: Segmentation & Personalization ---
  {
    id: "q5",
    question: "According to the course, segmented email campaigns achieve which of the following compared to non-segmented campaigns?",
    options: [
      "5% higher open rates and no change in click-through rates",
      "14.31% higher open rates and 100.95% higher click-through rates",
      "Equal open rates but 50% higher unsubscribe rates",
      "Lower open rates but higher revenue per email"
    ],
    correct: 1,
    explanation: "Segmented campaigns dramatically outperform generic ones: 14.31% higher open rates, 100.95% higher CTRs, and 77% of email ROI comes from segmented, targeted sends."
  },
  {
    id: "q6",
    question: "Which type of segmentation groups subscribers based on their actions — such as emails opened, pages visited, or purchases made?",
    options: [
      "Demographic segmentation",
      "Geographic segmentation",
      "Psychographic segmentation",
      "Behavioral segmentation"
    ],
    correct: 3,
    explanation: "Behavioral segmentation uses subscriber actions as the grouping criteria — making it one of the most powerful segmentation types because it reflects actual intent and engagement, not just who someone is."
  },

  // --- Module 4: A/B Testing & Optimization ---
  {
    id: "q7",
    question: "According to the course, which email element should be prioritized first in A/B testing because it has the biggest impact?",
    options: [
      "Email footer design",
      "Sender name format",
      "Subject lines",
      "Image size and placement"
    ],
    correct: 2,
    explanation: "Subject lines are the #1 lever in email A/B testing — they determine whether the email gets opened at all. Optimized subject lines can increase open rates by 30-50% according to the course."
  },
  {
    id: "q8",
    question: "What does 'statistical significance' mean in the context of email A/B testing?",
    options: [
      "The email was sent to a statistically large list of 10,000+ subscribers",
      "The test ran for at least 30 days before a winner was declared",
      "A confidence level that the observed difference is real and not due to random chance",
      "The percentage difference between the two test variants"
    ],
    correct: 2,
    explanation: "Statistical significance is a measure of confidence (typically 95%+) that the difference in results between two test variants is genuine — not just random variation in a small sample."
  },

  // --- Module 5: Email Automation Workflows ---
  {
    id: "q9",
    question: "What is the trigger event for an 'abandoned cart' email automation workflow?",
    options: [
      "A subscriber signs up for the email list for the first time",
      "A customer completes a purchase and receives a confirmation",
      "A customer adds items to their cart but does not complete the purchase",
      "A subscriber has not opened any emails in 90 days"
    ],
    correct: 2,
    explanation: "Abandoned cart automation fires when a visitor adds products to their cart but leaves without buying. These emails recover 10-30% of lost sales according to the course."
  },
  {
    id: "q10",
    question: "According to the course, how much more revenue do automated email workflows generate compared to non-automated emails?",
    options: ["50% more", "120% more", "200% more", "320% more"],
    correct: 3,
    explanation: "Automated emails generate 320% more revenue than non-automated emails — because they are sent at precisely the right moment (trigger-based), to the right person, with the right message."
  }
]

async function run() {
  console.log('\n=== Email Marketing with AI — Final Quiz Seeder ===\n')

  // Find the course — try common slugs
  const slugsToTry = ['email-marketing-ai', 'email-marketing-with-ai', 'email-marketing']
  let course = null

  for (const slug of slugsToTry) {
    console.log(`1. Trying slug: ${slug}`)
    const res = await request('GET', `/rest/v1/courses?slug=eq.${slug}&select=id,title,slug`, null)
    if (!Array.isArray(res.body)) { console.error('   API error:', res.body); process.exit(1) }
    if (res.body.length > 0) { course = res.body[0]; break }
  }

  if (!course) {
    console.log('   Course not found with common slugs. Listing all courses:')
    const all = await request('GET', '/rest/v1/courses?select=slug,title', null)
    if (Array.isArray(all.body)) all.body.forEach(c => console.log('  -', c.slug, '|', c.title))
    process.exit(1)
  }
  console.log(`   Found: ${course.title} (${course.id})`)

  // Get last module
  console.log('\n2. Getting last module number')
  const mods = await request('GET', `/rest/v1/course_modules?course_id=eq.${course.id}&select=module_number&order=module_number.desc&limit=1`, null)
  const lastModule = mods.body?.[0]?.module_number
  if (!lastModule) { console.error('   No modules found.'); process.exit(1) }
  console.log(`   Last module: ${lastModule}`)

  // Delete existing quizzes
  console.log('\n3. Deleting existing quizzes')
  const del = await request('DELETE', `/rest/v1/quizzes?course_id=eq.${course.id}`, null)
  console.log(`   Deleted (status ${del.status})`)

  // Insert final quiz
  console.log(`\n4. Inserting Course Final Quiz on module ${lastModule}`)
  const ins = await request('POST', '/rest/v1/quizzes', {
    course_id: course.id,
    module_number: lastModule,
    questions: { questions: FINAL_QUIZ_QUESTIONS },
    pass_percentage: 70,
  })

  if (ins.status === 201) {
    console.log(`   ✅ Final quiz inserted — ${FINAL_QUIZ_QUESTIONS.length} questions, 70% pass threshold`)
    console.log('   2 questions per module (modules 1–5), technical theory from course content')
  } else {
    console.error(`   ❌ Insert failed (${ins.status}):`, ins.body)
    process.exit(1)
  }

  console.log('\n=== Done ===')
  console.log('Modules 1–4: navigate freely.')
  console.log(`Module ${lastModule}: Course Final Quiz — pass 70% to earn certificate.\n`)
}

run().catch(e => { console.error('Fatal:', e); process.exit(1) })
