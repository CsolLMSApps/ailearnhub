# Module 2: Advanced Prompt Techniques

**Duration:** 45 minutes

## Learning Objectives

By the end of this module, you will be able to:

- Apply chain-of-thought prompting to solve complex problems
- Distinguish between few-shot, zero-shot, and one-shot learning approaches
- Utilize role-based prompting to improve AI response quality
- Configure system prompts for consistent AI behavior
- Adjust temperature and other parameters to control output creativity

## Introduction

Basic prompting gets you started, but advanced techniques unlock the true power of AI language models. In this module, we'll explore sophisticated prompting strategies that professional AI practitioners use to achieve exceptional results. These techniques aren't just theoretical—they're battle-tested methods that consistently produce better outputs across various use cases.

The difference between a novice and expert prompt engineer often comes down to knowing when and how to apply these advanced techniques. Whether you're generating code, analyzing data, or creating content, mastering these methods will dramatically improve your results.

## Chain-of-Thought Prompting

Chain-of-thought (CoT) prompting encourages AI models to break down complex problems into logical steps, mimicking human reasoning processes. This technique significantly improves accuracy on tasks requiring multi-step reasoning.

### How It Works

Instead of asking for a direct answer, you explicitly request that the AI show its reasoning process. This forces the model to work through the problem systematically rather than jumping to conclusions.

**Basic prompt:**
```
What is 15% of $847?
```

**Chain-of-thought prompt:**
```
Calculate 15% of $847. Show your step-by-step reasoning.

Think through this carefully:
1. Convert percentage to decimal
2. Multiply by the amount
3. Show the final answer
```

### Real-World Applications

**Financial Analysis:**
```
Analyze whether this company is a good investment. Think step-by-step:
1. Evaluate their revenue growth (5-year trend)
2. Assess their debt-to-equity ratio
3. Compare to industry benchmarks
4. Consider market position and competitive advantages
5. Provide your final recommendation with reasoning

Company Data: [insert data]
```

**Code Debugging:**
```
This Python function is producing incorrect results. Debug it step-by-step:
1. Identify what the function is supposed to do
2. Trace through the execution with sample input
3. Identify where the logic breaks
4. Explain the fix needed
5. Provide corrected code

[paste code]
```

### When to Use CoT

- Complex mathematical or logical problems
- Multi-step analysis or decision-making
- Debugging code or troubleshooting issues
- Situations where you need to verify the AI's reasoning
- Teaching or educational contexts where process matters

## Few-Shot vs Zero-Shot vs One-Shot Learning

Understanding these learning paradigms helps you provide the right amount of context for your specific task.

### Zero-Shot Learning

The AI performs the task with no examples, relying solely on its training.

**Example:**
```
Translate this sentence to Spanish: "The meeting is scheduled for next Tuesday."
```

**When to use:** Simple, well-defined tasks that the AI clearly understands.

### One-Shot Learning

You provide a single example to establish the pattern or format.

**Example:**
```
Convert these product names to URL slugs (lowercase, hyphens for spaces):

Example:
Product: "Premium Coffee Beans" → Slug: "premium-coffee-beans"

Now convert:
Product: "Organic Green Tea Leaves" → Slug: ?
```

**When to use:** When format or style matters, but the task is straightforward.

### Few-Shot Learning

You provide multiple examples (typically 3-5) to establish a clear pattern.

**Example:**
```
Classify customer feedback as Positive, Negative, or Neutral:

"The product arrived quickly and works great!" → Positive
"Terrible quality, broke after one week." → Negative
"It's okay, does what it's supposed to." → Neutral
"Shipping was delayed but product is good." → ?
```

**When to use:** 
- Ambiguous or nuanced tasks
- Custom classification schemes
- Specific formatting requirements
- Creative tasks with particular style preferences

### Practical Comparison

**Task:** Extract key information from emails

**Zero-shot (unreliable):**
```
Extract important information from this email: [email text]
```

**Few-shot (much better):**
```
Extract sender, date, action items, and deadline from emails:

Email 1: "From: john@company.com, Sent Monday. Please review the Q3 report by Friday."
→ Sender: john@company.com, Date: Monday, Action: Review Q3 report, Deadline: Friday

Email 2: "Hi, it's Sarah. Can you send me last month's data? Need it before the meeting tomorrow."
→ Sender: Sarah, Date: Unknown, Action: Send last month's data, Deadline: Tomorrow

Now extract from: [your email]
```

## Role-Based Prompting

Assigning a specific role or persona to the AI dramatically improves response quality by providing context about perspective, expertise level, and communication style.

### The Power of Role Assignment

**Generic prompt:**
```
Explain blockchain technology.
```

**Role-based prompt:**
```
You are a senior software architect with 10 years of experience in distributed systems. Explain blockchain technology to a team of junior developers who understand basic programming but haven't worked with distributed systems before. Use practical examples and avoid unnecessary jargon.
```

### Effective Role Examples

**For Technical Writing:**
```
You are a technical documentation specialist who excels at making complex topics accessible. Your writing is clear, well-structured, and includes practical examples.
```

**For Business Analysis:**
```
You are a management consultant with an MBA and 15 years of experience advising Fortune 500 companies. You think strategically, consider multiple stakeholders, and provide actionable recommendations.
```

**For Creative Work:**
```
You are an award-winning copywriter known for witty, engaging headlines that drive click-through rates. You understand psychology and what makes people take action.
```

**For Education:**
```
You are a patient, encouraging tutor who excels at breaking down complex topics into digestible chunks. You use analogies, check for understanding, and adapt your teaching style to the student's needs.
```

### Role + Task Combination

The most powerful prompts combine role assignment with specific task instructions:

```
Role: You are a senior financial analyst at a top investment bank.

Context: Our client is considering acquiring a mid-sized tech company. They've provided financial statements for the past 3 years.

Task: Analyze these financials and create a memo for the CEO highlighting:
1. Key financial health indicators
2. Red flags or concerns
3. Valuation considerations
4. Strategic fit assessment
5. Recommendation (acquire/pass/negotiate)

Tone: Professional, data-driven, but accessible to non-finance executives.

[Attach financial data]
```

## System Prompts and Consistent Behavior

System prompts define the AI's overall behavior, personality, and constraints. They're particularly useful when you need consistent behavior across multiple interactions.

### What Are System Prompts?

System prompts (also called system messages) set the foundational rules and personality before any user interaction. They're like giving the AI a job description and company handbook.

### Components of Effective System Prompts

**1. Identity/Role:**
```
You are a helpful customer service representative for TechCorp, a B2B SaaS company.
```

**2. Capabilities and Limitations:**
```
You can: answer product questions, troubleshoot common issues, schedule callbacks.
You cannot: process refunds, access customer payment information, make sales commitments.
```

**3. Behavioral Guidelines:**
```
- Always be polite and professional
- If you don't know something, admit it and offer to connect them with someone who does
- Keep responses concise (under 150 words unless asked for detail)
- Use customer's name when known
```

**4. Output Format:**
```
Structure responses as:
1. Acknowledge their issue
2. Provide solution or next steps
3. Ask if they need anything else
```

### Real System Prompt Example

```
You are an AI code review assistant for a fintech startup. Your role is to review pull requests and provide constructive feedback.

Guidelines:
- Focus on security, performance, and maintainability
- Point out both issues and good practices
- Be specific: cite line numbers and suggest improvements
- Prioritize: Critical > Important > Nice-to-have
- Tone: Collaborative and educational, never condescending

When reviewing code:
1. Check for security vulnerabilities (especially auth and data handling)
2. Look for performance issues
3. Evaluate readability and maintainability
4. Verify test coverage
5. Ensure code follows team style guide

If you find critical security issues, always flag them prominently.
```

## Temperature and Parameter Control

Understanding model parameters helps you fine-tune output creativity and consistency.

### Temperature (0.0 - 2.0)

Temperature controls randomness in the AI's responses.

**Low Temperature (0.0 - 0.3): Deterministic, Focused**
- Same input → same output (mostly)
- Factual, precise responses
- Best for: Analysis, code generation, factual Q&A, classification

```
Temperature: 0.1
Task: Extract email addresses from this text.
```

**Medium Temperature (0.4 - 0.7): Balanced**
- Consistent but with variation
- Good balance of accuracy and creativity
- Best for: General conversation, content editing, explanations

```
Temperature: 0.5
Task: Write a product description for our new laptop model.
```

**High Temperature (0.8 - 2.0): Creative, Diverse**
- More randomness and creativity
- Same input → different outputs
- Best for: Creative writing, brainstorming, generating alternatives

```
Temperature: 0.9
Task: Generate 10 unique tagline ideas for our eco-friendly water bottle brand.
```

### Other Important Parameters

**Max Tokens/Length:**
- Controls response length
- Set appropriately for your use case
- Too low = cut-off responses
- Too high = unnecessary verbosity

**Top-p (Nucleus Sampling):**
- Alternative to temperature
- Controls diversity by considering top probability tokens
- Values: 0.1 (focused) to 1.0 (diverse)

**Frequency Penalty:**
- Reduces repetition of token sequences
- Useful for creative writing
- Range: 0.0 to 2.0

**Presence Penalty:**
- Encourages new topics/concepts
- Helps avoid redundancy
- Range: 0.0 to 2.0

### Practical Parameter Combinations

**Technical Documentation:**
```
Temperature: 0.2
Max tokens: 1000
Top-p: 0.95
Frequency penalty: 0.1
```

**Creative Marketing Copy:**
```
Temperature: 0.8
Max tokens: 500
Top-p: 0.9
Frequency penalty: 0.3
Presence penalty: 0.3
```

**Code Generation:**
```
Temperature: 0.1
Max tokens: 2000
Top-p: 0.95
Frequency penalty: 0.0
```

## Combining Advanced Techniques

The real power comes from combining multiple techniques:

**Example: Complex Analysis Task**
```
System: You are a senior data scientist with expertise in e-commerce analytics.

Role: As a data analyst presenting to the VP of Marketing

Task: Using chain-of-thought reasoning, analyze this sales data:
1. Identify trends
2. Spot anomalies
3. Suggest actionable improvements

Format: Provide your analysis in three sections (Trends, Concerns, Recommendations).

Few-shot examples:
[Include 1-2 example analyses]

Temperature: 0.3 (we want consistent, factual analysis)

Data: [attach data]
```

## Action Items

Practice these advanced techniques:

1. **This Week:** Take three of your existing prompts and add chain-of-thought reasoning. Compare the results.

2. **Experiment:** Try the same creative task at three different temperatures (0.2, 0.7, 1.2). Note the differences.

3. **Role Practice:** Create three role-based prompts for tasks you do regularly (e.g., writing emails, analyzing data, reviewing documents).

4. **Build a System Prompt:** Create a system prompt for an AI assistant that matches your work style and needs. Test it on various tasks.

5. **Few-Shot Library:** Start collecting examples of your best outputs. Use them as few-shot examples for future prompts.

## Key Takeaways

- **Chain-of-thought prompting** dramatically improves accuracy on complex reasoning tasks by making the AI show its work
- **Few-shot learning** outperforms zero-shot for nuanced or ambiguous tasks—invest time in creating good examples
- **Role-based prompting** provides crucial context that shapes response quality, tone, and perspective
- **System prompts** ensure consistent behavior across interactions—essential for production applications
- **Temperature control** is your creativity dial: low for facts, high for creative exploration
- **Combining techniques** multiplicatively improves results—don't just use one approach

## Resources and Next Steps

**Practice Tools:**
- ChatGPT: Test temperature settings in custom instructions
- Claude: Experiment with system prompts in Projects
- API Playgrounds: Fine-tune parameters and see immediate results

**Next Module Preview:**
In Module 3, we'll dive deep into context and constraints—learning how to provide the right information and boundaries to get exactly what you need from AI systems.

**Advanced Reading:**
- Research papers on chain-of-thought prompting
- API documentation for your preferred AI platform
- Community prompt libraries and templates
