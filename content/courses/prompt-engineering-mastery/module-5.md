# Module 5: Domain-Specific Prompting

**Duration:** 50 minutes

## Learning Objectives

By the end of this module, you will be able to:

- Craft effective prompts for technical writing and documentation
- Design prompts for business analysis and strategic work
- Create prompts for creative content across various formats
- Generate high-quality code using specialized prompting techniques
- Apply domain-specific best practices for data analysis tasks

## Introduction

Generic prompting techniques work across domains, but mastering domain-specific approaches unlocks exceptional results. Each field—whether technical writing, business analysis, creative work, coding, or data analysis—has unique requirements, conventions, and quality criteria.

This module provides battle-tested prompting strategies for five major domains, complete with templates you can adapt to your specific needs.

## Technical Writing and Documentation

### Domain Characteristics

- Precision and accuracy are paramount
- Consistency in terminology and style
- Clear hierarchy and structure
- Audience-appropriate complexity
- Comprehensive yet concise

### Key Prompting Strategies

**1. Specify Target Audience Expertise**

```
"Write API documentation for the /users endpoint.

Audience: External developers (intermediate level) who have integrated REST APIs before but are new to our service.

Assume they know: HTTP methods, JSON, authentication basics
Don't assume they know: Our specific authentication flow, rate limits, data models"
```

**2. Define Format Standards**

```
"Document this Python function following Google style guide:

Include:
- One-line summary
- Detailed description (2-3 sentences)
- Args section with types
- Returns section with type
- Raises section if applicable
- Example usage

Function: [paste code]"
```

**3. Request Examples and Edge Cases**

```
"Create user guide for our export feature.

Include:
- Step-by-step instructions with screenshots
- 3 common use cases with examples
- Error messages users might see and what they mean
- Troubleshooting section (3-5 common issues)
- Expected behavior and limitations"
```

### Technical Writing Templates

**API Documentation:**
```
"Document this API endpoint:

Endpoint: [URL and method]
Purpose: [What it does]
Authentication: [Required auth]

Generate documentation with:
1. Endpoint summary (1 sentence)
2. Request format (headers, body schema)
3. Response format (status codes, response schema)
4. Code examples (curl, JavaScript, Python)
5. Error responses (all possible error codes)
6. Rate limits and usage notes

Style: Clear, professional, example-driven
Format: Markdown with code blocks"
```

**User Guide:**
```
"Write a user guide section for [feature name]:

Context: [What the feature does and why users need it]
Audience: [User type and technical level]

Structure:
1. Overview (What is this feature? When to use it?)
2. Prerequisites (What users need before starting)
3. Step-by-step instructions (numbered, with screenshots)
4. Tips and best practices (bullet points)
5. Troubleshooting (3-5 common issues)
6. Related features or next steps

Tone: Clear, helpful, patient
Length: 400-600 words"
```

## Business Analysis and Strategy

### Domain Characteristics

- Data-driven decision support
- Multiple stakeholder perspectives
- Risk and opportunity assessment
- Actionable recommendations
- Executive-level clarity

### Key Prompting Strategies

**1. Frame Business Context**

```
"Analyze this market entry opportunity:

Company context: Mid-sized SaaS company ($50M ARR, 200 employees)
Opportunity: Expansion into European market
Current state: 100% North American revenue
Decision timeline: Board meeting in 2 weeks

Provide:
- Market size and growth potential
- Key risks and mitigation strategies
- Resource requirements (people, capital, time)
- Expected ROI timeline
- Go/no-go recommendation with rationale"
```

**2. Request Multiple Perspectives**

```
"Analyze this pricing change from three viewpoints:

Proposed change: Increase base price 20%, add premium tier

Perspectives needed:
1. Financial: Revenue impact, margin analysis, scenarios
2. Customer: Retention risk, competitive positioning, value perception
3. Sales: Team objection handling, win rate impact, commission structure

For each perspective:
- Key concerns (3-5 bullets)
- Quantitative impact estimates
- Recommended approach"
```

**3. Demand Supporting Evidence**

```
"Evaluate this partnership proposal:

[Details of partnership]

Requirements:
- Support all claims with specific data or logic
- If data is unavailable, state assumptions explicitly
- Provide confidence levels (high/medium/low) for projections
- Include both best-case and worst-case scenarios
- Cite comparable partnerships or precedents where relevant"
```

### Business Analysis Templates

**Strategic Recommendation:**
```
"Create a strategic recommendation memo for [decision]:

Executive Summary (150 words):
- Current situation
- Recommendation
- Key rationale (3 points)
- Expected impact

Analysis (500 words):
- Market/competitive context
- Financial implications
- Risk assessment (with mitigation plans)
- Implementation requirements
- Success metrics

Recommendation:
- Specific action items with owners
- Timeline
- Budget requirements
- Key dependencies

Appendix:
- Data sources
- Assumptions
- Alternative options considered"
```

**Competitive Analysis:**
```
"Analyze our competitive position against [competitor]:

Framework: Use these dimensions
1. Product capabilities
2. Pricing and business model
3. Market positioning and messaging
4. Customer segments and fit
5. Strengths and weaknesses

Format:
- Side-by-side comparison table
- 3-5 key differentiators
- Strategic implications (3 paragraphs)
- Recommended positioning adjustments

Tone: Objective, data-driven, strategic
Sources: [provide relevant data]"
```

## Creative Content Creation

### Domain Characteristics

- Emotional resonance and engagement
- Brand voice consistency
- Originality and freshness
- Audience-specific appeal
- Format-specific conventions

### Key Prompting Strategies

**1. Define Brand Voice Precisely**

```
"Write Instagram captions for our eco-friendly product brand:

Brand voice:
- Tone: Warm, encouraging, never preachy or guilt-inducing
- Values: Sustainability, authenticity, community
- Language: Conversational, inclusive ('we' and 'our'), optimistic
- Avoid: Greenwashing terms, corporate speak, perfectionism

Create 5 captions with:
- Hook in first line (must grab attention)
- Personal story or relatable scenario
- Product mention (natural, not salesy)
- Call to action
- Relevant hashtags (5-7)"
```

**2. Provide Creative Constraints**

```
"Create 10 headline variations for our blog post about remote work productivity:

Constraints:
- Length: 50-70 characters (for SEO)
- Must include: 'remote work' or 'working from home'
- Avoid: Clickbait phrases, numbers unless compelling
- Tone: Helpful and specific (not generic advice)

Variation styles:
- 3 question-based headlines
- 3 how-to headlines
- 4 benefit-driven headlines

For each, briefly explain the psychological trigger it leverages."
```

**3. Request Multiple Options**

```
"Generate 5 distinct email subject lines for our product launch:

Product: [Description]
Audience: [Target segment]

Each subject line should use a different approach:
1. Curiosity-driven
2. Benefit-focused
3. Urgency-based
4. Social proof
5. Personal/emotional

For each, include:
- Subject line (max 50 chars)
- Why this approach fits our audience
- Predicted open rate impact (high/medium/low)"
```

### Creative Content Templates

**Blog Post:**
```
"Write a blog post for [topic]:

Audience: [Description, pain points, goals]
Keyword: [Primary SEO keyword]
Goal: [What reader should think/feel/do after reading]

Structure:
- Compelling title (2-3 options)
- Hook paragraph (identify with reader's problem)
- 3-5 main sections with subheadings
- Practical examples in each section
- Action items (3-5 bullets)
- Conclusion with clear next step

Tone: [Brand voice description]
Length: 1,200-1,500 words
Style: Scannable (short paragraphs, bullet points, headers)"
```

**Social Media Campaign:**
```
"Create a 5-post social media campaign for [campaign goal]:

Platform: [LinkedIn/Instagram/Twitter]
Duration: 1 week
Theme: [Campaign theme]

For each post provide:
- Core message
- Visual concept description
- Copy (platform-appropriate length)
- Hashtags
- Call to action
- Best posting time

Campaign arc:
- Post 1: Awareness/problem identification
- Post 2-3: Education/engagement
- Post 4: Social proof/case study
- Post 5: Call to action/conversion"
```

## Code Generation

### Domain Characteristics

- Correctness and efficiency
- Following language conventions
- Error handling and edge cases
- Documentation and maintainability
- Testing and validation

### Key Prompting Strategies

**1. Specify Language and Standards**

```
"Write a Python function to calculate compound interest:

Requirements:
- Python 3.10+
- Type hints for all parameters and returns
- Google-style docstring
- Handle edge cases (negative values, zero)
- Raise appropriate exceptions with clear messages
- Include example usage

Follow PEP 8 style guide"
```

**2. Request Tests and Documentation**

```
"Create a React component for a user profile card:

Component requirements:
- Props: user object (name, email, avatarUrl, bio)
- Responsive design (mobile and desktop)
- Loading state
- Error state if user is null
- Click handler for profile view

Include:
1. Main component code (TypeScript)
2. PropTypes or interface definition
3. 3 unit tests (using Jest/React Testing Library)
4. Usage example
5. Storybook story (if applicable)

Style: Functional component with hooks"
```

**3. Define Performance and Security Requirements**

```
"Write a SQL query to analyze user engagement:

Context: E-commerce database
Goal: Find users who visited 3+ times but never purchased

Requirements:
- Optimize for performance (large dataset: 10M+ users)
- Use appropriate indexes (suggest if needed)
- Prevent SQL injection (parameterized)
- Include execution plan
- Comment complex logic

Return: user_id, visit_count, last_visit_date, days_since_first_visit"
```

### Code Generation Templates

**Function with Tests:**
```
"Implement [function description]:

Language: [Programming language]
Inputs: [Parameter descriptions with types]
Output: [Return type and description]
Edge cases: [List specific cases to handle]

Provide:
1. Function implementation with:
   - Type hints/annotations
   - Docstring/comments
   - Error handling
   - Input validation

2. Unit tests covering:
   - Happy path (2-3 cases)
   - Edge cases (all specified)
   - Error conditions
   - Performance (if relevant)

3. Usage example with sample data

Style guide: [Specify if needed]"
```

**API Integration:**
```
"Create an API client for [API name]:

Requirements:
- Language: [Your language]
- Endpoints needed: [List specific endpoints]
- Authentication: [Type]
- Error handling: [Requirements]
- Rate limiting: [How to handle]

Include:
1. Client class with methods for each endpoint
2. Response models/types
3. Error handling with custom exceptions
4. Retry logic with exponential backoff
5. Example usage
6. Tests for success and error cases

Follow: [Language-specific best practices]"
```

## Data Analysis

### Domain Characteristics

- Accuracy and reproducibility
- Clear methodology
- Appropriate statistical techniques
- Visualization for insights
- Actionable conclusions

### Key Prompting Strategies

**1. Define Analysis Objectives**

```
"Analyze this sales data to answer:

Questions:
1. What products drive 80% of revenue?
2. Which customer segments are growing/declining?
3. Is there seasonality we should plan for?
4. What's our customer lifetime value by segment?

Data: [Description or attach dataset]

Provide:
- Methodology for each question
- Statistical summary
- Visualizations (describe charts)
- Key findings (bullet points)
- Business recommendations"
```

**2. Specify Statistical Requirements**

```
"Perform A/B test analysis:

Test: Homepage redesign (control vs. variant)
Metric: Conversion rate
Sample size: 10,000 per group
Confidence level: 95%
Minimum detectable effect: 2%

Analysis needed:
1. Statistical significance test
2. Confidence intervals
3. Power analysis
4. Segmentation analysis (mobile vs desktop)
5. Recommendation with caveats

Include:
- Assumptions and their validity
- Limitations of the analysis
- Required follow-up tests"
```

**3. Request Visualizations**

```
"Analyze quarterly revenue trends:

Data: [Quarterly revenue by product line, 3 years]

Provide:
1. Data summary (descriptive statistics)
2. Visualization recommendations:
   - Overall trend (which chart type and why)
   - Product line comparison (which chart type and why)
   - Growth rate visualization
3. Python/R code to generate these charts
4. Interpretation of each chart
5. Key insights and anomalies"
```

### Data Analysis Templates

**Exploratory Analysis:**
```
"Perform exploratory analysis on [dataset description]:

Objectives:
- Understand data structure and quality
- Identify patterns and relationships
- Flag anomalies or issues
- Suggest hypotheses for further testing

Analysis steps:
1. Data profiling (missing values, distributions, outliers)
2. Summary statistics by key dimensions
3. Correlation analysis
4. Trend analysis (if time series)
5. Segmentation insights

Deliverables:
- Executive summary (5-7 key findings)
- Detailed analysis with code
- Visualization suite (5-7 charts)
- Data quality report
- Recommended next steps

Tools: [Python/R/SQL]
Format: [Jupyter notebook/R markdown/report]"
```

**Predictive Modeling:**
```
"Build a predictive model for [target variable]:

Context: [Business context and why this matters]
Data: [Description of available data]
Goal: [What decisions will this model support]

Requirements:
1. Feature engineering approach
2. Model selection (compare 2-3 algorithms)
3. Training/validation/test split
4. Performance metrics appropriate for [problem type]
5. Feature importance analysis
6. Model interpretation
7. Deployment recommendations

Deliverables:
- Code (reproducible)
- Model performance report
- Feature importance visualization
- Production deployment guide
- Monitoring recommendations"
```

## Cross-Domain Best Practices

Regardless of domain:

1. **Be Specific:** Generic prompts get generic results
2. **Provide Context:** Background improves relevance
3. **Define Success:** State what good looks like
4. **Request Alternatives:** Get options to choose from
5. **Iterate:** First version is rarely perfect

## Action Items

1. **Domain Audit:** Identify your primary domain(s). Find 3 prompts you use regularly and enhance them using techniques from this module.

2. **Template Library:** Create templates for your 5 most common tasks using the format examples provided.

3. **Cross-Domain Application:** Take a technique from one domain and apply it to another (e.g., use technical writing's precision in business analysis).

4. **Quality Checklist:** For your domain, create a quality checklist based on domain characteristics.

5. **Benchmark Test:** Take a current prompt, enhance it with domain-specific techniques, compare outputs side-by-side.

## Key Takeaways

- **Domain expertise** translates to better prompts through understanding field-specific quality criteria
- **Technical writing** requires precision, examples, and audience-appropriate complexity
- **Business analysis** demands data-driven reasoning, multiple perspectives, and actionable recommendations
- **Creative content** benefits from brand voice definition, creative constraints, and multiple variations
- **Code generation** needs clear specifications, testing requirements, and adherence to standards
- **Data analysis** requires clear objectives, appropriate methods, and actionable insights
- **Templates accelerate** consistent results while allowing customization for specific needs

## Final Course Takeaways

Across all five modules, you've learned:

- Foundational prompt engineering principles
- Advanced techniques (chain-of-thought, few-shot learning, role-based prompting)
- Context and constraint mastery
- Iterative refinement methodology
- Domain-specific expertise

**Your Next Steps:**

1. Build your personal prompt library
2. Practice daily with diverse tasks
3. Track what works and iterate
4. Share knowledge with your team
5. Stay current with new techniques

**Continue Learning:**
- Join prompt engineering communities
- Follow AI development blogs
- Experiment with new models
- Contribute to prompt libraries
- Teach others what you've learned

Congratulations on completing Prompt Engineering Mastery! You now have the skills to leverage AI tools at an expert level.
