# Module 2: Advanced Prompting Techniques

**Duration:** 25 minutes

## 1. Chain-of-Thought Prompting (5 min)

**What it is:** Guide AI through step-by-step reasoning

**Basic Prompt:**
"Solve: If John has 5 apples and gives 2 to Mary, how many does he have?"

**Chain-of-Thought:**
```
Solve this step-by-step:
1. Start with the initial amount
2. Identify what changes
3. Calculate the result
4. State the final answer

Problem: If John has 5 apples and gives 2 to Mary, how many does he have?
```

**Result:** More accurate, shows reasoning process

**Use cases:** Math problems, logic puzzles, complex analysis, decision-making

## 2. Few-Shot vs Zero-Shot Learning (5 min)

**Zero-Shot:** No examples given
```
Write a product description for wireless headphones.
```

**One-Shot:** One example
```
Example:
Product: Running shoes
Description: "Lightweight performance running shoes with responsive cushioning..."

Now write for: Wireless headphones
```

**Few-Shot:** Multiple examples (best results)
```
Example 1: [Product A description]
Example 2: [Product B description]
Example 3: [Product C description]

Now write for: [Your product]
```

**Rule:** More examples = better consistency and quality

## 3. Role Prompting (4 min)

**Technique:** Assign AI a specific expert role

**Examples:**

**Technical Expert:**
```
You are a senior software engineer with 15 years of Python experience.
Explain decorators to a junior developer.
```

**Creative Writer:**
```
You are a New York Times bestselling novelist known for compelling characters.
Write the opening paragraph of a thriller.
```

**Industry Specialist:**
```
You are a healthcare compliance officer with expertise in HIPAA regulations.
Review this patient data handling policy.
```

**Why it works:** Context shapes response style, depth, and perspective

## 4. Constraints and Boundaries (4 min)

**Effective constraints:**

**Length:**
- "In exactly 100 words"
- "Between 500-700 words"
- "In 3 bullet points"

**Style:**
- "Using only simple words (5th grade level)"
- "In the style of Ernest Hemingway"
- "Like a friendly conversation"

**Content:**
- "Without using jargon"
- "Focus only on benefits, not features"
- "Include 3 specific examples"

**Format:**
- "As a numbered list"
- "In markdown with headers"
- "As a table with 3 columns"

**Template with Multiple Constraints:**
```
Write [CONTENT TYPE] about [TOPIC]

Constraints:
- Length: [SPECIFIC]
- Tone: [SPECIFIC]
- Audience level: [SPECIFIC]
- Must include: [SPECIFIC ELEMENTS]
- Must avoid: [SPECIFIC ELEMENTS]
- Format: [SPECIFIC STRUCTURE]
```

## 5. Iterative Refinement (4 min)

**The Improvement Loop:**

**Attempt 1:** Basic prompt
```
Write a LinkedIn post about AI
```

**Attempt 2:** Add specificity
```
Write a 150-word LinkedIn post about how AI improves productivity for marketers
```

**Attempt 3:** Add constraints
```
Write a 150-word LinkedIn post about how AI improves productivity for marketers.
Tone: Helpful and inspiring
Include: One specific example
End with: Thought-provoking question
```

**Attempt 4:** Refine further
```
Write a 150-word LinkedIn post for marketing managers about AI productivity tools.

Structure:
- Opening hook (one surprising statistic)
- Main point (how AI saves time on content creation)
- Specific example (ChatGPT for email drafting)
- Closing question to drive engagement

Tone: Professional but conversational
Avoid: Hype or overselling

Write the post now.
```

**Process:** Each iteration teaches you what works

## 6. Meta-Prompting (3 min)

**What it is:** Ask AI to improve your prompt

**Technique:**
```
I want to write a prompt that generates high-quality blog posts about technology.

My current prompt is:
"Write a blog post about [TOPIC]"

Help me improve this prompt by:
1. Identifying what's missing
2. Suggesting specific additions
3. Providing a better version
4. Explaining why it's better
```

**AI becomes your prompting coach**

**Use for:** Learning, optimization, when stuck

---

# Module 3: Prompting for Different Use Cases

**Duration:** 25 minutes

## 1. Content Creation Prompts (7 min)

**Blog Post Generator:**
```
Write a comprehensive blog post:

Topic: [SPECIFIC TOPIC]
Target audience: [WHO + KNOWLEDGE LEVEL]
Word count: [NUMBER]
Primary keyword: [SEO KEYWORD]

Structure:
1. Compelling headline (include keyword)
2. Introduction (hook + preview)
3. [NUMBER] main sections with subheadings
4. Practical examples in each section
5. Actionable takeaways
6. Strong conclusion with CTA

Tone: [SPECIFY]
Include: Statistics, expert insights, real-world examples
Optimize for: Readability (short paragraphs, varied sentence length)
```

**Social Media Series:**
```
Create a 7-day social media content series for [PLATFORM]

Theme: [TOPIC/CAMPAIGN]
Brand voice: [DESCRIPTION]
Goal: [ENGAGEMENT/AWARENESS/SALES]

For each day provide:
- Post copy (optimal length for platform)
- Hook/opening line
- Visual suggestion
- Hashtags (3-5)
- Best posting time

Vary the content types: Educational, entertaining, promotional, interactive
```

## 2. Code Generation Prompts (5 min)

**Effective Code Prompt:**
```
Write [LANGUAGE] code to [SPECIFIC TASK]

Requirements:
- Input: [WHAT IT RECEIVES]
- Output: [WHAT IT RETURNS]
- Constraints: [PERFORMANCE, COMPATIBILITY]
- Error handling: [HOW TO HANDLE ERRORS]
- Style: [CONVENTIONS TO FOLLOW]

Include:
- Inline comments explaining logic
- Function documentation
- Example usage
- Test cases

Code should be:
- Production-ready
- Well-organized
- Following [LANGUAGE] best practices
```

**Example:**
```
Write Python code to scrape product prices from an e-commerce website.

Requirements:
- Input: URL of product page
- Output: Dict with {name, price, availability}
- Use: BeautifulSoup4 and requests
- Handle: Network errors, missing elements
- Style: PEP 8 compliant

Include:
- Comments explaining each step
- Error handling with try/except
- Example usage with fake URL
- Unit test function
```

## 3. Analysis and Research Prompts (5 min)

**Deep Analysis:**
```
Analyze [TOPIC/DATA] and provide comprehensive insights

Context: [BACKGROUND INFORMATION]
Goal: [WHAT YOU'RE TRYING TO UNDERSTAND]

Analysis framework:
1. Current state overview
2. Key trends identified
3. Strengths and weaknesses
4. Opportunities and threats
5. Data-driven insights
6. Actionable recommendations

Output format:
- Executive summary (3-4 sentences)
- Detailed analysis by section
- Supporting evidence for each claim
- Prioritized recommendations

Approach: Objective, data-driven, strategic
```

**Competitive Research:**
```
Research and compare [COMPETITORS/OPTIONS]

Items to compare: [LIST]
Evaluation criteria:
- [CRITERION 1]
- [CRITERION 2]
- [CRITERION 3]

Provide:
1. Summary table (features, pricing, pros/cons)
2. Detailed analysis of each option
3. Best for different use cases
4. Overall recommendation with rationale

Include: Objective data, not opinions
Format: Easy to scan and compare
```

## 4. Problem-Solving Prompts (4 min)

**Structured Problem-Solving:**
```
Help me solve this problem using a structured approach:

Problem: [DETAILED DESCRIPTION]
Context: [RELEVANT BACKGROUND]
Constraints: [LIMITATIONS/REQUIREMENTS]

Use this framework:
1. Clarify the problem (restate in your own words)
2. Identify root causes
3. Generate 5 possible solutions
4. Evaluate pros/cons of each
5. Recommend best solution with rationale
6. Outline implementation steps

Approach: Systematic, thorough, practical
```

## 5. Creative Prompts (4 min)

**Brainstorming:**
```
Generate creative ideas for [PROJECT/CHALLENGE]

Context: [BACKGROUND]
Goal: [WHAT YOU WANT TO ACHIEVE]
Target audience: [WHO]

Generate 20 ideas ranging from:
- Safe and practical (5 ideas)
- Moderately creative (10 ideas)
- Bold and unconventional (5 ideas)

For each idea provide:
- Concept (1-2 sentences)
- Why it could work
- Implementation difficulty (low/medium/high)

Think outside the box but stay realistic.
```

---

# Module 4: Prompt Engineering for Business

**Duration:** 20 minutes

## 1. Customer Service Automation (5 min)

**Support Response Generator:**
```
Generate a customer support response:

Customer issue: [ISSUE DESCRIPTION]
Customer tone: [FRUSTRATED/CONFUSED/NEUTRAL]
Issue complexity: [SIMPLE/COMPLEX]
Product: [PRODUCT NAME]

Response requirements:
- Acknowledge their concern empathetically
- Provide clear solution steps
- Be conversational but professional
- Keep under 150 words
- Include relevant links/resources
- End with offer to help further

Tone: Helpful, patient, solution-focused
```

**FAQ Generator:**
```
Create a comprehensive FAQ section for [PRODUCT/SERVICE]

Generate 15 questions customers commonly ask about:
- Getting started
- Features and functionality
- Pricing and billing
- Troubleshooting
- Account management

For each Q&A:
- Question: Natural language (how customers actually ask)
- Answer: Clear, concise (50-100 words)
- Include: Links to relevant docs/resources where appropriate
- Tone: Helpful and accessible

Organize: By category
```

## 2. Sales and Marketing (5 min)

**Sales Email Sequence:**
```
Create a 5-email sales sequence for [PRODUCT]

Target: [IDEAL CUSTOMER]
Goal: [BOOK DEMO/TRIAL/PURCHASE]
Timeline: Days 0, 3, 7, 10, 14

For each email:
- Subject line (50 chars max)
- Email body (150-200 words)
- One clear CTA
- P.S. line

Email progression:
1. Introduction + value proposition
2. Social proof + case study
3. Address common objection
4. Limited time offer
5. Last chance + FOMO

Tone: Professional but conversational, not pushy
```

## 3. Meeting and Productivity (4 min)

**Meeting Prep:**
```
Prepare me for this meeting:

Meeting details: [WHO, TOPIC, GOAL]
My role: [YOUR POSITION]
Context: [RELEVANT BACKGROUND]

Provide:
1. Agenda (suggested discussion flow)
2. Key talking points (3-5)
3. Potential questions I might face
4. Recommended responses
5. Desired outcomes
6. Follow-up actions

Format: Concise, actionable bullet points
```

## 4. Data Analysis (3 min)

**Report Generation:**
```
Analyze this data and create an executive report:

[PASTE DATA OR DESCRIPTION]

Report structure:
1. Executive summary (3 sentences)
2. Key findings (5 bullet points)
3. Trends identified
4. Recommendations (prioritized)
5. Next steps

Requirements:
- Data-driven insights
- Clear visualizations described
- Actionable recommendations
- Professional tone

Audience: C-level executives (assume limited time)
```

## 5. HR and Operations (3 min)

**Job Description:**
```
Write a job description for [ROLE]

Company: [BRIEF DESCRIPTION]
Team: [WHICH TEAM]
Level: [JUNIOR/MID/SENIOR]

Include:
- Compelling overview (2-3 sentences)
- Key responsibilities (5-7)
- Required qualifications
- Preferred qualifications
- What we offer
- Company culture highlight

Tone: Professional but exciting
Focus: Attract top talent
Avoid: Generic corporate speak
```

---

# Module 5: Mastery and Best Practices

**Duration:** 15 minutes

## 1. Building Your Prompt Library (4 min)

**Organization System:**

**Category 1: By Function**
- Writing (blogs, emails, social)
- Analysis (research, data, competitive)
- Creation (code, design briefs, campaigns)
- Problem-solving (debugging, strategy)

**Category 2: By Frequency**
- Daily use prompts
- Weekly workflows
- Project-specific templates

**Template Format:**
```
PROMPT NAME: [Descriptive name]
USE CASE: [When to use this]
INPUT NEEDED: [What variables to fill]
EXPECTED OUTPUT: [What you'll get]

PROMPT:
[The actual prompt template with [VARIABLES]]

EXAMPLE:
[Filled-in example]

NOTES:
[Optimization tips, variations]
```

## 2. Common Mistakes to Avoid (3 min)

**Mistake 1:** Vague objectives
❌ "Write something about marketing"
✅ "Write a 500-word blog post about email marketing automation for small business owners"

**Mistake 2:** Information overload
❌ Dumping entire context in one prompt
✅ Break into steps, provide context incrementally

**Mistake 3:** No examples
❌ "Write in our brand voice"
✅ "Write in our brand voice. Here are 3 examples: [...]"

**Mistake 4:** Ignoring iteration
❌ Accept first output
✅ Refine 2-3 times until excellent

**Mistake 5:** No version control
❌ Lose working prompts
✅ Save what works in library

## 3. Optimization Techniques (4 min)

**A/B Testing Prompts:**
Test variations systematically:
- Different role assignments
- More vs fewer constraints
- Different example types
- Various output formats

**Incremental Improvement:**
```
Version 1.0: Basic prompt
Version 1.1: + Specific constraints
Version 1.2: + Examples
Version 1.3: + Format specification
Version 2.0: Complete rewrite based on learnings
```

**Performance Metrics:**
- Time to get desired output
- Quality rating (1-10)
- Need for editing (%)
- Reusability (how often used)

## 4. Advanced Tips (3 min)

**Tip 1: Use Delimiters**
```
Context: """[Your context here]"""
Instructions: ###[Your instructions]###
Examples: +++[Your examples]+++
```

**Tip 2: Specify Format First**
```
Format: JSON
{
  "title": "string",
  "summary": "string",
  "keyPoints": ["array"]
}

Now generate content for: [TOPIC]
```

**Tip 3: Negative Prompting**
Tell AI what NOT to do:
- "Do not use jargon"
- "Avoid listing features"
- "Do not make unsubstantiated claims"

**Tip 4: Temperature Control**
Request creative control:
- "Be creative and explore unusual angles"
- "Stick to conventional, proven approaches"
- "Balance creativity with practicality"

## 5. Future-Proofing Your Skills (1 min)

**Stay Updated:**
- AI models improve constantly
- New capabilities emerge monthly
- Prompt techniques evolve

**Continuous Learning:**
- Test new models as they release
- Join prompt engineering communities
- Share and learn from others
- Document what works

**Adaptability:**
- Core principles remain
- Specific techniques adjust
- Always experiment
- Focus on outcomes

---

## Course Complete!

You've mastered:
✅ Prompt engineering fundamentals
✅ Advanced techniques
✅ Use case-specific strategies
✅ Business applications
✅ Best practices and optimization

**Next Steps:**
1. Build your prompt library
2. Practice daily
3. Share with team
4. Keep optimizing

**Welcome to prompt engineering mastery!** 🎓
