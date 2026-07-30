#!/usr/bin/env node
// seed-all-quizzes-v2.js
// Replaces quizzes for all 6 courses with new moderate-difficulty questions.
// 2 questions per module, strictly within module content.
// Single "Course Final Quiz" placed on the last module of each course.
//
// Usage: node seed-all-quizzes-v2.js "SERVICE_ROLE_KEY"
//   or:  set SUPABASE_SERVICE_ROLE_KEY in .env.local and run without argument

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
    // Handle Windows CRLF line endings and BOM
    const raw = fs.readFileSync(envPath, 'utf8').replace(/^﻿/, '')
    raw.split(/\r?\n/).forEach(line => {
      const m = line.match(/^([^#=]+)=(.*)$/)
      if (m && m[1].trim() === 'SUPABASE_SERVICE_ROLE_KEY') {
        // Strip surrounding quotes if present, then sanitize
        SERVICE_KEY = sanitize(m[2].replace(/^["']|["']$/g, ''))
      }
    })
  }
}

if (!SERVICE_KEY) {
  console.error('❌  No service role key. Usage: node seed-all-quizzes-v2.js "KEY"')
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
// QUIZ DATA
// All questions: moderate difficulty, drawn strictly from module content.
// correct is 0-indexed (0=A, 1=B, 2=C, 3=D).
// ─────────────────────────────────────────────────────────────────────────────

// ── Course 1: AI for Beginners ────────────────────────────────────────────────
// Modules: AI Demystified | Getting Started with ChatGPT | AI for Everyday Life
//          AI at Work | Creative & Personal Uses | Next Steps & Simple Tools
const AI_FOR_BEGINNERS = [
  // Module 1: AI Demystified
  {
    id: 'q1',
    question: 'Which statement correctly describes how Large Language Models (LLMs) generate text?',
    options: [
      'They retrieve pre-written answers from a database and display the closest match',
      'They predict the most likely next word or token based on patterns learned during training',
      'They search the internet in real-time and summarize the results',
      'They use hand-coded grammar rules to construct grammatically correct sentences'
    ],
    correct: 1,
    explanation: 'LLMs are trained on vast text datasets and learn statistical patterns. At inference time they predict the most probable next token — they do not retrieve from a database or browse the internet.'
  },
  {
    id: 'q2',
    question: 'AI, Machine Learning, and Deep Learning are related but distinct. Which ordering correctly describes how they nest?',
    options: [
      'Deep Learning contains Machine Learning, which contains AI',
      'Machine Learning contains AI and Deep Learning as equal siblings',
      'AI is the broadest field; Machine Learning is a subset of AI; Deep Learning is a subset of Machine Learning',
      'AI and Machine Learning are the same thing, while Deep Learning is a separate field'
    ],
    correct: 2,
    explanation: 'AI is the broadest concept (machines mimicking human intelligence). Machine Learning is a subset of AI that learns from data. Deep Learning is a subset of ML that uses multi-layered neural networks.'
  },

  // Module 2: Getting Started with ChatGPT
  {
    id: 'q3',
    question: 'You ask ChatGPT for advice on treating a serious medical symptom and it gives a confident, detailed answer. What is the most important next step?',
    options: [
      'Follow the advice immediately — ChatGPT is trained on medical literature',
      'Share the answer with friends to see if they agree',
      'Verify the information with a qualified doctor before acting on it',
      'Ask ChatGPT to repeat the answer to confirm it is correct'
    ],
    correct: 2,
    explanation: 'ChatGPT can produce plausible-sounding but incorrect medical information (a phenomenon called hallucination). Always verify health information with a qualified professional before acting on it.'
  },
  {
    id: 'q4',
    question: 'Which prompt will consistently produce the most useful output from ChatGPT?',
    options: [
      '"Write something about marketing."',
      '"Tell me about sales."',
      '"Summarize in 3 bullet points the key differences between inbound and outbound marketing for a non-technical small business owner."',
      '"Marketing differences — go."'
    ],
    correct: 2,
    explanation: 'Specific prompts that include the desired format (bullet points), comparison target, output length, and audience context give ChatGPT exactly what it needs to produce a focused, useful response.'
  },

  // Module 3: AI for Everyday Life
  {
    id: 'q5',
    question: 'When ChatGPT generates a confident, detailed fact that turns out to be completely false, this is called:',
    options: [
      'Bias amplification',
      'Overfitting',
      'A hallucination',
      'Model collapse'
    ],
    correct: 2,
    explanation: 'Hallucination is when an AI model produces plausible-sounding content that is factually incorrect. It\'s a known limitation of LLMs — they optimize for fluency, not factual accuracy.'
  },
  {
    id: 'q6',
    question: 'You want to use AI to plan a week of healthy meals. Which prompt will give the most practical result?',
    options: [
      '"Make me a meal plan."',
      '"I need food ideas."',
      '"Create a 7-day meal plan for 2 adults: vegetarian, under 30 minutes per meal, approximately 500 calories per meal, with a shopping list organized by grocery aisle."',
      '"What should I eat this week?"'
    ],
    correct: 2,
    explanation: 'Specific constraints — who it\'s for, dietary type, time limit, calorie target, and the desired format (organized shopping list) — give the AI the parameters to produce a genuinely usable meal plan.'
  },

  // Module 4: AI at Work
  {
    id: 'q7',
    question: 'Which workplace task is AI currently LEAST reliable for when acting without human review?',
    options: [
      'Drafting a first-pass version of a routine business email',
      'Summarizing the key points from a long internal document',
      'Making final strategic business decisions that require accountability',
      'Suggesting an agenda structure for a team meeting'
    ],
    correct: 2,
    explanation: 'AI is a strong drafting and summarizing tool but lacks accountability, organizational context, and the ability to take responsibility. Final strategic decisions require human judgment and ownership.'
  },
  {
    id: 'q8',
    question: 'To get the most useful AI-drafted professional email, which elements must your prompt include?',
    options: [
      'Only the recipient\'s name',
      'The topic and nothing else — AI infers the rest',
      'Recipient context, purpose of the email, desired tone, key points to cover, and approximate length',
      'A full draft for the AI to simply "clean up"'
    ],
    correct: 2,
    explanation: 'A complete email prompt includes who you\'re writing to (and their context), the email\'s purpose, the tone, the key points, and the desired length — giving the AI everything it needs to produce a usable draft.'
  },

  // Module 5: Creative & Personal Uses
  {
    id: 'q9',
    question: 'When using ChatGPT for creative writing, which practice best preserves your originality?',
    options: [
      'Publish ChatGPT\'s output word-for-word as your own finished work',
      'Use ChatGPT to generate story ideas, outlines, and first drafts, then rewrite substantially in your own voice',
      'Ask ChatGPT to copy the exact style of a specific living author',
      'Let ChatGPT write every sentence to ensure speed and consistency'
    ],
    correct: 1,
    explanation: 'AI is most valuable as a creative collaborator — generating options and structure — while you supply the voice, perspective, and editorial judgment. Publishing raw AI output unchanged risks plagiarism concerns and lacks your unique perspective.'
  },
  {
    id: 'q10',
    question: 'For AI-assisted travel planning, which prompt produces the most actionable itinerary?',
    options: [
      '"Plan me a trip."',
      '"Give me travel ideas for Asia."',
      '"Create a 7-day Tokyo itinerary for March, $150/day budget, focused on street food and contemporary art, with one day trip outside the city. Include transport between sites."',
      '"What are the best things to do?"'
    ],
    correct: 2,
    explanation: 'Specific prompts with destination, duration, season, budget, interests, and format requirements (including transport) let the AI produce a genuinely actionable plan rather than a generic overview.'
  },

  // Module 6: Next Steps & Simple Tools
  {
    id: 'q11',
    question: 'Which AI tool is specifically designed for generating images from text descriptions?',
    options: [
      'Grammarly',
      'Microsoft Copilot (Bing Chat)',
      'DALL-E or Midjourney',
      'Notion AI'
    ],
    correct: 2,
    explanation: 'DALL-E (by OpenAI) and Midjourney are text-to-image AI tools — you describe an image in words and they generate it. Grammarly handles writing assistance; Notion AI handles notes and documents.'
  },
  {
    id: 'q12',
    question: 'Which behavior reflects responsible AI use in both personal and professional contexts?',
    options: [
      'Accept AI output as fact since it is trained on large datasets',
      'Always verify AI-generated information against reliable sources before sharing or acting on it',
      'Keep your AI tool usage secret so colleagues don\'t question your work',
      'Share personal passwords with AI tools for seamless integration'
    ],
    correct: 1,
    explanation: 'Responsible AI use requires fact-checking AI output — models can hallucinate confidently. Sharing passwords or treating AI as infallible creates security and accuracy risks.'
  }
]

// ── Course 2: ChatGPT Mastery ─────────────────────────────────────────────────
// Modules: ChatGPT Quick Start | Prompt Engineering Mastery |
//          Business Communication Excellence | Content Creation Accelerator |
//          AI-Powered Productivity | Advanced ChatGPT Techniques |
//          Beyond ChatGPT - Your AI Toolkit
const CHATGPT_MASTERY = [
  // Module 1: ChatGPT Quick Start
  {
    id: 'q1',
    question: 'What is the "context window" in ChatGPT and why does it matter for long conversations?',
    options: [
      'The physical display area of the chat interface on your screen',
      'The total amount of text (your inputs + ChatGPT\'s outputs) the model can hold in memory at once — older content gets dropped when the limit is reached',
      'The number of messages you are allowed to send per day',
      'The time limit before ChatGPT automatically ends a session'
    ],
    correct: 1,
    explanation: 'Every LLM has a context window — a maximum amount of text it can "see" at once. In very long conversations, earlier messages fall outside this window, so ChatGPT may lose track of details discussed much earlier.'
  },
  {
    id: 'q2',
    question: 'You paste a 5,000-word document into ChatGPT before asking questions about it. What is the main technical concern?',
    options: [
      'ChatGPT cannot read pasted text — it only accepts uploaded files',
      'ChatGPT will automatically delete the document after 24 hours',
      'The pasted document consumes a large portion of the context window, leaving less room for follow-up conversation',
      'Pasting documents automatically triggers a premium subscription charge'
    ],
    correct: 2,
    explanation: 'Long pastes consume context window space. If the document plus conversation exceeds the window, earlier content — potentially including the document itself — is no longer "visible" to the model.'
  },

  // Module 2: Prompt Engineering Mastery
  {
    id: 'q3',
    question: 'The "Chain-of-Thought" prompting technique improves complex reasoning by asking ChatGPT to:',
    options: [
      'Connect to multiple AI models and merge their responses',
      'Respond in a chain of separate messages rather than one long response',
      'Show its reasoning step-by-step before reaching a final answer',
      'Always format output as numbered lists'
    ],
    correct: 2,
    explanation: 'Chain-of-Thought (CoT) prompting encourages the model to reason explicitly through intermediate steps (e.g., "Let\'s think step by step") — this reduces errors on multi-step logical or mathematical problems.'
  },
  {
    id: 'q4',
    question: 'You want ChatGPT to always return competitive analysis in a specific table format. The most effective prompt strategy is:',
    options: [
      'Ask ChatGPT to "do its best" without further instructions',
      'Use shorter prompts to avoid overloading the model',
      'Provide a worked example of the exact table format you want, directly in the prompt',
      'Rephrase the question differently each time and pick the best result'
    ],
    correct: 2,
    explanation: 'Providing a concrete example of the desired output format (few-shot prompting) is the most reliable way to get consistent structure. ChatGPT will mirror the pattern you demonstrate.'
  },

  // Module 3: Business Communication Excellence
  {
    id: 'q5',
    question: 'Which set of prompt elements produces the highest-quality professional email from ChatGPT?',
    options: [
      'Recipient name only',
      'Recipient context, email purpose, desired tone, key points to cover, and word count target',
      'A full draft email and asking ChatGPT to "improve the vocabulary"',
      'No instructions — let ChatGPT decide the tone and content'
    ],
    correct: 1,
    explanation: 'Professional email prompts need: who you\'re writing to (and why they care), the email\'s goal, tone, the specific points to make, and length constraints. This prevents generic, off-target output.'
  },
  {
    id: 'q6',
    question: 'A colleague wants to submit a ChatGPT-generated client proposal without review. What is the most important reason to push back?',
    options: [
      'ChatGPT cannot write proposals at all',
      'AI-generated content may contain confidently-stated inaccuracies and lack your company-specific context, data, and voice',
      'Clients can always detect AI-written content with 100% accuracy',
      'ChatGPT proposals are always too long to be useful'
    ],
    correct: 1,
    explanation: 'ChatGPT can hallucinate facts, miss proprietary company data, and produce generic rather than tailored content. Professional documents sent to clients must be reviewed and verified by a human before sending.'
  },

  // Module 4: Content Creation Accelerator
  {
    id: 'q7',
    question: 'For a high-quality blog post series using ChatGPT, which workflow produces the best results?',
    options: [
      'Ask ChatGPT to write the entire series in one message, then publish immediately',
      'Give no topic instructions and let ChatGPT pick content freely',
      'Write an outline first, refine it, then ask ChatGPT to write each section individually with targeted instructions',
      'Ask ChatGPT to write randomly and rearrange later'
    ],
    correct: 2,
    explanation: 'Iterative content creation — outline → section-by-section writing with specific instructions — consistently outperforms asking for a complete piece in one shot. It lets you course-correct at each stage.'
  },
  {
    id: 'q8',
    question: 'When using ChatGPT for SEO content, what limitation must marketers be aware of?',
    options: [
      'ChatGPT can only write content in English',
      'ChatGPT content automatically ranks first on Google',
      'ChatGPT has a training data cutoff and may not reflect current keyword trends or recent algorithm changes',
      'ChatGPT always writes content that is too short for SEO purposes'
    ],
    correct: 2,
    explanation: 'ChatGPT\'s knowledge has a cutoff date. It cannot know current trending keywords, recent Google algorithm updates, or newly published competitor content. SEO strategy must combine AI drafting with current keyword research tools.'
  },

  // Module 5: AI-Powered Productivity
  {
    id: 'q9',
    question: 'Which prompt will give the most actionable result when using ChatGPT to prioritize your weekly workload?',
    options: [
      '"Help me with my tasks."',
      '"Tell me what to do today."',
      '"I have 8 tasks this week. Here is the list with deadlines, effort estimates, and business impact scores: [list]. Prioritize them using the Eisenhower Matrix and explain your reasoning for each."',
      '"What tasks should I start with?"'
    ],
    correct: 2,
    explanation: 'Giving ChatGPT the specific task list with metadata (deadlines, effort, impact) and a named framework (Eisenhower Matrix) produces a structured, explainable priority list you can actually act on.'
  },
  {
    id: 'q10',
    question: 'The most effective use of ChatGPT for personal productivity is to:',
    options: [
      'Let ChatGPT make decisions for you without your review or input',
      'Have ChatGPT send emails and schedule meetings automatically on your behalf',
      'Use ChatGPT to create first drafts, templates, and plans that you then refine, verify, and execute',
      'Replace all team collaboration with ChatGPT conversations'
    ],
    correct: 2,
    explanation: 'ChatGPT accelerates the "blank page" problem — it produces first drafts and structures quickly. Human review, verification, and execution remain essential for quality and accuracy.'
  },

  // Module 6: Advanced ChatGPT Techniques
  {
    id: 'q11',
    question: 'Custom instructions (system prompts) in ChatGPT are primarily used to:',
    options: [
      'Speed up the model\'s response time',
      'Grant ChatGPT access to the internet and real-time data',
      'Define a persistent persona, communication style, and constraints that apply across the entire conversation',
      'Limit ChatGPT to only answering questions about a specific topic'
    ],
    correct: 2,
    explanation: 'System prompts / custom instructions set the "operating context" — persona, tone, output format rules, constraints — that persists without you having to repeat it in every message.'
  },
  {
    id: 'q12',
    question: 'When ChatGPT gives an incorrect answer, the most effective recovery strategy is:',
    options: [
      'Accept the answer — the model\'s first response is always its most accurate',
      'Start a completely new conversation and hope for a different result',
      'Point out exactly what is wrong, provide correcting information if you have it, and ask the model to revise with those specific adjustments',
      'Switch to a different AI tool permanently after any error'
    ],
    correct: 2,
    explanation: 'Targeted correction prompts ("That revenue figure is wrong — the correct number is $X. Please revise the analysis using the correct figure") are far more effective than restarting, which loses conversation context.'
  },

  // Module 7: Beyond ChatGPT - Your AI Toolkit
  {
    id: 'q13',
    question: 'Which combination of tools best covers a complete AI-assisted content workflow — writing, images, and code?',
    options: [
      'ChatGPT for everything — it can handle writing, images, and code equally well',
      'ChatGPT for writing and reasoning, Midjourney/DALL-E for image generation, and GitHub Copilot for code assistance',
      'Grammarly for all written content, Canva for all visuals, and no AI needed for code',
      'A single general-purpose AI tool is always sufficient regardless of the task'
    ],
    correct: 1,
    explanation: 'Different AI tools are specialized. ChatGPT excels at text reasoning, Midjourney/DALL-E at image generation, and GitHub Copilot at code completion. Combining specialists outperforms using one tool for everything.'
  },
  {
    id: 'q14',
    question: 'When evaluating a new AI tool for your workflow, which factor should take priority?',
    options: [
      'Choosing whichever tool has the most social media followers',
      'Always selecting the most expensive option for guaranteed quality',
      'Assessing whether the tool\'s specific strengths match the tasks you actually need to accomplish, and testing it on your real use cases',
      'Using whichever tool your competitors use to stay even'
    ],
    correct: 2,
    explanation: 'Fit-to-task is the primary selection criterion. The "best" AI tool is the one that performs best on your specific workflow — not the most hyped or most expensive one.'
  }
]

// ── Course 3: Social Media Marketing AI ──────────────────────────────────────
// Modules: AI for Social Media Strategy | AI-Powered Content Creation |
//          AI-Driven Audience Targeting & Engagement | AI for Social Media Analytics |
//          AI-Powered Community Management | Advanced AI Marketing Tactics
const SOCIAL_MEDIA_AI = [
  // Module 1: AI for Social Media Strategy
  {
    id: 'q1',
    question: 'Which AI capability provides the most strategic value when building a social media plan from scratch?',
    options: [
      'Automatically posting content to all platforms without human review',
      'Generating AI images for every post in the plan',
      'Analyzing competitor posting patterns, audience demographics, and engagement trends at scale to inform channel and content strategy decisions',
      'Scheduling posts to go out at the same time every day'
    ],
    correct: 2,
    explanation: 'AI\'s ability to process large datasets — competitor behavior, audience signals, engagement trends — at a scale humans cannot is its core strategic advantage. Content generation and scheduling are secondary to this analytical layer.'
  },
  {
    id: 'q2',
    question: 'When AI suggests social media KPIs for your brand, the most important validation step is:',
    options: [
      'Confirming the AI recommends the maximum possible number of posts per week',
      'Ensuring the KPIs align with your actual business objectives rather than vanity metrics like raw follower count',
      'Verifying that your competitors use exactly the same KPIs',
      'Checking that the KPIs match your platform algorithm\'s current ranking factors'
    ],
    correct: 1,
    explanation: 'AI-suggested KPIs can include vanity metrics that look impressive but don\'t connect to revenue or growth. Always tie social KPIs back to business objectives — leads, conversions, brand sentiment, or customer retention.'
  },

  // Module 2: AI-Powered Content Creation
  {
    id: 'q3',
    question: 'You prompt an AI to generate 30 days of Instagram captions for a fitness brand. Which prompt addition most improves output quality?',
    options: [
      '"Make it motivating."',
      '"Write a lot of captions."',
      '"Brand voice: energetic and science-backed; audience: 28–45 active professionals; mix: 60% educational, 40% promotional; include a CTA in every third post; avoid generic fitness clichés."',
      '"Use hashtags in every caption."'
    ],
    correct: 2,
    explanation: 'Specifying brand voice, audience demographics, content ratio, CTA rules, and content constraints gives the AI the parameters to produce on-brand captions rather than generic fitness platitudes.'
  },
  {
    id: 'q4',
    question: 'When publishing AI-generated images (from tools like Midjourney) in commercial social media campaigns, which risk requires active management?',
    options: [
      'AI images are always blurry and unprofessional',
      'AI image tools can only produce abstract art, not photorealistic content',
      'Generated content may inadvertently replicate copyrighted styles or likenesses, and platform policies on AI-labeling disclosure vary',
      'AI-generated images automatically watermark themselves and cannot be removed'
    ],
    correct: 2,
    explanation: 'Copyright and disclosure are key risks. Some AI image training datasets include copyrighted work, and many platforms now require AI-generated content to be labeled. Always check the tool\'s terms and your platform\'s policy.'
  },

  // Module 3: AI-Driven Audience Targeting & Engagement
  {
    id: 'q5',
    question: 'AI-powered audience segmentation on social platforms identifies high-value audience clusters by:',
    options: [
      'Randomly assigning users to groups for equal testing',
      'Selecting audiences based only on basic demographics like age and gender',
      'Analyzing behavioral signals — interests, past interactions, purchase history, and content engagement patterns — to identify users most likely to respond to specific content',
      'Minimizing audience size to reduce ad spend'
    ],
    correct: 2,
    explanation: 'Behavioral segmentation is the core AI advantage over traditional demographic targeting. AI identifies patterns in how users interact with content and can surface micro-segments that demographic filters would miss entirely.'
  },
  {
    id: 'q6',
    question: 'A key limitation to keep in mind when using AI for audience engagement recommendations is:',
    options: [
      'AI cannot process any social media data',
      'AI always overestimates engagement rates by a factor of two',
      'AI models are trained on historical data and may not adapt instantly to new cultural moments, trending topics, or sudden shifts in audience sentiment',
      'AI engagement tools always increase follower count regardless of content quality'
    ],
    correct: 2,
    explanation: 'AI recommendations are grounded in historical patterns. Viral cultural moments, news events, or brand crises can shift audience sentiment overnight — faster than the AI model can recalibrate. Human monitoring remains essential.'
  },

  // Module 4: AI for Social Media Analytics
  {
    id: 'q7',
    question: 'AI sentiment analysis tools classify social content as positive, negative, or neutral. A well-known limitation of current sentiment AI is:',
    options: [
      'Sentiment AI can only analyze content written in formal English',
      'Sentiment AI requires a human to approve every classification before it is recorded',
      'Sentiment AI often struggles with sarcasm, cultural nuance, slang, and context-dependent language where tone contradicts literal meaning',
      'Sentiment AI can only analyze post text, not comments or replies'
    ],
    correct: 2,
    explanation: 'Sarcasm ("Oh great, another delay — really love that") reads as positive to a keyword-based model but is clearly negative. Cultural references and slang further confuse models trained predominantly on formal text.'
  },
  {
    id: 'q8',
    question: 'When presenting AI-derived social media analytics to stakeholders, the most responsible approach is to:',
    options: [
      'Present all AI insights as definitive facts since they are data-driven',
      'Avoid AI analytics entirely because they are never accurate enough',
      'Only show metrics that exceed competitor benchmarks to maintain credibility',
      'Contextualize findings with sample sizes, date ranges, data sources, and any known limitations of the tool — then let stakeholders draw conclusions'
    ],
    correct: 3,
    explanation: 'Data transparency is critical. AI analytics have inherent limitations (data completeness, model bias, platform API restrictions). Stakeholders need context to assess confidence levels and avoid over-indexing on a single metric.'
  },

  // Module 5: AI-Powered Community Management
  {
    id: 'q9',
    question: 'AI chatbots in social media community management are best deployed to:',
    options: [
      'Permanently replace all human community managers to reduce headcount',
      'Make final decisions on brand reputation issues autonomously',
      'Handle high-volume, repetitive inquiries (FAQs, order status checks) while escalating nuanced, sensitive, or complaint-heavy interactions to human agents',
      'Generate all original community content without human review'
    ],
    correct: 2,
    explanation: 'The human-AI handoff model maximizes efficiency: AI handles volume (repetitive FAQs, routing) while humans handle complexity (emotional complaints, PR-sensitive topics, creative community engagement).'
  },
  {
    id: 'q10',
    question: 'When a community member posts a serious complaint that the AI chatbot cannot resolve, what is the best practice?',
    options: [
      'Have the AI send an automated apology message five more times until the user stops complaining',
      'Delete the comment to protect brand image',
      'Have the AI offer a discount immediately in every complaint scenario',
      'Escalate to a human agent with the full conversation context so the user does not have to repeat their issue'
    ],
    correct: 3,
    explanation: 'Context-preserving escalation is the gold standard. Forcing users to repeat their problem to a human agent after an unsuccessful AI interaction amplifies frustration. The handoff should be seamless.'
  },

  // Module 6: Advanced AI Marketing Tactics
  {
    id: 'q11',
    question: 'Predictive AI in social media marketing helps teams by:',
    options: [
      'Guaranteeing specific engagement numbers before a campaign launches',
      'Reading competitor ad budgets in real-time to adjust bids automatically',
      'Analyzing historical campaign data, audience patterns, and seasonal trends to project likely outcomes and surface optimization opportunities before spending budget',
      'Automatically adjusting creative content after each post based on live A/B test results'
    ],
    correct: 2,
    explanation: 'Predictive AI surfaces probability-based forecasts from historical patterns — it cannot guarantee outcomes or access competitor private data. Its value is in reducing guesswork before budget is committed.'
  },
  {
    id: 'q12',
    question: 'Which workflow best describes advanced AI-human collaboration in social media marketing?',
    options: [
      'AI sets full strategy and humans publish content without modification',
      'Humans perform all analysis manually and AI only runs spell-check',
      'AI replaces the marketing team entirely to maximize cost savings',
      'AI generates creative options, performance predictions, and data-driven recommendations; humans make final calls on strategy, brand values, and audience relationships'
    ],
    correct: 3,
    explanation: 'Advanced AI-human collaboration positions AI as a "force multiplier" — faster analysis, more options, better predictions — while keeping humans accountable for brand voice, ethical choices, and strategic direction.'
  }
]

// ── Course 4: Email Marketing AI ─────────────────────────────────────────────
// Modules: Email Marketing Strategy with AI | AI-Powered Email Writing |
//          Segmentation & Personalization | A/B Testing & Optimization |
//          Email Automation Workflows
const EMAIL_MARKETING_AI = [
  // Module 1: Email Marketing Strategy with AI
  {
    id: 'q1',
    question: 'What is the primary strategic advantage of using AI in email marketing planning?',
    options: [
      'AI can send emails to any address without requiring subscriber permission',
      'AI can analyze large volumes of past campaign data to identify winning content patterns, optimal send times, and audience segments at a scale that manual analysis cannot match',
      'AI eliminates the need for building an email list',
      'AI guarantees a 100% open rate on every campaign'
    ],
    correct: 1,
    explanation: 'AI\'s core email marketing advantage is analytical scale. It processes thousands of past campaigns to surface patterns — which subject lines drive opens, which send times perform by segment — faster and more accurately than manual review.'
  },
  {
    id: 'q2',
    question: 'Which email metric does AI most effectively help optimize, and why?',
    options: [
      'Unsubscribe rate, because AI automatically removes inactive subscribers from your list',
      'List size, because AI automatically grows your subscriber base without paid ads',
      'Bounce rate, because AI blocks all invalid email addresses before sending',
      'Click-through rate, because AI can simultaneously test multiple subject lines, preview texts, and CTAs for different segments and predict which combinations will drive the most clicks'
    ],
    correct: 3,
    explanation: 'CTR optimization through multivariate testing is where AI outperforms humans most dramatically. AI can test combinations at a scale (hundreds of variations across thousands of segments) that would take humans months to evaluate manually.'
  },

  // Module 2: AI-Powered Email Writing
  {
    id: 'q3',
    question: 'Which prompt will produce the most directly usable AI-written promotional email?',
    options: [
      '"Write a marketing email."',
      '"Make the email sound exciting."',
      '"Write a 180-word promotional email for our summer sale (25% off all subscription plans). Audience: existing free-tier users who haven\'t upgraded. Tone: friendly, value-focused. Include: subject line, preview text, one paragraph body, and a CTA button labeled \'Claim My Discount\'."',
      '"Write the best email ever for our product."'
    ],
    correct: 2,
    explanation: 'Usable AI email prompts specify the offer, audience segment, tone, word count, required components (subject/preview/body/CTA), and the exact CTA label — leaving nothing for the AI to guess at.'
  },
  {
    id: 'q4',
    question: 'AI personalization in email writing "at scale" refers to:',
    options: [
      'Manually customizing every single email before it is sent',
      'Sending the same generic email to all subscribers simultaneously',
      'Dynamically inserting subscriber-specific data — name, purchase history, browsing behavior, location — into email templates to increase relevance for each individual recipient',
      'Removing all personal identifiers from emails to comply with privacy laws'
    ],
    correct: 2,
    explanation: 'Scale personalization means using data to automatically tailor each sent email. Rather than one email to 50,000 people, AI enables 50,000 individually-relevant emails — different subject lines, product recommendations, and offers per segment.'
  },

  // Module 3: Segmentation & Personalization
  {
    id: 'q5',
    question: 'AI-driven email segmentation differs from traditional demographic segmentation primarily because:',
    options: [
      'AI can only segment by demographics like age and location, not behavior',
      'AI creates larger, less targeted segments to maximize reach',
      'AI segmentation does not require any subscriber data to function',
      'AI identifies micro-segments based on behavioral patterns — click behavior, purchase recency, content preferences, browsing sequences — that would be impractical to isolate manually'
    ],
    correct: 3,
    explanation: 'Traditional segmentation uses demographic buckets (age, location, job title). AI segmentation adds behavioral layers that identify how subscribers actually interact with your content — producing tighter, more responsive segments.'
  },
  {
    id: 'q6',
    question: 'A subscriber has opened your last 6 emails but never clicked any link. Which re-engagement strategy is most appropriate?',
    options: [
      'Send them more frequent promotional emails to force a click',
      'Immediately add them to the unsubscribe list',
      'Treat them exactly the same as your most engaged subscribers',
      'Send a targeted sequence with a different content format (video, quiz, or survey) or ask directly what content they would find valuable'
    ],
    correct: 3,
    explanation: 'Openers who never click are interested but not compelled by current content or CTAs. A format change or direct survey surfaces the friction — maybe the content type, CTA language, or offer relevance needs adjusting.'
  },

  // Module 4: A/B Testing & Optimization
  {
    id: 'q7',
    question: 'When running an AI-assisted A/B test on email subject lines, which practice produces statistically reliable results?',
    options: [
      'Testing 8 variables simultaneously across a list of 60 subscribers',
      'Calling a winner after 1 hour regardless of the actual open counts',
      'Testing one variable at a time across a segment large enough to achieve statistical significance, then waiting for sufficient data before calling a winner',
      'Running the test on your least engaged segment to see if anything works'
    ],
    correct: 2,
    explanation: 'Valid A/B tests change ONE variable at a time (otherwise you can\'t attribute differences to a single cause) and need sufficient sample size and time (usually 24–48 hours minimum) to reach statistical significance.'
  },
  {
    id: 'q8',
    question: 'AI optimization continuously improves email campaign performance over time by:',
    options: [
      'Manually reviewing every email before it is sent to check for errors',
      'Replacing the entire subscriber list after each campaign to start fresh',
      'Learning from each campaign\'s engagement data to automatically refine send times, subject line patterns, and content types for future sends based on what actually resonated',
      'Ignoring campaigns that perform below the industry average open rate'
    ],
    correct: 2,
    explanation: 'AI optimization creates a feedback loop: each campaign\'s real-world results (opens, clicks, conversions) become training data that improves the AI\'s next prediction — compounding performance gains over time.'
  },

  // Module 5: Email Automation Workflows
  {
    id: 'q9',
    question: 'A "behavioral-triggered" email workflow is best described as:',
    options: [
      'Sending emails on a fixed calendar schedule regardless of subscriber actions',
      'Manually sending emails whenever a manager requests a campaign',
      'Sending a single welcome email and no follow-up communications',
      'Automatically sending specific emails in response to subscriber actions — cart abandonment, product page visits, download completions — to deliver timely, contextually relevant messages'
    ],
    correct: 3,
    explanation: 'Behavioral triggers connect email sends to real subscriber intent signals. A cart abandonment email sent 1 hour after the cart was abandoned is vastly more effective than a promotional email sent on a fixed Tuesday schedule.'
  },
  {
    id: 'q10',
    question: 'The most important design principle when building an AI-driven drip campaign is:',
    options: [
      'Maximizing the total number of emails in the sequence to ensure visibility',
      'Using the same email template for every message to maintain brand consistency',
      'Setting all emails to send at 9am regardless of subscriber timezone',
      'Mapping each email to a specific stage of the subscriber\'s journey and triggering it based on behavior — so the sequence feels relevant rather than intrusive'
    ],
    correct: 3,
    explanation: 'Journey-mapped, behavior-triggered drips convert at higher rates because each email arrives when it is relevant. Volume-first approaches (more emails = more visibility) increase unsubscribes without improving conversions.'
  }
]

// ── Course 5: Prompt Engineering Mastery ─────────────────────────────────────
// Modules: Prompt Engineering Fundamentals | Advanced Prompt Techniques |
//          Context and Constraints | Iterative Refinement | Domain-Specific Prompting
const PROMPT_ENGINEERING = [
  // Module 1: Prompt Engineering Fundamentals
  {
    id: 'q1',
    question: 'The "role prompting" technique (e.g., "You are a senior UX researcher") works primarily by:',
    options: [
      'Granting the AI model administrative access to specialized databases',
      'Restricting the model\'s vocabulary to terms used in that professional field only',
      'Priming the model to draw on patterns associated with that role\'s knowledge, communication style, and reasoning approach from its training data',
      'Connecting the AI to a live professional network for expert verification'
    ],
    correct: 2,
    explanation: 'Role prompting works through pattern activation. The model has seen enormous amounts of text associated with specific professional roles and biases its outputs toward those patterns when the role is established in the prompt.'
  },
  {
    id: 'q2',
    question: 'Which prompt characteristic most reliably causes an LLM to produce an unfocused, generic response?',
    options: [
      'Specifying a word count limit',
      'Providing detailed background context about the topic',
      'Requesting a specific output format like a table or numbered list',
      'Asking a multi-part question with no structure, prioritization, or context about what the output will be used for'
    ],
    correct: 3,
    explanation: 'Unstructured multi-part prompts without context force the model to guess at priorities, scope, and audience. The result is broad, shallow coverage of all parts rather than depth on what actually matters.'
  },

  // Module 2: Advanced Prompt Techniques
  {
    id: 'q3',
    question: '"Few-shot prompting" is defined as:',
    options: [
      'Sending multiple separate short messages instead of one detailed prompt',
      'Using the shortest possible prompts for faster response times',
      'Providing 2–5 worked input/output examples directly in your prompt to show the model the exact pattern, format, or reasoning style you want it to follow',
      'Asking the model to attempt the task using as few words as possible'
    ],
    correct: 2,
    explanation: 'Few-shot prompting shows rather than tells. Instead of describing what you want, you provide concrete examples (input → desired output). The model learns the pattern from the examples and applies it to new inputs.'
  },
  {
    id: 'q4',
    question: 'What is the core mechanism that makes Chain-of-Thought (CoT) prompting effective for multi-step reasoning tasks?',
    options: [
      'It forces the model to search external sources for verified intermediate facts',
      'By explicitly instructing the model to show each reasoning step, errors become visible and each step can be evaluated — reducing the chance of a wrong final answer built on faulty logic',
      'It links multiple separate AI models together for cross-validation of answers',
      'It compresses the prompt into fewer tokens, freeing model capacity for reasoning'
    ],
    correct: 1,
    explanation: 'CoT effectiveness comes from explicit step visibility. When the model must articulate each reasoning step, logical errors surface earlier in the chain rather than hiding inside a final confident-sounding wrong answer.'
  },

  // Module 3: Context and Constraints
  {
    id: 'q5',
    question: 'Adding explicit output constraints to a prompt (e.g., "Under 120 words, plain English, no jargon, active voice") primarily helps by:',
    options: [
      'Slowing the model down to produce a more carefully considered response',
      'Preventing the model from generating any creative or original language',
      'Increasing the total token count which improves output quality',
      'Reducing the solution space so the model\'s output matches your actual use case and audience rather than defaulting to its generic style'
    ],
    correct: 3,
    explanation: 'Constraints define the boundaries of an acceptable answer. Without them, the model optimizes for a "typical" response in its training distribution — which may not match your specific audience, format, or length requirements.'
  },
  {
    id: 'q6',
    question: 'Which contextual information has the greatest impact on output relevance when added to a prompt?',
    options: [
      'The current date and time of the request',
      'The length of your previous prompt in the conversation',
      'The name of the specific AI model you are using',
      'The intended audience and their knowledge level, the purpose of the output, and how the output will be used after it is generated'
    ],
    correct: 3,
    explanation: 'Purpose, audience, and end-use are the most output-shaping contextual factors. A summary "for a 10-year-old" versus "for a PhD panel" versus "for an executive one-pager" requires fundamentally different language, depth, and structure.'
  },

  // Module 4: Iterative Refinement
  {
    id: 'q7',
    question: 'Iterative prompt refinement is most accurately described as:',
    options: [
      'Randomly trying many different prompt styles and publishing whichever output looks best',
      'Asking the same prompt repeatedly with no changes until a good answer appears',
      'Using progressively shorter prompts in each iteration to simplify the task',
      'Systematically diagnosing which specific element of a prompt missed the mark, adjusting only that element, and re-testing to measure whether the change improved the output'
    ],
    correct: 3,
    explanation: 'Effective refinement is diagnostic, not random. Identify the failure mode (wrong tone? wrong format? missing information?), change one variable, and re-test. Changing multiple things at once makes it impossible to know what worked.'
  },
  {
    id: 'q8',
    question: 'When an AI response is factually solid but has the wrong structure, the best refinement approach is:',
    options: [
      'Start over with a completely different topic area',
      'Add more general background context about the subject',
      'Ask the model to "try harder" without any additional direction',
      'Retain the successful content-focused elements of your prompt and add explicit formatting instructions (e.g., "Structure as: Problem → Root Cause → Recommended Solution → Next Steps")'
    ],
    correct: 3,
    explanation: 'When content is right but structure is wrong, the fix is formatting constraints — not a content overhaul. Targeting the specific failure mode with a targeted fix is always more efficient than starting from scratch.'
  },

  // Module 5: Domain-Specific Prompting
  {
    id: 'q9',
    question: 'When prompting an AI to write a Python function, which element most reduces the time spent debugging the output?',
    options: [
      'Asking for the most complex, comprehensive solution that handles all possible edge cases',
      'Providing no input/output examples so the model can make its own assumptions',
      'Asking for code with no error handling to keep the output concise',
      'Specifying the function\'s exact purpose, input data types and example values, expected output format, any constraints or performance requirements, and requesting inline comments explaining the logic'
    ],
    correct: 3,
    explanation: 'Code prompts that specify types, examples, constraints, and commentary requirements dramatically reduce debugging time. The model has all the information it needs to make the right architectural choices rather than guessing.'
  },
  {
    id: 'q10',
    question: 'What extra safeguard is required when using AI for prompts in legal, medical, or financial domains that is NOT needed for general content?',
    options: [
      'Using a higher "temperature" setting to ensure more creative output in these domains',
      'Asking the AI to translate the content into multiple languages before using it',
      'Explicitly instructing the model to flag areas of uncertainty and recommend professional review — since AI models can generate authoritative-sounding but incorrect domain-specific information',
      'Requesting that the AI provide citations from its training dataset to verify claims'
    ],
    correct: 2,
    explanation: 'Domain-specific hallucinations are particularly dangerous because they sound authoritative. A prompt instruction like "flag any claims you are uncertain about and recommend professional review" is an essential safeguard in high-stakes domains.'
  }
]

// ── Course 6: AI Tools & Productivity ────────────────────────────────────────
// Modules: AI Productivity Revolution | AI Writing Tools Mastery |
//          AI Design & Visual Tools | Automation Workflows with AI |
//          Integration Strategies and Scaling
const AI_TOOLS_PRODUCTIVITY = [
  // Module 1: AI Productivity Revolution
  {
    id: 'q1',
    question: 'The "productivity paradox" sometimes observed with AI tool adoption occurs when:',
    options: [
      'Teams invest time setting up AI tools but primarily automate low-value tasks instead of redesigning higher-value workflows — resulting in limited net productivity gain',
      'AI tools are too expensive for small businesses to afford',
      'AI tools operate too quickly for employees to keep pace with their outputs',
      'AI tools are only useful for technical roles, leaving knowledge workers behind'
    ],
    correct: 0,
    explanation: 'Automating a bad process with AI makes the bad process faster — it doesn\'t improve outcomes. Real productivity gains come from redesigning workflows so AI handles entire task categories, freeing humans for higher-value work.'
  },
  {
    id: 'q2',
    question: 'Which description best captures "AI-augmented work" as distinct from "AI replacement"?',
    options: [
      'AI performs all tasks while humans simply approve results without meaningful review',
      'AI is used only for tasks humans find boring or repetitive, leaving all important work to humans',
      'AI replaces all entry-level positions to reduce headcount costs',
      'Humans retain accountability for judgment, creativity, and relationships while AI handles data-heavy or repetitive subtasks — surfacing insights that help humans make faster, better-informed decisions'
    ],
    correct: 3,
    explanation: 'Augmentation keeps humans in the loop for accountability and judgment while AI amplifies their capacity. Replacement removes humans entirely. Most effective AI implementations are augmentation models, not replacement.'
  },

  // Module 2: AI Writing Tools Mastery
  {
    id: 'q3',
    question: 'Why is a thorough editing pass after AI drafting critical, even when the AI-generated text reads well?',
    options: [
      'AI writing tools always produce grammatically incorrect text that must be corrected',
      'AI-generated content is illegal to publish without human editing',
      'AI writing tools cannot understand any tone of voice or emotional nuance',
      'AI lacks access to your proprietary data, personal experience, and brand nuance — editing injects accuracy, specific examples, and the voice that only you can provide'
    ],
    correct: 3,
    explanation: 'AI drafts are generic by nature — trained on general text, not your specific product data, client relationships, or brand history. Editing transforms a well-structured draft into a document with genuine authority and specificity.'
  },
  {
    id: 'q4',
    question: 'Prompt templates in AI writing tools are most valuable when:',
    options: [
      'You want a completely unique prompt every time to maximize creative variation',
      'You need the AI to learn from your internal documents and files',
      'You want to prevent team members from using AI independently',
      'Your team regularly produces the same content types (job descriptions, LinkedIn posts, case studies) and needs a reusable, quality-controlled starting point that scales across multiple users'
    ],
    correct: 3,
    explanation: 'Prompt templates encode best-practice prompting for recurring content types. They ensure consistent quality across team members, reduce the skill gap between expert and novice AI users, and speed up production.'
  },

  // Module 3: AI Design & Visual Tools
  {
    id: 'q5',
    question: 'When using text-to-image AI tools like Midjourney or DALL-E, which prompt component has the greatest impact on visual output quality?',
    options: [
      'Listing only what you do NOT want in the image',
      'Using single-word prompts to give the AI maximum creative freedom',
      'Specifying subject, visual style, lighting, mood, composition, color palette, and technical parameters (e.g., "soft natural lighting, shallow depth of field, editorial photography style") in clear detail',
      'Asking the AI to surprise you with an unprompted image concept'
    ],
    correct: 2,
    explanation: 'Specific multi-element prompts dramatically improve image-to-intent accuracy. Style references, lighting descriptions, and technical parameters (aspect ratio, rendering style) give the AI sufficient constraints to produce intended results.'
  },
  {
    id: 'q6',
    question: 'Before using AI-generated visuals in a commercial marketing campaign, which is the most critical legal checkpoint?',
    options: [
      'Confirming the AI tool offers a free trial plan',
      'Checking whether competitors use the same AI image tool',
      'Verifying the AI tool\'s terms of service regarding commercial usage rights, and whether training data copyright claims could apply to generated outputs',
      'Ensuring the images use brand colors correctly'
    ],
    correct: 2,
    explanation: 'Commercial usage rights vary significantly across AI image tools. Some require attribution, some restrict commercial use on free tiers, and the ongoing legal landscape around training data copyright is evolving — checking ToS before publishing is essential.'
  },

  // Module 4: Automation Workflows with AI
  {
    id: 'q7',
    question: 'In a no-code AI automation platform (such as Zapier or Make), a "trigger" is best described as:',
    options: [
      'A manual command you type to initiate a workflow each time',
      'The final action the workflow performs after all steps complete',
      'A billing event that charges your account each time a workflow runs',
      'A specific event in a connected app — a new email received, a form submitted, a file added to a folder — that automatically starts the automated workflow'
    ],
    correct: 3,
    explanation: 'Triggers are the "if this happens" part of an automation. They watch connected apps for specific events and fire the workflow automatically — eliminating the need for human intervention to start each automated process.'
  },
  {
    id: 'q8',
    question: 'When designing an AI automation workflow, which failure mode is most important to plan for?',
    options: [
      'The workflow completing too quickly before you can intervene',
      'The workflow sending too many Slack notifications during normal operation',
      'The workflow only functioning during standard business hours',
      'Unhandled edge cases — unexpected input formats, API timeouts, missing required fields — that cause silent failures where the workflow appears to run but produces incorrect or incomplete output'
    ],
    correct: 3,
    explanation: 'Silent failures are the most dangerous because they aren\'t immediately obvious. An automation that "succeeds" but writes corrupted data or skips records can cause significant downstream damage before anyone notices.'
  },

  // Module 5: Integration Strategies and Scaling
  {
    id: 'q9',
    question: 'When scaling AI tool adoption across a team, which barrier most commonly undermines success?',
    options: [
      'AI tools being too inexpensive to justify organizational investment',
      'AI tools performing too consistently, making it hard to differentiate individual contributors',
      'Excessive documentation of AI workflows creating information overload',
      'Lack of clear use cases, structured training, and governance policies — leading to inconsistent usage patterns, low adoption rates, or inappropriate application of AI tools'
    ],
    correct: 3,
    explanation: 'Tool availability is not the same as tool adoption. Without defined use cases (where AI helps most), training (how to use it effectively), and governance (what is and isn\'t permitted), teams default to informal, inconsistent AI usage or avoid it entirely.'
  },
  {
    id: 'q10',
    question: 'An "AI Center of Excellence" within an organization is primarily designed to:',
    options: [
      'Restrict all employee AI usage to approved use cases requiring prior written approval',
      'Outsource all AI-related work to external vendors to minimize internal skill requirements',
      'Replace the IT and data science departments with a single AI-focused team',
      'Centralize AI expertise, share best practices across business units, evaluate new tools systematically, and establish governance standards so AI benefits the entire organization rather than isolated pockets'
    ],
    correct: 3,
    explanation: 'An AI CoE is a scaling mechanism, not a gatekeeper. It prevents duplicated effort, accelerates organizational learning, ensures consistent quality and compliance, and builds internal AI capability systematically.'
  }
]

// ─────────────────────────────────────────────────────────────────────────────
// COURSE REGISTRY
// ─────────────────────────────────────────────────────────────────────────────
const COURSES = [
  { slug: 'ai-for-beginners',           questions: AI_FOR_BEGINNERS,    label: 'AI for Beginners' },
  { slug: 'chatgpt-mastery',            questions: CHATGPT_MASTERY,      label: 'ChatGPT Mastery' },
  { slug: 'social-media-marketing-ai',  questions: SOCIAL_MEDIA_AI,      label: 'Social Media Marketing AI' },
  { slug: 'email-marketing-ai',         questions: EMAIL_MARKETING_AI,   label: 'Email Marketing AI' },
  { slug: 'prompt-engineering-mastery', questions: PROMPT_ENGINEERING,   label: 'Prompt Engineering Mastery' },
  { slug: 'ai-tools-productivity',      questions: AI_TOOLS_PRODUCTIVITY, label: 'AI Tools & Productivity' },
]

// ─────────────────────────────────────────────────────────────────────────────
// RUNNER
// ─────────────────────────────────────────────────────────────────────────────
async function seedCourse({ slug, questions, label }) {
  console.log(`\n📚  ${label}`)

  // 1. Find course
  const r1 = await request('GET', `/rest/v1/courses?slug=eq.${slug}&select=id,title`, null)
  if (!Array.isArray(r1.body) || !r1.body.length) {
    console.error(`   ❌  Course not found: ${slug}`)
    return false
  }
  const course = r1.body[0]
  console.log(`   Found: ${course.title} (${course.id})`)

  // 2. Get last module
  const r2 = await request('GET', `/rest/v1/course_modules?course_id=eq.${course.id}&select=module_number&order=module_number.desc&limit=1`, null)
  const lastModule = r2.body?.[0]?.module_number
  if (!lastModule) { console.error('   ❌  No modules found'); return false }
  console.log(`   Last module: ${lastModule}`)

  // 3. Delete existing quizzes
  const r3 = await request('DELETE', `/rest/v1/quizzes?course_id=eq.${course.id}`, null)
  console.log(`   Deleted existing quizzes (HTTP ${r3.status})`)

  // 4. Insert new quiz
  const r4 = await request('POST', '/rest/v1/quizzes', {
    course_id: course.id,
    module_number: lastModule,
    questions: { questions },
    pass_percentage: 70,
  })

  if (r4.status === 201) {
    console.log(`   ✅  Inserted ${questions.length} questions (70% pass threshold)`)
    return true
  } else {
    console.error(`   ❌  Insert failed (HTTP ${r4.status}):`, JSON.stringify(r4.body).slice(0, 200))
    return false
  }
}

async function run() {
  console.log('\n=== AILearnHub — Master Quiz Seeder v2 ===')
  console.log('Moderate difficulty · 2 questions per module · Strictly within course content\n')

  let passed = 0
  let failed = 0

  for (const course of COURSES) {
    const ok = await seedCourse(course)
    ok ? passed++ : failed++
  }

  console.log(`\n${'─'.repeat(45)}`)
  console.log(`✅  Seeded: ${passed}/${COURSES.length} courses`)
  if (failed > 0) console.log(`❌  Failed: ${failed} courses — check output above`)
  console.log('=== Done ===\n')
}

run().catch(e => { console.error('Fatal:', e); process.exit(1) })
