/**
 * AILearnHub — Module Enhancement Script
 * Adds Mermaid diagrams, flowcharts & callout boxes to every module.
 *
 * Usage (run from your project root):
 *   node scripts/enhance-modules.js --list        → print all courses + modules
 *   node scripts/enhance-modules.js --run         → apply enhancements to Supabase
 *   node scripts/enhance-modules.js --run --slug ai-for-beginners  → one course only
 *
 * Requires: .env.local in project root with NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY
 */

const fs   = require('fs')
const path = require('path')

// ── Load .env.local ──────────────────────────────────────────────────────────
const envPath = path.join(__dirname, '..', '.env.local')
const envVars = {}
fs.readFileSync(envPath, 'utf8').split('\n').forEach(line => {
  const [k, ...v] = line.split('=')
  if (k && v.length) envVars[k.trim()] = v.join('=').trim()
})
const SUPABASE_URL = envVars['NEXT_PUBLIC_SUPABASE_URL']
const SUPABASE_KEY = envVars['SUPABASE_SERVICE_ROLE_KEY']
if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌  Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local')
  process.exit(1)
}

// ── Supabase helpers ─────────────────────────────────────────────────────────
const headers = { 'apikey': SUPABASE_KEY, 'Authorization': 'Bearer ' + SUPABASE_KEY, 'Content-Type': 'application/json', 'Prefer': 'return=minimal' }

async function sb(path, opts = {}) {
  const res = await fetch(SUPABASE_URL + '/rest/v1/' + path, { headers, ...opts })
  if (!res.ok) { const t = await res.text(); throw new Error(res.status + ': ' + t) }
  if (opts.method === 'PATCH') return
  return res.json()
}

// ── DIAGRAM LIBRARY ──────────────────────────────────────────────────────────
// Format for each entry:
//   key: `${courseSlug}|${moduleNumber}`
//   value: markdown string to APPEND to existing content

const ENHANCEMENTS = {

  /* ══════════════════════════════════════════════════════════════════════
     COURSE 1 — AI FOR BEGINNERS
  ══════════════════════════════════════════════════════════════════════ */

  'ai-for-beginners|1': `

---

## How It All Fits Together

\`\`\`mermaid
flowchart TD
    AI[🤖 Artificial Intelligence] --> ML[Machine Learning]
    AI --> Expert[Expert Systems]
    AI --> Robotics[Robotics]
    ML --> DL[Deep Learning]
    ML --> RL[Reinforcement Learning]
    ML --> SL[Supervised Learning]
    DL --> NLP[Natural Language Processing]
    DL --> CV[Computer Vision]
    NLP --> ChatGPT[ChatGPT / LLMs]
    CV --> ImageRec[Image Recognition]

    style AI fill:#FFF3E0,stroke:#FF6F00,color:#212121
    style ML fill:#E8F5E9,stroke:#2E7D32
    style DL fill:#E3F2FD,stroke:#1565C0
    style ChatGPT fill:#F3E5F5,stroke:#4A148C
\`\`\`

> KEY TAKEAWAY AI is not a single technology — it is a family of approaches. Machine Learning and Deep Learning are subsets of AI, and tools like ChatGPT sit at the end of this chain.
`,

  'ai-for-beginners|2': `

---

## How a Machine Learns

\`\`\`mermaid
flowchart LR
    Data[📊 Training Data] --> Model[🧠 ML Model]
    Model --> Predict[🔮 Prediction]
    Predict --> Compare[⚖️ Compare to Truth]
    Compare -->|Error found| Adjust[🔧 Adjust Model]
    Adjust --> Model
    Compare -->|Good enough| Done[✅ Trained Model]
    Done --> Deploy[🚀 Deploy & Use]

    style Data fill:#FFF3E0,stroke:#FF6F00
    style Done fill:#E8F5E9,stroke:#2E7D32
    style Deploy fill:#E3F2FD,stroke:#1565C0
\`\`\`

> TIP Think of a machine learning model like a student. It sees examples (training data), makes guesses, gets corrected, and improves. The more data it sees, the better it gets.

> EXAMPLE A spam filter learns by reading thousands of labelled emails — "spam" or "not spam" — then applies what it learned to new emails you receive.
`,

  'ai-for-beginners|3': `

---

## Deep Learning: The Neural Network

\`\`\`mermaid
flowchart LR
    Input["🖼️ Input Layer\n(Raw Data)"] --> H1["Hidden Layer 1\n(Edge Detection)"]
    H1 --> H2["Hidden Layer 2\n(Shapes)"]
    H2 --> H3["Hidden Layer 3\n(Features)"]
    H3 --> Output["📤 Output Layer\n(Prediction)"]

    style Input fill:#FFF3E0,stroke:#FF6F00
    style Output fill:#E8F5E9,stroke:#2E7D32
\`\`\`

> NOTE Deep Learning gets its name from the many hidden layers stacked between input and output. Each layer extracts increasingly complex patterns from the data.

> EXAMPLE When your phone unlocks with your face, a deep learning model scans your face through multiple layers — detecting edges → shapes → facial features → your specific face.
`,

  'ai-for-beginners|4': `

---

## How NLP Powers Tools Like ChatGPT

\`\`\`mermaid
sequenceDiagram
    participant U as 👤 User
    participant T as 🔤 Tokenizer
    participant M as 🧠 Language Model
    participant D as 📖 Decoder
    participant R as 💬 Response

    U->>T: "Explain AI in simple terms"
    T->>M: [tokens: 438, 102, 7, 56...]
    M->>D: Probability distribution over next tokens
    D->>R: Generates word by word
    R->>U: "AI is the ability of computers to..."
\`\`\`

> DEFINITION Token: The basic unit an LLM processes. A token is roughly 4 characters or ¾ of a word. "Hello world" = 2 tokens. GPT-4 can handle up to 128,000 tokens at once.
`,

  'ai-for-beginners|5': `

---

## AI in Everyday Life

\`\`\`mermaid
mindmap
  root((AI Around You))
    Home
      Smart speakers
      Recommendation engines
      Smart thermostats
    Phone
      Face unlock
      Autocorrect
      Photo organisation
    Work
      Email spam filters
      Grammar checkers
      Meeting transcription
    Shopping
      Product recommendations
      Fraud detection
      Dynamic pricing
    Healthcare
      Medical imaging
      Drug discovery
      Appointment chatbots
\`\`\`

> KEY TAKEAWAY AI is not a future technology — it is already embedded in apps and services you use every day. Recognising where AI is used is the first step to using it intentionally.
`,

  'ai-for-beginners|6': `

---

## How to Choose an AI Tool

\`\`\`mermaid
flowchart TD
    Start[What do I need to do?] --> Text{Text / Writing?}
    Text -->|Yes| LLM[ChatGPT / Claude / Gemini]
    Text -->|No| Image{Images?}
    Image -->|Yes| IMG[Midjourney / DALL·E / Adobe Firefly]
    Image -->|No| Audio{Audio / Voice?}
    Audio -->|Yes| AUD[ElevenLabs / Whisper / Otter.ai]
    Audio -->|No| Code{Code / Data?}
    Code -->|Yes| COD[GitHub Copilot / Cursor / Julius AI]
    Code -->|No| Auto{Automation?}
    Auto -->|Yes| AUT[Zapier AI / Make / n8n]
    Auto -->|No| Search[🔍 Search AI tools directory]

    style Start fill:#FFF3E0,stroke:#FF6F00
    style LLM fill:#E8F5E9,stroke:#2E7D32
\`\`\`

> TIP Start with one AI tool and master it before adding more. Most people get better results from going deep on one tool than switching between five.
`,

  'ai-for-beginners|7': `

---

## Your First 30 Days with AI

\`\`\`mermaid
gantt
    title AI Learning Roadmap — First 30 Days
    dateFormat  YYYY-MM-DD
    section Week 1
    Learn what AI is           :a1, 2024-01-01, 2d
    Try ChatGPT basics         :a2, after a1, 3d
    section Week 2
    Use AI for your work tasks :b1, 2024-01-08, 4d
    Experiment with prompts    :b2, after b1, 3d
    section Week 3
    Explore one new AI tool    :c1, 2024-01-15, 4d
    Build a simple workflow    :c2, after c1, 3d
    section Week 4
    Automate a repetitive task :d1, 2024-01-22, 4d
    Share & reflect            :d2, after d1, 3d
\`\`\`

> KEY TAKEAWAY Consistency beats intensity. Spending 20 minutes daily applying AI to real tasks will build skills faster than any course alone.
`,

  'ai-for-beginners|8': `

---

## Responsible AI Use

\`\`\`mermaid
flowchart LR
    Output[AI Output] --> Check{Verify Facts?}
    Check -->|Yes| Use[✅ Use Confidently]
    Check -->|No| Risk[⚠️ Risk of Errors]
    Output --> Privacy{Contains Private Data?}
    Privacy -->|Yes| Avoid[🚫 Do Not Submit to AI]
    Privacy -->|No| Safe[✅ Generally Safe]
    Output --> Bias{Could Be Biased?}
    Bias -->|Yes| Review[👀 Apply Human Judgement]
    Bias -->|No| Proceed[✅ Proceed]

    style Risk fill:#FFEBEE,stroke:#C62828
    style Avoid fill:#FFEBEE,stroke:#C62828
    style Use fill:#E8F5E9,stroke:#2E7D32
\`\`\`

> WARNING AI models can generate confident-sounding but incorrect information. Always verify important facts, especially in legal, medical, or financial contexts.

> KEY TAKEAWAY AI is a powerful tool — but human judgement, ethical use, and fact-checking are what make it truly valuable.
`,

  /* ══════════════════════════════════════════════════════════════════════
     COURSE 2 — CHATGPT MASTERY
  ══════════════════════════════════════════════════════════════════════ */

  'chatgpt-mastery|1': `

---

## How ChatGPT Generates a Response

\`\`\`mermaid
sequenceDiagram
    participant U as 👤 You
    participant API as ChatGPT API
    participant M as 🧠 GPT Model
    participant O as 💬 Output

    U->>API: Type your message
    API->>M: Your message + conversation history
    M->>M: Predict next word (×hundreds)
    M->>O: Stream tokens one by one
    O->>U: Response appears word by word
\`\`\`

> NOTE ChatGPT does not search the internet by default (unless told to). It generates responses based on patterns learned during training — it predicts the most likely next word given everything before it.
`,

  'chatgpt-mastery|2': `

---

## The Anatomy of a Great ChatGPT Prompt

\`\`\`mermaid
flowchart LR
    P[Your Prompt] --> Role["🎭 Role\n(Act as a...)"]
    P --> Task["📋 Task\n(Write / Summarise / Analyse...)"]
    P --> Context["📚 Context\n(Background info)"]
    P --> Format["📐 Format\n(Bullet list / Table / 200 words)"]
    P --> Tone["🎨 Tone\n(Professional / Friendly / Simple)"]

    Role --> Output[🚀 Better Output]
    Task --> Output
    Context --> Output
    Format --> Output
    Tone --> Output

    style Output fill:#E8F5E9,stroke:#2E7D32
    style P fill:#FFF3E0,stroke:#FF6F00
\`\`\`

> EXAMPLE Instead of: *"Write an email"* — try: *"Act as a professional business writer. Write a polite follow-up email to a client who missed our meeting. Keep it under 100 words and use a friendly tone."*
`,

  'chatgpt-mastery|3': `

---

## ChatGPT Use Cases by Department

\`\`\`mermaid
mindmap
  root((ChatGPT at Work))
    Marketing
      Write blog posts
      Social media captions
      Email campaigns
      Ad copy variations
    Sales
      Personalise outreach
      Summarise call notes
      Draft proposals
    HR
      Job descriptions
      Interview questions
      Policy drafting
    Operations
      SOP documentation
      Meeting summaries
      Process checklists
    Customer Support
      FAQ generation
      Response templates
      Complaint handling
\`\`\`

> KEY TAKEAWAY Every department has repetitive writing and thinking tasks. ChatGPT does not replace your team — it removes the time spent on first drafts so humans can focus on higher-value decisions.
`,

  'chatgpt-mastery|4': `

---

## ChatGPT Writing Workflow

\`\`\`mermaid
flowchart TD
    Brief[📋 Define Your Goal] --> Draft[🤖 Generate First Draft with ChatGPT]
    Draft --> Review[👀 Human Review]
    Review --> Refine{Good enough?}
    Refine -->|No| Iterate[💬 Refine with Follow-up Prompts]
    Iterate --> Review
    Refine -->|Yes| Edit[✏️ Light Human Edit]
    Edit --> Publish[🚀 Publish / Send]

    style Brief fill:#FFF3E0,stroke:#FF6F00
    style Publish fill:#E8F5E9,stroke:#2E7D32
\`\`\`

> TIP Use ChatGPT for the first 80% of a piece of writing. Your human edit (the last 20%) adds your voice, verifies facts, and catches any errors. This is much faster than starting from a blank page.
`,

  'chatgpt-mastery|5': `

---

## Conversation Memory & Context Window

\`\`\`mermaid
flowchart LR
    M1[Message 1] --> CTX[Context Window]
    M2[Message 2] --> CTX
    M3[Message 3] --> CTX
    M4[Message 4] --> CTX
    CTX --> Model[🧠 GPT Model]
    Model --> Response[Response]
    CTX -->|Window full| Drop[⚠️ Oldest messages dropped]

    style Drop fill:#FFEBEE,stroke:#C62828
    style CTX fill:#FFF3E0,stroke:#FF6F00
\`\`\`

> WARNING In long conversations, ChatGPT may "forget" early messages once the context window fills up. For long projects, periodically paste a summary of key decisions at the start of a new chat.

> TIP Start a fresh conversation for each new topic. Mixing unrelated tasks in one chat reduces quality.
`,

  'chatgpt-mastery|6': `

---

## GPT Model Comparison

\`\`\`mermaid
quadrantChart
    title Speed vs Intelligence
    x-axis Slower --> Faster
    y-axis Basic --> Advanced
    GPT-4o: [0.6, 0.85]
    GPT-4o mini: [0.85, 0.55]
    GPT-3.5: [0.9, 0.35]
    o1: [0.2, 0.98]
    o3-mini: [0.55, 0.75]
\`\`\`

> NOTE Choose GPT-4o for most tasks. Use o1 when you need deep reasoning (maths, complex analysis). Use GPT-4o mini for fast, simple tasks to save on cost and speed.
`,

  'chatgpt-mastery|7': `

---

## When ChatGPT Gets It Wrong

\`\`\`mermaid
flowchart TD
    Output[ChatGPT Response] --> Type{Type of content?}
    Type -->|Facts / Statistics| Verify[🔍 Verify with primary source]
    Type -->|Code| Test[🧪 Test the code before using]
    Type -->|Creative / Opinion| Fine[✅ Generally safe to use]
    Type -->|Legal / Medical| Expert[👨‍⚕️ Consult a qualified expert]
    Type -->|Your own data| Check[📊 Verify against your actual data]

    style Expert fill:#FFEBEE,stroke:#C62828
    style Fine fill:#E8F5E9,stroke:#2E7D32
\`\`\`

> WARNING ChatGPT hallucinations are most common when it is asked about specific numbers, recent events, or niche topics. Always verify before sharing externally.
`,

  'chatgpt-mastery|8': `

---

## Building Your ChatGPT Productivity System

\`\`\`mermaid
flowchart LR
    Tasks[Your Daily Tasks] --> Audit{Involves writing\nor thinking?}
    Audit -->|Yes| Prompt[Build a saved prompt template]
    Audit -->|No| Skip[Handle manually]
    Prompt --> Library[📚 Prompt Library]
    Library --> Use[Use daily with ChatGPT]
    Use --> Refine[Improve prompts over time]
    Refine --> Library

    style Library fill:#FFF3E0,stroke:#FF6F00
    style Use fill:#E8F5E9,stroke:#2E7D32
\`\`\`

> KEY TAKEAWAY The biggest productivity gain from ChatGPT comes from building reusable prompt templates for your most common tasks — so you are not starting from scratch every time.
`,

  /* ══════════════════════════════════════════════════════════════════════
     COURSE 3 — AI TOOLS FOR PRODUCTIVITY
  ══════════════════════════════════════════════════════════════════════ */

  'ai-tools-productivity|1': `

---

## The AI Productivity Landscape

\`\`\`mermaid
mindmap
  root((AI Productivity Tools))
    Writing & Content
      ChatGPT
      Claude
      Jasper
      Copy.ai
    Meetings & Voice
      Otter.ai
      Fireflies
      Fathom
      Grain
    Design & Visual
      Canva AI
      Adobe Firefly
      Midjourney
    Code & Data
      GitHub Copilot
      Cursor
      Julius AI
    Automation
      Zapier AI
      Make
      n8n
    Research
      Perplexity
      Elicit
      Consensus
\`\`\`

> KEY TAKEAWAY You do not need to use every tool. Pick one tool per category that matches your workflow, learn it well, and automate one task at a time.
`,

  'ai-tools-productivity|2': `

---

## AI Writing Tool Workflow

\`\`\`mermaid
flowchart TD
    Goal[Define Goal & Audience] --> Select[Select the right AI tool]
    Select --> Prompt[Write a detailed prompt]
    Prompt --> Draft[AI generates first draft]
    Draft --> Edit[Human review and edit]
    Edit --> Fact[Fact-check key claims]
    Fact --> Voice[Add your personal voice]
    Voice --> Final[✅ Final Content]

    style Goal fill:#FFF3E0,stroke:#FF6F00
    style Final fill:#E8F5E9,stroke:#2E7D32
\`\`\`

> TIP The best AI-assisted writing combines AI speed with human judgement. Never publish AI content without a personal review — your credibility is on the line.
`,

  'ai-tools-productivity|3': `

---

## AI Meeting Assistant Flow

\`\`\`mermaid
sequenceDiagram
    participant M as 📅 Meeting
    participant R as 🎙️ AI Recorder (Otter/Fireflies)
    participant S as 📝 AI Summary
    participant T as ✅ Action Items
    participant C as 👥 CRM / Notion

    M->>R: Meeting starts (auto-join)
    R->>R: Transcribe audio in real time
    R->>S: Generate summary after meeting
    S->>T: Extract action items & owners
    T->>C: Sync to your tools automatically
\`\`\`

> EXAMPLE Set up Fireflies.ai to auto-join every Google Meet or Zoom call. After each meeting, it emails a summary, action items, and full transcript — saving 15-30 minutes per meeting.
`,

  'ai-tools-productivity|4': `

---

## AI-Powered Project Management

\`\`\`mermaid
flowchart LR
    Brief[Project Brief] --> AI[AI breaks down into tasks]
    AI --> Plan[Task list with estimates]
    Plan --> Assign[Assign to team]
    Assign --> Track[Track progress]
    Track --> Blocker{Blocker?}
    Blocker -->|Yes| AIHelp[Ask AI to suggest solutions]
    Blocker -->|No| Done[✅ Deliver]
    AIHelp --> Track

    style Brief fill:#FFF3E0,stroke:#FF6F00
    style Done fill:#E8F5E9,stroke:#2E7D32
\`\`\`

> TIP Paste your project goals into ChatGPT and ask it to break them into a detailed task list with time estimates. Use this as a starting point for your project plan — it saves hours of planning time.
`,

  'ai-tools-productivity|5': `

---

## AI for Data Analysis Workflow

\`\`\`mermaid
flowchart TD
    Data[📊 Your Data / CSV] --> Upload[Upload to ChatGPT / Julius AI]
    Upload --> Question[Ask a question in plain English]
    Question --> Analysis[AI analyses and generates insights]
    Analysis --> Chart[AI creates charts / visuals]
    Chart --> Interpret[You interpret the business meaning]
    Interpret --> Decision[✅ Informed Decision]

    style Data fill:#FFF3E0,stroke:#FF6F00
    style Decision fill:#E8F5E9,stroke:#2E7D32
\`\`\`

> EXAMPLE Upload your monthly sales data to ChatGPT Advanced Data Analysis and ask: "Which product had the highest growth rate last quarter, and what drove it?" — you get charts and plain-English answers instantly.
`,

  'ai-tools-productivity|6': `

---

## No-Code AI Automation with Zapier / Make

\`\`\`mermaid
flowchart LR
    Trigger[⚡ Trigger\ne.g. New email received] --> Filter[🔍 Filter\nIs it a customer query?]
    Filter -->|Yes| AI[🤖 AI Step\nGenerate reply draft]
    AI --> Action1[📧 Send draft to Slack]
    Action1 --> Human[👤 Human approves]
    Human --> Action2[📤 Send reply]
    Filter -->|No| Skip[Skip automation]

    style Trigger fill:#FFF3E0,stroke:#FF6F00
    style Human fill:#E3F2FD,stroke:#1565C0
    style Action2 fill:#E8F5E9,stroke:#2E7D32
\`\`\`

> KEY TAKEAWAY The best automations keep a human in the loop for high-stakes actions (sending emails, making changes). Use AI to draft — humans to approve.
`,

  'ai-tools-productivity|7': `

---

## Building Your Personal AI Stack

\`\`\`mermaid
flowchart TD
    Audit[Audit your weekly tasks] --> List[List repetitive writing / thinking tasks]
    List --> Pick[Pick ONE tool per task type]
    Pick --> Test[Test for 1 week]
    Test --> Measure{Time saved?}
    Measure -->|Yes| Keep[✅ Keep in stack]
    Measure -->|No| Replace[Try a different tool]
    Keep --> Next[Move to next task type]
    Replace --> Test

    style Audit fill:#FFF3E0,stroke:#FF6F00
    style Keep fill:#E8F5E9,stroke:#2E7D32
\`\`\`

> TIP Start with the task that costs you the most time each week. Automate that first. One well-integrated AI tool is worth more than ten half-used ones.
`,

  'ai-tools-productivity|8': `

---

## Measuring AI Productivity ROI

\`\`\`mermaid
flowchart LR
    Before[⏱️ Time before AI\n(hours/week)] --> After[⚡ Time after AI\n(hours/week)]
    After --> Saved[🕐 Hours Saved / Week]
    Saved --> Annual[× 52 weeks = Annual hours saved]
    Annual --> Value[💰 × Hourly rate = Annual value]
    Value --> Cost[minus Tool cost]
    Cost --> ROI[✅ Net ROI]

    style Before fill:#FFEBEE,stroke:#C62828
    style ROI fill:#E8F5E9,stroke:#2E7D32
\`\`\`

> EXAMPLE If AI tools save you 5 hours/week and your time is worth $50/hr, that is $13,000/year in value. Most AI tool subscriptions cost $200–$600/year. The ROI is clear.
`,

  /* ══════════════════════════════════════════════════════════════════════
     COURSE 4 — EMAIL MARKETING WITH AI
  ══════════════════════════════════════════════════════════════════════ */

  'email-marketing-ai|1': `

---

## How AI Transforms Email Marketing

\`\`\`mermaid
flowchart LR
    Traditional[Traditional Email Marketing] --> AI[+ AI Layer]
    AI --> Segment[Smart Segmentation]
    AI --> Copy[AI Copywriting]
    AI --> Subject[Subject Line Optimisation]
    AI --> Send[Send-Time Optimisation]
    AI --> AB[Automatic A/B Testing]
    AI --> Predict[Predictive Analytics]

    Segment --> Results[📈 Higher Open Rates\nHigher Conversions]
    Copy --> Results
    Subject --> Results
    Send --> Results

    style Traditional fill:#F5F5F5,stroke:#9E9E9E
    style AI fill:#FFF3E0,stroke:#FF6F00
    style Results fill:#E8F5E9,stroke:#2E7D32
\`\`\`

> KEY TAKEAWAY AI does not replace your email strategy — it amplifies every part of it. Smarter segmentation, better copy, and perfect timing all compound together.
`,

  'email-marketing-ai|2': `

---

## AI Segmentation vs Traditional Segmentation

\`\`\`mermaid
flowchart TD
    subgraph Traditional["Traditional Segmentation"]
        T1[Age]
        T2[Location]
        T3[Purchase history]
    end
    subgraph AI["AI-Powered Segmentation"]
        A1[Behaviour patterns]
        A2[Predicted lifetime value]
        A3[Churn risk score]
        A4[Content engagement score]
        A5[Optimal send time per user]
    end
    Traditional --> Basic[Generic campaigns]
    AI --> Smart[Hyper-personalised campaigns]
    Smart --> Results[📈 2-5× higher conversion]

    style AI fill:#FFF3E0,stroke:#FF6F00
    style Smart fill:#E8F5E9,stroke:#2E7D32
\`\`\`

> EXAMPLE Klaviyo and Mailchimp AI can segment your list into "likely to buy in 30 days," "at risk of churning," and "high lifetime value" automatically — no manual rules needed.
`,

  'email-marketing-ai|3': `

---

## AI Email Copywriting Process

\`\`\`mermaid
sequenceDiagram
    participant M as 🧑 Marketer
    participant AI as 🤖 ChatGPT
    participant R as 📧 Email

    M->>AI: Provide product info + audience + goal
    AI->>M: Generate 3 subject line options
    M->>AI: Choose best, ask for email body
    AI->>M: Full email draft with CTA
    M->>AI: "Make it shorter and add urgency"
    AI->>M: Refined version
    M->>R: Apply brand voice + send
\`\`\`

> TIP Always give AI these 4 things for better email copy: (1) Who is the reader, (2) What is the offer, (3) What action do you want them to take, (4) What tone should it have.
`,

  'email-marketing-ai|4': `

---

## Personalisation at Scale

\`\`\`mermaid
flowchart LR
    CRM[CRM / Customer Data] --> AI[AI Personalisation Engine]
    AI --> Name[First name]
    AI --> Product[Recommended products]
    AI --> Content[Relevant content]
    AI --> Offer[Custom discount]
    AI --> Time[Best send time]
    Name --> Email[📧 Personalised Email × 10,000 subscribers]
    Product --> Email
    Content --> Email
    Offer --> Email
    Time --> Email

    style CRM fill:#FFF3E0,stroke:#FF6F00
    style Email fill:#E8F5E9,stroke:#2E7D32
\`\`\`

> KEY TAKEAWAY Personalisation at scale used to require large engineering teams. AI tools like Klaviyo, ActiveCampaign, and Brevo now do this automatically from your CRM data.
`,

  'email-marketing-ai|5': `

---

## AI-Powered A/B Testing Flow

\`\`\`mermaid
flowchart TD
    List[📋 Email List] --> Split[Split into groups]
    Split --> A[Version A\nOriginal subject line]
    Split --> B[Version B\nAI-generated subject line]
    A --> Send[Send to 20% each]
    B --> Send
    Send --> Measure[Measure open rates at 4 hours]
    Measure --> Winner{Which wins?}
    Winner -->|A| SendA[Send A to remaining 60%]
    Winner -->|B| SendB[Send B to remaining 60%]

    style Winner fill:#FFF3E0,stroke:#FF6F00
    style SendB fill:#E8F5E9,stroke:#2E7D32
\`\`\`

> NOTE Most modern email platforms (Mailchimp, Klaviyo) can run this entire flow automatically. Set the test, define the winner metric, and it handles the rest.
`,

  'email-marketing-ai|6': `

---

## What Makes a Great Subject Line

\`\`\`mermaid
mindmap
  root((Subject Line Formula))
    Curiosity
      "The mistake 90% of..."
      "You won't believe what..."
    Urgency
      "Last 24 hours..."
      "Ending tonight..."
    Personalisation
      "[Name], your report is ready"
      "Based on your last purchase..."
    Benefit
      "Save 3 hours every week"
      "Double your open rates"
    Question
      "Are you making this mistake?"
      "Ready to try something new?"
    Number
      "5 tools changing everything"
      "3 steps to better emails"
\`\`\`

> TIP Ask ChatGPT: "Generate 10 subject line variations for [your email goal] targeting [your audience]. Use different emotional triggers for each."
`,

  'email-marketing-ai|7': `

---

## Email Automation Sequence

\`\`\`mermaid
flowchart TD
    Subscribe[👤 New Subscriber] --> W1[Day 0: Welcome email]
    W1 --> W2[Day 2: Value email — tip or resource]
    W2 --> W3[Day 5: Story / case study]
    W3 --> W4[Day 8: Soft pitch]
    W4 --> W5[Day 12: Hard offer with urgency]
    W5 --> Bought{Purchased?}
    Bought -->|Yes| Onboard[Onboarding sequence]
    Bought -->|No| Nurture[Monthly nurture emails]

    style Subscribe fill:#FFF3E0,stroke:#FF6F00
    style Onboard fill:#E8F5E9,stroke:#2E7D32
\`\`\`

> KEY TAKEAWAY Your welcome sequence is your most valuable automation. Subscribers are most engaged in the first 2 weeks — this is when to deliver your best content and make your first offer.
`,

  'email-marketing-ai|8': `

---

## Email Marketing KPIs to Track

\`\`\`mermaid
flowchart LR
    Metrics[📊 Key Metrics] --> Open[Open Rate\nTarget: 20-40%]
    Metrics --> Click[Click Rate\nTarget: 2-5%]
    Metrics --> Convert[Conversion Rate\nTarget: 1-3%]
    Metrics --> Unsub[Unsubscribe Rate\nKeep below 0.5%]
    Metrics --> Revenue[Revenue per Email\nHighest priority]

    Open -->|Low| FixSubject[Fix subject lines]
    Click -->|Low| FixCTA[Fix CTA or content]
    Convert -->|Low| FixOffer[Fix the offer]

    style Metrics fill:#FFF3E0,stroke:#FF6F00
    style Revenue fill:#E8F5E9,stroke:#2E7D32
\`\`\`

> TIP Use AI to analyse your email performance data. Paste your metrics into ChatGPT and ask: "Based on these results, what should I test next to improve conversions?"
`,

  /* ══════════════════════════════════════════════════════════════════════
     COURSE 5 — PROMPT ENGINEERING MASTERY
  ══════════════════════════════════════════════════════════════════════ */

  'prompt-engineering-mastery|1': `

---

## Anatomy of a High-Quality Prompt

\`\`\`mermaid
flowchart TD
    Prompt[Your Prompt] --> Role[🎭 Role Assignment\ne.g. Act as a senior copywriter]
    Prompt --> Context[📚 Context\ne.g. We sell B2B SaaS to HR teams]
    Prompt --> Task[📋 Task\ne.g. Write a LinkedIn post]
    Prompt --> Constraints[📐 Constraints\ne.g. Under 150 words, no jargon]
    Prompt --> Examples[💡 Examples\ne.g. Here is a good example...]
    Prompt --> Format[📄 Output Format\ne.g. Return as a bullet list]

    Role --> Quality[🚀 High-Quality Output]
    Context --> Quality
    Task --> Quality
    Constraints --> Quality

    style Prompt fill:#FFF3E0,stroke:#FF6F00
    style Quality fill:#E8F5E9,stroke:#2E7D32
\`\`\`

> KEY TAKEAWAY A vague prompt gives a vague answer. The more specific context, constraints, and examples you provide, the more useful and accurate the output becomes.
`,

  'prompt-engineering-mastery|2': `

---

## Core Prompt Patterns

\`\`\`mermaid
mindmap
  root((Prompt Patterns))
    Role Pattern
      Act as an expert in...
      You are a...
      Take the perspective of...
    Format Pattern
      Return as a table
      Use bullet points
      Write in JSON format
    Constraint Pattern
      Under 100 words
      Avoid technical jargon
      Do not include...
    Persona Pattern
      Explain like I am 10
      Write for a CEO audience
      Target beginners
    Iteration Pattern
      Make it more concise
      Add more examples
      Rewrite in a different tone
\`\`\`

> EXAMPLE Combining patterns: "Act as a marketing expert [Role]. Explain email segmentation [Task] to a small business owner who has never used email marketing [Persona]. Use 3 bullet points [Format], keep it under 100 words [Constraint]."
`,

  'prompt-engineering-mastery|3': `

---

## Chain-of-Thought Prompting

\`\`\`mermaid
sequenceDiagram
    participant U as 👤 User
    participant AI as 🧠 AI Model

    U->>AI: Direct question (bad)
    AI->>U: Fast guess — often wrong

    U->>AI: "Think through this step by step..."
    AI->>AI: Step 1: Identify the problem
    AI->>AI: Step 2: Consider approaches
    AI->>AI: Step 3: Evaluate options
    AI->>AI: Step 4: Form conclusion
    AI->>U: Reasoned, accurate answer
\`\`\`

> TIP Add "Let's think through this step by step" or "Reason through this before giving your answer" to any complex prompt. This simple addition dramatically improves accuracy on reasoning tasks.

> EXAMPLE Without CoT: "What is 15% of 847?" → AI: "127.05" (might be right, might not)
> With CoT: "Calculate 15% of 847 step by step" → AI shows working: "10% = 84.7, 5% = 42.35, total = 127.05" ✅
`,

  'prompt-engineering-mastery|4': `

---

## Zero-Shot vs Few-Shot Prompting

\`\`\`mermaid
flowchart TD
    subgraph ZS["Zero-Shot"]
        ZQ[Task description only] --> ZA[AI infers from training]
    end
    subgraph FS["Few-Shot"]
        FE1[Example 1: Input → Output] --> FM[AI learns the pattern]
        FE2[Example 2: Input → Output] --> FM
        FE3[Example 3: Input → Output] --> FM
        FM --> FQ[Your actual task] --> FA[Consistent, patterned output]
    end

    ZS -->|Simple tasks| Good[✅ Works well]
    FS -->|Complex / consistent format needed| Better[✅ Works much better]

    style FS fill:#FFF3E0,stroke:#FF6F00
    style Better fill:#E8F5E9,stroke:#2E7D32
\`\`\`

> EXAMPLE For few-shot classification:
> "Positive: 'This product is amazing' → POSITIVE
> Negative: 'Terrible experience' → NEGATIVE
> Now classify: 'It was okay I guess'"
`,

  'prompt-engineering-mastery|5': `

---

## Role Prompting Framework

\`\`\`mermaid
flowchart LR
    Need[What do I need?] --> Expert{Expert knowledge?}
    Expert -->|Yes| Role[Assign expert role\ne.g. Act as a lawyer]
    Expert -->|No| Style{Specific style?}
    Style -->|Yes| Persona[Assign persona\ne.g. Write like Hemingway]
    Style -->|No| Plain[Standard prompt]

    Role --> Better[Better domain-specific answers]
    Persona --> Voice[Consistent style and tone]

    style Role fill:#FFF3E0,stroke:#FF6F00
    style Better fill:#E8F5E9,stroke:#2E7D32
\`\`\`

> NOTE The AI does not actually become an expert — it shifts its output distribution toward content that expert would likely produce. This is why role prompting significantly improves quality for domain-specific tasks.

> EXAMPLE "Act as a senior financial advisor. Explain the concept of compound interest to a 25-year-old just starting to invest. Use simple language and a practical example."
`,

  'prompt-engineering-mastery|6': `

---

## Controlling Output Format

\`\`\`mermaid
mindmap
  root((Output Formats))
    Structured Data
      JSON
      CSV
      Markdown table
      XML
    Documents
      Bullet list
      Numbered steps
      Headers and sections
      Executive summary
    Code
      Python function
      SQL query
      JavaScript snippet
    Creative
      Paragraph form
      Dialogue
      Story format
    Comparisons
      Pros and cons
      Side-by-side table
      Before and after
\`\`\`

> TIP Always specify your desired output format at the end of your prompt. Example: "...Return your answer as a markdown table with columns: Tool | Use Case | Cost | Skill Level Required."
`,

  'prompt-engineering-mastery|7': `

---

## Advanced Prompting Decision Tree

\`\`\`mermaid
flowchart TD
    Task[Your Task] --> Simple{Simple single task?}
    Simple -->|Yes| Direct[Direct prompt]
    Simple -->|No| Complex{Requires reasoning?}
    Complex -->|Yes| CoT[Chain-of-Thought prompt]
    Complex -->|No| Pattern{Needs consistent format?}
    Pattern -->|Yes| FewShot[Few-shot with examples]
    Pattern -->|No| Creative{Creative / open-ended?}
    Creative -->|Yes| Role[Role + persona prompt]
    Creative -->|No| Multi[Break into multiple prompts]

    style Direct fill:#E8F5E9,stroke:#2E7D32
    style CoT fill:#E3F2FD,stroke:#1565C0
    style FewShot fill:#FFF3E0,stroke:#FF6F00
\`\`\`

> KEY TAKEAWAY There is no single "best" prompt technique. Match the technique to the task: reasoning → CoT, consistency → few-shot, creativity → role prompting, complexity → chain of prompts.
`,

  'prompt-engineering-mastery|8': `

---

## Building a Prompt Library

\`\`\`mermaid
flowchart LR
    Task[Recurring task identified] --> Draft[Write and test prompt]
    Draft --> Refine[Refine until reliable]
    Refine --> Save[Save to prompt library]
    Save --> Tag[Tag by use case / tool]
    Tag --> Reuse[Reuse and share]
    Reuse --> Improve[Improve based on results]
    Improve --> Save

    style Save fill:#FFF3E0,stroke:#FF6F00
    style Reuse fill:#E8F5E9,stroke:#2E7D32
\`\`\`

> TIP Keep your prompt library in Notion, Google Docs, or a simple text file. Include: the prompt text, what it is for, the model it works best with, and any variables to replace (e.g. [PRODUCT NAME]).

> KEY TAKEAWAY A well-maintained prompt library is a competitive advantage. It captures your best thinking and lets anyone on your team produce consistent, high-quality AI outputs.
`,

  /* ══════════════════════════════════════════════════════════════════════
     COURSE 6 — SOCIAL MEDIA MARKETING WITH AI
  ══════════════════════════════════════════════════════════════════════ */

  'social-media-marketing-ai|1': `

---

## AI in Social Media Marketing — Overview

\`\`\`mermaid
mindmap
  root((AI for Social Media))
    Content Creation
      Caption writing
      Hashtag research
      Content ideas
      Blog to social repurposing
    Visual Content
      AI image generation
      Video scripts
      Thumbnail design
      Carousel creation
    Analytics
      Performance insights
      Competitor analysis
      Sentiment analysis
      Trend detection
    Scheduling
      Optimal posting times
      Auto-scheduling
      Content calendar AI
    Community
      Comment responses
      DM templates
      Crisis detection
\`\`\`

> KEY TAKEAWAY AI removes the two biggest obstacles in social media: running out of ideas and spending hours on execution. It does not replace your brand voice — it amplifies it.
`,

  'social-media-marketing-ai|2': `

---

## AI Content Creation Workflow

\`\`\`mermaid
flowchart TD
    Topic[💡 Content Topic / Goal] --> AI[AI generates 10 post ideas]
    AI --> Pick[You select the best 3]
    Pick --> Draft[AI writes full captions]
    Draft --> Edit[You edit for brand voice]
    Edit --> Visual[AI generates or suggests visuals]
    Visual --> Schedule[Schedule with Buffer / Later / Hootsuite]
    Schedule --> Post[📱 Auto-posted]
    Post --> Analyse[Review analytics next week]

    style Topic fill:#FFF3E0,stroke:#FF6F00
    style Post fill:#E8F5E9,stroke:#2E7D32
\`\`\`

> TIP Spend 2 hours per week using AI to batch-create a full week of social content. This is far more efficient than creating one post at a time every day.
`,

  'social-media-marketing-ai|3': `

---

## Repurposing One Piece of Content

\`\`\`mermaid
flowchart LR
    Core[📝 One Blog Post or Video] --> LinkedIn[LinkedIn article]
    Core --> Twitter[5 tweet thread]
    Core --> Instagram[Carousel post]
    Core --> TikTok[60-second script]
    Core --> Email[Email newsletter]
    Core --> Quote[3 quote graphics]
    Core --> Shorts[YouTube Short script]

    style Core fill:#FFF3E0,stroke:#FF6F00
\`\`\`

> KEY TAKEAWAY Create once, distribute everywhere. Use ChatGPT to repurpose your best piece of content into 7+ formats. This multiplies your reach without multiplying your workload.

> EXAMPLE Prompt: "Take this blog post [paste content] and rewrite it as: (1) a LinkedIn post under 200 words, (2) a 5-tweet thread, (3) an Instagram caption with emojis and hashtags."
`,

  'social-media-marketing-ai|4': `

---

## AI-Optimised Posting Schedule

\`\`\`mermaid
flowchart TD
    Audience[Who is your audience?] --> Platform{Platform?}
    Platform -->|LinkedIn| LI[Best: Tue-Thu, 8-10am or 5-6pm]
    Platform -->|Instagram| IG[Best: Mon-Fri, 9am or 6pm]
    Platform -->|TikTok| TT[Best: Tue-Fri, 6-10pm]
    Platform -->|Twitter/X| TW[Best: Mon-Wed, 8am or 4pm]
    Platform -->|Facebook| FB[Best: Wed, 11am or 1pm]

    LI --> AI[Use AI scheduler to find YOUR audience's peak time]
    IG --> AI
    TT --> AI

    style AI fill:#FFF3E0,stroke:#FF6F00
\`\`\`

> NOTE These are general guidelines. AI tools like Buffer Analyze or Later's Best Time to Publish analyse YOUR specific audience's engagement patterns and give personalised recommendations.
`,

  'social-media-marketing-ai|5': `

---

## Understanding Social Media Analytics with AI

\`\`\`mermaid
sequenceDiagram
    participant D as 📊 Platform Data
    participant AI as 🤖 AI Analytics Tool
    participant I as 💡 Insight
    participant A as ✅ Action

    D->>AI: Export last 30 days of data
    AI->>I: "Your video content gets 3× more reach"
    AI->>I: "Posts on Tuesday outperform by 40%"
    AI->>I: "Audience drops off after 45 seconds"
    I->>A: Post more video on Tuesdays
    I->>A: Keep videos under 45 seconds
\`\`\`

> TIP Paste your analytics report into ChatGPT and ask: "Based on this data, what are the top 3 things I should change about my social media strategy?" — it gives you actionable insights instantly.
`,

  'social-media-marketing-ai|6': `

---

## AI Hashtag Strategy

\`\`\`mermaid
flowchart LR
    Post[Your Post Content] --> AI[AI Hashtag Tool]
    AI --> Tier1[🏆 3-5 Large hashtags\n1M+ posts]
    AI --> Tier2[📈 5-7 Mid hashtags\n100K-1M posts]
    AI --> Tier3[🎯 5-8 Niche hashtags\nUnder 100K posts]

    Tier1 --> Mix[Mix all three tiers]
    Tier2 --> Mix
    Tier3 --> Mix
    Mix --> Reach[✅ Maximum reach across audience sizes]

    style AI fill:#FFF3E0,stroke:#FF6F00
    style Reach fill:#E8F5E9,stroke:#2E7D32
\`\`\`

> NOTE Using only large hashtags means your post competes with millions of others and disappears in seconds. Niche hashtags give you visibility to a smaller but highly relevant audience.
`,

  'social-media-marketing-ai|7': `

---

## AI-Powered Community Management

\`\`\`mermaid
flowchart TD
    Comment[💬 New Comment or DM] --> Sentiment[AI analyses sentiment]
    Sentiment --> Positive{Positive?}
    Positive -->|Yes| Thank[AI drafts thank-you reply]
    Positive -->|No| Negative{Negative / complaint?}
    Negative -->|Yes| Escalate[Flag for human response]
    Negative -->|No| Question{Question?}
    Question -->|Yes| Answer[AI drafts answer from FAQ]
    Question -->|No| Generic[AI drafts friendly reply]

    style Escalate fill:#FFEBEE,stroke:#C62828
    style Thank fill:#E8F5E9,stroke:#2E7D32
\`\`\`

> WARNING Always have a human review and approve replies to negative comments or complaints before sending. AI can misjudge tone in sensitive situations. Speed matters, but getting it wrong is worse.
`,

  'social-media-marketing-ai|8': `

---

## Building Your AI Social Media System

\`\`\`mermaid
flowchart LR
    Strategy[Monthly Strategy\n(You define goals)] --> AI[AI generates content ideas]
    AI --> Create[AI drafts captions + visuals]
    Create --> Review[You review and edit]
    Review --> Schedule[AI scheduler posts automatically]
    Schedule --> Monitor[AI monitors comments]
    Monitor --> Report[AI generates weekly report]
    Report --> Strategy

    style Strategy fill:#FFF3E0,stroke:#FF6F00
    style Report fill:#E8F5E9,stroke:#2E7D32
\`\`\`

> KEY TAKEAWAY Build a repeating system, not a one-off process. When AI handles ideation, drafting, scheduling, and reporting — you only need to bring strategy, brand voice, and final approval. That is how you scale social media with a small team.
`,

}

// ── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  const args = process.argv.slice(2)
  const mode = args.includes('--run') ? 'run' : 'list'
  const filterSlug = args.includes('--slug') ? args[args.indexOf('--slug') + 1] : null

  console.log('\n🤖  AILearnHub — Module Enhancement Script')
  console.log('────────────────────────────────────────────')

  const courses = await sb('courses?select=id,slug,title&order=created_at')
  const allModules = await sb('course_modules?select=id,course_id,module_number,title,content&order=course_id,module_number')

  const updated = []
  const skipped = []
  const noEnhancement = []

  for (const course of courses) {
    if (filterSlug && course.slug !== filterSlug) continue
    const modules = allModules.filter(m => m.course_id === course.id)
    console.log(`\n📚  ${course.title} (${course.slug})`)

    for (const mod of modules) {
      const key = `${course.slug}|${mod.module_number}`
      const enhancement = ENHANCEMENTS[key]

      if (!enhancement) {
        console.log(`  ⚪  Module ${mod.module_number}: ${mod.title} — no enhancement defined`)
        noEnhancement.push({ course: course.slug, module: mod.module_number, title: mod.title })
        continue
      }

      if (!mod.content) {
        console.log(`  ⚠️   Module ${mod.module_number}: ${mod.title} — empty content, skipping`)
        skipped.push({ course: course.slug, module: mod.module_number, title: mod.title, reason: 'no content' })
        continue
      }

      // Check if already enhanced (avoid double-applying)
      if (mod.content.includes('```mermaid') && mod.content.includes(enhancement.trim().slice(0, 30))) {
        console.log(`  ✅  Module ${mod.module_number}: ${mod.title} — already enhanced`)
        continue
      }

      if (mode === 'list') {
        console.log(`  📝  Module ${mod.module_number}: ${mod.title} — WILL BE ENHANCED`)
        updated.push({ course: course.slug, module: mod.module_number, title: mod.title })
        continue
      }

      // Apply enhancement
      const newContent = (mod.content || '') + enhancement
      await sb(`course_modules?id=eq.${mod.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ content: newContent })
      })
      console.log(`  ✅  Module ${mod.module_number}: ${mod.title} — enhanced`)
      updated.push({ course: course.slug, module: mod.module_number, title: mod.title })

      // Small delay to avoid rate limiting
      await new Promise(r => setTimeout(r, 150))
    }
  }

  console.log('\n────────────────────────────────────────────')
  if (mode === 'list') {
    console.log(`📋  ${updated.length} modules will be enhanced when you run --run`)
    console.log(`⚪  ${noEnhancement.length} modules have no enhancement defined`)
    console.log(`⚠️   ${skipped.length} modules have empty content\n`)
    console.log('Run with --run to apply:  node scripts/enhance-modules.js --run\n')
  } else {
    console.log(`✅  ${updated.length} modules enhanced successfully`)
    console.log(`⚪  ${noEnhancement.length} modules had no enhancement defined`)
    console.log(`⚠️   ${skipped.length} modules skipped (empty content)\n`)
    console.log('Done! Push your Supabase changes are live — no git push needed.')
    console.log('Reload any module page to see the diagrams.\n')

    // Print summary table
    if (updated.length > 0) {
      console.log('Updated modules:')
      updated.forEach(m => console.log(`  • ${m.course} → Module ${m.module}: ${m.title}`))
    }
  }
}

main().catch(e => { console.error('\n❌ Error:', e.message); process.exit(1) })
