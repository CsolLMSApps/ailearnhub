#!/usr/bin/env node
// update-all-course-content.js
// Updates all 6 courses with rewritten 2025/2026 content
// Uses Node built-in https (no fetch) — works on all Node versions on Windows

const fs   = require('fs')
const path = require('path')
const https = require('https')

// ── Get credentials (arg → env file → error) ─────────────────────────────────
function sanitize(str) {
  if (!str) return ''
  return str.replace(/[^\x20-\x7E]/g, '').trim()
}

const SUPABASE_URL = 'https://jqlynkmzduibfivycmze.supabase.co'

let SERVICE_KEY = sanitize(process.argv[2] || '')

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
  console.error('    Usage: node update-all-course-content.js YOUR_SERVICE_ROLE_KEY')
  console.error('    Or set SUPABASE_SERVICE_ROLE_KEY in .env.local')
  process.exit(1)
}

const urlObj = new URL(SUPABASE_URL)
console.log(`✅  Supabase host: ${urlObj.hostname}`)
console.log(`🔑  Key preview: ${SERVICE_KEY.substring(0, 30)}...${SERVICE_KEY.slice(-10)} (length: ${SERVICE_KEY.length})`)

const parts = SERVICE_KEY.split('.')
if (parts.length !== 3) {
  console.error(`❌  Key does not look like a valid JWT (got ${parts.length} parts, expected 3)`)
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

// ── File reader ───────────────────────────────────────────────────────────────
function readMd(filePath) {
  const full = path.join(__dirname, filePath)
  if (!fs.existsSync(full)) { console.warn(`  ⚠  Not found: ${full}`); return null }
  return fs.readFileSync(full, 'utf8')
}

// ── Course definitions ────────────────────────────────────────────────────────
const COURSES = [
  {
    slug: 'ai-for-beginners',
    modules: [
      { number: 1, title: 'AI Demystified',            minutes: 25, file: 'content/courses/ai-for-beginners/module-1.md' },
      { number: 2, title: 'Getting Started with ChatGPT', minutes: 30, file: 'content/courses/ai-for-beginners/module-2.md' },
      { number: 3, title: 'AI for Everyday Life',       minutes: 35, file: 'content/courses/ai-for-beginners/module-3.md' },
      { number: 4, title: 'AI at Work',                 minutes: 40, file: 'content/courses/ai-for-beginners/module-4.md' },
      { number: 5, title: 'Creative & Personal Uses',   minutes: 30, file: 'content/courses/ai-for-beginners/module-5.md' },
      { number: 6, title: 'Next Steps & Simple Tools',  minutes: 25, file: 'content/courses/ai-for-beginners/module-6.md' },
    ],
  },
  {
    slug: 'chatgpt-mastery',
    modules: [
      { number: 1, title: 'ChatGPT Quick Start',                minutes: 20, file: 'content/courses/chatgpt-mastery/module-1.md' },
      { number: 2, title: 'Prompt Engineering Mastery',         minutes: 35, file: 'content/courses/chatgpt-mastery/module-2.md' },
      { number: 3, title: 'Business Communication Excellence',  minutes: 40, file: 'content/courses/chatgpt-mastery/module-3.md' },
      { number: 4, title: 'Content Creation Accelerator',       minutes: 45, file: 'content/courses/chatgpt-mastery/module-4.md' },
      { number: 5, title: 'AI-Powered Productivity',            minutes: 40, file: 'content/courses/chatgpt-mastery/module-5.md' },
      { number: 6, title: 'Advanced ChatGPT Techniques',        minutes: 35, file: 'content/courses/chatgpt-mastery/module-6.md' },
      { number: 7, title: 'Beyond ChatGPT - Your AI Toolkit',   minutes: 30, file: 'content/courses/chatgpt-mastery/module-7.md' },
    ],
  },
  {
    slug: 'social-media-marketing-ai',
    modules: [
      { number: 1, title: 'AI for Social Media Strategy',                   minutes: 25, file: 'content/courses/social-media-marketing-ai/module-1.md' },
      { number: 2, title: 'AI-Powered Content Creation',                    minutes: 30, file: 'content/courses/social-media-marketing-ai/module-2.md' },
      { number: 3, title: 'AI-Driven Audience Targeting & Engagement',      minutes: 30, file: 'content/courses/social-media-marketing-ai/module-3.md' },
      { number: 4, title: 'AI for Social Media Analytics',                  minutes: 30, file: 'content/courses/social-media-marketing-ai/module-4.md' },
      { number: 5, title: 'AI-Powered Community Management',                minutes: 25, file: 'content/courses/social-media-marketing-ai/module-5.md' },
      { number: 6, title: 'Advanced AI Marketing Tactics',                  minutes: 25, file: 'content/courses/social-media-marketing-ai/module-6.md' },
    ],
  },
  {
    slug: 'email-marketing-ai',
    modules: [
      { number: 1, title: 'Email Marketing Strategy with AI', minutes: 25, file: 'content/courses/email-marketing-ai/course4-module1.md' },
      { number: 2, title: 'AI-Powered Email Writing',         minutes: 25, file: 'content/courses/email-marketing-ai/course4-module2.md' },
      { number: 3, title: 'Segmentation & Personalization',   minutes: 25, file: 'content/courses/email-marketing-ai/course4-module3.md' },
      { number: 4, title: 'A/B Testing & Optimization',       minutes: 20, file: 'content/courses/email-marketing-ai/course4-module4.md' },
      { number: 5, title: 'Email Automation Workflows',       minutes: 25, file: 'content/courses/email-marketing-ai/course4-module5.md' },
    ],
  },
  {
    slug: 'prompt-engineering-mastery',
    modules: [
      { number: 1, title: 'Prompt Engineering Fundamentals', minutes: 25, file: 'content/courses/prompt-engineering-mastery/course5-module1.md' },
      { number: 2, title: 'Advanced Prompt Techniques',      minutes: 45, file: 'content/courses/prompt-engineering-mastery/module-2.md' },
      { number: 3, title: 'Context and Constraints',         minutes: 40, file: 'content/courses/prompt-engineering-mastery/module-3.md' },
      { number: 4, title: 'Iterative Refinement',            minutes: 40, file: 'content/courses/prompt-engineering-mastery/module-4.md' },
      { number: 5, title: 'Domain-Specific Prompting',       minutes: 50, file: 'content/courses/prompt-engineering-mastery/module-5.md' },
    ],
  },
  {
    slug: 'ai-tools-productivity',
    modules: [
      { number: 1, title: 'AI Productivity Revolution',       minutes: 25, file: 'content/courses/ai-tools-productivity/course6-module1.md' },
      { number: 2, title: 'AI Writing Tools Mastery',         minutes: 25, file: 'content/courses/ai-tools-productivity/course6-module2.md' },
      { number: 3, title: 'AI Design & Visual Tools',         minutes: 20, file: 'content/courses/ai-tools-productivity/course6-module3.md' },
      { number: 4, title: 'Automation Workflows with AI',     minutes: 45, file: 'content/courses/ai-tools-productivity/module-4.md' },
      { number: 5, title: 'Integration Strategies and Scaling', minutes: 45, file: 'content/courses/ai-tools-productivity/module-5.md' },
    ],
  },
]

// ── Main ─────────────────────────────────────────────────────────────────────
async function updateCourse(courseDef) {
  console.log(`\n📚  Processing course: ${courseDef.slug}`)

  // Find course ID
  const courses = await request('GET', 'courses', null, `?slug=eq.${courseDef.slug}&select=id,slug,title`)
  if (!courses || courses.length === 0) {
    console.error(`  ❌  Course "${courseDef.slug}" not found in Supabase — skipping.`)
    return { slug: courseDef.slug, status: 'not_found', modules: 0 }
  }
  const course = courses[0]
  console.log(`  ✅  Found: ${course.title} (${course.id})`)

  let updated = 0

  for (const mod of courseDef.modules) {
    const content = readMd(mod.file)
    if (!content) {
      console.warn(`  ⚠   Module ${mod.number} file missing — skipped`)
      continue
    }

    await request('POST', 'course_modules', {
      course_id: course.id,
      module_number: mod.number,
      title: mod.title,
      content,
      estimated_minutes: mod.minutes,
    }, '?on_conflict=course_id,module_number')

    console.log(`  ✅  Module ${mod.number}: ${mod.title} (${Math.round(content.length / 1024)}KB)`)
    updated++
  }

  return { slug: courseDef.slug, title: course.title, status: 'ok', modules: updated }
}

async function main() {
  console.log('\n🚀  Updating all AILearnHub course content (2025/2026 rewrite)\n')
  console.log(`    Courses to update: ${COURSES.length}`)
  console.log(`    Total modules: ${COURSES.reduce((n, c) => n + c.modules.length, 0)}\n`)

  const results = []

  for (const courseDef of COURSES) {
    try {
      const result = await updateCourse(courseDef)
      results.push(result)
    } catch (err) {
      console.error(`\n  ❌  Error processing ${courseDef.slug}: ${err.message}`)
      results.push({ slug: courseDef.slug, status: 'error', error: err.message, modules: 0 })
    }
  }

  // Summary
  console.log('\n' + '─'.repeat(60))
  console.log('📊  SUMMARY')
  console.log('─'.repeat(60))

  let totalModules = 0
  for (const r of results) {
    if (r.status === 'ok') {
      console.log(`  ✅  ${r.title || r.slug}: ${r.modules} modules updated`)
      totalModules += r.modules
    } else if (r.status === 'not_found') {
      console.log(`  ⚠   ${r.slug}: not found in database`)
    } else {
      console.log(`  ❌  ${r.slug}: ERROR — ${r.error}`)
    }
  }

  console.log('\n' + '─'.repeat(60))
  console.log(`  Total modules updated: ${totalModules}`)
  console.log('  No deploy needed — this was a direct database update.')
  console.log('  Changes are live immediately on ailearnhub.io.')
  console.log('─'.repeat(60) + '\n')
}

main().catch(err => {
  console.error('\n❌  Fatal error:', err.message)
  process.exit(1)
})
