# Module 1: Prompt Engineering Fundamentals

**Duration:** 25 minutes

---

## What You'll Learn

- Understand what prompt engineering is and why it's the most valuable AI skill to develop
- Learn how large language models (LLMs) interpret and process your inputs
- Apply the foundational principles of effective prompting
- Distinguish between good and bad prompts and know exactly why
- Set up the right environment for deliberate prompt practice

---

## 1.1 What Is Prompt Engineering?

Prompt engineering is the practice of designing inputs to AI systems to reliably produce high-quality, specific outputs.

It sounds technical, but in practice it's closer to clear communication than to programming. A prompt engineer understands how AI models interpret language and uses that understanding to get consistent, useful results.

**Why it matters more than most people think:**

The same AI model — GPT-4o, Claude, Gemini — will produce dramatically different outputs for differently framed inputs. The model hasn't changed. The skill of the person using it has.

In 2025, prompt engineering has become a core professional skill alongside writing, analysis, and communication. Roles that once listed "Excel proficiency" now list "AI fluency" — and prompt engineering is the practical foundation of that fluency.

---

## 1.2 How LLMs Process Your Prompts

To write good prompts, you need a basic mental model of how large language models work.

**What LLMs actually do:**
An LLM doesn't "think" or "understand" the way humans do. It predicts which tokens (roughly: words or word fragments) are most likely to follow your input, based on patterns learned from training data.

The implication: the model produces the most statistically probable response to your input — which means vague inputs produce generic, average-case outputs. Precise, specific inputs steer the model toward more specific, useful outputs.

**Key properties of LLMs relevant to prompting:**

**Context window:** The maximum amount of text the model can "see" at once (your prompt + its response). GPT-4o and Claude support 100,000–200,000 tokens. Use it — the more relevant context you provide, the better the output.

**Instruction following:** Modern LLMs are fine-tuned to follow instructions. The clearer and more specific your instructions, the more reliably the model follows them.

**Role/persona adoption:** LLMs can adopt described roles and adjust their vocabulary, tone, expertise, and approach accordingly. This is a reliable and powerful technique.

**Temperature (conceptually):** Models have a "temperature" setting that controls how predictable vs. creative they are. High-capability models like GPT-4o, Claude, and Gemini are calibrated to be useful — creative enough to be interesting, constrained enough to be reliable.

---

## 1.3 The Anatomy of an Effective Prompt

Every effective prompt has some combination of these elements:

**1. Role / Persona**
Who should the AI act as?
> *"Act as a senior product manager with 10 years of experience launching B2B SaaS products..."*

**2. Context**
What does the AI need to know about the situation?
> *"I'm writing a business case for a $500K investment in a new customer onboarding platform. My audience is our CFO and COO..."*

**3. Task**
What specifically should it do?
> *"Write an executive summary that makes the business case..."*

**4. Format**
How should the output be structured?
> *"Format: 3–4 paragraphs, under 300 words, lead with the ROI case, conclude with the recommended next step..."*

**5. Constraints**
What should it avoid or stay within?
> *"Do not use technical jargon. Do not start with background or history — lead with the recommendation..."*

**6. Examples (optional but powerful)**
Show it what good looks like
> *"Here's an example executive summary that represents the tone and structure I want: [paste example]..."*

Not every prompt needs all six elements. But prompts that underperform are almost always missing one of the first four.

---

## 1.4 Good Prompts vs. Bad Prompts

### Side-by-Side Comparison

**Scenario:** You want to improve the website copy for a software product.

**Bad prompt:**
> "Write better website copy for my software."

Problems: No context (what software?), no audience (who buys it?), no format (homepage? one section?), no constraints (length, tone?), no success criteria (what does "better" mean?).

**Good prompt:**
> Act as a B2B SaaS copywriter with expertise in conversion-focused web copy.
>
> My product is a project management tool for remote engineering teams. Our main differentiator is: AI-powered workload balancing that prevents burnout.
>
> Our current hero section headline is: "Manage Your Projects Better."
>
> Write 5 alternative headlines that: (1) lead with the specific benefit (preventing burnout / balancing workload), (2) speak to engineering team leads, (3) are under 12 words each, and (4) avoid generic SaaS clichés like "streamline," "empower," or "next-generation."

**The difference:** The bad prompt gets you generic average output. The good prompt gets you something usable.

---

## 1.5 The CRISP Framework for Prompt Design

A framework you can apply to any prompt:

**C — Clear task:** State exactly what you want done. Use specific action verbs: write, analyse, compare, generate, summarise, rewrite, critique, plan.

**R — Role:** Give the model a relevant persona or expertise level that shapes its approach.

**I — Information:** Provide all relevant context — who the audience is, what the situation is, any constraints that exist.

**S — Structure:** Specify the desired output format — length, sections, bullet points vs. prose, table vs. paragraph.

**P — Parameters:** What should it avoid? What constraints matter? What's the success criteria?

### Applying CRISP

**Without CRISP:**
> "Help me think through my pricing strategy."

**With CRISP:**
> **Role:** Act as a pricing strategy consultant with experience in subscription software businesses.
> **Task (Clear):** Analyse the pricing options I'm considering and give me a recommendation.
> **Information:** I'm launching a B2B SaaS product for accountants. We have 3 options: (1) $49/user/month, (2) $199/seat/month for teams of 5+, (3) usage-based at $0.10 per document processed. Early customers have processed 200–800 documents per month.
> **Structure:** Analyse each option, then give a clear recommendation with reasoning.
> **Parameters:** Focus on growth potential and enterprise appeal. Don't just list pros and cons — make a recommendation.

---

## 1.6 Setting Up for Deliberate Practice

Prompt engineering improves through practice, not just theory. Set yourself up for effective practice from day one.

**Your practice environment:**
1. Choose your primary AI: ChatGPT (GPT-4o), Claude, or Gemini
2. Set up Custom Instructions (ChatGPT) or a Project with your context
3. Keep a prompt journal — a simple document where you save prompts that worked and note what made them effective
4. For each task, first attempt a minimal prompt, then improve it based on the output, then note what you changed

**The improvement loop:**
1. Write a prompt
2. Evaluate the output: what's good, what's missing, what's wrong?
3. Identify which prompt element caused the problem
4. Revise that element specifically
5. Test the revised prompt
6. Repeat until the output is what you need
7. Save the successful prompt with a note on what made it work

---

## Key Takeaways

- Prompt engineering is the skill of designing inputs to reliably produce high-quality AI outputs
- LLMs predict probable responses to your input — **vague inputs → generic outputs; specific inputs → specific outputs**
- Every effective prompt has: **role, context, task, format, constraints** — missing any of these is usually why prompts underperform
- The **CRISP framework** (Clear, Role, Information, Structure, Parameters) gives you a checklist for any important prompt
- Improvement comes through the **practice loop:** write → evaluate → identify the gap → revise → test → save

---

## Quick Check

1. Why do vague prompts produce generic outputs? (Relate to how LLMs work)
2. What are the 5 elements of an effective prompt?
3. Apply CRISP to a task you'd actually want to do this week

---

*Next up: Module 2 — Advanced Prompt Techniques*
