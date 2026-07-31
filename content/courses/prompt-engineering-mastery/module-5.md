# Module 5: Domain-Specific Prompting

**Course:** Prompt Engineering Mastery
**Estimated Time:** 65 minutes
**Difficulty:** 🔴 Advanced

---

## What You'll Learn

- How prompt engineering requirements differ across professional domains
- Specialized prompting techniques for legal, medical, financial, educational, and technical work
- How to extract domain expertise from AI while maintaining appropriate epistemic humility
- Prompting for code, data analysis, and technical documentation
- Building domain-specific prompt systems for your professional context
- Understanding the limits of AI in regulated and high-stakes domains

---

## Why This Matters Today

> The **today Stanford HAI AI Index** documented that domain-specific AI applications in law, medicine, finance, and education show the highest productivity gains — but also the highest risk of harm from misuse. Professionals who understand both the capabilities and the appropriate application of AI in their domain outperform those using generic AI approaches by 3-4x in productivity gains, while maintaining the professional accountability standards their work requires.

General prompting techniques improve outputs across all domains. But each professional domain has specific requirements, conventions, risks, and appropriate uses of AI that require domain-adapted prompting strategies. This module addresses the five domains where professionals are most commonly using AI today.

---

## Section 1: Prompting for Legal Work

### What AI Can and Cannot Do in Legal Contexts

**What AI does well in legal work:**
- Research (identifying relevant cases, statutes, and legal concepts)
- Document drafting (contracts, memos, briefs — always requiring lawyer review)
- Summarizing long legal documents
- Comparing document versions
- Explaining legal concepts in plain language
- First-pass document review for common issues

**What AI should not be used for in legal work:**
- Providing legal advice to clients (this creates attorney-client relationship issues and liability)
- Final review of documents with legal consequences
- Jurisdiction-specific advice without expert verification
- Anything where the AI's training cutoff means it might miss recent case law

**The EU AI Act consideration:** Legal AI applications involving consequential decisions about individuals are subject to the EU AI Act's high-risk AI provisions, requiring human oversight and auditability.

### Legal Research Prompting

```prompt
I need to research the legal landscape around [legal topic] for a memo 
I'm writing for [client type].

Jurisdiction: [specific jurisdiction — state/country]
Purpose: [what the memo is for]
My role: [attorney / paralegal / law student / general counsel / other]

Research the following:
1. The primary legal framework governing this area (key statutes or regulations)
2. Landmark cases that established the current doctrine
3. Recent developments in the last 24 months (flag any that might be 
   post your training cutoff and require verification)
4. The key tests or factors courts use to evaluate this issue
5. Any circuit splits or jurisdictional differences I should be aware of

IMPORTANT: Cite specific cases and statutes by name. Flag any citation 
that you're uncertain about — I will verify all citations before using them.
Do not present uncertain citations as confirmed.
```

### Contract Review Prompting

```prompt
I need to conduct a first-pass review of this contract for potential issues.

My role: [Attorney reviewing for client / general counsel self-review / other]
Document type: [NDA / service agreement / employment contract / other]
My client's position: [buyer / seller / service provider / employee / other]
Key concerns to focus on: [indemnification / limitation of liability / IP ownership / 
  termination rights / specific clauses the client flagged]

Please review this contract for:
1. Unusual or aggressive provisions that favor the other party
2. Missing standard provisions that should be present
3. Ambiguous language that could be interpreted against my client
4. Provisions that conflict with each other
5. Any "red flag" clauses that require immediate attention

IMPORTANT: This is a first-pass analysis, not a substitute for attorney review. 
Flag all identified issues with the specific section reference.
Do not make assumptions about what's "acceptable" — flag anything that could be an issue.

[Paste contract text]
```

> ⚠️ **Common Mistake:** Presenting AI-generated legal analysis as definitive legal advice to clients, or using AI-cited cases without verification. AI models can "hallucinate" case citations that don't exist or misstate holdings. Every AI-generated legal citation must be verified in Westlaw, LexisNexis, or the court's actual record before any professional reliance.

---

## Section 2: Prompting for Medical and Healthcare Work

### What AI Can and Cannot Do in Healthcare

**What AI does well in healthcare contexts:**
- Medical literature synthesis and research
- Clinical note formatting and documentation
- Patient education materials (always requiring physician review)
- Administrative and coding tasks
- Drug interaction lookups (as a starting point for professional verification)
- Explaining complex medical concepts in accessible language

**What AI must not do in healthcare:**
- Diagnose conditions for specific patients
- Replace clinical judgment
- Provide treatment recommendations without professional oversight
- Handle patient-identifiable information in cloud AI tools (HIPAA concerns)
- Be presented to patients as a substitute for professional medical advice

### Clinical Documentation Prompting

```prompt
I'm a [physician / nurse practitioner / PA / resident] and I need help 
formatting a clinical note from my raw documentation.

Note type: [SOAP note / H&P / discharge summary / progress note]
Specialty: [your specialty — affects terminology and format conventions]
Purpose: This is for [EHR entry / billing documentation / referral / other]

Raw notes from my visit:
[paste raw notes — ensure no PHI if using commercial cloud AI]

Please:
1. Format these notes in standard [note type] format
2. Ensure completeness — flag any sections that are missing information 
   that should typically be present
3. Suggest appropriate ICD-10 codes based on the diagnoses documented 
   (I will verify these)
4. Flag any clinical inconsistencies or documentation gaps I should address

IMPORTANT: Do not alter clinical findings or add clinical information 
not present in my raw notes. Format and organize only.
```

### Medical Literature Research

```prompt
I'm researching the current evidence base for [clinical topic] 
to support a clinical decision / update our protocol / prepare a presentation.

My clinical context:
- Patient population: [describe]
- Specific clinical question: [PICO format if possible — 
  Patient/Intervention/Comparison/Outcome]
- Level of evidence needed: [systematic review / RCT level / 
  observational studies acceptable]

Please:
1. Summarize the current evidence landscape on this clinical question
2. Identify the highest-quality evidence available (systematic reviews, meta-analyses)
3. Note any significant clinical trials published in the past 3 years 
   (flag that recent studies may be post your training cutoff)
4. Describe areas of clinical controversy or where evidence is mixed
5. Identify gaps in the evidence base

Flag confidence levels for each claim:
HIGH CONFIDENCE: Well-established in multiple systematic reviews
MODERATE CONFIDENCE: Supported by RCTs but with some limitations
LOW CONFIDENCE: Limited to observational studies or expert opinion
UNCERTAIN: This is at or near my training cutoff; verify current literature
```

---

## Section 3: Prompting for Financial Analysis

### What AI Does Well in Finance

**Strong AI applications in finance:**
- Financial model explanation and documentation
- Financial writing and narrative generation (for reports, memos, communications)
- Scenario analysis and sensitivity discussion
- Investment thesis development (not advice — thesis development)
- Financial education and concept explanation
- Benchmarking and comparative analysis

**Appropriate cautions:**
- AI cannot access real-time financial data (unless using web browsing)
- AI should not provide personalized investment advice
- Regulatory compliance requirements vary by jurisdiction and must be followed
- All financial projections from AI must be verified by qualified professionals

### Financial Analysis Writing

```prompt
I'm writing the analysis section for an equity research report on [company].

My research data (which I've already gathered):
[paste or describe your key financial metrics, ratio comparisons, 
trends you've identified]

The report is for: [institutional investors / retail investors / 
internal investment committee]
The investment thesis I've developed: [your thesis — buy/hold/sell and why]
The target audience's sophistication: [professional investors / 
general public / C-suite executives]

Write the analysis section (600-800 words) that:
1. Presents the financial performance story using my data
2. Contextualizes the numbers (vs. peers, vs. historical performance, vs. expectations)
3. Identifies the key value drivers and risks
4. Connects the financial performance to the investment thesis
5. Uses precise financial language appropriate for [audience]

Do not fabricate data. Only analyze the figures I've provided.
All specific data points should come from my inputs — note [VERIFY] 
where you'd expect a data point that I haven't provided.
```

### Financial Modeling Documentation

```prompt
I've built a financial model for [purpose] and I need to create 
documentation that explains it to [stakeholders].

Model overview:
[describe the model structure, key inputs, and key outputs]

Key assumptions I've made:
[list assumptions]

Intended users of this documentation:
[who will read it and what they need to understand]

Create model documentation that includes:
1. Executive summary of what the model does and what decisions it informs
2. Key assumptions and their rationale (with sensitivity — what if they're wrong?)
3. Input guide — what users need to enter and where to find each input
4. Output interpretation — what each key output means and how to use it
5. Limitations and appropriate use cases (when to use and when NOT to use this model)

Language should be [technical / accessible] depending on the audience.
```

---

## Section 4: Prompting for Education

### AI in Educational Contexts

Education was one of the first domains to experience significant AI disruption recently-today, primarily around academic integrity. But AI also has genuine, valuable educational applications:

**Legitimate educational AI uses:**
- Curriculum design and lesson planning
- Differentiated instruction material creation
- Assessment design (with appropriate plagiarism detection backup)
- Student feedback frameworks
- Explanation generation for different learning levels
- Research assistance that teaches information literacy

### Lesson Planning and Curriculum Design

```prompt
I'm a [grade level] teacher of [subject] developing a [unit / lesson plan / 
curriculum sequence] for [duration].

Student context:
- Grade level / age: [grade or age range]
- Prior knowledge: [what students already know]
- Learning differences to accommodate: [if any — ELL / IEP considerations / 
  accelerated learners]
- Available resources: [technology access, classroom constraints, time]

Learning objectives (I want students to be able to):
1. [Objective 1]
2. [Objective 2]
3. [Objective 3]

Create [a lesson plan / unit outline] that:
- Aligns with [curriculum standards — specify which standard set]
- Includes instructional strategies for different learning styles
- Suggests formative assessment checkpoints (not just summative)
- Identifies likely misconceptions students will have and how to address them
- Recommends how to differentiate for students who are ahead or behind

Format: [your preferred lesson plan format or specify the components you need]
```

### Differentiated Explanation Generation

One of AI's most valuable educational applications is explaining the same concept at multiple levels:

```prompt
I need to explain [concept] to students at three different levels.

Concept: [describe the concept with accurate technical detail]

LEVEL 1 — For students who are new to this topic:
Age/grade equivalent: [6th grade or specify]
Goal: Make it memorable and intuitive, not technically precise
Length: 100 words

LEVEL 2 — For students with some background:
Age/grade equivalent: [10th grade or specify]
Goal: Accurate enough to build on, accessible to most students
Length: 150 words

LEVEL 3 — For advanced students / college level:
Goal: Full technical precision; prepare them for deeper study
Length: 200 words

After the three explanations, identify:
- The most common misconception about this concept at each level
- The most important thing NOT to oversimplify when explaining it
```

---

## Section 5: Technical and Code Prompting

### Prompting for Code

Code prompting has specific conventions that improve output quality significantly:

**Essential elements for code prompts:**
- Programming language (and version if it matters)
- Context of the codebase (what it does, what libraries it uses)
- What the code should do (functional specification)
- What it should NOT do (constraints and error conditions to handle)
- Testing requirements
- Code style preferences (naming conventions, comment level)

```prompt
Write a Python function that [describes what the function should do].

Language: Python 3.11
Context: This function will be used in [describe the broader codebase]
Libraries available: [list relevant libraries you're already importing]

Functional requirements:
- Input: [describe input parameters and their types]
- Output: [describe what the function returns]
- Handles these edge cases: [list edge cases to handle]
- Error handling: [how to handle errors — raise exception / return None / log and continue]

Non-functional requirements:
- Performance: [any performance constraints]
- Code style: [PEP 8 / your team's conventions]
- Comments: [minimal / docstring only / comprehensive inline comments]

After the function, provide:
1. A brief explanation of the approach
2. 3 unit test cases (including an edge case)
3. Any potential improvements if performance becomes a concern
```

### Code Review Prompting

```prompt
Please review this code for [Python / JavaScript / SQL / other].

Context: This is [what the code does] in [where it's used].
Reviewer perspective: Act as a senior engineer doing a code review.

[Paste code]

Review for:
1. Correctness: Are there any bugs or logical errors?
2. Security: Are there any security vulnerabilities? (SQL injection, XSS, etc.)
3. Performance: Are there inefficient patterns that will cause problems at scale?
4. Readability: Is this code clear? Would a new team member understand it?
5. Maintainability: Is this code well-structured for future changes?
6. Error handling: Are edge cases and errors handled appropriately?

Format your feedback as:
- Critical issues (must fix before merge)
- Improvements (should fix)
- Suggestions (nice to have)

For each issue: line number + specific problem + recommended fix.
```

### Data Analysis Prompting

```prompt
I've uploaded a dataset about [describe the data].

Dataset description:
- Source: [where the data came from]
- Time period: [date range]
- Variables: [key columns and what they represent]
- Business context: [what business decisions this data should inform]

Please analyze this data for:
1. Summary statistics for all numeric variables (mean, median, min, max, missing values)
2. Any obvious data quality issues (outliers, missing values, suspicious patterns)
3. The key trends in [specific variables most important to my question]
4. Any correlations worth exploring between [variable pairs you're interested in]
5. Answers to these specific questions:
   - [Question 1]
   - [Question 2]
   - [Question 3]

Generate visualizations for: [types of charts you want]
Flag any findings that seem surprising or that would warrant further investigation.
```

---

## Section 6: Building Your Domain Prompt System

### The Domain Prompt System Architecture

For professionals using AI daily in a specific domain, a systematic prompt library outperforms ad-hoc prompting. Here's how to build one:

```prompt
Help me build a domain-specific prompt system for my work as a [your role].

My most common AI tasks in my role:
1. [Task 1]
2. [Task 2]
3. [Task 3]
4. [Task 4]
5. [Task 5]

My domain-specific constraints:
- Regulatory requirements: [what regulations govern my work]
- Professional standards: [what professional standards apply]
- Confidentiality requirements: [what I can/cannot share with AI tools]
- Accuracy requirements: [where errors are unacceptable]

Build a prompt system with:
1. A master context template for all my prompts (background about my role and standards)
2. A dedicated prompt template for each of my 5 most common tasks
3. A "sanity check" prompt I can run on any AI output to verify it meets 
   my professional standards
4. A list of things my domain's AI use should ALWAYS include (safety guardrails)
5. A list of things my domain's AI use should NEVER do (ethical and legal guardrails)
```

> 🎯 **Try This Now:** Identify the 3 AI tasks most common in your professional domain. For each one, write a prompt template that incorporates the domain-specific considerations from this module: appropriate confidence signaling, verification requirements, professional standards, regulatory constraints. Test each template on a real task and note where the domain-specific elements improved the output compared to a general prompt.

---

## Key Takeaways

1. **Domain-specific prompting builds on general techniques** — the six components and advanced techniques apply everywhere; domain adaptation adds field-specific requirements and constraints.

2. **Legal work requires citation verification** — AI can "hallucinate" cases and statutes; every AI-generated legal citation must be verified before professional use.

3. **Healthcare work requires HIPAA awareness** — patient identifiable information should not go into commercial cloud AI tools without privacy-preserving measures.

4. **Financial analysis AI should be data-driven** — AI writes the narrative around your verified data; AI should not fabricate financial figures or provide personalized investment advice.

5. **Education AI offers legitimate, valuable applications** — differentiated explanations, curriculum design, and assessment creation are genuinely valuable; academic integrity tools must accompany student-facing AI use.

6. **Code prompts require specification precision** — language version, codebase context, functional requirements, error handling, and testing requirements are all essential for quality code output.

7. **A domain prompt system multiplies professional productivity** — a library of domain-appropriate templates with built-in safeguards produces consistently better results than ad-hoc prompting.

---

## Reflection Questions

1. In your professional domain, what are the three types of AI use that carry the highest risk if done incorrectly? How would you build safeguards into your prompts for each of these high-risk uses?

2. The module identifies AI activities that are appropriate vs. inappropriate in each domain. For your domain, are there common AI uses you see colleagues doing that you believe cross the line? What would you say to them about the risks?

3. Building a domain prompt system requires significant upfront investment — writing, testing, and refining templates for your most common tasks. What's the calculus for that investment: how much time would a complete domain prompt system save you per month, and how long would building it take? Does the math justify the investment?

---

*Course Complete: Prompt Engineering Mastery. You now have a comprehensive, professional-grade prompt engineering skill set applicable to any AI model and any professional domain. Recommended next: AI Tools for Productivity — applying your prompt engineering skills across the complete ecosystem of AI productivity tools today.*
