# Module 4: Automation Workflows with AI

**Duration:** 45 minutes

---

## What You'll Learn

- Understand the automation stack available in 2025
- Build no-code AI automations using Zapier and Make.com
- Connect your tools into intelligent workflows that run without intervention
- Apply AI to common business automation use cases
- Evaluate which tasks are worth automating vs. which aren't

---

## 4.1 The Automation Opportunity

Automation is where AI productivity compounds most dramatically. Every manual, repetitive task you automate returns time every time it runs — forever.

**The distinction between AI assistance and AI automation:**
- **AI assistance:** You interact with AI to get a result (you write the prompt, review the output, take action)
- **AI automation:** You build a workflow once; AI runs it automatically when triggered, without your involvement

Both are valuable. But automation is where the leverage is extraordinary — a workflow built once can save hours every week for years.

---

## 4.2 The Automation Stack

### Tier 1 — No-Code Automation (Zapier, Make.com)

These tools connect your apps and add AI capabilities without writing code.

**Zapier:**
- Connects 6,000+ apps
- AI Actions: add ChatGPT-powered text generation and processing to any workflow
- Best for: simple 2–3 step automations between standard apps
- Cost: from $19.99/month; free tier for basic automations

**Make.com (formerly Integromat):**
- More powerful than Zapier for complex workflows
- Visual flowchart builder
- Better for: multi-step workflows with conditional logic, loops, data transformation
- Cost: from $9/month; generous free tier

### Tier 2 — AI-Native Automation

**n8n:** Open-source automation with native AI nodes. Self-hostable for full control. Excellent for technical users who want LLM integration in their workflows.

**Activepieces:** Open-source Zapier alternative with AI capabilities. Good privacy characteristics.

### Tier 3 — Platform-Native Automation

Built-in automation tools in major platforms:
- **Klaviyo Flows** — email automation with AI triggers
- **HubSpot Workflows** — CRM and marketing automation with AI scoring
- **Salesforce Flow** — enterprise workflow automation with Einstein AI
- **Monday.com Automations** — project management automation

---

## 4.3 Automation Use Cases by Category

### Content and Marketing

**Blog post to social media automation:**
Trigger: New blog post published
Steps: Extract key points → Generate 5 social media posts → Create image prompts → Draft email newsletter section → Add to scheduling queue

**Lead magnet delivery:**
Trigger: Form submission
Steps: Add to email list → Send welcome email → Notify sales team in Slack → Create CRM contact → Start nurture sequence

**Content performance reporting:**
Trigger: Weekly schedule
Steps: Pull data from Google Analytics + social platforms → ChatGPT generates performance summary → Send email report to stakeholders

### Customer Support

**Support ticket categorisation:**
Trigger: New support ticket received
Steps: ChatGPT classifies ticket (Technical Bug / Feature Request / Billing / General) → Routes to correct team → Drafts initial response suggestion → Updates ticket in CRM

**Review monitoring and response:**
Trigger: New review on Google/Trustpilot/Yelp
Steps: Sentiment analysis → If negative: alert manager and draft response → If positive: draft thank-you response for approval → If neutral: route to marketing for potential content

### Sales and CRM

**Lead enrichment:**
Trigger: New lead in CRM
Steps: Enrich with company data (Clearbit/Apollo) → Generate AI-written personalised outreach email draft → Assign to sales rep with context summary → Set follow-up reminder

**Meeting notes to CRM:**
Trigger: Meeting transcript from Otter.ai/Fireflies
Steps: ChatGPT extracts: deal stage, pain points, next steps, action items → Update CRM fields → Create follow-up tasks → Generate summary email for rep to send

### Internal Operations

**Invoice processing:**
Trigger: PDF invoice received via email
Steps: Extract key fields (vendor, amount, due date, invoice number) → Check against approved vendor list → Route for approval if new vendor → Create accounting entry → Log in spreadsheet

**Job application processing:**
Trigger: Application submitted
Steps: Parse resume and cover letter → Score against job requirements with AI → Route to hiring manager with summary → Send acknowledgment to applicant

---

## 4.4 Building Your First Automation with Zapier

### Step-by-Step: Contact Form → CRM + Personalised Email

**Objective:** When someone fills in your contact form, automatically create a CRM contact, generate a personalised intro email, and notify your team.

**Tools needed:** Typeform (or any form), ChatGPT (via Zapier's OpenAI action), HubSpot or Pipedrive, Gmail or Outlook, Slack

**Step 1 — Trigger:** 
Zapier: "New submission" on Typeform → Select your contact form

**Step 2 — Create CRM contact:**
Zapier action: Create contact in HubSpot → Map form fields (name, email, company, message) to CRM fields

**Step 3 — Generate personalised email:**
Zapier action: OpenAI → 
Prompt: `"Write a personalised response to this contact form submission. Name: [name], Company: [company], Message: [their message]. The email should: acknowledge their specific enquiry, briefly explain what we do, and suggest a 20-minute call to discuss further. Tone: professional and warm. Under 200 words. Sign off from [your name]."`

**Step 4 — Send the email:**
Zapier action: Gmail → Send email → From: your address → To: contact email → Body: [ChatGPT output]

**Step 5 — Slack notification:**
Zapier action: Slack → Post message in #new-leads → "New lead: [name] from [company] — [brief summary]"

**Total setup time:** 45–90 minutes. **Time saved per lead:** 15–20 minutes. **Break-even:** ~4–6 leads.

---

## 4.5 Building Complex Workflows with Make.com

Make.com uses a visual canvas where you see the entire workflow as a flowchart. It handles logic that Zapier can't do simply: loops, conditional branching, data transformation.

### Use Case: Meeting Transcript → Full CRM Update

**Trigger:** New completed meeting recording added to Otter.ai folder in Google Drive

**Modules:**
1. Google Drive — watch for new files in meeting transcripts folder
2. Otter.ai or Google Drive — get transcript text
3. OpenAI — send transcript with prompt: `"Extract from this sales meeting: (1) deal stage, (2) customer pain points mentioned, (3) objections raised, (4) commitments made by either party, (5) agreed next steps with dates, (6) any new stakeholders mentioned. Return as JSON."`
4. JSON Parser — parse the AI output
5. HubSpot — update deal record with extracted data
6. HubSpot — create tasks for each next step
7. Gmail — generate and send meeting follow-up email to customer
8. Slack — post update in sales channel

**This workflow replaces:** 20–30 minutes of manual CRM updating after every sales call.

---

## 4.6 Evaluating Automation Candidates

Not every task should be automated. Before building, apply this filter:

**Good automation candidates:**
- Happens repeatedly (at least weekly)
- Follows a consistent pattern each time
- Doesn't require significant judgment or creativity
- The cost of error is low (or errors are easy to catch)
- The time saving is meaningful relative to build time

**Poor automation candidates:**
- Happens rarely or irregularly
- Each instance is meaningfully different
- Requires human judgment to produce quality output
- Errors could be costly or embarrassing before a human reviews
- The build time exceeds 6–12 months of time saved

**The automation calculator:**
> I'm considering automating [task description]. It happens [X times per week/month] and currently takes [Y minutes each time].
> Should I automate this? Estimate: build time, maintenance time, time saved per year, quality risk, and error risk. Give me a go/no-go recommendation with reasoning.

---

## 4.7 AI Agent Workflows (Emerging in 2025)

**Agentic AI** goes beyond simple automations — an AI agent can take multi-step actions, make decisions, and adapt based on what it encounters.

**In 2025, early agentic tools include:**
- **ChatGPT Operator** — takes actions in web browsers on your behalf
- **Claude Computer Use** — similar capability; controls desktop applications
- **AutoGPT / OpenAgents** — autonomous agents that complete tasks involving multiple steps and tool use
- **Microsoft Copilot Agents** — enterprise agents that complete business processes end-to-end

**Current honest assessment:** Agentic AI is powerful but still early. It works well for bounded, well-defined tasks (fill in this form, collect this data from these websites) but requires human review for anything consequential.

**The practical approach for 2025:** Use agentic tools for low-stakes, well-defined tasks. Keep humans in the loop for anything where errors matter.

---

## Key Takeaways

- **Automation** is where AI productivity compounds most — a workflow built once saves time forever
- **Zapier** is best for simple, standard automations between popular apps; **Make.com** handles complex workflows with conditional logic
- The four highest-ROI automation categories: **content/marketing, customer support, sales/CRM, and internal operations**
- Build automations for tasks that are: **recurring, pattern-based, low-judgment, low error-cost**
- Use the **automation calculator** to validate ROI before investing build time
- **Agentic AI** (ChatGPT Operator, Claude Computer Use) is emerging in 2025 but still requires human oversight for consequential tasks

---

## Quick Check

1. What's the difference between AI assistance and AI automation?
2. What criteria make a task a good candidate for automation?
3. Describe the 5-step Zapier automation for contact form → CRM from this module.

---

*Next up: Module 5 — Integration Strategies and Scaling*
