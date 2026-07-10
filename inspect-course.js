// inspect-course.js — reads module content + current quiz for any course
// Usage: node inspect-course.js "SERVICE_KEY" "course-slug"

const https = require('https')

function sanitize(str) { return str.replace(/[^\x20-\x7E]/g, '').trim() }

const SUPABASE_URL = 'https://jqlynkmzduibfivycmze.supabase.co'
const SERVICE_KEY = sanitize(process.argv[2] || '')
const SLUG = process.argv[3] || 'ai-for-beginners'

if (!SERVICE_KEY) { console.error('Usage: node inspect-course.js "KEY" "slug"'); process.exit(1) }

function request(path) {
  return new Promise((resolve, reject) => {
    const url = new URL(SUPABASE_URL + path)
    const req = https.request({
      hostname: url.hostname, path: url.pathname + url.search, method: 'GET',
      headers: { apikey: SERVICE_KEY, Authorization: `Bearer ${SERVICE_KEY}` }
    }, res => {
      let d = ''; res.on('data', c => d += c); res.on('end', () => resolve(JSON.parse(d)))
    })
    req.on('error', reject); req.end()
  })
}

async function run() {
  const courses = await request(`/rest/v1/courses?slug=eq.${SLUG}&select=id,title,slug`)
  if (!courses.length) { console.log('Course not found. Available courses:'); const all = await request('/rest/v1/courses?select=slug,title'); all.forEach(c => console.log(' -', c.slug, '|', c.title)); return }

  const course = courses[0]
  console.log('\n=== COURSE:', course.title, '===')
  console.log('ID:', course.id)

  const modules = await request(`/rest/v1/course_modules?course_id=eq.${course.id}&select=module_number,title,content&order=module_number.asc`)
  console.log('\n--- MODULES ---')
  modules.forEach(m => {
    console.log(`\nModule ${m.module_number}: ${m.title}`)
    console.log('Content preview:', (m.content || '').substring(0, 300), '...')
  })

  const quizzes = await request(`/rest/v1/quizzes?course_id=eq.${course.id}&select=module_number,pass_percentage,questions`)
  console.log('\n--- CURRENT QUIZZES ---')
  quizzes.forEach(q => {
    const qs = q.questions?.questions || q.questions || []
    console.log(`\nModule ${q.module_number} quiz (${qs.length} questions, pass: ${q.pass_percentage}%):`)
    qs.forEach((question, i) => console.log(`  Q${i+1}: ${question.question}`))
  })
}

run().catch(e => { console.error(e); process.exit(1) })
