# Module 3: AI Design & Visual Tools

**Course:** AI Tools for Productivity
**Estimated Time:** 60 minutes
**Difficulty:** 🟡 Intermediate

---

## What You'll Learn

- How to create professional-quality visuals without design training using AI tools
- Midjourney V7, DALL-E 3, and Adobe Firefly: when to use each
- Gamma and AI-powered presentation creation for business professionals
- AI video tools: Runway Gen-3, Sora 2, and practical use cases today
- Canva AI: accessible design for non-designers
- Building a visual content system that produces brand-consistent outputs at scale

---

## Why This Matters Today

> The **today Canva Design Report** found that teams using AI design tools produce visual content **4.7x faster** than those using traditional design software. More significantly, the **quality gap between professionally trained designers and AI-assisted non-designers** has narrowed dramatically — independent evaluation studies show AI-assisted non-designer outputs are rated comparably to mid-level professional design work. Visual communication is no longer a specialized skill; it is now an AI-augmented general professional competency.

The design barrier has collapsed. today, any professional who understands what they want to communicate visually can produce it. This doesn't eliminate the value of professional designers — great design still requires aesthetic judgment, strategic thinking, and expertise. But it eliminates the bottleneck of waiting for design resources for routine visual communication needs.

---

## Section 1: The AI Visual Tool Landscape

### Tool Categories and Their Best Uses

**AI Image Generation (Text-to-Image):**

| Tool | Best For | Access | Cost |
|------|----------|--------|------|
| Midjourney V7 | Artistic quality, photorealism, creative imagery | Discord/Web | $10-$120/month |
| DALL-E 3 | Accurate text in images, concept visualization, follows detailed descriptions | ChatGPT Plus | Included in $20/month |
| Adobe Firefly | Commercial-safe imagery (licensed training data), Adobe suite integration | Adobe CC | Included in Adobe subscription |
| Canva AI | Simple, brand-consistent, fast generation within a design context | Canva Pro | $13/month |

**AI Presentation Creation:**

| Tool | Best For | Cost |
|------|----------|------|
| Gamma | Complete presentations from text | Free / $15/month |
| Beautiful.ai | Smart templates with AI layout | $12/month |
| Microsoft Copilot | PowerPoint integration | Included in M365 Copilot |
| Tome | Narrative-focused decks | Free / $16/month |

**AI Video Generation:**

| Tool | Best For | Cost |
|------|----------|------|
| Runway Gen-3 | High-quality short video generation | $15-$95/month |
| Sora 2 (OpenAI) | Photorealistic video from text | Included in ChatGPT Pro |
| Kling AI | Cost-effective video generation | $8/month |
| HeyGen | AI avatars for video presentations | $29/month |

---

## Section 2: Midjourney V7 Mastery for Professionals

### The Professional's Prompting Guide

Midjourney V7 introduced significant improvements in prompt adherence, photorealism, and coherence. Here is the professional prompting framework:

**The Full Prompt Structure:**
```
[Subject] [Context/Setting] [Lighting] [Style/Aesthetic] [Composition] [Technical Parameters]
```

**Example (LinkedIn profile photo style image):**
```
/imagine Professional headshot of a woman in her 40s with confident expression, 
neutral gray studio background, soft studio lighting, clean professional photography 
style, centered composition, shoulders to head framing --ar 4:5 --v 7 --style raw
```

**Example (Product photography):**
```
/imagine Minimalist flat lay of sustainable coffee brand packaging — kraft paper bags 
with muted green labels, scattered coffee beans, eucalyptus leaves, on white marble 
surface, natural window light from upper left, clean modern product photography style, 
high-end consumer brand aesthetic --ar 4:5 --v 7
```

**Example (Conceptual/abstract illustration):**
```
/imagine Abstract digital illustration representing AI and human collaboration, 
human hand reaching toward network of glowing neural connections floating in space, 
deep navy and electric blue color palette, tech futurism aesthetic, editorial 
illustration style --ar 16:9 --v 7
```

### Essential Midjourney Parameters

```
--ar [ratio]     Aspect ratio: --ar 16:9 (widescreen) --ar 4:5 (portrait) --ar 1:1 (square)
--v 7            Version 7 (current best quality)
--style raw      More photorealistic, less stylized
--q 2            Higher quality generation (takes longer)
--no [word]      Exclude specific elements: --no text, --no people, --no watermark
--seed [number]  Reproduce a specific result
--chaos [0-100]  More variation: 0=consistent, 100=wildly varied
```

### When Midjourney Is the Right Choice

Use Midjourney V7 when:
- Artistic quality matters (hero images, marketing materials, social media visuals)
- You need photorealistic people, places, or objects
- The creative direction requires high aesthetic quality
- You're willing to spend time prompting for excellence

Don't use Midjourney when:
- You need accurate text in the image (DALL-E 3 is better for this)
- You need it integrated into a design context (Canva AI is simpler)
- The image needs to feature real people (ethical issues with realistic fake people)
- Commercial use concerns exist around training data (Adobe Firefly is safer)

---

## Section 3: DALL-E 3 for Business Visuals

### Where DALL-E 3 Excels

DALL-E 3 (accessed through ChatGPT Plus) excels at:
- Following precise, complex descriptions more faithfully than Midjourney
- Rendering text within images accurately (signs, labels, titles)
- Creating consistent visual concepts across multiple iterations
- Generating images within a ChatGPT conversation alongside text work

**DALL-E 3 Professional Use Cases:**

**Infographic concepts:**
```prompt
[In ChatGPT with DALL-E]

Create an infographic-style image showing the journey from "Problem" to "Solution" 
in 5 steps: Discovery, Analysis, Ideation, Testing, Launch. 

Style: Clean, modern corporate design. Color scheme: navy blue, white, and gold accents.
Show each step as a connected icon/node in a horizontal flow. 
Include small descriptive icons for each step — magnifying glass for Discovery, 
chart for Analysis, lightbulb for Ideation, checkmark for Testing, rocket for Launch.
Format: Landscape (16:9).
No additional text beyond the step labels I've specified.
```

**Social media graphics with accurate text:**
```prompt
Create a professional social media quote graphic.

Quote text to display exactly: "The best time to start was yesterday. The second best time is now."

Design specs:
- Background: Dark teal gradient (top-left to bottom-right)
- Quote text: Large, white, clean sans-serif font
- Attribution: Smaller text below, right-aligned: "— Your Brand Name"
- Decorative element: Subtle geometric pattern in background
- Format: Square (1:1 ratio)
- No additional text or elements
```

---

## Section 4: Gamma — AI Presentations in Minutes

### The Gamma Workflow for Business Professionals

Gamma is the highest-value presentation tool for business professionals today. Here is the complete workflow:

**Step 1: The presentation brief**
Before opening Gamma, write your brief in a text document:
- Topic and goal
- Audience and their context
- Key messages (3-5)
- The one thing they should do after seeing this
- Approximate number of slides (10-15 is typical)

**Step 2: Generate in Gamma**
1. Go to gamma.app and click "Create New"
2. Choose "Generate" (AI-created from scratch)
3. Paste your brief or describe your presentation
4. Review and edit the AI-generated outline before generating slides
5. Gamma produces a complete, designed deck

**Step 3: Edit the output**
Gamma's deck will be structurally strong but needs your specific content:
- Replace placeholder text with your actual data
- Add or replace Gamma's images with specific visuals from Midjourney or your own
- Adjust the design to match your brand colors and fonts
- Add transitions and animations if needed

**The Gamma Prompt Template:**
```
Create a presentation for [audience — describe their role and context].

Topic: [your topic]
Goal: After seeing this presentation, the audience should [action/belief/decision]

The presentation should cover:
1. [Key message 1 — what you want them to understand]
2. [Key message 2]
3. [Key message 3]
4. [Key message 4]
5. [Call to action or next steps]

Tone: [professional / conversational / inspiring / educational]
Format: [pitch deck / report presentation / training / proposal]
Number of slides: approximately [10-15]

Include: one slide showing data/evidence for the main claim, 
one slide with a concrete example or case study.
```

### Gamma vs. PowerPoint vs. Google Slides

| Consideration | Gamma | PowerPoint | Google Slides |
|--------------|-------|-----------|---------------|
| Creation speed | Very fast (minutes) | Slow | Moderate |
| Design quality | High (AI design) | Depends on template | Moderate |
| Customization | Moderate | Full | Full |
| Brand adherence | Limited | Full | Full |
| Collaboration | Good | Excellent | Excellent |
| Export options | PDF, PPT, web | All formats | All formats |
| Best for | Quick, professional decks | Complex branded decks | Collaborative editing |

> 💡 **Pro Tip:** Use Gamma for first drafts and internal presentations. When a presentation goes to external stakeholders or requires strict brand adherence, export the Gamma deck as a PowerPoint file and refine it in PowerPoint or Google Slides. The best of both worlds: Gamma's speed for generation, traditional tools for brand-perfect polish.

---

## Section 5: AI Video for Professional Productivity

### Practical AI Video Applications today

AI video has moved from experimental to practical for business use:

**Loom + AI:** Loom's AI features automatically transcribe, title, summarize, and identify key moments in screen recordings. For tutorial and demo creation, this makes video documentation 3x faster.

**HeyGen:** Create video presentations with an AI avatar of yourself (or stock avatars). Write a script, choose or create an avatar, generate a video. Useful for: training videos, product demos, personalized outreach videos.

**Runway Gen-3:** Generate short video clips (5-30 seconds) from text prompts or images. Useful for: B-roll footage, product visualizations, social media video content.

**Kapwing AI:** AI-powered video editing. Auto-caption, remove filler words, create clips, translate video content. Useful for: polishing existing video content efficiently.

### The Video Productivity Workflow

For professionals creating video content regularly:

```
Step 1: Script with AI (Claude or ChatGPT — 10 minutes)
Step 2: Record video (Loom or phone — actual recording time)
Step 3: Loom AI transcribes and identifies key moments (automatic)
Step 4: Kapwing removes filler words, adds captions (15 minutes)
Step 5: Add B-roll from Runway Gen-3 or stock footage (20 minutes)
Step 6: Export and distribute
```

Total production time for a 3-5 minute professional video: 1-2 hours
Traditional production time: 3-5 hours minimum

---

## Section 6: Building a Visual Content System

### The Brand-Consistent Visual System

Creating visual content at scale requires consistency. Without a system, AI-generated visuals look unrelated and undermine brand coherence.

**Build a visual system document:**

```prompt
Help me create a visual content system for [brand].

Brand identity:
- Brand colors: [primary, secondary, accent with hex codes if possible]
- Brand fonts: [primary and secondary fonts]
- Brand aesthetic: [3 adjectives — e.g., clean, modern, approachable]
- Brand personality: [how the brand should feel visually]

Visual needs:
- Social media posts: [platforms and formats]
- Presentation backgrounds: [use case]
- Website images: [style and subject matter]
- Marketing materials: [what you create]

Create a visual system guide with:
1. A "style bible" for AI image generation — specific prompts for our aesthetic
2. Midjourney/DALL-E prompt templates for each visual category
3. Colors and their application (which colors for what type of content)
4. What to avoid — visual elements inconsistent with our brand
5. Subject matter guide — what type of imagery represents our brand

Format this so I can paste relevant sections into AI image generation prompts.
```

### The Content Template System

For recurring visual content (social media, presentations, reports):

```prompt
I create [type of visual content] regularly and want to build a template system.

Content type: [social media posts / presentations / reports / email headers]
Volume: [how many per week/month]
Platforms: [where it will appear]
Brand context: [brief brand description]

Design a template system with:
1. 3-4 master templates for different content categories
2. A Gamma/Canva prompt template for each master template
3. A Midjourney prompt template for the images in each template
4. A naming and organization system for saving and reusing templates
5. A quality checklist to apply before each piece goes out

Also: What information do I need to gather before generating each piece 
to ensure it fits the template?
```

> 🎯 **Try This Now:** Pick one recurring visual need in your work — a weekly social media graphic, a slide template you use often, or an image type you regularly need. Use the tools in this module to create a reusable AI prompt that produces that visual consistently. Store the prompt. The next time you need that visual type, you should be able to produce it in under 5 minutes.

---

## Key Takeaways

1. **The design barrier has collapsed** — AI-assisted non-designers can produce outputs comparable to mid-level professional design for most business visual needs.

2. **Tool selection matters by use case** — Midjourney for artistic quality, DALL-E 3 for text-in-image accuracy, Adobe Firefly for commercial-safe imagery, Canva AI for accessibility.

3. **Gamma is the presentation revolution** — complete professional decks from a text brief in minutes; use it for first drafts and internal decks, then export for brand-critical external presentations.

4. **AI video is practical for business today** — HeyGen for avatar videos, Loom AI for screen recording documentation, Runway Gen-3 for B-roll; a 3-5 minute video now takes 1-2 hours to produce.

5. **A visual system document prevents brand drift** — Midjourney and DALL-E prompt templates that encode your brand aesthetic produce consistently on-brand content at scale.

6. **Template systems multiply efficiency** — invest 2 hours building prompt templates for your 3-4 most common visual needs; each subsequent creation takes 5-10 minutes instead of 30-60 minutes.

7. **Professional designers are not replaced** — AI handles routine visual production; professional designers are freed for strategic brand work, creative direction, and complex visual problem-solving where judgment matters.

---

## Reflection Questions

1. What is the most time-consuming visual content creation task in your current work? How much time does it take per week? Based on what you've learned in this module, what would change if you used AI tools for this task?

2. The module describes a "style bible" for AI image generation that encodes your brand aesthetic into prompt templates. If you were to write the three most important elements of your brand's visual identity, what would they be? How would you translate those into Midjourney or DALL-E prompts?

3. AI video tools like HeyGen enable creating video content with an AI avatar — something that raises questions about authenticity and transparency. Where do you personally draw the line on AI-generated video in professional contexts? What disclosure, if any, do you think is appropriate?

---

*Next Module: Automation Workflows with AI — building systems that work while you sleep.*
