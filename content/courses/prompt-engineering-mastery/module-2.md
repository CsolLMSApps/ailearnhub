# Module 2: Advanced Prompt Techniques

**Course:** Prompt Engineering Mastery
**Estimated Time:** 65 minutes
**Difficulty:** 🔴 Advanced

---

## What You'll Learn

- Chain-of-thought and self-consistency prompting for complex reasoning tasks
- Meta-prompting: using AI to improve your own prompts
- Tree-of-thought prompting for multi-path problem solving
- Constitutional prompting: building quality constraints directly into prompts
- Prompt decomposition: breaking complex problems into precise sub-prompts
- Structured output prompting for reliable, parseable AI responses

---

## Why This Matters Today

> Research from **DeepMind and Stanford HAI-today** has documented that chain-of-thought prompting improves performance on complex reasoning tasks by 40-60% compared to direct answer prompting. These gains apply to all frontier models and are available to any user who knows the technique. The gap between users who know advanced prompting techniques and those who don't is widening as AI becomes more capable — better models benefit more from better prompting.

The techniques in this module are what separate professionals who use AI productively from researchers and power users who extract the maximum possible value from the same models. Most of these techniques were documented in academic AI research before becoming widely practiced. This module translates that research into professional practice.

---

## Section 1: Chain-of-Thought Prompting

### What It Is and Why It Works

Chain-of-thought (CoT) prompting asks the model to show its reasoning process step by step before arriving at a conclusion. This technique significantly improves output quality for analytical, logical, and mathematical tasks.

**Why it works at a technical level:**
LLMs generate text sequentially. When forced to reason step-by-step before concluding, each step becomes part of the context for subsequent steps — creating a reasoning chain that's more likely to arrive at a correct conclusion than a single-step prediction jump.

Think of the difference between:
- Mental math (fast, error-prone for complex problems)
- Written-out calculation (slower, but each step is verifiable and informed by previous steps)

CoT prompting triggers the "written-out calculation" mode.

### Zero-Shot CoT

The simplest form — just add "Let's think step by step" or similar phrasing:

```prompt
I need to decide whether to hire a full-time employee or contract with 
a freelancer for a 6-month project.

Details:
- Project: Building a new company website
- Budget: $45,000 total for this project
- Employee cost: $90,000/year salary + 30% benefits = $117,000/year
- Freelancer options: $75-120/hour, estimated 300-400 hours for this project
- Current team workload: At capacity
- Future need: May have ongoing web work after this project (uncertain)

Let's think through this step by step before reaching a conclusion:
Step 1: Calculate the financial comparison at different freelancer rate scenarios
Step 2: Consider the non-financial factors (team capacity, continuity, flexibility)
Step 3: Evaluate the uncertainty about future web work needs
Step 4: Weigh the decision factors against each other
Step 5: Arrive at a recommendation with confidence level and key assumptions
```

### Few-Shot CoT

Provide examples of the reasoning process before asking the model to apply it:

```prompt
I need you to help me evaluate business decisions using financial reasoning.

Here is an example of how I want you to reason through financial decisions:

EXAMPLE DECISION: Should we upgrade our server infrastructure?
My reasoning: 
First, I'll calculate the current cost: $2,000/month = $24,000/year.
Then the upgrade cost: $150,000 one-time + $500/month ongoing = $156,000/year 1, $6,000/year after.
The benefit: The upgrade would eliminate 4 hours/month of downtime that costs approximately $8,000/incident based on lost sales and engineer time. That's $384,000/year in avoided cost.
Break-even: The upgrade pays for itself in roughly 5 months even including the ongoing cost.
Accounting for risk: Downtime incidents are uncertain. Even at 50% of projected downtime reduction, ROI is still strong.
My conclusion: The upgrade is financially justified with high confidence.

Now apply this same reasoning approach to my decision: [describe your decision]
```

> 💡 **Pro Tip:** CoT is most valuable for tasks that require multiple logical steps, tradeoff analysis, or mathematical reasoning. For simple factual questions or creative tasks, CoT adds length without adding value. Save it for analytical work.

---

## Section 2: Self-Consistency Prompting

### The Problem Self-Consistency Solves

For complex reasoning problems, a single chain of thought can still lead to the wrong answer. Self-consistency addresses this by generating multiple independent reasoning chains and selecting the most consistent conclusion.

**The technique:**
1. Run the same problem through multiple reasoning chains (either in one prompt or separately)
2. Identify which conclusion appears most frequently across the chains
3. Use the majority answer and investigate why alternative chains reached different conclusions

```prompt
I want to use self-consistency to reason through an important decision.

Problem: [describe your decision or problem]

Please reason through this problem THREE TIMES using different starting assumptions or 
analytical frameworks. After all three reasoning chains, identify which conclusion 
appears most consistently and explain why the dissenting chains reached different conclusions.

REASONING CHAIN 1: Use a financial/quantitative lens — what does the math say?

REASONING CHAIN 2: Use a strategic/positioning lens — what does this mean for 
our competitive position and long-term goals?

REASONING CHAIN 3: Use a risk/downside lens — what could go wrong with each option, 
and which failure modes are most catastrophic?

CONSISTENCY ANALYSIS: 
Which conclusion appears in 2 or 3 of the chains? 
What does the dissenting chain reveal that the majority view might be missing?
What should I do with this information?
```

### When to Use Self-Consistency

Self-consistency is most valuable for:
- High-stakes decisions where a wrong conclusion is costly
- Problems where your intuition conflicts with data
- Strategic decisions with long-term, hard-to-reverse consequences
- Complex analytical problems where multiple approaches are valid

---

## Section 3: Tree of Thought Prompting

### The Concept

Tree of Thought (ToT) prompting extends chain-of-thought by exploring multiple branches of reasoning at once — like a decision tree rather than a single chain. This is particularly powerful for creative problem-solving and strategy development.

```prompt
I want to use tree-of-thought reasoning to find the best solution to this problem:

Problem: [describe your problem]

BRANCH 1 — Conventional approach:
What does the standard, proven solution look like?
[Explore this branch for 100-150 words]
Assessment: What are the limits of this approach?

BRANCH 2 — Resource-constrained approach:
What would we do if we had half the time and budget?
[Explore this branch for 100-150 words]
Assessment: What does this reveal about what's truly essential?

BRANCH 3 — Ambitious/innovative approach:
What would we do if we assumed the constraints don't exist?
[Explore this branch for 100-150 words]
Assessment: What's genuinely novel here and what's just expensive?

BRANCH 4 — Diagonal approach (combining elements):
Now combine the most promising element from each branch into a hybrid solution.
[Synthesize into a coherent approach]

FINAL EVALUATION:
Which branch or combination produces the best outcome for my specific situation 
and constraints?
```

> 📖 **Real Example:** A product strategy team at a fintech startup used tree-of-thought prompting to design their new user onboarding flow. Rather than picking one approach to build, they explored three branches (guided wizard, self-directed exploration, social proof-led) before synthesizing a hybrid. The AI's synthesis combined the structure of the wizard, the agency of self-directed, and the credibility of social proof into a coherent approach. A/B testing showed the synthesized approach outperformed any single branch alone by 34% on day-7 retention.

---

## Section 4: Meta-Prompting — Using AI to Improve Your Prompts

### What Meta-Prompting Is

Meta-prompting means using AI to help you write better prompts. Instead of writing a prompt from scratch, you describe what you're trying to accomplish and ask the AI to generate an optimal prompt — then use that prompt.

This is a power technique because AI has seen millions of high-quality prompts and understands what structures work for different tasks.

```prompt
I want to [describe what you're trying to accomplish].

My current prompt approach for this is: 
[paste your current prompt or describe your approach]

The problems I'm running into:
[describe what's not working — wrong tone, wrong length, wrong content, etc.]

Please:
1. Diagnose why my current approach is producing poor results
2. Write an improved prompt that will produce better results for this task
3. Explain what you changed and why each change should improve the output
4. Identify what information I need to fill in before using this prompt 
   (the [PLACEHOLDER] variables)
```

### The Prompt Improvement Loop

Meta-prompting works best as an iterative loop:

**Round 1:** Describe the task and your current (poor) prompt
**Round 2:** AI generates an improved prompt
**Round 3:** Use the improved prompt, note remaining issues
**Round 4:** Return to AI with the remaining issues and the improved prompt
**Round 5:** Further refinement until the prompt produces reliable, high-quality results

```prompt
I ran the prompt you generated in our previous exchange. Here are the results:

What worked well:
[what the AI got right]

What still needs improvement:
[remaining issues]

Specific changes I need:
[what specifically needs to be different]

Please update the prompt to address these remaining issues. 
Show me the updated version and explain what you changed.
```

### Generating Prompt Templates for Recurring Tasks

```prompt
I regularly need to [describe a recurring task you do].

This task always involves:
- Input: [what you start with]
- Process: [what you're trying to do]
- Output: [what you need to produce]
- Audience: [who uses the output]
- Quality standard: [what makes the output good]

Generate a reusable prompt template for this task with:
1. The complete prompt structure
2. Clearly labeled [PLACEHOLDERS] for the information that changes each time
3. Instructions at the top explaining how to use the template
4. Any conditional elements (parts that only apply in certain situations)
5. An example of the filled-in template with realistic placeholder values

Also: What information should I gather before running this template 
to get the best results?
```

---

## Section 5: Constitutional Prompting

### What Constitutional Prompting Is

Constitutional prompting embeds quality criteria directly into the prompt as a review standard. After generating an initial response, the AI checks its own output against the criteria and revises accordingly.

This technique was originally developed by Anthropic for AI safety purposes (ensuring responses align with stated values) but is extremely useful for professional output quality.

```prompt
I want you to write [describe the task].

CONSTITUTIONAL CRITERIA — After writing your initial response, 
review it against each of these standards and revise anything that doesn't meet them:

☐ ACCURACY: Every factual claim is either verified or clearly flagged as uncertain
☐ SPECIFICITY: No vague generalizations — every point has a concrete example
☐ ACTIONABILITY: The reader can take a specific action based on this content
☐ CONCISENESS: Nothing could be removed without losing important meaning
☐ VOICE: This sounds like [describe your brand voice] — not generic AI writing
☐ AUDIENCE: This would be understood and valued by [specific audience description]

Write the initial version, then conduct the constitutional review and 
produce a final version that passes all criteria. Show me both versions 
and note what you changed and why.
```

### Using Constitutional Prompting for Output Quality

```prompt
Write a [document type] about [topic].

[Full task context and instructions]

SELF-REVIEW CHECKLIST — Before delivering your response, review it against these 
specific quality criteria and revise accordingly:

1. Does the opening hook the reader in the first sentence? If not, rewrite it.
2. Is every section equally strong, or are some weaker? Strengthen the weakest.
3. Are there any clichés or overused phrases? Replace them.
4. Does the conclusion feel earned, or just appended? Revise if needed.
5. Would someone who knows this topic well find this insightful, 
   or just competent? If just competent, add one genuinely interesting insight.

After the self-review, deliver the final revised version.
```

---

## Section 6: Structured Output Prompting

### When Structured Output Matters

In some use cases, you don't just need good writing — you need reliably structured output that can be parsed, processed, or used programmatically. This is especially important when:
- Building automations that process AI output
- Creating content that must fit a specific CMS format
- Generating reports that need consistent structure
- Running batch processing on multiple inputs

### JSON and Structured Output Prompting

```prompt
Extract information from the following customer feedback and return it 
in this exact JSON structure:

{
  "sentiment": "positive" | "negative" | "neutral" | "mixed",
  "sentiment_score": [1-10 where 1 is most negative and 10 is most positive],
  "main_topics": [array of strings],
  "specific_issues": [array of strings — only if negative feedback present],
  "specific_praise": [array of strings — only if positive feedback present],
  "action_required": true | false,
  "urgency": "low" | "medium" | "high",
  "suggested_response_type": "acknowledgment" | "investigation" | "resolution" | "celebration"
}

Return ONLY the JSON object with no additional text, explanation, or markdown code blocks.

Customer feedback to analyze:
[paste feedback]
```

### Table Output Prompting

```prompt
Analyze the following 5 business scenarios and return your analysis 
as a structured markdown table.

The table must have these exact columns:
| Scenario | Key Risk | Probability (H/M/L) | Impact (H/M/L) | Mitigation Strategy | Priority |

Each row represents one scenario. Do not add additional columns.
Do not include introductory or concluding text — only the table.

Scenarios to analyze:
1. [Scenario 1]
2. [Scenario 2]
3. [Scenario 3]
4. [Scenario 4]
5. [Scenario 5]
```

> 🎯 **Try This Now:** Take a complex decision you're currently facing. Apply the self-consistency technique — reason through it three times using three different frameworks (financial, strategic, risk-focused). After all three chains, look for the majority conclusion and examine what the dissenting chain reveals. Does this process change what you'd do?

---

## Section 7: Prompt Decomposition

### When to Decompose

Some tasks are too complex to handle in a single prompt. Trying to do everything in one prompt leads to:
- The AI juggling too many competing requirements
- Shallow coverage of multiple things instead of depth on each
- Loss of quality as the context fills with instructions

Decompose when:
- The task has clearly separable phases
- You need to review intermediate outputs before proceeding
- Different phases require different roles or expertise
- The total prompt would exceed 500 words of instructions

### The Decomposition Process

**Step 1:** Break the complex task into independent sub-tasks
**Step 2:** Identify dependencies (what must be done before what?)
**Step 3:** Sequence the prompts
**Step 4:** Use outputs from earlier prompts as inputs to later ones

```prompt
I need to produce a complete competitive analysis report. 
Let me decompose this into sequential prompts.

PROMPT 1 (Research scope):
Define what specific questions a competitive analysis for [my company/situation] 
should answer. What dimensions of comparison matter most for my strategic decisions?

[Run Prompt 1, review the output, then continue]

PROMPT 2 (Analysis framework):
Based on these questions [paste output from Prompt 1], 
create an analysis framework — a structured template for evaluating 
each competitor across these dimensions.

[Run Prompt 2, review the output, then continue]

PROMPT 3 (Apply to competitors):
Using this framework [paste output from Prompt 2], 
evaluate [Competitor A] across all dimensions.

[Repeat for each competitor]

PROMPT 4 (Synthesis):
Here is the analysis of each competitor [paste all competitor analyses]. 
Synthesize this into: key patterns, competitive positioning map, 
our distinctive advantages, and 3 strategic recommendations.
```

---

## Key Takeaways

1. **Chain-of-thought activates better reasoning** — for analytical tasks, showing step-by-step reasoning before concluding improves accuracy by 40-60% in research tests.

2. **Self-consistency reduces error from single-chain limitations** — multiple independent reasoning chains finding the same answer builds confidence; divergent chains reveal genuine uncertainty.

3. **Tree-of-thought expands solution space before optimizing** — exploring multiple branches before synthesizing produces more creative and robust solutions than directly pursuing a single approach.

4. **Meta-prompting is compounding** — using AI to improve your prompts builds a better prompt library over time; each iteration of the meta-prompting loop produces more reusable, reliable templates.

5. **Constitutional prompting embeds quality criteria** — asking AI to check its own output against specific standards and revise accordingly produces measurably better first drafts.

6. **Structured output enables automation** — JSON and table-formatted outputs from AI can be processed programmatically, enabling automation workflows that would otherwise require human formatting.

7. **Decomposition beats trying to do everything at once** — complex tasks are better handled as sequences of focused prompts than as single massive instructions.

---

## Reflection Questions

1. The module presents four advanced techniques: chain-of-thought, self-consistency, tree-of-thought, and constitutional prompting. For your most common professional tasks, which single technique would have the highest impact if you used it consistently? Why?

2. Meta-prompting — using AI to improve your own prompts — requires you to know what's not working with your current approach before you can improve it. How good are you at diagnosing prompt failures? What would help you get better at this diagnosis?

3. Prompt decomposition is presented as a solution for complex tasks that are "too complex to handle in a single prompt." Think about the most complex task you've tried to do in a single prompt. How would you decompose it? What would the 3-4 sub-prompts be?

---

*Next Module: Context and Constraints — mastering the two elements most often missing from professional prompts.*
