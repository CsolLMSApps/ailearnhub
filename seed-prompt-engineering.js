#!/usr/bin/env node
// seed-prompt-engineering.js
// Uses Node built-in https (no fetch) — works on all Node versions on Windows

const fs   = require('fs')
const path = require('path')
const https = require('https')

// ── Get credentials (arg → env file → error) ─────────────────────────────────
function sanitize(str) {
  if (!str) return ''
  return str.replace(/[^\x20-\x7E]/g, '').trim()
}

// Supabase URL is known — hardcoded as fallback
const SUPABASE_URL = 'https://jqlynkmzduibfivycmze.supabase.co'

// Service role key: passed as first CLI argument
let SERVICE_KEY = sanitize(process.argv[2] || '')

// Fallback: try reading from .env.local if no CLI arg
if (!SERVICE_KEY) {
  const envPath = path.join(__dirname, '.env.local')
  if (fs.existsSync(envPath)) {
    const env = {}
    fs.readFileSync(envPath, 'utf8').split('\n').forEach(line => {
      const m = line.match(/^([^#=]+)=(.*)$/)
      if (m) env[m[1].trim()] = sanitize(m[2])
    })
    SERVICE_KEY = sanitize(
      env['SUPABASE_SERVICE_ROLE_KEY'] || env['SUPABASE_SERVICE_KEY'] || ''
    )
  }
}

if (!SERVICE_KEY) {
  console.error('❌  No service role key provided.')
  console.error('    Usage: node seed-prompt-engineering.js YOUR_SERVICE_ROLE_KEY')
  process.exit(1)
}

// Extract hostname for https module
const urlObj = new URL(SUPABASE_URL)
console.log(`✅  Supabase host: ${urlObj.hostname}`)
console.log(`🔑  Key preview: ${SERVICE_KEY.substring(0, 30)}...${SERVICE_KEY.slice(-10)} (length: ${SERVICE_KEY.length})`)

// Validate key looks like a JWT (should be 3 base64 parts separated by dots)
const parts = SERVICE_KEY.split('.')
if (parts.length !== 3) {
  console.error(`❌  Key does not look like a valid JWT (got ${parts.length} parts, expected 3)`)
  console.error('   It may be truncated. Please check your .env.local file.')
  process.exit(1)
}

// ── HTTPS helper ─────────────────────────────────────────────────────────────
function request(method, tablePath, body, queryString = '') {
  return new Promise((resolve, reject) => {
    const fullPath = `/rest/v1/${tablePath}${queryString}`
    const bodyStr = body ? JSON.stringify(body) : ''

    const options = {
      hostname: urlObj.hostname,
      port: 443,
      path: fullPath,
      method,
      headers: {
        'apikey': SERVICE_KEY,
        'Authorization': `Bearer ${SERVICE_KEY}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(bodyStr),
        'Prefer': (method === 'POST' || method === 'PATCH')
          ? 'resolution=merge-duplicates,return=representation'
          : 'return=representation',
      },
    }

    const req = https.request(options, (res) => {
      let data = ''
      res.on('data', chunk => { data += chunk })
      res.on('end', () => {
        if (res.statusCode >= 400) {
          reject(new Error(`${method} ${tablePath}: HTTP ${res.statusCode} — ${data}`))
          return
        }
        try { resolve(data ? JSON.parse(data) : null) }
        catch { resolve(data) }
      })
    })

    req.on('error', reject)
    if (bodyStr) req.write(bodyStr)
    req.end()
  })
}

// ── Module content files ─────────────────────────────────────────────────────
function readMd(filePath) {
  const full = path.join(__dirname, filePath)
  if (!fs.existsSync(full)) { console.warn(`  ⚠  Not found: ${full}`); return null }
  return fs.readFileSync(full, 'utf8')
}

const MODULES = [
  { number: 1, title: 'Prompt Engineering Fundamentals', minutes: 25,
    file: 'content/courses/prompt-engineering-mastery/course5-module1.md' },
  { number: 2, title: 'Advanced Prompt Techniques', minutes: 45,
    file: 'content/courses/prompt-engineering-mastery/module-2.md' },
  { number: 3, title: 'Context and Constraints', minutes: 40,
    file: 'content/courses/prompt-engineering-mastery/module-3.md' },
  { number: 4, title: 'Iterative Refinement', minutes: 40,
    file: 'content/courses/prompt-engineering-mastery/module-4.md' },
  { number: 5, title: 'Domain-Specific Prompting', minutes: 50,
    file: 'content/courses/prompt-engineering-mastery/module-5.md' },
]

// ── Quiz data ────────────────────────────────────────────────────────────────
const QUIZZES = {
  1: { pass_percentage: 70, questions: { questions: [
    { id:'q1', question:'What is prompt engineering?', options:['Writing code for AI models','Designing inputs to get optimal AI outputs','Training AI on new datasets','Building AI hardware'], correct:1 },
    { id:'q2', question:'Which of the following is NOT one of the 6 essential prompt elements?', options:['Role','Task','Database connection','Format'], correct:2 },
    { id:'q3', question:'What is the most important thing to include first in a prompt?', options:['Examples','Task and key constraints','Your name','Temperature setting'], correct:1 },
    { id:'q4', question:'Which is an example of a tone descriptor?', options:['"Use Python 3"','"Conversational vs. Formal"','"Write 500 words"','"Include tables"'], correct:1 },
    { id:'q5', question:'What is the biggest mistake beginners make when prompting AI?', options:['Being too vague and unspecific','Giving too many examples','Using bullet points','Asking one question at a time'], correct:0 },
    { id:'q6', question:'What is the most effective way to iterate on a prompt?', options:['Start over from scratch','Ask a different AI model','Refine based on what was wrong','Use shorter prompts'], correct:2 },
    { id:'q7', question:'When should you include examples in your prompt?', options:['Never','Only for complex tasks','Always, for consistency','Only when the AI asks'], correct:2 },
    { id:'q8', question:'How should you specify output length?', options:['Leave it to the AI','Say "exactly X words" (specific)','Just say "short" or "long"','Length does not matter'], correct:1 },
    { id:'q9', question:'If you need answers to multiple questions, what is the best approach?', options:['Break them into separate prompts','Ask all at once','Use numbered lists in one prompt','Ask randomly'], correct:0 },
    { id:'q10', question:'Which is a best practice for prompt engineering?', options:['Be vague for creative freedom','Avoid giving context','Be specific about role, task, format, and constraints','Never use examples'], correct:2 },
  ]}},
  2: { pass_percentage: 70, questions: { questions: [
    { id:'q1', question:'What does Chain-of-Thought (CoT) prompting do?', options:['Makes prompts shorter','Guides AI through step-by-step reasoning','Limits AI response length','Speeds up AI processing'], correct:1 },
    { id:'q2', question:'Few-shot learning involves providing the AI with:', options:['No examples at all','Exactly one example','Multiple examples (typically 3 or more)','Auto-generated examples'], correct:2 },
    { id:'q3', question:'Zero-shot prompting means:', options:['No examples are provided','Zero output is produced','Starting the session over','Removing all context'], correct:0 },
    { id:'q4', question:'Role-based prompting assigns the AI:', options:['A different model type','A specific expert perspective or persona','A random response style','Limited capabilities'], correct:1 },
    { id:'q5', question:'What is the primary purpose of a system prompt?', options:['To reset the conversation','To set foundational behavior and constraints','To limit the number of tokens','To slow down responses'], correct:1 },
    { id:'q6', question:'A temperature of 0.1 is best suited for:', options:['Creative writing','Brainstorming ideas','Factual analysis and code generation','Casual conversation'], correct:2 },
    { id:'q7', question:'Which temperature range produces the most creative, varied outputs?', options:['0.0 – 0.2','0.3 – 0.5','0.5 – 0.7','0.8 – 2.0'], correct:3 },
    { id:'q8', question:'When is few-shot preferred over zero-shot?', options:['When the task is very simple','For ambiguous, nuanced, or format-specific tasks','When AI already knows the task','When you want shorter responses'], correct:1 },
    { id:'q9', question:'What does the Frequency Penalty parameter do?', options:['Makes AI respond faster','Reduces repetition of the same tokens','Limits the number of questions','Sets the response language'], correct:1 },
    { id:'q10', question:'Combining role + chain-of-thought + few-shot examples results in:', options:['Worse, more confused outputs','Multiplicatively better results','Same result as one technique','Slower AI responses only'], correct:1 },
  ]}},
  3: { pass_percentage: 70, questions: { questions: [
    { id:'q1', question:'Which is NOT one of the Five Layers of Context?', options:['Situational Context','Audience Context','Billing Context','Purpose Context'], correct:2 },
    { id:'q2', question:'What is "Audience Context" in prompting?', options:['Telling AI the room temperature','Specifying who will receive the output','Listing your credentials','Defining word count'], correct:1 },
    { id:'q3', question:'What problem does "too much context" cause?', options:['AI refuses to respond','Information overload with irrelevant details','Shorter responses','Perfect but slow outputs'], correct:1 },
    { id:'q4', question:'Which is an example of a GOOD output constraint?', options:['"Write something good"','"Be detailed"','"In exactly 150 words, using 3 bullet points"','"Do your best"'], correct:2 },
    { id:'q5', question:'What does "Format Context" tell the AI?', options:['The AI model version','How the output will be used or displayed','The number of questions','Background of the writer'], correct:1 },
    { id:'q6', question:'A negative constraint in a prompt does what?', options:['Stops AI from responding','Tells AI what NOT to include or do','Lowers response quality','Increases token usage'], correct:1 },
    { id:'q7', question:'What is "Background Context"?', options:['Color theme preferences','Relevant history or prior knowledge for the task','AI model training data','System hardware information'], correct:1 },
    { id:'q8', question:'The optimal amount of context in a prompt is:', options:['As much as possible','None — AI works without context','Just enough: audience, goal, format, and constraints','Only the task, nothing else'], correct:2 },
    { id:'q9', question:'Specifying output format in a prompt helps to:', options:['Slow down the AI','Match the output to your actual workflow needs','Reduce AI accuracy','Limit creativity'], correct:1 },
    { id:'q10', question:'When handling an ambiguous request, the best strategy is to:', options:['Let AI guess','Add clarifying context and explicit constraints','Use shorter prompts','Avoid examples'], correct:1 },
  ]}},
  4: { pass_percentage: 70, questions: { questions: [
    { id:'q1', question:'What is the Four-Stage Refinement process (in order)?', options:['Write → Publish → Delete → Redo','Baseline → Analysis → Hypothesis → Test & Compare','Draft → Edit → Proofread → Submit','Plan → Code → Deploy → Monitor'], correct:1 },
    { id:'q2', question:'What does "Baseline" mean in refinement?', options:['The worst possible prompt','Your initial prompt and output — your starting point','The final approved version','A template from a library'], correct:1 },
    { id:'q3', question:'In A/B prompt testing, what should you change between versions?', options:['Everything at once','Only one variable at a time','The AI model used','Nothing — results should be identical'], correct:1 },
    { id:'q4', question:'What is "meta-prompting"?', options:['Using AI to write code','Asking AI to evaluate and improve your prompt','Sending the same prompt twice','Using shorter prompts'], correct:1 },
    { id:'q5', question:'Why should you save and version-control working prompts?', options:['For compliance requirements','To reuse reliable prompts without starting from scratch','Because AI forgets previous sessions','To slow down iteration'], correct:1 },
    { id:'q6', question:'Prompt debugging focuses on:', options:['Fixing code errors in AI models','Identifying why a prompt produces poor or inconsistent results','Deleting bad prompts permanently','Changing AI providers'], correct:1 },
    { id:'q7', question:'What is a "Prompt Library"?', options:['A book about AI','A curated collection of tested, reusable prompts by use case','A list of failed prompts','An AI training dataset'], correct:1 },
    { id:'q8', question:'How many iterations typically improve a mediocre prompt to high-performing?', options:['Perfect on first try','Exactly 10 always','Typically 3–5 focused refinement cycles','Over 100 iterations'], correct:2 },
    { id:'q9', question:'What is "output analysis" in iterative refinement?', options:['Checking AI server logs','Evaluating what worked using specific quality criteria','Counting words in the output','Reformatting output as HTML'], correct:1 },
    { id:'q10', question:'The goal of iterative refinement is to:', options:['Use more API credits','Turn a mediocre prompt into a reliable, high-performing one','Make prompts as long as possible','Avoid using AI'], correct:1 },
  ]}},
  5: { pass_percentage: 70, questions: { questions: [
    { id:'q1', question:'For technical documentation, the most important prompting strategy is:', options:['High temperature for creativity','Specifying target audience expertise level','Avoiding examples entirely','Using casual language'], correct:1 },
    { id:'q2', question:'When prompting for code generation, you should include:', options:['Only the function name','Input types, output types, error handling, and coding style','Just "write code for this"','The AI model version'], correct:1 },
    { id:'q3', question:'For business analysis prompts, what structure works best?', options:['Stream of consciousness writing','Current state → trends → insights → recommendations','A single broad question','Only quantitative data, no context'], correct:1 },
    { id:'q4', question:'A prompt library is best organized by:', options:['Alphabetical order only','Date created','Function and frequency of use','Length of the prompt'], correct:2 },
    { id:'q5', question:'What does "negative prompting" tell the AI?', options:['To refuse the task','What NOT to do or include in the output','To use lower temperature','To produce shorter answers'], correct:1 },
    { id:'q6', question:'For creative content prompts, which approach produces better results?', options:['Single open-ended instruction','Specifying tone, audience, format, length, and brand voice','Using maximum temperature only','Avoiding all constraints'], correct:1 },
    { id:'q7', question:'Domain-specific prompting differs from generic prompting because:', options:['It uses different AI models','It applies field-specific conventions, terminology, and quality criteria','It always produces shorter outputs','It avoids roles or examples'], correct:1 },
    { id:'q8', question:'To prompt effectively for data analysis, you should:', options:['Only ask for raw numbers','Specify audience, insight type, format, and decisions the analysis drives','Avoid mentioning data source','Ask for summaries with no recommendations'], correct:1 },
    { id:'q9', question:'How do you future-proof your prompt engineering skills?', options:['Learn one AI tool and stick with it','Continuous learning and adaptation as models evolve','Avoid new AI releases','Only use free-tier AI models'], correct:1 },
    { id:'q10', question:'A good prompt template format includes:', options:['Only the task description','Name, use case, required inputs, expected outputs, and usage notes','Just a title and one line','The AI model version and pricing'], correct:1 },
  ]}},
}

// ── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log('\n🚀  Seeding Prompt Engineering Mastery course...\n')

  // 1. Find course ID
  const courses = await request('GET', 'courses', null, '?slug=eq.prompt-engineering-mastery&select=id,slug,title')
  if (!courses || courses.length === 0) {
    console.error('❌  Course "prompt-engineering-mastery" not found in Supabase.')
    process.exit(1)
  }
  const course = courses[0]
  console.log(`✅  Found course: ${course.title} (${course.id})\n`)

  // 2. Update module content
  for (const mod of MODULES) {
    const content = readMd(mod.file)
    if (!content) continue

    await request('POST', 'course_modules', {
      course_id: course.id,
      module_number: mod.number,
      title: mod.title,
      content,
      estimated_minutes: mod.minutes,
    }, '?on_conflict=course_id,module_number')

    console.log(`  ✅  Module ${mod.number}: ${mod.title} (${Math.round(content.length/1024)}KB)`)
  }

  // 3. Delete ghost module 6 if it exists
  const ghosts = await request('GET', 'course_modules', null,
    `?course_id=eq.${course.id}&module_number=eq.6&select=id`)
  if (ghosts && ghosts.length > 0) {
    await request('DELETE', 'course_modules', null,
      `?course_id=eq.${course.id}&module_number=eq.6`)
    console.log('\n  🗑   Deleted ghost module 6 (was causing 404)\n')
  } else {
    console.log('\n  ✓   No ghost module 6\n')
  }

  // 4. Seed quizzes
  for (const [num, quiz] of Object.entries(QUIZZES)) {
    await request('POST', 'quizzes', {
      course_id: course.id,
      module_number: parseInt(num),
      questions: quiz.questions,
      pass_percentage: quiz.pass_percentage,
    }, '?on_conflict=course_id,module_number')
    console.log(`  ✅  Quiz Module ${num} (${quiz.questions.questions.length}Q, ${quiz.pass_percentage}% pass)`)
  }

  console.log('\n✅  All done!\n')
  console.log('  • Modules 1-5 content updated')
  console.log('  • Ghost module 6 removed (fixes 404)')
  console.log('  • Quizzes seeded for all 5 modules')
  console.log('\nNo deploy needed — this was a direct database update.\n')
}

main().catch(err => {
  console.error('\n❌  Error:', err.message)
  process.exit(1)
})
