# Module 2: Prompt Engineering Mastery
**Estimated Time: 35 minutes**

---

## What You'll Learn

- Understand why prompt quality determines output quality
- Apply a consistent framework to write prompts that work first time
- Use advanced techniques: role prompting, chain-of-thought, few-shot examples
- Recognise and fix the most common prompting mistakes
- Build prompts for any task — writing, analysis, code, creativity

---

## 2.1 Why Prompts Matter So Much

ChatGPT is capable of extraordinary outputs — but the output you get depends almost entirely on the input you give. Two people asking about the same topic can get wildly different results based purely on how they framed their question.

Think of it this way: ChatGPT has a vast range of possible responses to any input. Your prompt is like a dial that steers toward the output you actually want. A vague prompt points the dial at the average of everything — which is usually mediocre. A precise prompt narrows in on exactly what you need.

The good news: effective prompting isn't a talent. It's a skill — one you can learn in an afternoon and refine over weeks.

---

## 2.2 The CRAFT Framework

Use CRAFT as a checklist for any important prompt:

**C — Context:** Who are you? What's the situation?
**R — Role:** What role should ChatGPT play?
**A — Action:** What exactly do you want it to do?
**F — Format:** How should the output be structured?
**T — Tone:** What's the voice, style, or audience?

### CRAFT in Practice

**Without CRAFT:**
> Write something about employee feedback

**With CRAFT:**
> **Context:** I'm an HR manager at a 200-person tech company introducing a new 360-degree feedback process next quarter.
> **Role:** Act as an experienced HR communications specialist.
> **Action:** Write an internal announcement email introducing the new process, explaining how it works and addressing likely concerns employees will have.
> **Format:** Professional email format. Subject line + 3–4 paragraphs. Under 300 words.
> **Tone:** Warm, transparent, and reassuring — not corporate.

The difference in output quality between these two prompts is dramatic.

---

## 2.3 Role Prompting

Assigning ChatGPT a role is one of the highest-leverage techniques in prompting. It shifts the model's perspective, vocabulary, and approach to match the expertise you need.

**Basic role assignment:**
> Act as a [role] and help me with [task].

**Examples:**
> Act as a senior UX designer and critique the navigation structure I'm about to describe.

> You are an experienced secondary school science teacher. Explain photosynthesis to a Year 9 class that has already covered basic cell biology.

> Act as a devil's advocate. I'm going to share a business idea and I want you to find the most significant flaws in my reasoning.

**Stacked roles for complex tasks:**
> You are an experienced investment analyst writing for an audience of non-specialist retail investors. Use clear language, avoid jargon, and explain any technical terms you use.

The role shapes not just what ChatGPT says but how it prioritises and frames information.

---

## 2.4 Chain-of-Thought Prompting

For complex reasoning tasks — analysis, maths, logic, planning — asking ChatGPT to think step by step dramatically improves accuracy.

**Without chain-of-thought:**
> Should I quit my job and start a business?

**With chain-of-thought:**
> I'm considering leaving my job to start a business. Think through this step by step:
> 1. What financial runway do I need before making this move?
> 2. What are the early signs that a business idea is worth pursuing vs. not?
> 3. What are the most common reasons first-time founders fail in the first year?
> 4. Given all of this, what questions should I be able to answer before I resign?

Alternatively, use the trigger phrase:
> Think through this step by step before giving me your answer.

Or with the o3 model, chain-of-thought reasoning happens automatically — the model "thinks" before responding.

---

## 2.5 Few-Shot Prompting

Show ChatGPT examples of what you want and it will match the pattern.

**The technique:**
> Here are 3 examples of the style I want:
>
> Example 1: [paste example]
> Example 2: [paste example]
> Example 3: [paste example]
>
> Now write [your new task] in the same style.

**Use cases:**
- Matching your company's brand voice with examples of existing copy
- Replicating a specific writing style (author, journalist, genre)
- Generating consistent outputs across multiple items (product descriptions, social posts)
- Teaching ChatGPT a format you've invented

**Practical example:**
> Here are 2 LinkedIn posts from our company page that represent our tone:
>
> [Post 1]
> [Post 2]
>
> Write 3 new LinkedIn posts announcing our new AI-powered feature. Match the tone, length, and formatting of the examples above.

---

## 2.6 Constraints and Negative Instructions

Telling ChatGPT what NOT to do is just as important as telling it what to do.

**Examples:**
> Write a product description for this running shoe. Do NOT use clichés like "game-changing", "revolutionary", or "next-level". Do NOT start with a question.

> Explain machine learning to a senior executive. Do not use technical jargon. Do not assume any prior knowledge of statistics or programming. Keep it under 200 words.

> Summarise this article. Do not include the author's personal opinions — only facts and findings.

**Format constraints that consistently improve outputs:**
- `"Keep it under [X] words"`
- `"Use exactly [X] bullet points"`
- `"Format as a table with these columns: [A, B, C]"`
- `"Start with the conclusion, then the reasoning"`
- `"Give me only the [email/code/list] — no preamble"`

---

## 2.7 Iterative Prompting — The Conversation Is the Skill

Most people write one prompt and accept whatever they get. Power users treat it as a dialogue.

**The iterative loop:**
1. Send your initial prompt
2. Evaluate: What's good? What's missing? What's wrong?
3. Refine with a follow-up prompt
4. Repeat until the output is what you need

**Powerful follow-up prompts:**
- `"That's too long. Cut it by half, keeping only the most important points."`
- `"The tone feels too formal. Rewrite it to sound more conversational."`
- `"Give me 3 alternative versions of the opening paragraph."`
- `"You missed [specific thing]. Add that and revise."`
- `"Now make the argument stronger by adding specific data or examples."`
- `"What did you leave out that you think is worth including?"`

The last one is underrated. Asking ChatGPT what it omitted often surfaces valuable additions.

---

## 2.8 Prompt Templates for Common Tasks

Save these as your personal prompt templates:

**Summarisation:**
> Summarise [document/text] in [X] bullet points. Target audience: [who]. Focus on: [key aspects]. Exclude: [what to leave out].

**Comparison:**
> Compare [A] vs [B] across these dimensions: [list]. Present as a structured table. Conclude with a recommendation for [specific use case].

**Brainstorming:**
> Generate [X] ideas for [goal]. I'm a [role/context]. Requirements: [list]. Avoid: [what not to suggest].

**Email:**
> Write a [type] email to [recipient]. Context: [situation]. Goal: [what you want them to do or feel]. Tone: [warm/formal/direct]. Length: under [X] words.

**Analysis:**
> Analyse [topic/document/situation]. Identify: (1) key strengths, (2) key weaknesses, (3) opportunities, (4) risks. Be specific, not generic. Focus on [specific angle].

**Decision support:**
> I need to decide between [options]. My priorities are: [list]. My constraints are: [list]. Walk me through the decision using those priorities.

---

## 2.9 Common Prompting Mistakes

**Mistake 1: One-and-done**
The first response is a starting point. Always refine.

**Mistake 2: Vague verbs**
"Write something" → too open. "Draft", "summarise", "analyse", "compare", "critique", "rewrite", "generate" → specific.

**Mistake 3: No context**
ChatGPT doesn't know who you are, your audience, or your constraints unless you tell it. Context is free — include it liberally.

**Mistake 4: Asking multiple unrelated things**
One prompt, one task. If you need three things, ask in sequence — each builds on the last.

**Mistake 5: Accepting hallucinated facts**
ChatGPT can confidently state incorrect information. For any factual claim that matters, verify independently. Use Perplexity or ChatGPT Browse for fact-sensitive research.

**Mistake 6: Not specifying length or format**
Without format guidance, ChatGPT defaults to a medium-length prose response. If you need a table, bullet list, JSON, numbered steps, or a word count — say so.

---

## Key Takeaways

- The **CRAFT framework** (Context, Role, Action, Format, Tone) turns mediocre prompts into great ones
- **Role prompting** shifts ChatGPT's perspective and expertise to match your needs
- **Chain-of-thought** prompting dramatically improves complex reasoning and planning outputs
- **Few-shot examples** teach ChatGPT your preferred style, format, or voice
- **Constraints** (what not to do) are as important as instructions about what to do
- Treat prompting as a **conversation** — iterate until the output is actually what you need

---

## Quick Check

1. Write a CRAFT prompt for a task you do regularly at work
2. What trigger phrase can you add to any prompt to improve reasoning quality?
3. Name two constraints you should add when asking for a written output

---

*Next up: Module 3 — Business Communication Excellence*
