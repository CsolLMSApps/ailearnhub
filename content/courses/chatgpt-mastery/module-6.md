# Module 6: Advanced ChatGPT Techniques
**Estimated Time: 35 minutes**

---

## What You'll Learn

- Use system-level instructions and custom GPTs for specialised workflows
- Apply advanced reasoning with o3 and structured chain-of-thought
- Work with files, code, and data inside ChatGPT
- Use ChatGPT as a research and analysis engine
- Build multi-step workflows and agentic tasks
- Understand ChatGPT's operator and computer use capabilities

---

## 6.1 System Prompts and Custom Instructions at Depth

You've already set up basic Custom Instructions in Module 1. This section goes deeper: treating Custom Instructions like a system prompt — a persistent configuration layer that shapes every interaction.

### Advanced Custom Instructions

**Box 1 — Deep context:**
Instead of just stating your role, include:
- Your specific goals and what success looks like
- Context that's always relevant (industry, tools you use, level of expertise)
- Things ChatGPT consistently gets wrong that you want to prevent
- Specific terminology or conventions for your field

**Box 2 — Behavioural rules:**
> - Lead with the most important point. Never bury it in the middle.
> - If I ask for something and you're unsure of my intent, complete the task and then ask one clarifying question — don't ask before doing the work.
> - When giving advice, be direct. Don't say "it depends" without immediately explaining the most important factor it depends on.
> - If you think I'm approaching a problem the wrong way, tell me before answering my actual question.
> - Never add unnecessary caveats. If something is risky, say so once — don't repeat it.

### Custom GPTs

Custom GPTs are specialised versions of ChatGPT you configure for a specific purpose. You can build one in under 10 minutes, and OpenAI's GPT Store has thousands built by others.

**What you can configure:**
- A custom name, description, and profile image
- Specific instructions (similar to a detailed system prompt)
- Uploaded knowledge files (your documents, style guides, SOPs)
- Connected tools: web browsing, image generation, code interpreter, external APIs

**When to build a Custom GPT instead of using a prompt template:**
- When the task requires persistent knowledge files (product catalogue, brand guidelines, internal docs)
- When you want to share a configured AI with your team
- When the task is complex enough that a full system prompt in Custom Instructions would be too long

**Practical Custom GPT ideas:**
- **Brand Voice GPT:** Trained on your style guide and past content examples — generates on-brand copy instantly
- **Support GPT:** Trained on your FAQ and product documentation — drafts customer support replies
- **Proposal GPT:** Trained on your service descriptions and case studies — drafts client proposals
- **Research GPT:** With web browsing enabled — researches topics and returns structured summaries

---

## 6.2 Working with the o3 Reasoning Model

GPT-4o is excellent for most tasks. For complex reasoning, switch to o3.

**o3 excels at:**
- Multi-step mathematical calculations
- Complex logic problems and puzzles
- Long research analysis requiring synthesis across many factors
- Debugging complex code with non-obvious errors
- Planning tasks with many dependencies and constraints
- Evaluating arguments and identifying logical fallacies

**How o3 works differently:**
o3 "thinks" before responding — you'll see a thinking indicator. It takes longer but produces significantly more reliable reasoning. For problems where getting the right answer matters more than getting a fast answer, o3 is the right tool.

**Prompt guidance for o3:**
You don't need to ask it to "think step by step" — it does this automatically. Just describe the problem clearly and completely. Be more explicit about constraints and what "good" looks like.

**Example:**
> I need to decide between hiring a full-time employee ($85K salary + benefits) vs. contracting with an agency ($12K/month) for our content function. 
> Context: we're a 50-person SaaS company, our content needs are seasonal (heavy in Q1 and Q4), the full-time hire would need 3 months to onboard and start producing, we currently have one internal marketer.
> Constraints: budget for content capped at $150K this year; we need content running at full capacity by March.
> Analyse this decision fully — financial, operational, and strategic factors. Make a recommendation.

---

## 6.3 File Analysis and the Code Interpreter

ChatGPT Plus includes a Code Interpreter (also called "Advanced Data Analysis") that can read, process, and analyse files.

### What You Can Upload and Analyse

| File Type | What ChatGPT Can Do |
|---|---|
| CSV / Excel | Analyse data, create charts, run calculations, find trends |
| PDF | Extract text, summarise, answer questions |
| Word / PowerPoint | Summarise, edit, extract content |
| Images | Describe, analyse charts/graphs, read text in images |
| Code files | Review, debug, explain, refactor |
| Audio (with voice features) | Transcribe, summarise |

### Data Analysis Workflow

Upload a spreadsheet or CSV:
> Analyse this data. Give me: (1) summary statistics for each column, (2) key trends you notice, (3) any anomalies or outliers worth investigating, (4) your top 3 insights from a business perspective, (5) a chart showing [specific relationship].

**For sales data:**
> This is our sales data for the last 12 months. Which products are growing fastest? Which customers account for the top 20% of revenue? Which months show unusual patterns and why might that be?

**For survey results:**
> These are survey responses from our customers. Identify the most common themes in the open-text responses. Quantify the patterns. What are customers most satisfied with? What do they most want us to improve?

### PDF and Document Analysis

Upload a long report, contract, or document:
> Summarise this document in 5 bullets. What are the key recommendations or decisions? What should I read in full vs. what can I skim?

For multiple documents: upload all of them to a Project, then ask questions that draw across all of them.

---

## 6.4 Code Generation and Technical Tasks

You don't need to be a developer to use ChatGPT for code — and if you are a developer, AI dramatically accelerates your work.

### Non-Developer Code Use Cases

**Excel/Sheets formulas:**
> Write an Excel formula that: calculates the average of column C, but only for rows where column A says "UK" and column B is greater than $1,000.

**Data cleaning:**
> Write a simple Python script that reads a CSV file called "customers.csv", removes rows where the email column is blank, removes duplicate email addresses, and saves the result as "customers_clean.csv".

**Simple automations:**
> Write a Google Apps Script that automatically sends a reminder email to anyone in this spreadsheet [describe columns] whose "Follow-up Date" column is today.

### Developer Use Cases

For more complex tasks, use ChatGPT (or Claude — which often edges ahead for longer code tasks) with full context:
> I'm building [describe what and in what language/framework]. Here's the current code [paste]. I need to add [feature]. Requirements: [list]. Constraints: [performance, compatibility, style guide]. Write the implementation.

**Debugging:**
> Here's a function that should [do X] but instead [does Y]. Here's the error: [paste]. Here's the code: [paste]. What's the issue and how do I fix it?

**Code review:**
> Review this code for: bugs, security issues, performance problems, and clarity. Suggest specific improvements with examples.

---

## 6.5 Advanced Research Workflows

### Multi-Step Research

For serious research, use a structured multi-prompt approach:

**Prompt 1 — Landscape:**
> Give me a structured overview of [topic]. Include: key concepts, main players/schools of thought, recent developments (2024–2025), and the most important debates.

**Prompt 2 — Deep dive:**
> Now go deeper on [specific aspect I care most about]. What does the evidence say? What are the strongest counterarguments?

**Prompt 3 — Application:**
> Given all of this, what are the most important implications for [my specific context]? What would you recommend I do or prioritise?

**Prompt 4 — Gaps and next steps:**
> What did we not cover that I should research further? What are the most important things you're uncertain about in what you've told me?

### Using Gemini Deep Research as a Complement

For research tasks requiring current sources, consider combining tools:
- **Gemini Deep Research** (Google One AI Premium) — runs a 20–30 minute autonomous research session, browses dozens of sources, produces a structured report with citations
- **ChatGPT** — for analysis, synthesis, and applying the research to your specific situation

This combination is more powerful than either tool alone.

---

## 6.6 Agentic Tasks and Computer Use

In 2025, ChatGPT has begun supporting "agentic" tasks — multi-step sequences where the AI takes actions, not just generates text.

**ChatGPT Operator/Computer Use:**
Available with ChatGPT Pro, this feature lets ChatGPT control a web browser on your behalf — clicking, typing, navigating, and completing tasks across websites.

**Early use cases include:**
- Filling in web forms from structured data
- Extracting information from multiple websites into a document
- Booking appointments or making purchases on approved sites
- Navigating complex web interfaces to complete research

**Important caveats:**
- Review every action before authorising it in Operator mode
- Don't use for sensitive accounts (banking, healthcare) without understanding the security implications
- The technology is powerful but still early — verify outputs

---

## 6.7 Evaluating and Improving ChatGPT's Outputs

Advanced users don't just accept responses — they actively interrogate them.

**Quality checks:**
- `"Is there anything in your response that you're less confident about?"`
- `"What are the strongest counterarguments to what you just said?"`
- `"What assumptions are you making that might not apply to my situation?"`
- `"Rate the quality of your own response on a scale of 1–10 and explain why."`

**Improving outputs systematically:**
- `"This is good but too generic. Add 3 specific examples from the [industry/context] that make it concrete."`
- `"Rewrite this but with 30% fewer words. Don't cut any important ideas."`
- `"The structure is right but the writing is flat. Rewrite with more energy and conviction."`

---

## Key Takeaways

- **Custom GPTs** let you create specialised AI tools trained on your own knowledge and instructions
- The **o3 model** is significantly better than GPT-4o for complex reasoning, analysis, and planning
- **Code Interpreter** unlocks data analysis, file processing, and code generation from files you upload
- **Multi-step research** workflows produce dramatically better outputs than single prompts
- **Agentic features** (Operator, Computer Use) are beginning to let ChatGPT take actions, not just generate text
- Always **interrogate outputs** — ask ChatGPT about its confidence, assumptions, and what it omitted

---

## Quick Check

1. When should you use o3 instead of GPT-4o?
2. What are 3 things you can do with the Code Interpreter that don't require any coding knowledge?
3. How would you use ChatGPT to critically evaluate its own response?

---

*Next up: Module 7 — Beyond ChatGPT: Your AI Toolkit*
