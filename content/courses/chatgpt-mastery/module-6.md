# Module 6: Advanced ChatGPT Techniques
**Estimated Time: 35 minutes**

---

## Unlock Master-Level ChatGPT Skills

Welcome to Module 6! You've mastered the fundamentals—now it's time to become a true ChatGPT expert.

**This module is for power users.** We're diving into advanced techniques that separate pros from beginners.

By the end of this module, you'll:
- ✅ Use custom instructions for consistent results
- ✅ Apply advanced reasoning frameworks
- ✅ Generate and debug code (even if you're not a programmer)
- ✅ Solve multi-step complex problems
- ✅ Understand ChatGPT limitations and work around them

Let's unlock the advanced features! 🎓

---

## Part 1: Custom Instructions & System Prompts

### What Are Custom Instructions?

Custom instructions tell ChatGPT how to ALWAYS respond to you, without repeating instructions in every conversation.

**Think of it like:** Setting your default preferences in any app—once set, it remembers.

---

### Setting Up Custom Instructions

**In ChatGPT Settings:**
1. Click your profile
2. Select "Custom Instructions"
3. Fill in two sections:

**Section 1: What would you like ChatGPT to know about you?**
```
I am a [your role] at a [company type] company in [industry].

My main responsibilities:
- [Responsibility 1]
- [Responsibility 2]
- [Responsibility 3]

My typical use cases for ChatGPT:
- Business communication
- Content creation
- Research and analysis
- Project planning

My audience is typically: [describe]

My goals: [What you're trying to achieve]
```

**Section 2: How would you like ChatGPT to respond?**
```
Response style:
- Professional but conversational
- Concise (avoid fluff)
- Action-oriented (focus on what I can do)
- Use specific examples over generic advice

Formatting preferences:
- Use bullet points for lists
- Bold key terms
- Keep paragraphs to 2-3 sentences max
- Start with TL;DR for long responses

Always:
- Ask clarifying questions if ambiguous
- Provide 2-3 options when appropriate
- Include potential risks/considerations
- Cite sources when making factual claims

Never:
- Use overly formal language
- Apologize unnecessarily
- Give generic advice
```

**Result:** Every conversation starts with this context!

---

## Part 2: Advanced Reasoning Frameworks

### Chain-of-Thought Prompting

Force ChatGPT to "show its work" for better reasoning:

```
Think through this problem step-by-step:

PROBLEM: [Your complex problem]

PROCESS:
1. Break down the problem into components
2. Analyze each component
3. Consider dependencies and relationships
4. Evaluate potential solutions
5. Recommend best approach
6. Explain your reasoning at each step

Show your thinking process, not just the answer.
```

**When to use:** Complex decisions, analysis, strategy

---

### Socratic Method

Let ChatGPT guide you to answers through questions:

```
ROLE: You are a Socratic teacher helping me think through a problem.

MY PROBLEM: [Describe your challenge]

INSTRUCTIONS:
- Don't give me the answer directly
- Ask me probing questions that help me discover the solution
- Build on my answers with deeper questions
- Guide me to insights through dialogue
- After 5-6 exchanges, summarize what I've discovered

Start by asking me your first question.
```

**When to use:** Learning, critical thinking, exploring options

---

### Six Thinking Hats Method

Examine problems from multiple perspectives:

```
Analyze [decision/problem] using the Six Thinking Hats method:

WHITE HAT (Facts):
- What data do we have?
- What's missing?
- Objective information only

RED HAT (Emotions):
- Gut reactions
- Feelings about this
- Intuitive responses

BLACK HAT (Caution):
- Potential problems
- Risks
- Why this might fail

YELLOW HAT (Benefits):
- Opportunities
- Best case scenarios
- Why this could work

GREEN HAT (Creativity):
- Alternatives
- New ideas
- Innovative approaches

BLUE HAT (Process):
- Summary of all perspectives
- Recommended next steps
- Action plan

Spend equal time on each hat.
```

---

## Part 3: Code Generation & Debugging

### Code Generation for Non-Programmers

You don't need to be a developer to use ChatGPT for code:

**Excel/Google Sheets Formula**
```
I need an Excel formula that:
- [Describe what you want it to do]
- Input data is in cells: [cell references]
- Expected output: [description]

Provide:
1. The formula
2. Step-by-step explanation of how it works
3. Example with sample data
4. Common errors to avoid
```

---

**Simple Web Script**
```
Create a simple [type] script that:
- Does: [functionality]
- Inputs: [what user provides]
- Outputs: [what it produces]

REQUIREMENTS:
- Explain each section with comments
- Keep it simple (I'm not a programmer)
- Include instructions for how to run it

LANGUAGE: [JavaScript/Python/etc.]
```

---

**Data Transformation**
```
I have data in this format:
[Show example of current format]

I need it in this format:
[Show example of desired format]

Provide:
1. Python/JavaScript code to transform it
2. Explanation of what each part does
3. How to run it (step-by-step)
```

---

### Code Debugging

**When code doesn't work:**
```
This code isn't working as expected:

CODE:
[Paste your code]

EXPECTED BEHAVIOR:
[What should happen]

ACTUAL BEHAVIOR:
[What's happening instead]

ERROR MESSAGE (if any):
[Paste error]

HELP ME:
1. Identify the bug
2. Explain why it's happening
3. Provide corrected code
4. Explain the fix

Assume I have basic programming knowledge.
```

---

## Part 4: Multi-Step Problem Solving

### Complex Problem Template

```
ROLE: You are a strategic problem solver.

COMPLEX PROBLEM: [Detailed description]

SOLVE USING THIS FRAMEWORK:

STEP 1: PROBLEM DEFINITION
- Core issue (one sentence)
- Root causes (3-5)
- Stakeholders affected
- Success criteria

STEP 2: CONSTRAINTS
- Budget limitations
- Time constraints
- Resource availability
- Political/organizational factors

STEP 3: SOLUTION OPTIONS (3-5)
For each option:
- Description
- Pros and cons
- Resource requirements
- Risk level
- Time to implement

STEP 4: EVALUATION MATRIX
- Score each option against criteria
- Weight important factors

STEP 5: RECOMMENDATION
- Best option and why
- Implementation roadmap
- Risk mitigation
- Quick wins

STEP 6: ALTERNATIVE SCENARIOS
- If recommendation fails, then what?
- Plan B and Plan C

Use data-driven logic throughout.
```

---

### Scenario Planning

```
Create scenario plans for: [situation]

CURRENT STATE: [Describe where you are now]
GOAL: [Where you want to be]
TIMEFRAME: [Duration]

DEVELOP 3 SCENARIOS:

1. BEST CASE (Optimistic)
   - What has to go right
   - Probability: X%
   - Key indicators
   - Action plan

2. MOST LIKELY (Realistic)
   - Expected path
   - Probability: X%
   - Key indicators
   - Action plan

3. WORST CASE (Pessimistic)
   - What could go wrong
   - Probability: X%
   - Key indicators
   - Contingency plan

For each scenario:
- Triggers to watch for
- Decision points
- Pivot strategies
```

---

## Part 5: Advanced Prompt Techniques

### Perspective Shifting

```
Analyze [topic/decision] from these perspectives:

1. YOUR COMPETITOR would say:
2. YOUR CUSTOMER would say:
3. YOUR INVESTOR would say:
4. YOUR EMPLOYEE would say:
5. AN INDUSTRY EXPERT would say:
6. A CRITIC would say:

For each perspective:
- Main argument (100 words)
- Supporting evidence
- Concerns raised
- Recommendations

Then: Synthesize into balanced view
```

---

### Constraint-Based Thinking

```
Solve this challenge WITH constraints:

CHALLENGE: [Your problem]

CONSTRAINTS (must follow all):
1. Budget: $[amount] maximum
2. Time: [timeline]
3. Team: [size/skills available]
4. Cannot use: [forbidden solutions]
5. Must maintain: [non-negotiables]

CREATIVE CONSTRAINTS:
- Solution must be [creative restriction]
- Inspired by [unrelated industry/field]

Often constraints force the BEST solutions.
Provide 3 creative approaches that work within ALL constraints.
```

---

### Meta-Prompting

Ask ChatGPT to improve your prompts:

```
I want to ask ChatGPT: [your intended question]

Before answering, first:
1. Analyze my question
2. Identify ambiguities or missing context
3. Suggest a better, more specific version of my prompt
4. THEN answer using the improved prompt

This helps me learn better prompting while getting a better answer.
```

---

## Part 6: Understanding Limitations

### What ChatGPT Can't Do

**Cannot:**
- Browse the internet in real-time (unless using plugins)
- Access personal data unless you provide it
- Remember conversations unless explicitly told
- Know events after training cutoff (check date in settings)
- Execute actions outside the chat interface
- Make subjective judgments about "best" without criteria

**Workarounds:**
```
For real-time data:
"Based on general patterns in [industry], what would typically..."

For personal data:
"Here's my data: [paste]. Now analyze..."

For recent events:
"Assuming [recent event] happened, how would..."
```

---

### Handling Hallucinations

ChatGPT sometimes "hallucinates" (makes up information):

**Prevention strategies:**
```
1. Request sources: "Cite your sources for these claims"

2. Ask for confidence levels: "How confident are you in this information? (High/Medium/Low)"

3. Cross-check critical facts: "What evidence supports this?"

4. Use disclaimers: "If you're not certain, say 'Based on typical patterns...' rather than stating as fact"
```

---

### Token Limits

Long conversations may lose early context:

**Solution: Conversation management**
```
When conversation is long:
"Summarize our conversation so far, highlighting:
- Key decisions made
- Important context to remember
- Open questions remaining

I'll use this summary to start a fresh conversation."
```

---

## Part 7: Advanced Use Cases

### Competitive Intelligence

```
Analyze [Competitor] using SWOT framework:

PUBLIC INFORMATION ONLY (websites, news, social media)

STRENGTHS:
- What they do well
- Competitive advantages
- Market position

WEAKNESSES:
- Vulnerabilities
- Customer complaints
- Gaps in offering

OPPORTUNITIES (for us):
- Market gaps they're not serving
- Areas where we can differentiate
- Their weaknesses we can exploit

THREATS (from them):
- Their innovations
- Their strengths vs. our weaknesses
- Market trends favoring them

STRATEGIC RECOMMENDATIONS:
- How to compete effectively
- Where to focus our efforts
- Defensive strategies
```

---

### Crisis Communication

```
URGENT: Need crisis communication plan for:

SITUATION: [Describe crisis]
STAKEHOLDERS: [Who's affected]
SEVERITY: [High/Medium/Low]
PUBLIC AWARENESS: [Is this public yet?]

CREATE IMMEDIATE RESPONSE:

1. HOLDING STATEMENT (100 words)
   - Acknowledge situation
   - Express concern/empathy
   - Commit to transparency
   - Next update timeline

2. INTERNAL COMMUNICATION (200 words)
   - What employees need to know
   - How to respond to questions
   - What NOT to say

3. CUSTOMER COMMUNICATION (200 words)
   - Direct address of their concerns
   - Steps being taken
   - Support available

4. MEDIA TALKING POINTS
   - 5 key messages
   - Q&A (10 likely questions + answers)

5. MONITORING PLAN
   - What to track
   - When to update

TONE: [Serious, apologetic, transparent, action-oriented]
```

---

## Part 8: API & Integration Concepts

### Understanding ChatGPT API (Basic)

**What it enables:**
- Integrate ChatGPT into your own tools
- Automate workflows
- Build custom applications

**Basic concept:**
```
You send a "prompt" → API returns "completion"

Example use cases:
- Auto-generate product descriptions from specs
- Summarize customer support tickets
- Draft emails based on bullet points
- Analyze data and create reports

Technical requirements:
- Basic programming knowledge
- API key from OpenAI
- Some coding ability (or hire developer)
```

**Simple API prompt structure:**
```json
{
  "model": "gpt-4",
  "messages": [
    {"role": "system", "content": "You are a helpful assistant."},
    {"role": "user", "content": "What is AI?"}
  ]
}
```

---

## Advanced Tips from Power Users

### Tip #1: Version Control Your Prompts
Keep a document of your best prompts:
- Date created
- Use case
- Prompt text
- Performance notes
- Iterations/improvements

---

### Tip #2: A/B Test Your Prompts
```
Create 2 versions of this [content type]:

VERSION A: [Approach 1]
VERSION B: [Approach 2]

For each version, create complete draft.
I'll test which performs better.
```

---

### Tip #3: Combine Multiple Techniques
```
Use chain-of-thought + six thinking hats + constraint-based thinking
to solve: [complex problem]

This forces deep, multi-faceted analysis.
```

---

### Tip #4: Temperature Settings (if using API)
- Temperature 0 = Deterministic, consistent
- Temperature 0.7 = Balanced creativity
- Temperature 1.0 = Maximum creativity

Match to use case:
- Technical docs: Low temperature
- Creative writing: High temperature

---

## Key Takeaways

🎯 **What You Learned:**
1. Custom instructions for personalized responses
2. Advanced reasoning frameworks
3. Code generation and debugging
4. Multi-step problem solving
5. ChatGPT limitations and workarounds
6. Advanced prompt techniques
7. Power user strategies

🚀 **Immediate Actions:**
- Set up your custom instructions
- Try chain-of-thought prompting on next complex problem
- Generate a simple script/formula for a task
- Create your personal prompt library

---

## Glossary

**Chain-of-Thought:** Prompting technique that asks ChatGPT to explain its reasoning step-by-step, improving complex problem-solving.

**Hallucination:** When AI generates false information presented as fact. More common with factual claims than with creative or analytical tasks.

**Token:** Unit of text (roughly 4 characters or ¾ word). ChatGPT has token limits per conversation and per response.

**Temperature:** API setting controlling randomness/creativity. Lower = more predictable, higher = more creative.

**System Prompt:** Instructions that set ChatGPT's behavior for an entire conversation (like custom instructions).

**Meta-Prompting:** Using ChatGPT to improve your prompts before answering your actual question.

---

## Coming Up in Module 7

Final module: **Beyond ChatGPT - Your AI Toolkit**

- Other AI tools worth knowing
- When to use what tool
- Building your AI stack
- Future of AI tools
- Staying updated

**You're a ChatGPT expert—time to expand your AI toolkit!** 🛠️

---

**Module 6 Complete!** 🎉  
Final quiz coming up—test your advanced skills!
