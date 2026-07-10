// seed-final-quiz.js
// Replaces per-module quizzes with a single Course Final Quiz on the last module.
// 10 questions, 2 per module, beginner–intermediate difficulty.
//
// Usage:
//   node seed-final-quiz.js "your-supabase-service-role-key"

const https = require('https')

function sanitize(str) {
  return str.replace(/[^\x20-\x7E]/g, '').trim()
}

const SUPABASE_URL = 'https://jqlynkmzduibfivycmze.supabase.co'
const SERVICE_KEY = sanitize(process.argv[2] || '')

if (!SERVICE_KEY) {
  console.error('Usage: node seed-final-quiz.js "YOUR_SERVICE_ROLE_KEY"')
  process.exit(1)
}

function request(method, path, body) {
  return new Promise((resolve, reject) => {
    const payload = body ? JSON.stringify(body) : null
    const url = new URL(SUPABASE_URL + path)
    const options = {
      hostname: url.hostname,
      path: url.pathname + url.search,
      method,
      headers: {
        'apikey': SERVICE_KEY,
        'Authorization': `Bearer ${SERVICE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=representation',
      },
    }
    if (payload) options.headers['Content-Length'] = Buffer.byteLength(payload)

    const req = https.request(options, (res) => {
      let data = ''
      res.on('data', chunk => data += chunk)
      res.on('end', () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(data) }) }
        catch { resolve({ status: res.statusCode, body: data }) }
      })
    })
    req.on('error', reject)
    if (payload) req.write(payload)
    req.end()
  })
}

// 10 questions — 2 per module, beginner to intermediate
const FINAL_QUIZ_QUESTIONS = [
  // Module 1: Introduction to Prompt Engineering
  {
    id: "q1",
    question: "What is the primary purpose of prompt engineering?",
    options: [
      "To train AI models from scratch",
      "To craft inputs that guide AI models toward desired outputs",
      "To write code that powers AI systems",
      "To test the processing speed of AI"
    ],
    correct: 1,
    explanation: "Prompt engineering is the skill of designing effective inputs (prompts) so AI models produce accurate, relevant, and useful outputs."
  },
  {
    id: "q2",
    question: "Which of the following best describes a 'prompt' in the context of AI?",
    options: [
      "A hardware component inside the AI server",
      "A type of neural network layer",
      "An input or instruction given to an AI model to produce a response",
      "A programming language used to build AI"
    ],
    correct: 2,
    explanation: "A prompt is the text or instruction you provide to an AI model — it's how you communicate what you want the model to do."
  },

  // Module 2: Core Prompting Techniques
  {
    id: "q3",
    question: "What is 'zero-shot prompting'?",
    options: [
      "Giving the AI zero seconds to respond",
      "Asking the AI to complete a task without providing any examples",
      "Using a prompt with no punctuation or formatting",
      "Running a prompt that produces zero output"
    ],
    correct: 1,
    explanation: "Zero-shot prompting means asking the AI to perform a task relying only on its training knowledge, without any examples in the prompt."
  },
  {
    id: "q4",
    question: "In few-shot prompting, what role do the examples in the prompt play?",
    options: [
      "They cause the AI to download more training data",
      "They show the AI the expected pattern or format of the response",
      "They reduce the number of tokens the AI uses",
      "They connect the AI to external search engines"
    ],
    correct: 1,
    explanation: "Examples in few-shot prompting demonstrate the pattern, style, or format you expect, helping the AI produce more consistent and accurate responses."
  },

  // Module 3: Advanced Strategies
  {
    id: "q5",
    question: "What does chain-of-thought (CoT) prompting encourage the AI to do?",
    options: [
      "Generate very long, detailed paragraphs",
      "Chain together multiple AI models",
      "Work through a problem step by step before giving the final answer",
      "Only use verified facts in its response"
    ],
    correct: 2,
    explanation: "Chain-of-thought prompting guides the AI to reason through intermediate steps, which significantly improves accuracy on math, logic, and complex tasks."
  },
  {
    id: "q6",
    question: "Which phrase is commonly used to trigger step-by-step reasoning in an AI?",
    options: [
      "Be very creative",
      "Answer as fast as possible",
      "Let's think step by step",
      "Use bullet points only"
    ],
    correct: 2,
    explanation: "'Let's think step by step' is a well-known trigger phrase that activates chain-of-thought reasoning, helping the AI tackle complex problems more accurately."
  },

  // Module 4: Real-World Applications
  {
    id: "q7",
    question: "When using AI to generate code, which approach gives the best results?",
    options: [
      "Asking something vague like 'write some code for me'",
      "Specifying the programming language, the goal, the inputs, and any constraints",
      "Providing only the expected output without explaining the task",
      "Letting the AI decide everything on its own"
    ],
    correct: 1,
    explanation: "Providing specific context — language, purpose, inputs, outputs, and constraints — gives the AI exactly what it needs to generate accurate and usable code."
  },
  {
    id: "q8",
    question: "What is the most reliable way to get an AI to return output in a specific format (such as JSON or a table)?",
    options: [
      "Hope the AI figures out the format on its own",
      "Ask the AI to 'be more organized'",
      "Explicitly describe or demonstrate the desired format inside the prompt",
      "Use a very short, minimal prompt"
    ],
    correct: 2,
    explanation: "Explicitly showing or describing the output format in your prompt is the most reliable way to get structured, consistent responses from an AI."
  },

  // Module 5: Mastering Prompt Engineering
  {
    id: "q9",
    question: "What is 'prompt iteration' and why does it matter?",
    options: [
      "Sending the exact same prompt repeatedly to average the results",
      "Progressively refining your prompt based on the AI's output to improve quality",
      "Writing the longest possible prompt to cover every scenario",
      "Using loops in your code to call the AI multiple times"
    ],
    correct: 1,
    explanation: "Prompt iteration means reviewing the AI's output and adjusting your prompt to fix issues or improve results — it's one of the most important skills in prompt engineering."
  },
  {
    id: "q10",
    question: "Which characteristic best describes a well-crafted prompt?",
    options: [
      "It is as long as possible to leave nothing to chance",
      "It avoids giving the AI any constraints or instructions",
      "It is clear, specific, and provides the right amount of context for the task",
      "It uses complex technical language to get better answers"
    ],
    correct: 2,
    explanation: "A well-crafted prompt is clear, specific, and contextually rich — it gives the AI everything it needs without unnecessary length or ambiguity."
  }
]

async function run() {
  console.log('\n=== Course Final Quiz Seeder ===\n')

  // 1. Get the course
  console.log('1. Looking up course: prompt-engineering-mastery')
  const courseRes = await request('GET', '/rest/v1/courses?slug=eq.prompt-engineering-mastery&select=id,title', null)

  // Detect bad API key (Supabase returns an object, not an array)
  if (!Array.isArray(courseRes.body)) {
    console.error('\n❌ Supabase returned an error:')
    console.error(JSON.stringify(courseRes.body, null, 2))
    console.error('\nThis usually means the service role key is wrong.')
    console.error('Get it from: Supabase Dashboard → Project Settings → API → service_role key')
    process.exit(1)
  }

  if (courseRes.body.length === 0) {
    console.error('❌ Course not found. Make sure the course exists in Supabase.')
    process.exit(1)
  }
  const course = courseRes.body[0]
  console.log(`   Found: ${course.title} (id: ${course.id})`)

  // 2. Get the last module number
  console.log('\n2. Getting last module number')
  const modulesRes = await request('GET', `/rest/v1/course_modules?course_id=eq.${course.id}&select=module_number&order=module_number.desc&limit=1`, null)
  const lastModuleNumber = modulesRes.body?.[0]?.module_number
  if (!lastModuleNumber) {
    console.error('No modules found for this course.')
    process.exit(1)
  }
  console.log(`   Last module: ${lastModuleNumber}`)

  // 3. Delete ALL existing quizzes for this course
  console.log('\n3. Deleting all existing per-module quizzes')
  const deleteRes = await request('DELETE', `/rest/v1/quizzes?course_id=eq.${course.id}`, null)
  console.log(`   Deleted (status ${deleteRes.status})`)

  // 4. Insert the single Course Final Quiz on the last module
  console.log(`\n4. Inserting Course Final Quiz on module ${lastModuleNumber}`)
  const quizPayload = {
    course_id: course.id,
    module_number: lastModuleNumber,
    questions: { questions: FINAL_QUIZ_QUESTIONS },
    pass_percentage: 70,
  }
  const insertRes = await request('POST', '/rest/v1/quizzes', quizPayload)
  if (insertRes.status === 201) {
    console.log('   ✅ Final quiz inserted successfully')
    console.log(`   ${FINAL_QUIZ_QUESTIONS.length} questions, 70% pass threshold`)
    console.log('   2 questions per module (modules 1–5)')
  } else {
    console.error(`   ❌ Insert failed (${insertRes.status}):`, insertRes.body)
    process.exit(1)
  }

  console.log('\n=== Done ===')
  console.log('Modules 1–4: navigate freely, no quiz.')
  console.log(`Module ${lastModuleNumber}: Course Final Quiz appears at the bottom.`)
  console.log('Pass 70% → certificate generates automatically.\n')
}

run().catch(err => {
  console.error('Fatal error:', err)
  process.exit(1)
})
