# Module 5: Domain-Specific Prompting

**Duration:** 50 minutes

---

## What You'll Learn

- Apply specialised prompting techniques across key professional domains
- Build domain-specific prompt libraries for writing, analysis, coding, research, and education
- Understand how prompt requirements differ by domain
- Adapt general prompting techniques to specific use cases
- Use AI as a domain expert for tasks in unfamiliar fields

---

## 5.1 Why Domain Specificity Matters

General prompting principles work across all domains. But each domain has specific requirements, failure modes, and techniques that make a meaningful difference to output quality.

A prompt for writing a persuasive essay differs from a prompt for debugging code — not just in content, but in structure, the type of context required, the evaluation criteria for "good output," and the refinement approach.

This module gives you the domain-specific playbook for the most common professional use cases.

---

## 5.2 Writing and Content Creation

### Research and Ideation

**Audience-first ideation:**
> I create content for [audience description] about [topic area]. They're primarily [experienced/beginner] in this area. Their biggest struggles are: [list]. Their goals are: [list].
> Generate 15 specific content ideas that would be genuinely useful to this audience — not generic topics but specific angles, insights, or questions they'd actually search for.

**Contrarian angle generation:**
> What are the most commonly accepted "best practices" in [field]? For each, identify: (1) the conventional wisdom, (2) the strongest critique of that wisdom, (3) what a contrarian who has real evidence for their view would say.

### Writing Precise Instructions

**The voice calibration prompt:**
> Here are 3 samples of writing that represent the voice I want to match: [paste examples].
> Analyse what makes this voice distinctive — sentence length, vocabulary level, use of first person, punctuation style, whether it uses humour, how it handles evidence and claims.
> Write a brief voice guide I can paste into future prompts to help you match this voice.

**Structural control:**
> Write a [piece type] using this exact structure:
> 1. Open with a specific scenario that illustrates the problem (2–3 sentences, present tense)
> 2. State the problem explicitly (1 sentence)
> 3. Transition with "But there's a better way..." or equivalent
> 4. Explain the solution in 3 steps (one paragraph each)
> 5. Close with the long-term outcome (2 sentences)
> Do not deviate from this structure.

### Editing and Improvement

**Targeted editing instructions:**
> Edit this piece [paste] for the following specific issues only — don't change anything else:
> 1. Replace any passive voice with active voice
> 2. Cut the three weakest sentences (identify which ones and explain)
> 3. Strengthen the opening hook
> 4. Make the final paragraph more memorable — it currently ends weakly

---

## 5.3 Analysis and Research

### Structured Analysis Frameworks

**SWOT with teeth:**
> Conduct a SWOT analysis of [subject]. Rules: (1) every point must be specific and falsifiable, not generic platitudes; (2) strengths and opportunities should be expressed as competitive advantages, not features; (3) weaknesses and threats should be expressed as specific business risks; (4) assign a rough severity/importance rating to each point.

**Porter's Five Forces:**
> Analyse [industry/company] using Porter's Five Forces. For each force: rate its intensity (high/medium/low), explain the key factors driving that intensity, and identify how this affects competitive strategy for a new entrant.

**Pre-mortem analysis:**
> I'm planning to [decision/project]. 
> Conduct a pre-mortem: assume it's 18 months from now and this has failed significantly. 
> Walk through: (1) the 5 most likely causes of failure, ordered by probability; (2) for each cause, the early warning signs I should monitor; (3) which risks I should mitigate before starting vs. which I should monitor and react to.

### Research Synthesis

**Cross-source synthesis:**
> I've gathered information from multiple sources on [topic]. [Paste or describe the sources and their key points.]
> Synthesise this into: (1) the points where sources agree, (2) the points where they disagree and why, (3) what's missing that would help resolve the disagreements, (4) the most reliable conclusion I can draw given the available evidence.

**Finding the counterargument:**
> Here's the argument I'm planning to make: [paste your argument].
> What are the strongest counterarguments? Not straw men — actual well-reasoned objections that someone who knows this field would make. For each, tell me how I should respond in my writing.

---

## 5.4 Coding and Technical Tasks

### Requirements First

Before writing code, clarify requirements:
> I want to build [describe what it should do]. Before writing any code, ask me the questions you need answered to write this correctly — language, framework, performance requirements, edge cases, integration constraints.

### Code Generation with Context

**Complete context prompt:**
> Language: [Python/JavaScript/TypeScript/etc.]
> Framework: [if applicable]
> Context: This function will be part of [describe the larger system]
> Input: [describe expected inputs, types, edge cases]
> Output: [describe expected outputs]
> Constraints: [performance requirements, error handling, style guide requirements]
> 
> Write [description of function/component/module]. Include: inline comments for complex logic, docstring, and error handling for [specific edge cases].

### Code Review

> Review this code [paste] for:
> 1. Bugs or logic errors (be specific — identify the exact line and what's wrong)
> 2. Security vulnerabilities (SQL injection, XSS, authentication issues, etc.)
> 3. Performance issues (N+1 queries, unnecessary loops, memory issues)
> 4. Readability and maintainability (unclear variable names, missing comments, overly complex logic)
> 5. Missing edge case handling
>
> For each issue found: state the problem, its severity (critical/medium/low), and the specific fix.

### Debugging

> I'm getting this error [paste error and stack trace] in this code [paste relevant code].
> 
> Think through step by step: (1) what is this error telling us, (2) what are the 3 most likely root causes in order of probability, (3) what's your diagnosis of the actual cause in this specific code, (4) what's the fix, and (5) how should I test the fix?

### Architecture and Design

> I'm designing [system description]. Key requirements: [list]. Scale: [users, requests/second, data volume]. Tech stack: [describe].
>
> Propose an architecture. For each major component: what it does, why this approach over alternatives, and what the main risks of this design are. Flag any decisions where you'd want more information before committing.

---

## 5.5 Business Strategy and Decision-Making

### Strategic Planning

**Options analysis:**
> I'm facing a strategic decision: [describe the situation and options].
> Analyse each option through these lenses: (1) short-term impact (0–12 months), (2) long-term positioning (1–3 years), (3) resource requirements, (4) risk profile, (5) reversibility.
> For each option, give a verdict: recommended / not recommended / conditional (and the condition).

**Assumption surfacing:**
> Here's my plan: [describe].
> What are the key assumptions this plan depends on? For each assumption: (1) how critical is it (if this is wrong, does the plan fail?), (2) how confident should I be in it (is it well-evidenced or speculative?), (3) how could I test it before committing?

### Financial Analysis

**Business case structure:**
> Build a business case for [investment/decision]. Structure it as: (1) the problem being solved and its cost, (2) the proposed solution and its cost, (3) the expected return (hard and soft benefits), (4) the risk scenarios, (5) the recommended decision.
> I'll provide the specific numbers: [list what you have]. Use these numbers; flag where estimates are needed.

---

## 5.6 Education and Learning

### Explaining Complex Topics

**The Feynman prompting technique:**
> Explain [complex concept] to someone who has never encountered it before. Use an analogy from everyday life. Build up from the most basic version of the idea to the full concept. Check my understanding at the end with 2 questions.

**Layered explanations:**
> Explain [concept] at 3 levels:
> Level 1 (5-year-old): the simplest possible version using only everyday words
> Level 2 (smart non-expert): correct terminology introduced and explained
> Level 3 (practitioner): full technical accuracy with the nuances that experts care about

### Creating Learning Materials

**Quiz generation:**
> I've just learned about [topic]. Create a 10-question quiz to test my understanding. Include: 4 factual recall questions, 3 application questions (where I have to apply the concept to a scenario), 2 analysis questions (where I have to compare or evaluate), and 1 synthesis question (where I have to connect this to something else I've learned). After I answer, give me detailed feedback on each answer.

**Spaced repetition flashcards:**
> Create 20 flashcard pairs (front: question; back: answer) covering the key concepts in [topic]. Make the questions test understanding, not just memorisation. Vary the format: some definition cards, some application scenarios, some comparison cards.

---

## 5.7 Legal, Medical, and Financial Domains

A note on sensitive domains: AI can provide highly useful information in legal, medical, and financial domains — but with important caveats.

**What AI is excellent at:**
- Explaining concepts, terms, and processes in plain language
- Summarising documents (contracts, medical literature, financial reports)
- Generating questions to ask your professional
- Providing general frameworks for thinking about decisions

**What requires professional verification:**
- Any advice that is specific to your personal situation
- Jurisdictional or regulatory specifics that may vary
- Medical diagnoses, treatment decisions, or medication recommendations
- Investment advice based on your personal financial situation

**The research prompt for sensitive domains:**
> I want to understand [topic] in [legal/medical/financial] domain. I'm not looking for personal advice — I want to understand the general landscape well enough to have an informed conversation with [lawyer/doctor/financial adviser].
>
> Explain: (1) the key concepts I need to understand, (2) the questions I should be asking a professional, (3) the factors that typically determine how these situations resolve, (4) common misconceptions to avoid.

---

## 5.8 Building Your Domain-Specific Prompt Library

At this point in the course, you have the skills to build a professional-grade prompt library. Here's the structure:

**Organisation:**
Create a document (Notion, Obsidian, or Google Docs) with sections for each domain you work in. Within each section:

- **Purpose prompts:** For generating content, plans, or initial drafts
- **Analysis prompts:** For evaluating, critiquing, or researching
- **Editing prompts:** For improving existing work
- **Diagnostic prompts:** For identifying what's wrong and why

**For each saved prompt:**
- Give it a descriptive name
- Note what makes it work (the key elements)
- Note the failure mode it addresses
- Include [PLACEHOLDER] brackets for the parts you'll customise each use

**Review cycle:**
Every 2–3 months, review your prompt library. Remove prompts you never use. Improve prompts based on failures you've had. Add new prompts for new task types.

---

## Course Summary

You've completed Prompt Engineering Mastery. Here's what you've built:

| Module | Core Skill |
|---|---|
| 1: Prompt Engineering Fundamentals | CRISP framework, anatomy of prompts, good vs. bad |
| 2: Advanced Prompt Techniques | Few-shot, chain-of-thought, role prompting, meta-prompting, chaining |
| 3: Context and Constraints | Context types, strategic constraints, long-document prompting |
| 4: Iterative Refinement | Diagnosis, refinement toolkit, when to start over |
| 5: Domain-Specific Prompting | Writing, analysis, coding, strategy, education, sensitive domains |

---

## Key Takeaways

- Every domain has **specific prompting requirements** — the same general techniques apply but with domain-specific calibration
- For **writing**: voice calibration and structural control produce the most consistent quality
- For **analysis**: use structured frameworks (SWOT, pre-mortem, Porter's Five Forces) as scaffolding
- For **coding**: requirements-first prompting prevents the most common failures
- For **strategy**: assumption surfacing and pre-mortem analysis are the highest-value prompts
- Your **domain-specific prompt library** is one of the most valuable professional assets you can build — maintain and improve it continuously

---

## Congratulations!

You've completed **Prompt Engineering Mastery**. Take the final quiz to earn your certificate.

---

*Take the Course Final Quiz to earn your certificate.*
