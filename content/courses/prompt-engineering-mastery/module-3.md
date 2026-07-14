# Module 3: Context and Constraints

**Duration:** 40 minutes

---

## What You'll Learn

- Understand why context is the highest-leverage element of any prompt
- Provide the right type and amount of context for different tasks
- Use constraints strategically to improve output quality
- Manage context across long conversations
- Work effectively with the context window — including very long documents

---

## 3.1 Context Is the Highest-Leverage Prompt Element

If you had to improve one thing about your prompts, it would be context.

Context is everything the model doesn't know that it needs to know to produce a useful output. It's the gap between what you have in your head and what's in the prompt. Closing that gap is the single biggest driver of prompt quality.

**What context includes:**
- Who you are and your relevant background
- Who the audience is and what they know, care about, and need
- What the situation or problem is (with specifics)
- What good output looks like for this particular case
- What you've already tried or decided
- What constraints or requirements the output must meet

Most people provide the task. They forget everything else.

---

## 3.2 Types of Context and When to Use Each

### Identity Context

Who are you? What's your role, expertise level, and relationship to this task?

**Examples:**
- "I'm a first-year law student writing my first legal memo"
- "I'm a senior product designer with 8 years experience, currently working at a fintech startup"
- "I run a 3-person digital marketing agency serving local businesses"

**Why it matters:** The same question asked by a beginner and an expert needs different answers. Identity context calibrates the response for the actual recipient.

### Audience Context

Who is the output for? What do they know? What do they care about? What would fail for them?

**Examples:**
- "The audience is non-technical executives who make budget decisions but don't use the product"
- "This is for junior employees on their first week — assume no prior knowledge"
- "The reader is a venture capitalist who sees 200 pitches per month — get to the point immediately"

**Why it matters:** Audience shapes vocabulary, depth, tone, structure, and what needs to be explained vs. assumed.

### Situational Context

What's the broader situation? What decisions are being made? What has happened before?

**Examples:**
- "We've already tried [X] and it didn't work because [Y]"
- "This email is the third in a series; the previous two covered [topics]"
- "I'm presenting this to a board that has previously rejected proposals for [reasons]"

**Why it matters:** Without situational context, the model may suggest things you've already ruled out, give advice that's appropriate in general but wrong for your specific situation, or miss important constraints.

### Technical Context

Specifications, requirements, standards, or background knowledge the model needs.

**Examples:**
- "We use Next.js 16 with TypeScript and Tailwind. We don't use Redux — we use Zustand."
- "Our brand guidelines specify: [colours, fonts, tone rules]"
- "The legal constraint here is GDPR — any solution must not process EU user data outside the EU"

---

## 3.3 How Much Context Is Enough?

Context costs tokens. There's a point of diminishing returns.

**Rule of thumb:** Include context if it would meaningfully change the output. Omit it if it wouldn't.

**Context to always include:**
- Who the output is for
- What format/length is required
- Any hard constraints (time, budget, technical limitations, audience restrictions)
- Anything specific to your situation that differs from the "typical case"

**Context to usually skip:**
- Background the model already knows (don't explain what email marketing is)
- Details that won't change the output
- Lengthy preambles about why you're asking

**Practical test:** If you removed a piece of context and the output would be the same, you don't need it. If it would be different, you do.

---

## 3.4 Strategic Use of Constraints

Constraints are negative instructions — what not to do, what to stay within, what to avoid.

They're equally important as positive instructions and often more impactful because they prevent the most common failure modes.

### Types of Constraints

**Format constraints:**
- "Under 200 words"
- "Exactly 3 bullet points"
- "One sentence per paragraph"
- "No subheadings — write in flowing paragraphs"

**Style constraints:**
- "No jargon — if you use a technical term, explain it immediately"
- "Do not use these words: leverage, robust, seamlessly, transformative, game-changing"
- "Don't start with a question"
- "Never use passive voice"

**Scope constraints:**
- "Focus only on the marketing implications — don't address the technical or financial aspects"
- "Assume the strategic decision has been made — advise only on implementation"
- "Only recommend free or open-source tools"

**Accuracy constraints:**
- "If you're not certain of a fact, say so explicitly"
- "Do not invent statistics — if you reference data, note whether it's a general estimate or a specific cited source"

### Constraint Stacking

Stacking multiple constraints is powerful but can cause conflicts. Keep them mutually compatible:

**Good:**
> Under 300 words. Use bullet points for lists. No filler phrases. Start with the key takeaway.

**Potentially conflicting:**
> Under 100 words. Include a detailed explanation of all 7 points. Use formal academic language.

If constraints conflict, the model will make a judgement call. Better to catch and resolve the conflict yourself.

---

## 3.5 Managing Context Across Long Conversations

ChatGPT, Claude, and Gemini all maintain context within a conversation. But very long conversations have problems: models can lose track of earlier instructions, context becomes stale, and key details get buried.

### Techniques for Long-Context Conversations

**Explicit reminders:**
If a conversation has run long, re-state the key constraints: "Reminder: we're writing for a non-technical executive audience, in under 500 words, in British English."

**Summaries:**
At the start of a new phase of work in a long conversation:
> Briefly summarise the decisions we've made so far about [project/topic] so I can confirm we're aligned before we continue.

**Projects (ChatGPT) and long context windows (Claude):**
ChatGPT Projects and Claude's 200K context window let you maintain persistent context without it degrading. Use them for work spanning multiple conversations.

**Context resets:**
Sometimes it's better to start a new conversation with a fresh, consolidated brief than to continue fighting a degraded context. Paste your accumulated decisions and context into a new prompt.

---

## 3.6 Working with Long Documents

Modern AI models can process very long documents — Claude's 200K context handles roughly 150,000 words. But long documents require deliberate prompting.

### Asking Questions Across Long Documents

> Here is a [document type] of [X pages/words]. [Paste document]
>
> When I ask questions, base your answers only on what's in this document. If something I ask about isn't addressed in the document, tell me explicitly rather than drawing from general knowledge.

### Extracting Specific Information

> From this [document/report], extract all mentions of [specific topic/entity/number] and present them as a structured list with the page/section reference for each.

### Cross-Document Analysis

> I'm uploading 3 reports. Analyse all three together and answer: (1) what conclusions do they agree on, (2) where do they contradict each other, (3) what's missing from all three that would be important to understand [topic]?

### Summarisation with Control

> Summarise this document at 3 levels of detail:
> - Executive summary: 3 sentences
> - Key points: 5 bullet points
> - Detailed summary: 3 paragraphs covering the main sections

---

## 3.7 Providing Context Efficiently — Templates and Preambles

For tasks you do repeatedly, write a context preamble once and reuse it:

**Reusable context template:**
> **About me:** [role, company, expertise level]
> **About my audience:** [who they are, what they know, what they need]
> **Brand voice:** [tone, style, words to use/avoid]
> **Standard format:** [length, structure, formatting rules]
> **Always:** [recurring positive instructions]
> **Never:** [recurring constraints]

Save this in your prompt library. For any new task, paste the preamble and add the specific task below it.

**In ChatGPT:** Put this in Custom Instructions so it applies automatically to every conversation.

**In Claude:** Create a Project with this as the project instructions — it carries across all conversations in the project.

---

## Key Takeaways

- **Context is the highest-leverage element** in any prompt — the gap between what's in your head and what's in the prompt is where most prompts fail
- The four types of context: **identity, audience, situational, and technical**
- Include context only if it would **meaningfully change the output** — skip what wouldn't
- **Constraints** (what not to do) are as important as positive instructions — they prevent the most common failure modes
- For long conversations: use **Projects** (ChatGPT) or long context windows (Claude), re-state key constraints periodically, and don't hesitate to start fresh with a consolidated brief
- Build **reusable context templates** for tasks you do repeatedly — paste and go

---

## Quick Check

1. What are the four types of context? Give an example of each.
2. What's the "practical test" for deciding whether to include a piece of context?
3. Why are constraints especially valuable, and what are 3 types you can use?

---

*Next up: Module 4 — Iterative Refinement*
