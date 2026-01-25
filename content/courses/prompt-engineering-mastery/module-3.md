# Module 3: Context and Constraints

**Duration:** 40 minutes

## Learning Objectives

By the end of this module, you will be able to:

- Provide optimal context to AI systems for accurate, relevant responses
- Set clear constraints that guide output format, length, and style
- Define output formats that match your workflow requirements
- Handle ambiguous situations with strategic prompt design
- Distinguish between good and bad context in real-world scenarios

## Introduction

Context is the foundation of effective AI communication. Even the most sophisticated prompting techniques fail without proper context. Similarly, constraints transform vague outputs into precisely what you need.

Think of context as giving the AI a map—without it, even the best navigator can't reach the destination. Constraints are the guardrails that keep outputs on track, ensuring you get usable results every time.

This module will teach you how to provide just enough context (not too little, not too much) and set constraints that produce consistent, high-quality outputs.

## The Context Framework

### What Is Effective Context?

Context is any information that helps the AI understand:
- **What** you're trying to accomplish
- **Why** it matters
- **Who** the audience is
- **Where** this fits in a larger workflow
- **When** timing or deadlines matter

### The Five Layers of Context

**Layer 1: Situational Context**
Where are you and what's happening?

```
Poor: "Write a report about Q3 sales."

Better: "I'm preparing for our Monday board meeting. Our Q3 sales came in 15% below projections, and I need to present a clear explanation to investors who are already concerned about market conditions."
```

**Layer 2: Audience Context**
Who will receive this output?

```
Poor: "Explain our new pricing model."

Better: "Explain our new pricing model to our sales team. They're experienced sellers but don't have finance backgrounds. They need to confidently present this to customers who may push back on the 20% price increase."
```

**Layer 3: Purpose Context**
What decision or action will this enable?

```
Poor: "Analyze this customer feedback."

Better: "Analyze this customer feedback to help our product team prioritize features for the next sprint. We need to decide between three possible directions, and user pain points should guide us."
```

**Layer 4: Format Context**
How will this be used?

```
Poor: "Summarize this research paper."

Better: "Summarize this research paper for my literature review section. I need: (1) key findings in 2-3 sentences, (2) methodology in 1 sentence, (3) limitations, and (4) how it relates to my hypothesis about user retention."
```

**Layer 5: Background Context**
What relevant history or prior knowledge applies?

```
Poor: "Create a marketing campaign for our new product."

Better: "Create a marketing campaign for our new product launch. Context: Our previous launches underperformed because we focused too heavily on features instead of benefits. Our target customer is busy professionals who value time-saving. Our main competitor just launched a similar product but at a higher price point."
```

### Context Optimization: Not Too Little, Not Too Much

**Too Little Context:**
```
"Write a blog post about productivity."
```
*Problem: Vague topic, unknown audience, no angle, no constraints.*

**Too Much Context:**
```
"Write a blog post about productivity. I'm a productivity coach with 10 years of experience. I run a website with 50,000 monthly visitors. My audience is mostly millennials working in tech. I've written 487 blog posts already. My last post got 2,342 views. I prefer using personal anecdotes. My writing style is conversational. I usually write between 1,200 and 1,800 words. I like using bullet points. I avoid jargon. I've been thinking about this topic for three weeks..."
```
*Problem: Information overload, much of it irrelevant to the task.*

**Optimal Context:**
```
"Write a 1,500-word blog post about productivity for tech professionals struggling with remote work distractions. Tone: Conversational but authoritative. Structure: Start with a relatable problem, provide 5 specific strategies, include one personal anecdote. Goal: Drive newsletter signups from readers who want more deep-dive productivity content."
```
*Just right: Audience, angle, structure, tone, length, and goal are clear.*

## Setting Effective Constraints

Constraints aren't limitations—they're guides that focus the AI on producing exactly what you need.

### Types of Constraints

**1. Length Constraints**

Be specific about desired length:

```
Vague: "Keep it short."

Specific: "Limit your response to 150 words maximum."

Even better: "Write exactly 3 paragraphs, each 50-75 words."
```

**2. Format Constraints**

Define the structure you need:

```
"Provide your analysis in this format:
## Summary (2-3 sentences)
## Key Findings (3-5 bullet points)
## Recommendations (numbered list, 1-3 items)
## Next Steps (bullet points)"
```

**3. Style Constraints**

Specify tone, voice, and linguistic choices:

```
"Write in a professional but warm tone. Use 'we' and 'our' (inclusive). Avoid: jargon, buzzwords like 'synergy' or 'leverage', corporate clichés. Prefer: concrete examples, active voice, specific numbers over vague terms."
```

**4. Scope Constraints**

Limit what should and shouldn't be included:

```
"Focus exclusively on:
- Financial implications
- Timeline to implementation
- Required resources

Do NOT include:
- Technical implementation details
- Competitive analysis
- Historical context"
```

**5. Behavioral Constraints**

Guide how the AI should approach the task:

```
"If you're uncertain about any data point, explicitly state your uncertainty rather than guessing. If you need more information to provide a complete answer, list exactly what additional information you need and why."
```

### Constraint Combinations

The most effective prompts use multiple constraint types:

```
"Create a product comparison for our sales team:

Length: Maximum 1 page (300 words)

Format:
- Side-by-side table with 5-7 feature rows
- 2-3 sentence summary of key differences below table
- One "best use case" for each product

Tone: Professional but accessible (B2B sales context)

Scope: Focus only on features that impact buying decisions. Exclude technical specs that customers don't care about.

Behavior: If features are similar, say "comparable" rather than forcing differences. Highlight genuine differentiators."
```

## Defining Output Formats

Output format specifications eliminate back-and-forth revisions and ensure immediate usability.

### Structured Data Formats

**JSON Output:**
```
"Extract company information and return ONLY valid JSON (no other text):

{
  "company_name": "string",
  "industry": "string",
  "employee_count": "number or 'unknown'",
  "headquarters": "string",
  "key_products": ["array", "of", "strings"]
}

Text to analyze: [company description]"
```

**CSV Format:**
```
"Convert this unstructured data to CSV format with these exact columns: Name, Email, Company, Role, Engagement_Score (1-5)

Return ONLY the CSV data, no other text or explanation."
```

### Document Formats

**Email Format:**
```
"Write this as a professional email following this template:

Subject: [Compelling, specific subject line]

Hi [Name],

[Opening sentence that references previous conversation or provides context]

[2-3 sentences explaining the situation or request]

[Specific ask or next step, with clear deadline if applicable]

[Closing sentence]

Best regards,
[Your name]"
```

**Report Format:**
```
"Structure as an executive report:

Title Page:
- Title
- Date
- Author
- 1-sentence purpose

Executive Summary: 
- 3-4 paragraphs, max 250 words
- Include key recommendation in bold

Detailed Analysis:
- Section 1: Current State (300 words)
- Section 2: Key Issues (300 words)  
- Section 3: Recommendations (400 words)

Appendix:
- Data tables
- Methodology notes"
```

### Code Output Formats

```
"Generate Python code with these specifications:

- Include docstrings for all functions
- Type hints for parameters and returns
- Minimum 80% test coverage (provide test code)
- Follow PEP 8 style guidelines
- Add inline comments for complex logic
- Include example usage at bottom

Return code in this format:
1. Main implementation
2. Test code (using pytest)
3. Example usage with sample data"
```

## Handling Ambiguity

Real-world problems are often ambiguous. Strategic prompt design helps navigate uncertainty.

### Strategy 1: Explicit Uncertainty Handling

```
"Analyze this market data and provide recommendations.

If data is incomplete or ambiguous:
1. State what's unclear
2. Make reasonable assumptions (explicitly listed)
3. Provide conditional recommendations based on different scenarios
4. Indicate confidence levels (high/medium/low) for each recommendation"
```

### Strategy 2: Constrained Options

```
"Our team is debating three approaches to this problem. For each approach, provide:
- Pros (3-5 bullets)
- Cons (3-5 bullets)  
- Best use case (2 sentences)
- Risk level (Low/Medium/High with brief explanation)

Do not recommend one over the others—provide objective analysis so our team can decide."
```

### Strategy 3: Progressive Clarification

```
"I need help designing a pricing strategy, but I'm not sure what information you need.

First, ask me 3-5 specific questions that would help you provide the best recommendations. After I answer those, provide your analysis."
```

### Strategy 4: Multiple Perspectives

```
"Analyze this business decision from three perspectives:

1. Finance Perspective: Focus on costs, revenue, ROI
2. Customer Perspective: Focus on user experience, satisfaction, retention
3. Engineering Perspective: Focus on feasibility, technical debt, scalability

For each perspective, identify the key concerns and what factors would make this decision good or bad from that viewpoint."
```

## Examples: Good Context vs. Bad Context

### Example 1: Content Creation

**❌ Bad Context:**
```
"Write something about email marketing."
```
*Problems: No audience, no angle, no format, no purpose.*

**✅ Good Context:**
```
"Write a 800-word blog post for small business owners who want to start email marketing but feel overwhelmed by the technical aspects.

Angle: Focus on simple, actionable first steps that require no coding or expensive tools.

Tone: Encouraging and practical (not condescending)

Structure:
- Hook: Common fear/objection about email marketing
- 5 simple steps (each 100-150 words)
- Each step includes: what to do, why it matters, one specific tool recommendation
- End with next action

Goal: Reader should feel capable of sending their first campaign this week."
```

### Example 2: Data Analysis

**❌ Bad Context:**
```
"Look at this sales data and tell me what you see."
```
*Problems: No specific question, no decision to make, no context about business goals.*

**✅ Good Context:**
```
"Analyze our Q3 sales data to help us decide whether to continue our new discount strategy.

Background: We launched 15% discounts in August (previously no discounts). We're debating whether to continue it in Q4.

Specific questions:
1. Did discounts increase total revenue or just margin compression?
2. Did we attract new customers or just discount existing purchases?
3. What's the customer lifetime value of discount vs. full-price customers?

Format: Provide clear answer to each question with supporting data, then a final recommendation (continue/modify/discontinue) with reasoning.

Data: [attached spreadsheet]"
```

### Example 3: Technical Writing

**❌ Bad Context:**
```
"Document this API endpoint."
```
*Problems: No audience definition, no format spec, no examples.*

**✅ Good Context:**
```
"Write API documentation for our user authentication endpoint. Audience is external developers (intermediate skill level) integrating our service.

Include:
- Endpoint URL and method
- Required headers with authentication
- Request body schema (JSON) with field types and validation rules
- Response codes (200, 400, 401, 500) with example responses
- 2 code examples (JavaScript and Python)
- Common errors and troubleshooting (3-5 scenarios)

Tone: Clear and professional. Assume developer has integrated APIs before but is new to our service.

Format: Follow the style of our existing docs at docs.example.com"
```

## Practical Context Checklist

Before sending a prompt, verify you've included:

- [ ] **Task Goal:** What you want to accomplish
- [ ] **Audience:** Who will use/read this
- [ ] **Format:** Structure and length requirements
- [ ] **Tone/Style:** How it should sound
- [ ] **Constraints:** What to include/exclude
- [ ] **Context:** Relevant background information
- [ ] **Success Criteria:** How you'll know it's good

If any are missing, add them or explicitly state "no constraint" if truly open-ended.

## Action Items

1. **Audit Your Prompts:** Take 5 prompts you use regularly. Use the context checklist above. Which context elements are you missing?

2. **Context Experiment:** Take one vague prompt you've used. Rewrite it with rich context across all five layers. Compare outputs.

3. **Format Library:** Create a personal library of format templates for common tasks (emails, reports, analyses, etc.). 

4. **Constraint Practice:** Write 3 prompts for the same task, each with different constraints. Notice how constraints shape outputs.

5. **Ambiguity Handling:** Identify an ambiguous task in your work. Write a prompt that explicitly addresses the ambiguity using one of the four strategies.

## Key Takeaways

- **Context quality** directly impacts output quality—invest time in providing the right context
- **Five layers of context** (situational, audience, purpose, format, background) create comprehensive understanding
- **Optimal context** provides just enough information—too little causes poor outputs, too much creates confusion
- **Constraints aren't limitations**—they're precise instructions that focus AI on exactly what you need
- **Format specifications** eliminate revision cycles and ensure immediate usability
- **Handle ambiguity explicitly** rather than hoping the AI guesses correctly
- **The context checklist** ensures you're providing everything needed for quality outputs

## Resources and Next Steps

**Templates:**
- Context Checklist (printable PDF)
- Common Format Templates (email, report, analysis, etc.)
- Constraint Combinations Guide

**Next Module Preview:**
In Module 4, we'll explore iterative refinement—the process of taking good outputs and making them great through systematic improvement.

**Practice Playground:**
- Try the same task with minimal vs. rich context
- Experiment with different constraint combinations
- Build your personal prompt template library
