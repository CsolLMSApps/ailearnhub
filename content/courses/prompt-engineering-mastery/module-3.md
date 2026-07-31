# Module 3: Context and Constraints

**Course:** Prompt Engineering Mastery
**Estimated Time:** 60 minutes
**Difficulty:** 🔴 Advanced

---

## What You'll Learn

- Why context is the single most important component of effective prompts
- How to provide context efficiently without making prompts unnecessarily long
- The art of constraints: using limitations to improve output quality
- How to encode your specific situation, audience, and goals into every prompt
- Negative constraints: what NOT to do is often more important than what to do
- Building context-rich prompt templates that maintain quality across repeated use

---

## Why This Matters Today

> A **recently Microsoft Research paper on prompt optimization** found that adding relevant context to a prompt improved output quality scores by an average of **52%** across a diverse set of professional tasks. Critically, poorly chosen context (irrelevant or misleading) degraded quality by **18%** — suggesting that context quality matters more than context quantity. The research validated what experienced prompt engineers already knew: the right context is everything; the wrong context is worse than none.

Context and constraints are the two most frequently missing elements in professional prompts. Most people tell AI what to do (the task) but not why it matters, who it's for, what limitations apply, or what success looks like. This module teaches you to provide context efficiently and use constraints precisely.

---

## Section 1: The Context Problem

### Why AI Gets Context Wrong

When you ask an AI a question without context, the AI fills in context from its training data — using the most statistically common interpretation of your request. This interpretation is almost never exactly right for your specific situation.

**Example:**
Prompt: "Write a proposal for expanding our team."

Without context, the AI assumes:
- Standard corporate setting (probably wrong for your company culture)
- Generic business writing (probably not your voice)
- Unknown audience (probably not your specific decision-maker)
- Unknown team type (could be engineering, sales, support, etc.)
- Unknown company stage (enterprise vs. startup have very different conventions)

The AI can write something technically correct. But "technically correct" isn't useful when you need something that will actually work in your specific organizational context.

### The Three Levels of Context

**Level 1 — Situation context:** Who are you? What situation are you in? What happened that led to this need?

**Level 2 — Audience context:** Who will receive this output? What do they know? What do they care about? What are they likely to object to?

**Level 3 — Purpose context:** What does success look like? What decision or action should this output enable? What happens after this output is delivered?

Most prompts provide only a fraction of Level 1. Level 2 and Level 3 are almost entirely missing from typical prompts.

---

## Section 2: Providing Context Efficiently

### The Context Compression Problem

Providing rich context is valuable, but prompts that are too long create different problems:
- Important instructions get buried in text the AI gives less weight to
- Long prompts take more time to write and refine
- Adding irrelevant context can actually confuse the AI's focus

The solution is **context compression**: providing high-information context efficiently.

### What Context to Include and What to Leave Out

**Include context that:**
- Distinguishes your situation from the generic default
- Changes what the best answer looks like
- Prevents common mistakes specific to your situation
- Establishes the stakes (why this matters)

**Exclude context that:**
- Could apply to anyone asking this type of question
- Doesn't change what the best answer looks like
- Is interesting but not decision-relevant for this task

```prompt
[High-information context example]

I'm the Head of Customer Success at a 45-person B2B SaaS company 
($8M ARR, selling to retail chains). We recently had our largest ever 
customer ($400K ARR, 22% of our revenue) ask to reduce their contract 
by 40% at renewal. Their usage data shows heavy engagement from one 
team, and very low adoption from the other three teams they licensed for.

I'm preparing for the renewal conversation next Thursday. The champion 
is our main contact — she personally advocated for us internally. 
The economic buyer (CFO) is who she has to convince.

Help me prepare for this renewal conversation by:
[specific ask]
```

This context tells the AI:
- Your role and expertise level
- The stakes (specific financial impact)
- The specific situation (selective adoption, not universal disengagement)
- The relationship dynamics (champion vs. economic buyer)
- The timeline (Thursday = urgent)

None of this is filler. Every sentence changes what good preparation looks like.

### The Situation → Stakes → Ask Structure

A reliable structure for providing efficient context:

**Situation (2-3 sentences):** Who are you, what's happening, what led to this need?
**Stakes (1-2 sentences):** Why does this matter? What happens if this goes well vs. poorly?
**Ask (1-2 sentences):** Specifically what do you need from the AI?

```prompt
SITUATION: I'm preparing a presentation to our board on our Q3 performance. 
Revenue hit target (103% of plan) but we missed our new customer acquisition 
goal (68% of plan) while exceeding expansion revenue with existing customers 
(142% of plan). This is my third board presentation and I know they're 
particularly focused on growth trajectory.

STAKES: If I can't clearly explain the acquisition miss and show we 
understand the cause and the fix, the board may question our sales strategy 
and push for changes I'm not confident we need.

ASK: Help me structure the narrative for this section of the board deck 
— specifically how to present the mixed results in a way that's honest, 
shows strategic awareness, and doesn't invite the conversation about 
replacing our current sales approach before I've had time to fix it.
```

---

## Section 3: Audience Context — The Most Underused Dimension

### Why Audience Context Changes Everything

The same information written for different audiences should look, sound, and feel completely different. AI needs to know your audience as specifically as you know them.

**Audience context dimensions:**
- **Expertise level:** What they already know about this topic
- **Role and authority:** What decisions they make, what they care about professionally
- **Relationship:** How well they know you, the history between you
- **Emotional state:** Are they anxious, skeptical, excited, bored?
- **Time and attention:** How much time will they give this?
- **Communication preferences:** Do they prefer data or narrative? Detail or summary?

```prompt
I need to communicate the same information to three different audiences.
The information: [describe the core message]

AUDIENCE 1: Write this for our CEO
- Background: MBA, strong financial instincts, 20 years in corporate
- What she cares about: Revenue impact, competitive positioning, stakeholder risk
- Current state: Skeptical about this initiative, wants proof it's working
- Time available: She will read this for 2 minutes maximum
- Format: Will review on her phone between meetings

AUDIENCE 2: Write this for our engineering team
- Background: Technical, highly analytical, deep domain experts
- What they care about: Technical soundness, implementation quality, avoiding debt
- Current state: Bought in to the initiative, want specifics
- Time available: Will read carefully for 10-15 minutes
- Format: Will read on desktop, comfortable with technical language

AUDIENCE 3: Write this for our customers
- Background: Operations and procurement professionals, non-technical
- What they care about: Reliability, ease of transition, business continuity
- Current state: Nervous about change, need reassurance
- Time available: Will skim, then read parts that concern them
- Format: Email, read on any device

Write three versions. Make them clearly distinct — not just different lengths.
```

---

## Section 4: Constraints — The Art of Productive Limitation

### Why Constraints Improve Output

Counterintuitively, constraints generally improve AI outputs rather than limiting them. Here's why:

Without constraints, AI produces the most generic, complete, comprehensive version of a response — because that's what "most responses to this type of question" look like in training data. Constraints force the AI toward the specific, the appropriate, and the useful.

The constraint forces the AI to prioritize, which produces cleaner, more targeted output.

### Types of Constraints

**Format constraints:** "No bullet points — flowing paragraphs only" / "Exactly 3 sections" / "Table format"

**Length constraints:** "Under 150 words" / "Between 500-700 words" / "One sentence per point"

**Tone constraints:** "Professional but not stiff" / "No motivational language" / "Direct and data-focused"

**Vocabulary constraints:** "No jargon" / "Avoid passive voice" / "Don't use these words: [list]"

**Content constraints:** "Don't mention competitor X" / "Focus only on the implementation phase, not design" / "Only include information I can verify"

**Perspective constraints:** "Argue for, not against" / "Take the skeptic's view" / "Write as if you have no prior knowledge of our industry"

### Negative Constraints — Telling AI What NOT to Do

Negative constraints are often more valuable than positive constraints because they prevent the most predictable failures:

```prompt
Write a 500-word article about productivity for knowledge workers.

Do NOT:
- Start with "In today's fast-paced world" or any variant of this opener
- Use the phrase "work smarter, not harder"
- Include generic advice like "take breaks" or "prioritize your tasks"
- Write in a listicle format
- End with a motivational summary that doesn't add new information
- Mention any specific apps or tools — focus on principles, not software

DO:
- Take a specific angle or make a claim that contradicts common advice
- Use one concrete, specific example
- Address a real frustration that knowledge workers have with productivity advice
```

The negative constraints prevent 80% of what would make this article forgettable.

> 📖 **Real Example:** A content marketing director at a technology company found that her team's AI-generated blog posts were consistently mediocre despite detailed positive instructions. She switched her approach to lead with negative constraints — a list of 10 things that make blog posts generic and forgettable. Output quality improved dramatically because the AI stopped defaulting to the patterns it had seen most often.

### The "Don't X Unless Y" Constraint

A more sophisticated constraint pattern that handles exceptions:

```prompt
Write a business recommendation memo about [topic].

CONSTRAINTS:
- Don't include data tables UNLESS the comparison is central to the recommendation
- Don't use hedging language ("might," "could potentially," "it seems like") UNLESS 
  you're flagging genuine uncertainty about a specific claim
- Don't include implementation details UNLESS they're necessary to evaluate feasibility
- Don't mention competitors UNLESS a specific comparison strengthens the case
- Don't exceed 400 words UNLESS the complexity of the situation genuinely requires more

This produces a clean, direct memo in most cases while allowing 
exceptions where they're genuinely warranted.
```

---

## Section 5: Context Templates for Recurring Situations

### Building Context Libraries

For professionals who use AI regularly, building context templates for common situations eliminates the need to re-establish context every session. A context template is a pre-written summary of your professional situation that you paste at the beginning of prompts.

**Template structure:**

```
[YOUR CONTEXT TEMPLATE — store and paste into relevant prompts]

About me: I am [role] at [company type and size] focused on [main work area].
My expertise: [2-3 sentences about relevant professional background]
My audience for most work: [who you typically write for or communicate with]
My typical constraints: [common limitations in your work — word counts, tone requirements, technical level]
My brand/communication voice: [brief description]
What I value in AI outputs: [specific things — conciseness, examples, data citations, etc.]
What I don't want: [things that consistently frustrate you in AI outputs]
```

### The System Prompt as Context

For Claude, Custom GPTs, or any AI that allows system prompts, your context template belongs in the system prompt — so you never have to repeat it:

```
SYSTEM PROMPT:

You are assisting [Your Name], a [your role] at [your organization].

ABOUT MY WORK:
[Description of your work, your organization, your typical tasks]

ABOUT MY AUDIENCE:
[Who your outputs typically go to]

MY COMMUNICATION VOICE:
[Detailed description of your writing style and preferences]

MY STANDARDS:
- [Quality standard 1]
- [Quality standard 2]
- [Quality standard 3]

WHAT TO AVOID:
- [Avoid thing 1]
- [Avoid thing 2]
- [Avoid thing 3]

When I give you a task, apply this context unless I specify otherwise.
```

---

## Section 6: The Context Debugging Process

When prompts consistently produce poor output, missing or wrong context is usually the cause. Here is how to debug:

### The Context Audit

```prompt
I'm getting poor results from this prompt:

[paste your current prompt]

The outputs I'm getting:
[describe what you're getting]

The outputs I want:
[describe what you need]

Please conduct a context audit:
1. What context is missing that would most change the output?
2. Is there any context in my prompt that might be misleading the model?
3. What assumptions is the model likely making to fill in missing context?
4. What's the single most important piece of context I could add?

Then rewrite my prompt with the necessary context added.
```

### Testing Context Additions

When you're not sure if a piece of context is helping or hurting:

```prompt
I want to test whether a piece of context improves or hurts my output quality.

My base prompt (no context in question): [paste prompt]
The context I'm considering adding: [describe the context]

Generate a response:
1. WITH this context added
2. WITHOUT this context (using only the base prompt)

After both responses, evaluate:
- Which version better serves my actual need?
- Does the context help the model be more specific, or does it add irrelevant noise?
- Should I include this context, exclude it, or rephrase it?
```

> 🎯 **Try This Now:** Take your most common professional AI task — the type of thing you ask AI to help with most often. Write a context template for your professional situation. Include: your role, your organization, your typical audience, your voice, your constraints, and what you don't want. Store this somewhere easily accessible. For the next week, paste it at the beginning of every related prompt and notice whether output quality improves.

---

## Key Takeaways

1. **Context is the most important prompt component** — adding relevant context improves output quality by 52% on average; missing or wrong context is the most common cause of poor outputs.

2. **The three levels of context** — situation (who you are, what's happening), audience (who receives this, what they need), and purpose (what success looks like) — all need to be present in professional prompts.

3. **Efficient context beats comprehensive context** — include what distinguishes your situation from the generic default; exclude anything that doesn't change what the best answer looks like.

4. **Audience context is the most underused dimension** — writing for a skeptical CFO vs. an excited engineering team should produce completely different outputs from the same information.

5. **Constraints improve outputs** — they force the AI away from generic patterns and toward specific, targeted responses appropriate for your situation.

6. **Negative constraints prevent predictable failures** — telling AI what NOT to do prevents the generic patterns that make outputs forgettable.

7. **Context templates compound over time** — once built, a professional context template eliminates repeated context-setting and maintains consistent quality across many prompts.

---

## Reflection Questions

1. Think about the last time you got a frustratingly generic response from an AI. What level of context was in your prompt — situation only? All three levels? What was missing that led to the generic response?

2. The module emphasizes audience context as the most underused dimension. For a communication or document you produce regularly, how specifically could you describe your audience to an AI — their expertise level, what they care about, their emotional state, their time constraints? How would that description change what the AI produces?

3. Negative constraints are described as often more valuable than positive ones because they prevent predictable failures. What are the 5 most common ways AI outputs fail for YOUR specific professional tasks? Write them as negative constraints you'd add to your prompts.

---

*Next Module: Iterative Refinement — building the feedback loops and iteration strategies that continuously improve your AI outputs.*
