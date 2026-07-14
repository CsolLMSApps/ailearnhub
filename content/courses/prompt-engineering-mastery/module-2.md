# Module 2: Advanced Prompt Techniques

**Duration:** 45 minutes

---

## What You'll Learn

- Master chain-of-thought, few-shot, and zero-shot prompting techniques
- Apply role prompting for expert-level outputs
- Use meta-prompting and prompt chaining for complex tasks
- Control output format precisely with structured prompting
- Apply prompt compression and efficiency techniques

---

## 2.1 Zero-Shot vs. Few-Shot Prompting

### Zero-Shot Prompting

Zero-shot means asking the model to perform a task without providing any examples. The model draws entirely on its training.

**When it works:** Simple, well-defined tasks where "good output" is obvious from context.

> Classify this customer review as Positive, Negative, or Neutral:
> "The product arrived on time but the packaging was damaged. The item itself works fine."

**Output:** Neutral (or Mixed Positive)

Zero-shot prompting is fast and effective for straightforward tasks. It fails when the output format or quality standard needs to be more precise than the model can infer.

### Few-Shot Prompting

Few-shot means providing 2–5 examples before your actual request. The model learns your preferred pattern from the examples.

**When to use:** When you need specific format, style, length, classification categories, or quality that the model can't infer from instructions alone.

**Example — Few-shot classification:**
> Classify the following customer reviews as either: Feature Request, Bug Report, or General Feedback.
>
> Review: "It would be great if I could export to PDF" → Feature Request
> Review: "The login screen crashes on iOS 18" → Bug Report
> Review: "Really enjoying the new dashboard" → General Feedback
> Review: "I can't seem to get the API integration working with Zapier" → ?

**Output:** Bug Report (or Feature Request depending on phrasing — the model uses your examples to decide the category that best fits)

### Building Your Few-Shot Examples

**Prompt for generating few-shot examples:**
> I want to create a few-shot prompt for the task of [task description]. 
> Generate 4 high-quality examples that represent the range of inputs I'd see and the correct outputs for each. Vary the examples to cover different cases the model might encounter.

---

## 2.2 Chain-of-Thought (CoT) Prompting

Chain-of-thought prompting asks the model to reason through a problem step by step before arriving at an answer. It dramatically improves performance on tasks involving logic, maths, planning, and multi-step reasoning.

### Explicit CoT

**Trigger phrase:** "Think through this step by step" or "Reason through this carefully before answering"

**Example — Without CoT:**
> If a train leaves London at 9:15am travelling at 100mph toward Edinburgh (400 miles), and another train leaves Edinburgh at 10:30am travelling at 120mph toward London, at what time and location do they meet?
> **Output:** [Often incorrect without reasoning]

**Example — With CoT:**
> Think through this step by step. If a train leaves London at 9:15am travelling at 100mph toward Edinburgh (400 miles)...
> **Output:** [Model shows working: calculates distance covered by first train before second departs, then relative speed of approach, then calculates meeting point accurately]

### Zero-Shot CoT

Simply adding "Let's think step by step" at the end of a prompt activates chain-of-thought reasoning without providing examples:
> [Complex problem or question] Let's think step by step.

### Structured CoT for Complex Analysis

For analysis tasks, give the model a reasoning structure to follow:
> Evaluate this business plan step by step:
> 1. First, identify the core value proposition and assess its clarity
> 2. Then, evaluate the target market and its size
> 3. Next, assess the competitive landscape and defensibility
> 4. Then, analyse the financial model and assumptions
> 5. Finally, give an overall assessment with your top 3 concerns and top 3 strengths

This structured CoT produces a thorough analysis rather than a surface-level summary.

---

## 2.3 Role Prompting — Advanced Applications

Basic role prompting is "act as a [role]." Advanced role prompting creates fully specified personas with expertise, constraints, and behavioural guidelines.

### Building Rich Role Descriptions

**Basic:** *"Act as a marketing expert."*

**Advanced:**
> You are Maya, a growth marketing consultant with 12 years of experience specialising in B2B SaaS companies with $1M–$20M ARR. You have deep expertise in demand generation, content-led growth, and marketing attribution. 
>
> Your approach: You always lead with strategy before tactics. You're direct and don't hedge excessively. You ask clarifying questions when you need more context before giving recommendations. You cite specific examples and data when you make claims. You flag when something is a strong recommendation vs. your personal preference.

This role creates a much more specific, useful, and consistent persona across a long conversation.

### Stacked Expertise

For tasks requiring multiple perspectives:
> Evaluate this product feature proposal from three perspectives:
>
> First, as a product manager focused on user experience and adoption
> Second, as a software architect focused on technical feasibility and scalability
> Third, as a CFO focused on revenue impact and resource allocation
>
> Clearly label each perspective. After all three, synthesise the key tensions and what you'd need to know to resolve them.

### The Devil's Advocate Role

One of the most useful roles for improving thinking:
> Act as a rigorous devil's advocate. I'm going to share a business decision I'm planning to make. Your job is to find the strongest possible case against this decision — the risks I might be underestimating, the assumptions I might be wrong about, and the scenarios where this goes badly. Don't steelman my position; steelman the opposition.

---

## 2.4 Meta-Prompting

Meta-prompting means using AI to write or improve your prompts. You describe the task you're trying to accomplish and ask the AI to design the best prompt for that task.

### Prompt Improvement

> Here's a prompt I wrote: [paste your prompt].
> This is what I want to accomplish: [describe the goal and what good output looks like].
> The output I got was: [describe the problem with the output].
> Improve my prompt to fix this specific problem. Explain what you changed and why.

### Prompt Generation

> I want to create a prompt for the following use case: [describe the task, audience, and desired output].
> Write the best prompt for this task. Then explain the choices you made and suggest 2 variations I could test.

### Prompt Critique

> Critique this prompt [paste prompt] based on: (1) clarity of the task, (2) quality of context, (3) output specification, (4) potential failure modes. Then suggest specific improvements.

---

## 2.5 Prompt Chaining for Complex Tasks

For complex, multi-stage tasks, a single prompt is rarely the best approach. Prompt chaining breaks the work into stages where the output of one prompt becomes the input of the next.

### The Chaining Pattern

**Task:** Write a well-researched, compelling case study

**Chain:**
1. **Prompt 1 — Gather structure:** *"What are the key sections a compelling B2B SaaS case study needs to include? Give me an outline structure with the purpose of each section."*
2. **Prompt 2 — Develop the story:** *"Using this outline [paste], help me extract the key story elements from these raw notes: [paste customer interview notes]."*
3. **Prompt 3 — Draft each section:** *"Write the 'Challenge' section of this case study based on these story elements: [paste]..."* (repeat for each section)
4. **Prompt 4 — Review and improve:** *"Here's the full draft case study: [paste]. Review it for: (1) narrative flow, (2) specificity of results, (3) clarity of the solution section, (4) strength of the CTA. Then suggest specific improvements."*
5. **Prompt 5 — Final polish:** *"Rewrite the intro paragraph and the key quote pull to be more compelling. The current versions are: [paste]."*

### When to Chain vs. Single Prompt

**Single prompt is fine for:**
- Tasks with clear, bounded outputs
- Tasks under a few hundred words of output
- Tasks without complex multi-stage reasoning

**Chain when:**
- The task has multiple distinct stages
- You want to review and direct at each stage
- The final output needs to be high quality (not just usable)
- The task involves combining multiple inputs or perspectives

---

## 2.6 Structured Output Prompting

For technical use cases, data processing, or integration with other tools, you need predictable output formats.

### JSON Output

> Extract the following information from this job posting [paste] and return it as valid JSON:
> {
>   "job_title": "",
>   "company_name": "",
>   "location": "",
>   "salary_range": "",
>   "required_skills": [],
>   "nice_to_have_skills": [],
>   "key_responsibilities": []
> }
> Return only the JSON. No additional text.

### Markdown Tables

> Compare these 3 project management approaches [describe them] across these dimensions: implementation complexity, team size suitability, cost, learning curve, and best use case.
> Format as a markdown table. Add a recommendation row at the bottom.

### Numbered Lists with Specific Structure

> List the top 10 risks in this project plan [paste]. For each risk:
> **Risk [N]: [Name]**
> - Likelihood: [High/Medium/Low]
> - Impact: [High/Medium/Low]
> - Current mitigation: [what's in place]
> - Recommended action: [what should be done]

---

## 2.7 Prompt Compression — Doing More with Less

As your prompts grow, they can become unwieldy. Compression techniques maintain quality while reducing length.

**Compress repeated context with a system message:**
If you're doing a series of similar tasks, set the shared context once at the top:
> Context for all following requests: [company name, audience, brand voice, goals, constraints].
> Unless I specify otherwise, apply this context to everything.

**Use shorthand you define:**
> For this conversation, "our users" refers to: [detailed description]. "Product" refers to: [description]. I'll use these terms throughout without re-explaining.

**Reference previous outputs:**
> Using the structure from your previous response, now apply it to [new topic].

---

## Key Takeaways

- **Few-shot prompting** (showing examples) dramatically improves output quality for pattern-sensitive tasks
- **Chain-of-thought** ("think step by step") is the single most reliable technique for improving reasoning quality
- **Advanced role prompting** builds fully specified personas — not just "act as an expert" but specific expertise, approach, and constraints
- **Meta-prompting** (asking AI to write or improve your prompts) is underused and highly effective
- **Prompt chaining** breaks complex tasks into reviewable stages — the best outputs usually come from multi-step chains
- **Structured output** prompting (JSON, markdown tables, specific formats) enables technical use cases and integration

---

## Quick Check

1. What's the difference between zero-shot and few-shot prompting? Give an example of when you'd use each.
2. What does chain-of-thought prompting do and how do you activate it?
3. Describe a task where prompt chaining would produce better results than a single prompt.

---

*Next up: Module 3 — Context and Constraints*
