#!/usr/bin/env node
// seed-all-quizzes-v3.js
// Quiz questions rewritten to match new rewritten module content.
// 2 questions per module, based strictly on new module content.
//
// Usage: node seed-all-quizzes-v3.js
//   reads SUPABASE_SERVICE_ROLE_KEY from .env.local automatically

const fs    = require('fs')
const path  = require('path')
const https = require('https')

function sanitize(str) {
  if (!str) return ''
  return str.replace(/[^\x20-\x7E]/g, '').trim()
}

const SUPABASE_URL = 'https://jqlynkmzduibfivycmze.supabase.co'
let SERVICE_KEY = sanitize(process.argv[2] || '')

if (!SERVICE_KEY) {
  const envPath = path.join(__dirname, '.env.local')
  if (fs.existsSync(envPath)) {
    const raw = fs.readFileSync(envPath, 'utf8').replace(/^﻿/, '')
    raw.split(/\r?\n/).forEach(line => {
      const m = line.match(/^([^#=]+)=(.*)$/)
      if (m && m[1].trim() === 'SUPABASE_SERVICE_ROLE_KEY') {
        SERVICE_KEY = sanitize(m[2].replace(/^["']|["']$/g, ''))
      }
    })
  }
}

if (!SERVICE_KEY) {
  console.error('No service role key. Usage: node seed-all-quizzes-v3.js "KEY"')
  process.exit(1)
}

const urlObj = new URL(SUPABASE_URL)

function request(method, urlPath, body) {
  return new Promise((resolve, reject) => {
    const payload = body ? JSON.stringify(body) : null
    const options = {
      hostname: urlObj.hostname, port: 443,
      path: urlPath, method,
      headers: {
        'apikey': SERVICE_KEY, 'Authorization': `Bearer ${SERVICE_KEY}`,
        'Content-Type': 'application/json', 'Prefer': 'return=representation',
      },
    }
    if (payload) options.headers['Content-Length'] = Buffer.byteLength(payload)
    const req = https.request(options, res => {
      let d = ''
      res.on('data', c => d += c)
      res.on('end', () => {
        try { resolve({ status: res.statusCode, body: JSON.parse(d) })
        } catch { resolve({ status: res.statusCode, body: d }) }
      })
    })
    req.on('error', reject)
    if (payload) req.write(payload)
    req.end()
  })
}

// ─────────────────────────────────────────────────────────────────────────────
// QUIZ DATA — based strictly on new rewritten module content
// correct is 0-indexed (0=A, 1=B, 2=C, 3=D)
// ─────────────────────────────────────────────────────────────────────────────

// ── Course 1: AI for Beginners ────────────────────────────────────────────────
// Modules: AI Demystified | Getting Started with ChatGPT | AI for Everyday Life
//          AI at Work | Creative & Personal Uses | Next Steps & Simple Tools
const AI_FOR_BEGINNERS = [

  // Module 1: AI Demystified
  {
    id: 'q1',
    question: 'According to the module, the 2017 paper "Attention Is All You Need" introduced which architecture that underpins every major AI model today?',
    options: [
      'Deep Neural Network (DNN)',
      'Recurrent Neural Network (RNN)',
      'The Transformer architecture',
      'The Convolutional Neural Network (CNN)'
    ],
    correct: 2,
    explanation: 'The Transformer architecture, introduced in Google\'s 2017 paper "Attention Is All You Need," is the foundation of all leading models today — GPT-4o, Claude Sonnet 4, Gemini 2.5 Pro, and others. It enables models to process entire documents at once and understand long-range context.'
  },
  {
    id: 'q2',
    question: 'The module describes a "context window" as the model\'s working memory. What is the significance of today\'s leading models having context windows of 200,000 to 1 million tokens?',
    options: [
      'It means the model can browse the internet for unlimited information',
      'It allows models to process entire books, large codebases, or months of email threads in a single session',
      'It guarantees the model will never hallucinate within that limit',
      'It means the model permanently remembers all previous conversations'
    ],
    correct: 1,
    explanation: 'A context window is the amount of text an LLM can hold in attention at once — its working memory. Early models had ~4,000 tokens. Today\'s leading models handle 200K–1M tokens, enabling them to process entire books or large codebases in one session. It does not prevent hallucination or grant internet access.'
  },

  // Module 2: Getting Started with ChatGPT
  {
    id: 'q3',
    question: 'The module warns beginners about "The Search Engine Trap." What does this refer to?',
    options: [
      'Using Perplexity AI instead of ChatGPT for research tasks',
      'Treating AI like a search engine by typing short keyword queries instead of having a detailed conversation with context',
      'Forgetting to enable web browsing mode when searching for current information',
      'Using AI to search for copyrighted material'
    ],
    correct: 1,
    explanation: 'The Search Engine Trap is the habit of typing short, keyword-style queries into AI ("email tips") instead of providing full context ("I\'m a sales manager writing to a difficult client who missed payment..."). AI rewards specificity; keyword queries produce generic results that feel disappointing compared to Google.'
  },
  {
    id: 'q4',
    question: 'Which of the Five Principles of Effective AI Interaction states that you should treat AI as a collaborator rather than an oracle — and why does this framing matter?',
    options: [
      'It encourages users to always accept the AI\'s first response as correct',
      'It reminds users that AI is infallible and should guide all decisions',
      'It sets the expectation that AI output is a starting point requiring your judgment, not a final answer to be followed without question',
      'It means AI should only be used for creative tasks, not factual ones'
    ],
    correct: 2,
    explanation: 'Treating AI as a collaborator — not an oracle — is a critical mindset shift. An oracle is believed without question; a collaborator produces work you review, shape, and improve. This framing prevents over-reliance on AI output and keeps human judgment in the loop where it belongs.'
  },

  // Module 3: AI for Everyday Life
  {
    id: 'q5',
    question: 'The module describes using AI with "The Feynman Technique, Supercharged." What does this approach involve?',
    options: [
      'Asking AI to write a complete textbook on any topic you want to learn',
      'Having AI quiz you on a topic, then asking it to explain concepts in plain language until you can teach them back simply — revealing gaps in your understanding',
      'Using AI to find and summarize existing Wikipedia articles',
      'Asking AI to generate multiple-choice tests for exam preparation only'
    ],
    correct: 1,
    explanation: 'The Feynman Technique involves explaining a concept in simple terms to identify gaps. With AI, you can learn a topic, then ask AI to quiz you, explain gaps in progressively simpler language, and keep going until you can explain it to a child — a learning loop impossible at this pace with traditional methods.'
  },
  {
    id: 'q6',
    question: 'When the module covers "AI for Health Navigation," what is the first and most important point it makes before any health-related prompts?',
    options: [
      'AI can provide a more accurate diagnosis than most general practitioners',
      'You should always ask AI to recommend specific medications by name',
      'AI health information must always be verified with a qualified medical professional before any action is taken',
      'AI can replace doctor appointments for minor health issues'
    ],
    correct: 2,
    explanation: 'The module leads with a clear disclaimer: AI is a tool for understanding and preparing questions — not for diagnosis or treatment decisions. AI can explain conditions, help you understand test results, and prepare you for appointments, but medical decisions must always involve a qualified professional.'
  },

  // Module 4: AI at Work
  {
    id: 'q7',
    question: 'In the section "AI for Meetings," the module divides AI\'s role into "before" and "after." What does AI help with BEFORE a meeting that saves the most time?',
    options: [
      'Automatically attending the meeting on your behalf and taking notes',
      'Building structured meeting agendas with goals, time allocations per topic, attendee roles, and pre-read materials',
      'Sending automated follow-up emails to all attendees',
      'Transcribing the meeting in real time using voice recognition'
    ],
    correct: 1,
    explanation: 'Before meetings, AI\'s highest value is creating structured agendas — with clear goals, time blocks per agenda item, attendee roles, and pre-read links. A well-structured agenda reduces meeting time, improves focus, and ensures nothing important is missed. The module shows a prompt template for this.'
  },
  {
    id: 'q8',
    question: 'The module\'s section on "AI for Research and Analysis" emphasizes what key practice when using AI to analyze documents you upload?',
    options: [
      'Always paste the entire document into the chat rather than uploading it',
      'Ask AI to summarize first, then follow up with specific analytical questions — rather than asking one vague "analyze this" prompt',
      'Only use AI to analyze documents under 10 pages in length',
      'Ask AI to compare the document against its internet knowledge for accuracy'
    ],
    correct: 1,
    explanation: 'The module teaches a two-phase document analysis approach: start with a structured summary prompt, then drill into specific sections with targeted questions. A single vague "analyze this" prompt produces shallow output. Layered questioning — summary → specific analysis → implications — produces professional-grade insights.'
  },

  // Module 5: Creative & Personal Uses
  {
    id: 'q9',
    question: 'The module draws a critical distinction in creative writing between AI as a "collaborator" vs. a "ghost writer." What is the essential difference?',
    options: [
      'A collaborator writes the entire piece; a ghost writer only edits',
      'A collaborator generates ideas and structure that you rewrite in your own voice; a ghost writer produces final copy you publish unchanged',
      'A collaborator is only useful for fiction; a ghost writer is used for business writing',
      'There is no meaningful difference — both produce content you can use immediately'
    ],
    correct: 1,
    explanation: 'The module emphasizes that treating AI as a collaborator — generating ideas, outlines, and drafts that you then substantially rewrite — preserves your authentic voice and produces better work. Using AI as a ghost writer (publishing output unchanged) risks losing your unique perspective and, in many contexts, raises ethical or academic integrity concerns.'
  },
  {
    id: 'q10',
    question: 'When using image generation tools like Midjourney V7, the module identifies which element as having the greatest impact on output quality?',
    options: [
      'Choosing the most expensive subscription tier',
      'Using very short, abstract prompts to give the AI maximum creative freedom',
      'Specifying subject, visual style, lighting, mood, composition, and technical parameters in detail',
      'Uploading a reference photo and asking the AI to copy it exactly'
    ],
    correct: 2,
    explanation: 'The module shows that specific multi-element prompts — subject + style + lighting + mood + composition + technical specs (e.g., "cinematic lighting, shallow depth of field, editorial photography") — dramatically outperform vague prompts. Short abstract prompts give the AI too much freedom, resulting in generic or off-target images.'
  },

  // Module 6: Next Steps & Simple Tools
  {
    id: 'q11',
    question: 'The module warns against "Shiny Tool Syndrome." What does it recommend instead when a new AI tool launches?',
    options: [
      'Sign up immediately to stay ahead of competitors',
      'Wait one year before adopting any new AI tool to let it mature',
      'Apply the 5-Question Evaluation Framework to assess whether the tool addresses a specific unmet need in your workflow before investing time',
      'Only adopt tools that have been reviewed by major tech publications'
    ],
    correct: 2,
    explanation: '"Shiny Tool Syndrome" is the habit of signing up for every new AI tool. The module recommends a 5-Question Evaluation Framework: Does it solve a specific problem I have? Is it better than what I already use? What\'s the learning curve vs. the ROI? Is the company credible? Can I test before committing? This prevents tool sprawl.'
  },
  {
    id: 'q12',
    question: 'The module\'s 30-Day AI Proficiency Plan is structured into four weeks. What is the focus of Week 1?',
    options: [
      'Specialization — picking one AI tool and mastering it exclusively',
      'Integration — embedding AI into every part of your daily workflow',
      'Foundation — setting up accounts, learning core interaction principles, and building the daily habit of using AI',
      'Automation — building no-code workflows to run AI in the background'
    ],
    correct: 2,
    explanation: 'Week 1 of the 30-Day Plan is Foundation: setting up your AI accounts, learning the core interaction principles from this course, and most importantly, building the habit of reaching for AI tools daily. Without the habit, no amount of knowledge produces results. Weeks 2-4 progressively build depth, specialization, and integration.'
  }
]

// ── Course 2: ChatGPT Mastery ─────────────────────────────────────────────────
const CHATGPT_MASTERY = [

  // Module 1: ChatGPT Quick Start
  {
    id: 'q1',
    question: 'The module describes Custom Instructions as "the most impactful underused feature in ChatGPT." What specific benefit does configuring them provide?',
    options: [
      'They give ChatGPT access to real-time internet data automatically',
      'They eliminate the context window limit for long conversations',
      'They provide ChatGPT with permanent context about who you are and how you want responses, reducing iteration time by 30-40%',
      'They allow ChatGPT to remember all previous conversations permanently'
    ],
    correct: 2,
    explanation: 'Custom Instructions give ChatGPT persistent context — your role, communication preferences, output format defaults — so you never repeat yourself. The module notes this reduces iteration time by 30-40% on every subsequent conversation. Despite being available for over a year, most users still have not configured them.'
  },
  {
    id: 'q2',
    question: 'When should you use o3 or o4-mini instead of GPT-4o, according to the module\'s model selection guidance?',
    options: [
      'Always — o3 and o4-mini are newer and therefore better for all tasks',
      'For tasks requiring complex, multi-step reasoning such as logic problems, advanced coding, or mathematical analysis — where thinking through steps matters more than speed',
      'For creative writing tasks that benefit from more imaginative output',
      'When you need real-time web browsing capability'
    ],
    correct: 1,
    explanation: 'The module teaches model matching: GPT-4o for most conversational, writing, and analysis tasks; o3/o4-mini for complex reasoning that benefits from extended thinking — math, hard logic, advanced coding. Using the wrong model is "like using a hammer for a screw" — wasteful and often producing worse results.'
  },

  // Module 2: Prompt Engineering Mastery
  {
    id: 'q3',
    question: 'The module identifies the root causes of prompt failure. Which failure mode does it describe as "the most common reason professionals get generic output"?',
    options: [
      'Using too many words in the prompt, which confuses the model',
      'Asking for too specific a format, which constrains the AI\'s creativity',
      'Providing no context about who the output is for, what it will be used for, or what success looks like',
      'Using technical jargon that the model does not understand'
    ],
    correct: 2,
    explanation: 'The module identifies context absence as the primary cause of generic output. The model defaults to a "typical" response when it doesn\'t know the audience, purpose, or success criteria. "Write a marketing email" produces generic copy; "Write a 150-word re-engagement email for lapsed subscribers who bought running gear 6+ months ago" produces something usable.'
  },
  {
    id: 'q4',
    question: 'The module\'s section on "Building Your Personal Prompt Library" recommends organizing prompts by what criteria?',
    options: [
      'By date created, so you can track how your prompting has evolved',
      'Alphabetically by topic for easy retrieval',
      'By task type and frequency of use — highest-frequency, highest-value tasks get their own saved templates',
      'By which AI model they work best with'
    ],
    correct: 2,
    explanation: 'The module recommends building your prompt library around task type and usage frequency. Your highest-frequency workflows (weekly report, client emails, research summaries) deserve fully developed prompt templates. Low-frequency tasks can be prompted fresh each time. This approach delivers the highest ROI on prompt engineering investment.'
  },

  // Module 3: Business Communication Excellence
  {
    id: 'q5',
    question: 'The module\'s "AI Communication Framework" introduces a staged approach to professional writing. What is the first stage and why is it critical?',
    options: [
      'Generating multiple draft versions and choosing the best one',
      'Starting with a formatting pass to get structure right before content',
      'Defining the communication objective, audience, and desired outcome BEFORE writing any prompt — so AI is briefed like a skilled assistant, not guessing at your intent',
      'Asking AI to improve grammar and tone on a rough draft you wrote yourself'
    ],
    correct: 2,
    explanation: 'The AI Communication Framework starts with objective clarity — defining what you want the communication to achieve, who the reader is, and what action they should take. This pre-work shapes everything. Skipping it and jumping to "write me an email" produces output that sounds professional but misses the strategic goal.'
  },
  {
    id: 'q6',
    question: 'The module\'s section on "Diplomacy and Nuance" identifies situations where AI needs human help most. Which type of communication does it flag as requiring the most human judgment?',
    options: [
      'Routine status update emails',
      'Meeting agenda creation',
      'Emotionally sensitive situations — delivering difficult feedback, managing conflict, addressing grief or crisis — where tone, timing, and relationship context cannot be fully captured in a prompt',
      'Technical documentation and specification writing'
    ],
    correct: 2,
    explanation: 'The module is clear that AI handles structure and tone well but struggles with emotional nuance. Delivering difficult feedback, navigating a conflict between team members, or communicating during a personal crisis requires human judgment about relationship history, power dynamics, and emotional state — context AI cannot fully understand from a prompt.'
  },

  // Module 4: Content Creation Accelerator
  {
    id: 'q7',
    question: 'The module\'s "Content Creation System" recommends which workflow for producing high-quality long-form content consistently?',
    options: [
      'Ask AI to write the entire piece in one prompt, then publish with light editing',
      'Let AI pick the topic, format, and angle based on current trends',
      'Use a staged workflow: AI-generated outline → human approval → section-by-section writing → AI quality review → human final edit',
      'Write a rough draft yourself first, then ask AI to rewrite it completely'
    ],
    correct: 2,
    explanation: 'The module\'s Content Creation System is staged: outline first (where you control structure and strategy), then section-by-section writing with specific instructions per section, then a quality pass, then human final edit. This produces content that is structured by your thinking and written with AI speed — the best of both.'
  },
  {
    id: 'q8',
    question: 'The module\'s "Content Repurposing Engine" (Section 5) describes what core principle?',
    options: [
      'Writing new original content for each platform to maximize platform-native engagement',
      'Creating one high-quality pillar piece of content and systematically adapting it into multiple formats — LinkedIn post, Twitter thread, email newsletter, short video script — rather than starting from scratch each time',
      'Using AI to scrape competitor content and rewrite it in a different style',
      'Publishing the same content simultaneously across all platforms with no adaptation'
    ],
    correct: 1,
    explanation: 'The Content Repurposing Engine is one of the highest-ROI practices in the module. One well-researched blog post becomes: 5 LinkedIn posts, 3 email newsletter sections, 10 short-form social captions, 2 podcast talking points, and 1 short video script. AI makes this adaptation fast and platform-appropriate.'
  },

  // Module 5: AI-Powered Productivity
  {
    id: 'q9',
    question: 'The module\'s section on "Knowledge Management with AI" addresses what common professional pain point?',
    options: [
      'The inability to type fast enough to capture ideas during meetings',
      'The problem of information living in too many places — notes, emails, documents, bookmarks — making it impossible to retrieve and connect insights when you need them',
      'The challenge of storing large files on cloud services',
      'The difficulty of sharing documents with remote team members'
    ],
    correct: 1,
    explanation: 'Knowledge management addresses the "second brain" problem: professionals accumulate enormous amounts of information but can\'t retrieve or synthesize it on demand. The module covers using AI to capture meeting notes into a searchable system, link related ideas across documents, and retrieve synthesized insights — turning information scattered across tools into usable knowledge.'
  },
  {
    id: 'q10',
    question: 'The module warns that AI-powered automations must always include what safeguard, especially for external-facing content?',
    options: [
      'A second AI model that reviews the first AI\'s output automatically',
      'A minimum 24-hour delay between generation and publishing',
      'A human review step — because automations run at scale and a bad prompt produces bad results many times before anyone notices',
      'An encryption layer to protect the content during processing'
    ],
    correct: 2,
    explanation: 'The module\'s warning: automations amplify both quality and errors. A prompt producing mediocre output in a chat is a minor inconvenience. The same prompt embedded in an automation sending 1,000 emails is a serious problem. A human review checkpoint — even spot-checking — is essential before any automation touches external audiences.'
  },

  // Module 6: Advanced ChatGPT Techniques
  {
    id: 'q11',
    question: 'The module\'s advice on building Custom GPTs states: "The best Custom GPTs are built for a single, specific use case." Why does focus outperform breadth in Custom GPT design?',
    options: [
      'OpenAI limits Custom GPTs to one topic per GPT by technical design',
      'A focused GPT can have a deeply optimized system prompt, specific knowledge files, and fine-tuned instructions for one workflow — producing consistently excellent results; a broad GPT spreads its instructions too thin',
      'Focused GPTs load faster and cost less to run',
      'Users prefer simple interfaces, so fewer features means higher satisfaction'
    ],
    correct: 1,
    explanation: 'The module explains that a Custom GPT for "writing case studies in our brand voice" with a detailed system prompt, style guide, and example outputs will consistently outperform a "do everything marketing" GPT with diffuse instructions. Depth of optimization beats breadth of capability in specialized workflow tools.'
  },
  {
    id: 'q12',
    question: 'What is "Prompt Chaining" as described in the module, and what problem does it solve?',
    options: [
      'Copying a prompt from one AI tool and using it in another to compare outputs',
      'Breaking a complex task into a sequence of prompts where each output feeds the next — solving the problem that single large prompts produce worse results than thoughtful step-by-step workflows',
      'Linking multiple ChatGPT accounts for collaborative work',
      'Saving prompts in a chain-like structure for organized retrieval'
    ],
    correct: 1,
    explanation: 'Prompt chaining breaks complex work into logical stages: research → outline → draft → review → polish, with each AI output informing the next prompt. A single "write me a complete market analysis report" prompt produces mediocre output. A chained workflow where each stage builds on the last produces professional-grade work.'
  },

  // Module 7: Beyond ChatGPT - Your AI Toolkit
  {
    id: 'q13',
    question: 'The module describes NotebookLM as "fundamentally different" from other AI tools. What makes it distinct?',
    options: [
      'It uses a more advanced AI model than ChatGPT or Claude',
      'It works entirely from documents you upload rather than accessing the internet — so all answers are grounded in your specific source materials with citations',
      'It can generate images and audio in addition to text',
      'It is the only AI tool that can process documents in multiple languages simultaneously'
    ],
    correct: 1,
    explanation: 'NotebookLM\'s defining characteristic is source-grounded AI: it only answers from the documents you upload, not from general training data or the internet. Every answer cites the specific source document and section. This makes it exceptionally reliable for research, studying, and analyzing proprietary documents where hallucination cannot be tolerated.'
  },
  {
    id: 'q14',
    question: 'The module identifies Gamma\'s key limitation when used for presentations. What should users understand about Gamma\'s role?',
    options: [
      'Gamma can only create presentations in English',
      'Gamma produces poor visual design compared to traditional PowerPoint templates',
      'Gamma excels at design and structure but its auto-generated content requires significant editing for accuracy, specificity, and audience fit — it is a design tool, not a content writing tool',
      'Gamma requires a professional design background to use effectively'
    ],
    correct: 2,
    explanation: 'The module is explicit: Gamma\'s superpower is generating professional-looking slide structure and design in minutes. Its weakness is that it fills slides with generic content inferred from your description. The workflow is: use Gamma for structure and design, then manually replace its content with your specific data, examples, and messaging.'
  }
]

// ── Course 3: Social Media Marketing AI ──────────────────────────────────────
const SOCIAL_MEDIA_AI = [

  // Module 1: AI for Social Media Strategy
  {
    id: 'q1',
    question: 'The module introduces "The Three-Layer Pillar System" for content architecture. What are the three layers?',
    options: [
      'Platform pillars (which platforms to post on), frequency pillars (how often), and format pillars (text vs. video)',
      'Brand Pillars (3-5 core topics), Content Formats (3-4 post types), and a Content Calendar linking them together',
      'Awareness pillars, consideration pillars, and conversion pillars matching the sales funnel',
      'Owned pillars, earned pillars, and paid pillars based on channel type'
    ],
    correct: 1,
    explanation: 'The Three-Layer Pillar System creates consistency: Brand Pillars are the 3-5 topics you will own and be known for. Content Formats are the 3-4 post types you produce (carousel, case study, how-to, opinion). The Content Calendar links them into a repeatable schedule. AI generates content within this framework, not randomly.'
  },
  {
    id: 'q2',
    question: 'The module describes "The \'They\'re talking about me\' test" for evaluating social content quality. What does this test measure?',
    options: [
      'Whether your content will generate direct mentions and tags from other accounts',
      'Whether a target audience member reading the content feels personally seen and understood — as if the post was written specifically for them',
      'Whether your brand is being discussed in competitor communities',
      'Whether your content passes social media platform community guidelines'
    ],
    correct: 1,
    explanation: '"They\'re talking about me" is the ultimate audience resonance test. If your target reader thinks "this is exactly my situation" — that\'s the goal. AI helps achieve this by mining the exact language your audience uses in reviews, forums, and comments, then writing in their words rather than marketing language.'
  },

  // Module 2: AI-Powered Content Creation
  {
    id: 'q3',
    question: 'The module\'s section on LinkedIn Content Creation emphasizes which structural principle for maximum engagement on that platform?',
    options: [
      'Always use images or videos because text posts have lower reach on LinkedIn',
      'Keep posts under 50 words to match LinkedIn\'s audience attention span',
      'Lead with a strong hook in the first two lines — what appears before "see more" — because most viewers decide whether to expand based on those two lines alone',
      'Post only company news and product announcements to maintain professional credibility'
    ],
    correct: 2,
    explanation: 'LinkedIn collapses posts after 2-3 lines. The hook — what appears before "see more" — determines whether the viewer reads further. The module shows AI-generated LinkedIn structures that front-load the most compelling insight, question, or contrarian statement to maximize expansion rates.'
  },
  {
    id: 'q4',
    question: 'The "Content Repurposing Engine" in Section 6 is described as one of the highest-ROI tactics. What is its core principle?',
    options: [
      'Automatically cross-posting the same content to all platforms without changes',
      'Creating a new piece of content for each platform to maximize native engagement',
      'Creating one high-quality "pillar" piece (blog post, video, podcast episode) and using AI to adapt it into platform-specific formats — LinkedIn post, Twitter thread, email, short-form video script',
      'Repurposing competitor content by rewriting it with different examples'
    ],
    correct: 2,
    explanation: 'The Repurposing Engine multiplies the value of every content investment. One researched long-form piece yields: 5+ LinkedIn posts, an email newsletter, 10 short-form captions, podcast talking points, and a short-video script. AI makes format adaptation fast and platform-appropriate while preserving the core insight.'
  },

  // Module 3: AI-Driven Audience Targeting & Engagement
  {
    id: 'q5',
    question: 'The module\'s section on "Social Listening and Trend Detection" describes what competitive advantage AI provides?',
    options: [
      'AI can read private competitor social media strategy documents',
      'AI can monitor thousands of conversations, keywords, and hashtags simultaneously — identifying emerging trends, sentiment shifts, and audience pain points faster than any human team could manually',
      'AI automatically responds to competitor mentions to redirect their audience',
      'AI predicts which trends will go viral 30 days before they emerge'
    ],
    correct: 1,
    explanation: 'Social listening AI processes scale that humans cannot: thousands of posts, comments, forums, and hashtags simultaneously. It surfaces which specific language your audience uses, what problems they\'re actively complaining about, and which topics are gaining momentum — intelligence that takes manual researchers weeks to compile.'
  },
  {
    id: 'q6',
    question: 'In the Influencer Identification section, what does the module recommend prioritizing over follower count?',
    options: [
      'Verification status (blue checkmark) as a proxy for credibility',
      'Posting frequency — influencers who post more reach more people',
      'Audience engagement rate and audience quality — a smaller, highly engaged audience of your exact target customer outperforms a large, disengaged general audience',
      'The influencer\'s personal brand aesthetic matching your visual identity'
    ],
    correct: 2,
    explanation: 'The module explicitly de-prioritizes follower count in favour of engagement rate and audience fit. An influencer with 15,000 highly engaged followers in your exact niche typically delivers better conversion than one with 500,000 followers across mixed demographics. AI tools can analyze comment quality, fake follower ratios, and audience demographic fit.'
  },

  // Module 4: AI for Social Media Analytics
  {
    id: 'q7',
    question: 'The module\'s "Right Metrics Framework" distinguishes between vanity metrics and value metrics. Which of these is described as a vanity metric?',
    options: [
      'Conversion rate from social traffic to email sign-ups',
      'Revenue influenced by social media content',
      'Raw follower count and total impressions — numbers that look impressive but don\'t directly connect to business outcomes',
      'Cost per acquisition from paid social campaigns'
    ],
    correct: 2,
    explanation: 'Vanity metrics (follower count, total impressions, raw likes) measure activity but not business impact. The module teaches mapping metrics to business outcomes: reach matters if it\'s reaching the right people; engagement matters if engaged users convert; follower growth matters if new followers match your buyer persona.'
  },
  {
    id: 'q8',
    question: 'When analyzing content performance with AI, the module recommends what approach beyond just identifying top-performing posts?',
    options: [
      'Asking AI to predict which future posts will go viral based on past performance',
      'Asking AI to identify patterns across your top and bottom performers — what topic, format, hook style, posting time, or emotional tone correlates with high vs. low engagement — then systematically amplifying what works',
      'Comparing your metrics against the global social media average for your industry',
      'Automating all content based on what performed well last month'
    ],
    correct: 1,
    explanation: 'Performance analysis becomes actionable when AI identifies the WHY behind top posts — was it the hook structure? The topic? The format? The day/time? Pattern recognition across a content archive reveals the specific variables that predict success in YOUR audience, not generic best practices.'
  },

  // Module 5: AI-Powered Community Management
  {
    id: 'q9',
    question: 'The module\'s section on "Crisis Management and Negative Comments" outlines what first principle for handling public criticism?',
    options: [
      'Delete negative comments quickly before they gain traction',
      'Have AI generate an immediate automated response to all negative comments within minutes',
      'Acknowledge publicly and promptly, then move the detailed resolution to a private channel — never debate or get defensive in the comment thread',
      'Respond with factual corrections that demonstrate the commenter is wrong'
    ],
    correct: 2,
    explanation: 'The module\'s crisis principle: public acknowledgment shows you\'re listening and responsive; private resolution protects the customer\'s dignity and prevents an escalating public thread. Deleting comments amplifies the crisis. Debating publicly creates audiences for arguments. The goal is visible responsiveness and private resolution.'
  },
  {
    id: 'q10',
    question: 'When building "Scaling Community Responses" with AI, the module identifies which scenario as MOST suitable for AI-drafted responses?',
    options: [
      'A comment from someone who has just experienced a bereavement and shared it on your page',
      'A complex product complaint involving three separate technical failures',
      'A legal threat from a user regarding product liability',
      'High-volume, repetitive FAQs and product inquiries where the answer is consistent and factual — freeing human managers for nuanced interactions'
    ],
    correct: 3,
    explanation: 'AI community response templates add the most value for volume and consistency: FAQs, shipping questions, standard troubleshooting. Human community managers should handle anything emotional, complex, sensitive, or requiring relationship judgment. The AI-human split is: AI handles volume, humans handle nuance.'
  },

  // Module 6: Advanced AI Marketing Tactics
  {
    id: 'q11',
    question: 'The module\'s section on "Newsjacking and Trend Hijacking" describes what risk marketers must actively manage?',
    options: [
      'Being too slow to act on trends — the window for newsjacking closes within hours',
      'Creating content that is too similar to competitor newsjacking attempts',
      'Attaching your brand to sensitive news events where association could damage reputation — newsjacking requires brand-fit assessment before execution, not just speed',
      'Using AI-generated trend content that social platforms algorithmically penalize'
    ],
    correct: 2,
    explanation: 'Newsjacking\'s main risk is brand-fit mismatch. Speed matters, but attaching a brand to tragedy, controversy, or polarizing events causes backlash that far outweighs any engagement gain. The module teaches a two-step check: is this trend genuinely relevant to our brand? Is the news event brand-safe? AI helps with speed; humans must make the judgment call.'
  },
  {
    id: 'q12',
    question: 'In "Measuring Advanced AI Marketing ROI," the module recommends what approach for attributing social media\'s contribution to business outcomes?',
    options: [
      'Attributing 100% of any conversion that touched a social media post to social media',
      'Ignoring attribution entirely since social media\'s impact is inherently unmeasurable',
      'Using multi-touch attribution models that give credit across all touchpoints in a buyer\'s journey — recognizing social media often creates awareness or trust that converts through another channel',
      'Measuring only last-click conversions from paid social campaigns'
    ],
    correct: 2,
    explanation: 'Single-touch attribution (first click or last click) systematically undervalues social media, which often operates at the awareness and consideration stages. Multi-touch attribution distributes credit across the customer journey — including the social post that introduced a buyer who later converted through search or email.'
  }
]

// ── Course 4: Email Marketing AI ─────────────────────────────────────────────
const EMAIL_MARKETING_AI = [

  // Module 1: Email Marketing Strategy with AI
  {
    id: 'q1',
    question: 'The module identifies "Deliverability" as a foundational concern in email marketing strategy. What does email deliverability refer to?',
    options: [
      'The speed at which your email platform sends bulk emails',
      'Whether your email actually reaches the subscriber\'s inbox — as opposed to landing in spam, promotions, or being blocked entirely by mail servers',
      'The percentage of subscribers who open your emails within 24 hours',
      'Whether your email renders correctly on mobile devices'
    ],
    correct: 1,
    explanation: 'Deliverability is the prerequisite to everything else. A beautifully crafted email with a genius subject line delivers zero results if it lands in spam. The module covers the technical and strategic factors that protect sender reputation: list hygiene, authentication (SPF/DKIM/DMARC), engagement signals, and avoiding spam triggers.'
  },
  {
    id: 'q2',
    question: 'The module calls the Welcome Sequence "your most important emails." Why do welcome emails deserve more attention than regular campaign emails?',
    options: [
      'Welcome emails have mandatory high deliverability guaranteed by all email platforms',
      'Welcome emails are the only emails exempt from GDPR unsubscribe requirements',
      'Welcome emails arrive when subscriber intent and curiosity are highest — open rates are typically 3-5x higher than regular campaigns, making them the best opportunity to establish the relationship and set expectations',
      'Welcome emails are automatically sent by the platform and require no copywriting effort'
    ],
    correct: 2,
    explanation: 'The welcome moment is when subscriber attention peaks — they just opted in and are most curious about what they signed up for. The module\'s data: welcome emails average 50-60% open rates vs. 15-25% for regular campaigns. A well-crafted welcome sequence (3-5 emails) establishes the relationship, demonstrates value, and sets the tone for the entire subscriber journey.'
  },

  // Module 2: AI-Powered Email Writing
  {
    id: 'q3',
    question: 'The module titles Section 1 "Subject Lines — The Single Most Important Element." What does the module identify as the primary purpose of a subject line?',
    options: [
      'To summarize the full content of the email so subscribers can decide whether to read it',
      'To get the email opened — everything else in the email becomes irrelevant if the subject line fails to earn a click in a crowded inbox',
      'To pass spam filters by avoiding trigger words',
      'To establish brand consistency by matching the email\'s visual design language'
    ],
    correct: 1,
    explanation: 'The module is unambiguous: the subject line\'s only job is to earn the open. Not to be clever, not to summarize, not to brand — to create enough curiosity, urgency, or relevance that the subscriber opens the email. An email with perfect content and a weak subject line fails. AI generates and tests subject line variations at scale.'
  },
  {
    id: 'q4',
    question: 'The module describes "Preview Text" as "The Hidden Conversion Lever." What is preview text and why does it matter?',
    options: [
      'A test version of the email sent to a small segment before the main send',
      'The short text that appears next to or below the subject line in an inbox — giving subscribers a second preview of the email before they decide to open',
      'A plain-text version of the email shown when images are blocked',
      'The alt-text on email images visible to screen reader users'
    ],
    correct: 1,
    explanation: 'Preview text is the snippet visible in the inbox preview alongside the subject line. Most email clients show 40-90 characters. The module shows that optimized preview text — extending the subject line\'s hook rather than repeating it — can increase open rates by 10-25%. Most marketers leave it blank or let it auto-populate with "View in browser."'
  },

  // Module 3: Segmentation & Personalization
  {
    id: 'q5',
    question: 'The module\'s section on "Behavioral Triggers" describes them as "the engine of personalization." What makes behavioral triggers more effective than time-based email schedules?',
    options: [
      'Behavioral triggers are cheaper to implement than scheduled campaigns',
      'They send emails based on what the subscriber actually does — visiting a page, abandoning a cart, completing a purchase — so the email arrives precisely when it is most relevant to the subscriber\'s current mindset',
      'Behavioral triggers bypass spam filters more effectively than scheduled sends',
      'They work without requiring a subscriber\'s email address'
    ],
    correct: 1,
    explanation: 'Time-based emails are sent when the marketer decides; behavioral triggers fire when the subscriber signals interest through action. A cart abandonment email sent 1 hour after cart abandonment is exponentially more relevant than the same promotional email sent on Tuesday at 10am. The module shows behavioral triggers typically outperform scheduled campaigns by 3-5x on conversion rate.'
  },
  {
    id: 'q6',
    question: 'The module covers "Email Personalization Ethics" as part of segmentation strategy. What does it identify as the line between helpful personalization and uncomfortable surveillance?',
    options: [
      'Any personalization beyond first-name insertion crosses the ethical line',
      'Personalization is only ethical if subscribers have explicitly consented to each specific type of data use',
      'Personalizing based on data subscribers knowingly provided or actions they took on your owned properties is generally acceptable; making it feel like you\'re tracking them across the internet without their awareness crosses into uncomfortable territory',
      'Personalization is only ethical for B2C email — never B2B'
    ],
    correct: 2,
    explanation: 'The module\'s ethics framework: personalizing using purchase history, stated preferences, or behavior on your own website is expected and valued. Referencing data from third-party tracking, showing that you know which competitor sites someone visited, or personalizing based on inferred private information feels invasive and erodes trust.'
  },

  // Module 4: A/B Testing & Optimization
  {
    id: 'q7',
    question: 'The module\'s section on "Sample Size and Statistical Significance" makes which critical point about A/B testing?',
    options: [
      'Any difference between test variants, no matter how small, is meaningful and should inform your strategy',
      'You should declare a winner as quickly as possible to act on results while they\'re fresh',
      'Results from small samples or short test windows are likely noise — you need sufficient sample size and test duration (usually 24-48 hours minimum) before a difference is statistically meaningful',
      'Statistical significance only matters for tests with more than 3 variables'
    ],
    correct: 2,
    explanation: 'The module warns against "calling winners early." A 5% open rate difference across 200 subscribers after 3 hours may be statistical noise — not a real signal. Statistical significance requires enough data that the result would unlikely occur by chance. The module recommends minimum sample sizes and test durations before making strategy changes.'
  },
  {
    id: 'q8',
    question: 'The module\'s "Optimization Mindset" section describes the goal of ongoing A/B testing as building what?',
    options: [
      'A collection of viral email templates you can reuse indefinitely',
      'Cumulative intelligence about YOUR specific audience — what language, offers, timing, and formats resonate — that becomes a proprietary competitive advantage over time',
      'A library of industry-standard email templates benchmarked against sector averages',
      'A reputation with email platforms that improves your deliverability score'
    ],
    correct: 1,
    explanation: 'The optimization mindset treats every test as a data point building a model of your audience. After 50 tests, you know which subject line styles your subscribers respond to, which CTAs convert, which content topics drive clicks. This audience-specific intelligence — unavailable from any benchmark report — is a genuine competitive advantage.'
  },

  // Module 5: Email Automation Workflows
  {
    id: 'q9',
    question: 'The module identifies "The Five Essential Automations" every email marketer should build. Which does it rank as the highest priority to build first?',
    options: [
      'Re-engagement sequence for cold subscribers',
      'Post-purchase review request sequence',
      'Cart abandonment sequence',
      'Welcome sequence — because it engages subscribers at peak intent, sets relationship expectations, and runs for every new subscriber indefinitely'
    ],
    correct: 3,
    explanation: 'The welcome sequence is #1 because: it activates at peak subscriber interest, it sets the tone for the entire relationship, it delivers value before asking for anything, and every future subscriber goes through it. A one-time investment in a great welcome sequence pays dividends indefinitely. Cart abandonment has higher immediate conversion impact but serves a smaller segment.'
  },
  {
    id: 'q10',
    question: 'The module\'s "Auditing and Optimizing Existing Automations" section recommends reviewing automations at what cadence, and what is the primary metric to watch?',
    options: [
      'Annually — automation performance is stable once set up correctly',
      'Only when a technical error causes a failure',
      'Quarterly at minimum — checking engagement rates at each step because automations "set it and forget it" while subscriber expectations, product offerings, and platform algorithms continuously change around them',
      'Weekly — automation content becomes stale within 7 days'
    ],
    correct: 2,
    explanation: 'The module warns against truly "setting and forgetting" automations. Quarterly audits check: Are open/click rates declining? Are unsubscribe rates at specific steps elevated? Is the content still accurate (correct prices, current product names, valid links)? Email automations interact with a changing world and degrade without maintenance.'
  }
]

// ── Course 5: Prompt Engineering Mastery ─────────────────────────────────────
const PROMPT_ENGINEERING = [

  // Module 1: Prompt Engineering Fundamentals
  {
    id: 'q1',
    question: 'The module identifies "The Six Components of Effective Prompts." Which component does it describe as the most underused — yet the one that most dramatically improves output relevance?',
    options: [
      'Role — telling the AI what persona to adopt',
      'Length — specifying exactly how long the output should be',
      'Audience — specifying who the output is for and their knowledge level, which fundamentally changes vocabulary, depth, and tone',
      'Format — specifying the structural layout of the response'
    ],
    correct: 2,
    explanation: 'The module identifies Audience as the most underused component. Telling the AI "explain quantum entanglement to a 12-year-old" vs. "explain it to a physics PhD" produces fundamentally different responses in vocabulary, analogies, and assumed knowledge. Audience context changes everything, yet most prompts omit it entirely.'
  },
  {
    id: 'q2',
    question: 'The module explains that building "Prompt Engineering Intuition" develops over time through what practice?',
    options: [
      'Memorizing a list of 100 pre-approved prompt formulas',
      'Systematically analyzing why prompts succeed or fail — not just what output they produced — building a mental model of which inputs produce which outputs across different task types',
      'Using the same proven prompt template for all tasks to build consistency',
      'Reading academic papers on natural language processing'
    ],
    correct: 1,
    explanation: 'Intuition develops through deliberate analysis, not just practice. After each prompt: Why did it work? What specifically in the wording produced that output? What would have produced something different? This meta-analysis — studying the prompt-output relationship — builds the mental model that lets expert prompt engineers predict outputs before testing.'
  },

  // Module 2: Advanced Prompt Techniques
  {
    id: 'q3',
    question: 'The module covers "Self-Consistency Prompting" as an advanced technique. How does it work and when is it most valuable?',
    options: [
      'Asking the AI to check its output for grammatical consistency before responding',
      'Generating multiple independent reasoning paths for the same problem and selecting the answer that appears most frequently across them — most valuable for problems with a single correct answer where reasoning errors are possible',
      'Keeping your prompt style consistent across all uses of the same tool',
      'Asking the AI to use the same format it used in the previous response'
    ],
    correct: 1,
    explanation: 'Self-Consistency generates several independent attempts at reasoning through a problem, then identifies the most common conclusion. It\'s especially useful for math problems, logical deductions, and factual questions where reasoning errors might lead to wrong answers. If 4 of 5 reasoning paths reach the same answer, you can be more confident than in a single response.'
  },
  {
    id: 'q4',
    question: 'The module introduces "Meta-Prompting — Using AI to Improve Your Prompts." What does this technique involve?',
    options: [
      'Asking one AI to critique the outputs of another AI',
      'Using a prompt you found online as the starting point for your own prompt',
      'Describing your goal to the AI and asking it to generate the optimal prompt for achieving that goal — then using that AI-generated prompt as your actual input',
      'Building a prompt from multiple smaller prompts concatenated together'
    ],
    correct: 2,
    explanation: 'Meta-prompting is using the AI as a prompt engineer for itself. You describe what you\'re trying to achieve ("I want to generate a detailed market analysis of the electric vehicle sector"), ask the AI to write you the best possible prompt for that goal, then use the AI-generated prompt as your actual query. Experienced prompt engineers use this to break through plateaus.'
  },

  // Module 3: Context and Constraints
  {
    id: 'q5',
    question: 'The module identifies "Audience Context" as "the most underused dimension" of prompting. Which example best illustrates why audience context matters so much?',
    options: [
      'Telling the AI that the audience is large vs. small in number',
      'Specifying that the audience is in a different country than the writer',
      'Specifying "explain blockchain to a 60-year-old retired teacher with no tech background" vs. "explain it to a CTO considering enterprise implementation" — producing fundamentally different vocabulary, analogies, and recommended depth',
      'Telling the AI whether the audience will read on mobile or desktop'
    ],
    correct: 2,
    explanation: 'The same topic requires completely different treatment for different audiences. Blockchain for a non-technical retiree needs simple analogies (like a shared ledger book everyone in a village can see) and focuses on what it means practically. For a CTO, it needs technical architecture, enterprise integration patterns, and risk assessment. Audience context is the single highest-leverage contextual addition.'
  },
  {
    id: 'q6',
    question: 'The module\'s "Context Debugging Process" helps when AI output keeps missing the mark. What is the first step in this process?',
    options: [
      'Switch to a different AI tool that might understand your intent better',
      'Start a completely new conversation to reset the model\'s attention',
      'Diagnose which specific context element is missing or wrong — is it missing audience info? Wrong format? Insufficient task specification? — before changing anything, so you fix the actual cause rather than randomly trying new prompts',
      'Add more length to the prompt by including more background information'
    ],
    correct: 2,
    explanation: 'The Context Debugging Process is diagnostic: before changing a prompt that isn\'t working, identify specifically what\'s wrong with the output (wrong tone? wrong format? wrong depth? factually off?) and trace it back to a specific missing or incorrect context element. Random prompt changes without diagnosis often fix one thing while breaking another.'
  },

  // Module 4: Iterative Refinement
  {
    id: 'q7',
    question: 'The module contrasts "Convergent Iteration" with "Divergent Iteration." What is the key difference?',
    options: [
      'Convergent iteration uses shorter prompts; divergent iteration uses longer ones',
      'Convergent iteration narrows toward a specific, polished final output through progressive refinement; divergent iteration deliberately explores multiple different directions to find the best approach before committing to one',
      'Convergent iteration is for creative tasks; divergent iteration is for analytical tasks',
      'These are two names for the same iterative refinement process'
    ],
    correct: 1,
    explanation: 'Choosing the right iteration mode matters: Convergent iteration (refine → refine → polish) is right when you know the direction and need to improve execution. Divergent iteration (generate 5 different angles → evaluate → pick the best → then converge) is right when you\'re unsure of the best approach. Most people default to convergent even when divergent would serve them better.'
  },
  {
    id: 'q8',
    question: 'The module\'s "Self-Critique Loop" teaches the AI to evaluate its own outputs. What does this technique involve?',
    options: [
      'Asking the AI to rewrite the same output multiple times and compare versions',
      'After receiving an output, asking the AI to critique it against specific criteria (accuracy, completeness, tone, audience fit), then revise — essentially having the AI play both author and editor',
      'Having the AI score its response on a 1-10 scale before you read it',
      'Asking the AI to identify which parts of its response it is least confident about'
    ],
    correct: 1,
    explanation: 'The Self-Critique Loop unlocks significant quality improvement without additional manual effort: generate output → prompt AI to critique it against your stated criteria → prompt AI to revise based on its own critique. The AI\'s editor perspective often catches things its author perspective missed, producing better output than you\'d get through direct refinement alone.'
  },

  // Module 5: Domain-Specific Prompting
  {
    id: 'q9',
    question: 'The module\'s section on "Prompting for Legal Work" identifies which safeguard as non-negotiable in any legal prompt?',
    options: [
      'Always asking the AI to cite specific case law from its training data',
      'Using only AI tools that have been certified by legal professional associations',
      'Explicitly instructing the AI to flag anything requiring professional legal review, and never using AI output as a final legal document without attorney review — AI can organize, draft, and identify issues but cannot provide legal advice',
      'Restricting legal prompts to questions about laws that haven\'t changed in over 10 years'
    ],
    correct: 2,
    explanation: 'The module is unambiguous on legal prompting: AI is a powerful legal research and drafting assistant, but not a lawyer. It can draft contracts, identify relevant legal concepts, and flag potential issues. It cannot provide legal advice or produce final binding documents. The non-negotiable safeguard: every legally consequential AI output requires attorney review.'
  },
  {
    id: 'q10',
    question: 'The module\'s "Technical and Code Prompting" section identifies what as the most effective way to reduce debugging time on AI-generated code?',
    options: [
      'Asking the AI to write the simplest possible solution to reduce complexity',
      'Requesting that the AI avoid error handling to keep code concise',
      'Specifying the programming language, function purpose, exact input/output data types with examples, constraints, edge cases to handle, and requesting inline comments explaining the logic',
      'Breaking the coding task into at least 10 separate prompts for maximum precision'
    ],
    correct: 2,
    explanation: 'The module shows that code prompts specifying types, examples, constraints, and edge cases dramatically reduce debugging. The AI can make correct architectural choices when it knows input formats, expected output structures, performance requirements, and boundary conditions — rather than making assumptions that require debugging after the fact.'
  }
]

// ── Course 6: AI Tools & Productivity ────────────────────────────────────────
const AI_TOOLS_PRODUCTIVITY = [

  // Module 1: AI Productivity Revolution
  {
    id: 'q1',
    question: 'The module\'s section on "Auditing Your Current Workflow" is presented as a necessary first step before adopting AI tools. Why?',
    options: [
      'To identify which tasks are legally permitted to be automated in your industry',
      'To calculate your current hourly rate so you can measure AI\'s time savings in dollar terms',
      'To identify which specific tasks consume the most time, involve the most repetition, or require the most cognitive load — so AI is applied where it creates real impact rather than just automating low-value tasks you could simply stop doing',
      'To create a record of your pre-AI baseline for performance review documentation'
    ],
    correct: 2,
    explanation: 'Automating a bad process makes a bad process faster. Auditing first identifies the highest-value targets: tasks that are time-consuming AND important AND repetitive AND suitable for AI. Without an audit, people tend to AI-ify whatever is most frustrating rather than whatever creates the most value.'
  },
  {
    id: 'q2',
    question: 'The module describes "The Cognitive Shifts Required" for effective AI integration. Which shift does it identify as the hardest for experienced professionals?',
    options: [
      'Learning new software interfaces and keyboard shortcuts',
      'Shifting from "AI as a search engine" to "AI as a thinking partner" — trusting AI enough to share unfinished thinking and work-in-progress rather than only using it for polished, clearly defined tasks',
      'Accepting that AI can generate content faster than you can write',
      'Getting comfortable with AI occasionally making errors'
    ],
    correct: 1,
    explanation: 'The hardest cognitive shift for experienced professionals is vulnerability: sharing rough, half-formed ideas with AI rather than only bringing it finished inputs. Professionals accustomed to expertise are uncomfortable with "here\'s my messy thinking, help me structure it." This shift unlocks AI\'s highest value — as a thinking partner, not just an execution tool.'
  },

  // Module 2: AI Writing Tools Mastery
  {
    id: 'q3',
    question: 'The module\'s "Professional Writing Workflow" integrates AI at which stages, according to its recommended process?',
    options: [
      'AI replaces the entire writing process from research to final edit',
      'AI is used only for the final polish pass — grammar, tone, and word choice improvements',
      'AI supports research and outline generation, drafts sections on request, and reviews completed drafts — while the human provides strategy, specific examples, proprietary data, and editorial judgment throughout',
      'AI is used only when the writer has complete writer\'s block'
    ],
    correct: 2,
    explanation: 'The module\'s workflow treats AI as a writing partner, not a ghostwriter. Human provides: the strategic direction, specific data and examples, organizational voice, and final judgment. AI provides: research synthesis, structural suggestions, fast drafting of sections, and quality checks. Neither alone produces optimal professional output.'
  },
  {
    id: 'q4',
    question: 'The module\'s section on "Voice Preservation at Scale" addresses what challenge that arises when teams use AI for writing?',
    options: [
      'AI writing tools only work in one language, creating problems for multilingual teams',
      'All AI tools add the same watermark to generated content, which readers can detect',
      'When multiple team members use AI without shared guidance, content loses organizational voice consistency — different posts sound like they were written by different brands',
      'AI writing tools automatically include competitor brand names in generated content'
    ],
    correct: 2,
    explanation: 'Voice preservation at scale is about maintaining consistent organizational identity when AI democratizes content creation. The solution: documented brand voice guidelines fed into every AI writing prompt; team prompt templates encoding voice parameters; an editorial review process. Without these, AI makes every team member\'s content sound generically similar — just not to each other.'
  },

  // Module 3: AI Design & Visual Tools
  {
    id: 'q5',
    question: 'In the Midjourney V7 mastery section, the module identifies what as the single most impactful prompt element for professional-quality results?',
    options: [
      'Specifying the aspect ratio and image resolution',
      'Uploading a reference image for the AI to copy directly',
      'Combining a specific art style or photography style reference with technical parameters — lighting type, camera lens simulation, rendering quality — rather than describing only the subject matter',
      'Using the negative prompt feature to exclude unwanted elements'
    ],
    correct: 2,
    explanation: 'The module shows that subject-only prompts ("a woman at a desk") produce generic results. Adding style and technical parameters — "a woman at a desk, editorial photography style, soft window light, Canon 85mm portrait lens, shallow depth of field, muted warm tones, magazine cover quality" — produces professional imagery. The style layer is what elevates amateur to professional outputs.'
  },
  {
    id: 'q6',
    question: 'The module\'s "AI Video for Professional Productivity" section sets what expectation about current AI video tools?',
    options: [
      'AI video tools can now produce broadcast-quality video indistinguishable from professional productions',
      'AI video tools are only suitable for personal use, not professional contexts',
      'AI video tools (Sora, Runway Gen-3) excel at short clips, B-roll, and concept visualization but still require significant human judgment for script, narrative, and professional-grade polish — they augment video production, they don\'t replace it',
      'AI video tools require no text prompting — they generate video from images alone'
    ],
    correct: 2,
    explanation: 'The module sets realistic expectations: current AI video tools are powerful for short-form content, B-roll footage, and visualizing concepts quickly. They are not yet a replacement for professional video production in high-stakes contexts. The right framing is AI as a video production accelerator — cutting stock footage costs and rough visualization time significantly.'
  },

  // Module 4: Automation Workflows with AI
  {
    id: 'q7',
    question: 'The module\'s "Platform Selection — Zapier vs. Make vs. n8n" section recommends n8n for which type of user or use case?',
    options: [
      'Absolute beginners with no technical background who want simple, fast automation',
      'Enterprise companies that need Salesforce and SAP integration',
      'Teams or individuals who want maximum flexibility, self-hosting for data privacy, complex logic capabilities, and are comfortable with a steeper learning curve — often technical users or those with developer support',
      'Users who need exclusively social media automations'
    ],
    correct: 2,
    explanation: 'The module\'s platform comparison: Zapier is easiest for beginners with the largest app library; Make (formerly Integromat) suits more complex visual workflows at a lower price point; n8n is for technical users who need maximum flexibility, self-hosting (data stays on your servers), and complex conditional logic — at the cost of a steeper learning curve.'
  },
  {
    id: 'q8',
    question: 'The module\'s "Automation Ethics and Governance" section raises what concern specifically about AI-powered automations communicating on behalf of a person or brand?',
    options: [
      'Automated communications are prohibited by GDPR in all EU countries',
      'AI automations are too slow to send timely communications',
      'When AI communicates automatically at scale — responding to customers, sending personalized emails, posting social content — errors, tone failures, or hallucinations scale with the automation and can cause significant harm before any human notices',
      'Automation platforms charge extra for AI-generated content in workflows'
    ],
    correct: 2,
    explanation: 'The ethics concern is scale amplification of errors. A human accidentally sends an inappropriate email to one person. An AI automation with a flawed prompt sends the same inappropriate message to 10,000 people before anyone catches it. Governance requirements: human review checkpoints, conservative rate limits during initial deployment, alerting on anomalous outputs, and clear human escalation paths.'
  },

  // Module 5: Integration Strategies and Scaling
  {
    id: 'q9',
    question: 'The module\'s "From Personal to Team AI Adoption" section identifies what as the most common failure mode when organizations try to scale AI adoption?',
    options: [
      'The AI tools being too expensive for widespread team access',
      'Team members being resistant to learning new technology',
      'Deploying tools without defined use cases, training, or governance — resulting in inconsistent usage where some team members use AI heavily, others ignore it, and no one follows consistent standards, producing no organizational benefit',
      'Choosing the wrong AI tool for the team\'s primary workflow'
    ],
    correct: 2,
    explanation: 'Tool availability does not equal adoption. The module\'s finding: organizations that deploy AI access without a change management program — defined use cases, training, prompt libraries, and governance — see fragmented, inconsistent adoption. The result is islands of AI productivity (individual power users) surrounded by unchanged workflows.'
  },
  {
    id: 'q10',
    question: 'The module\'s "Measuring AI ROI at Scale" section recommends which approach for calculating the business value of AI adoption?',
    options: [
      'Focus exclusively on cost savings from headcount reduction',
      'Measure only the time saved on individual tasks and multiply by hourly rate',
      'Build a multi-dimension ROI model: time savings × value of that time + quality improvements + new capabilities enabled + error reduction + employee satisfaction — because time savings alone understates AI\'s total organizational value',
      'Compare your AI spending against industry benchmark averages'
    ],
    correct: 2,
    explanation: 'The module argues that time savings × hourly rate is the floor, not the ceiling, of AI ROI. The full model includes: quality improvements (fewer errors, more consistent output), new capabilities (work that wasn\'t feasible before), employee engagement (less drudgery, more meaningful work), and competitive positioning. Single-metric ROI consistently undervalues AI investments.'
  }
]

// ─────────────────────────────────────────────────────────────────────────────
const COURSES = [
  { slug: 'ai-for-beginners',           questions: AI_FOR_BEGINNERS,     label: 'AI for Beginners' },
  { slug: 'chatgpt-mastery',            questions: CHATGPT_MASTERY,       label: 'ChatGPT Mastery' },
  { slug: 'social-media-marketing-ai',  questions: SOCIAL_MEDIA_AI,       label: 'Social Media Marketing AI' },
  { slug: 'email-marketing-ai',         questions: EMAIL_MARKETING_AI,    label: 'Email Marketing AI' },
  { slug: 'prompt-engineering-mastery', questions: PROMPT_ENGINEERING,    label: 'Prompt Engineering Mastery' },
  { slug: 'ai-tools-productivity',      questions: AI_TOOLS_PRODUCTIVITY, label: 'AI Tools & Productivity' },
]

async function seedCourse({ slug, questions, label }) {
  console.log(`\n📚  ${label}`)
  const r1 = await request('GET', `/rest/v1/courses?slug=eq.${slug}&select=id,title`, null)
  if (!Array.isArray(r1.body) || !r1.body.length) { console.error(`   ❌  Not found: ${slug}`); return false }
  const course = r1.body[0]
  console.log(`   Found: ${course.title}`)
  const r2 = await request('GET', `/rest/v1/course_modules?course_id=eq.${course.id}&select=module_number&order=module_number.desc&limit=1`, null)
  const lastModule = r2.body?.[0]?.module_number
  if (!lastModule) { console.error('   ❌  No modules'); return false }
  console.log(`   Last module: ${lastModule}`)
  await request('DELETE', `/rest/v1/quizzes?course_id=eq.${course.id}`, null)
  const r4 = await request('POST', '/rest/v1/quizzes', {
    course_id: course.id,
    module_number: lastModule,
    questions: { questions },
    pass_percentage: 70,
  })
  if (r4.status === 201) {
    console.log(`   ✅  ${questions.length} questions inserted`)
    return true
  }
  console.error(`   ❌  Insert failed (${r4.status}):`, JSON.stringify(r4.body).slice(0, 200))
  return false
}

async function run() {
  console.log('\n=== AILearnHub — Quiz Seeder v3 (synced to new module content) ===\n')
  let ok = 0, fail = 0
  for (const c of COURSES) {
    const passed = await seedCourse(c)
    passed ? ok++ : fail++
  }
  console.log(`\n${'─'.repeat(50)}`)
  console.log(`✅  Seeded: ${ok}/${COURSES.length}   ❌  Failed: ${fail}`)
  console.log('=== Done ===\n')
}

run().catch(e => { console.error('Fatal:', e); process.exit(1) })
