# Module 4: Automation Workflows with AI

**Duration:** 45 minutes

## Learning Objectives

- Design end-to-end AI-powered automation workflows
- Integrate AI with popular automation platforms (Zapier, Make.com)
- Implement ChatGPT API for custom automations
- Build batch processing systems with AI
- Create robust error handling and monitoring

## Introduction

Automation transforms repetitive tasks into streamlined processes. When combined with AI, automation becomes intelligent—capable of handling nuanced decisions, generating custom content, and adapting to context. This module teaches you to build production-ready AI automation workflows.

## Automation Platform Integration

### Zapier + AI Integration

**Use Case: Auto-respond to Customer Emails**

Workflow:
1. Trigger: New email arrives in Gmail
2. AI Action: ChatGPT analyzes email and generates response
3. Action: Send draft reply via Gmail

**Setup:**
```
Trigger: Gmail - New Email Matching Search
Search: label:support -label:replied

Action: ChatGPT - Generate Response
Prompt: "Draft a professional support response:
Email: {{email_body}}
Context: Customer support for SaaS product
Tone: Helpful, empathetic
Length: 150-200 words"

Action: Gmail - Create Draft
To: {{email_from}}
Subject: Re: {{email_subject}}
Body: {{chatgpt_response}}
```

### Make.com Automation

**Use Case: Social Media Content Pipeline**

Workflow:
1. Google Sheets: List of blog post URLs
2. Web scraper: Extract content
3. ChatGPT: Generate social posts
4. Buffer/Hootsuite: Schedule posts

**Module Configuration:**
```
Module 1: Google Sheets - Watch Rows
Sheet: Content Calendar
Trigger: New row added

Module 2: HTTP - Get Webpage
URL: {{sheet_blog_url}}

Module 3: OpenAI - Create Completion
Model: gpt-4
Prompt: "Convert this blog post into 3 social media posts:
- LinkedIn: Professional, 150 words
- Twitter: Concise, under 280 chars
- Instagram: Visual-focused, hashtags

Blog content: {{webpage_text}}"

Module 4: Buffer - Create Post
Content: {{openai_response}}
Schedule: {{sheet_schedule_time}}
```

## ChatGPT API Implementation

### Basic API Structure

```python
import openai
import os

# Configuration
openai.api_key = os.getenv("OPENAI_API_KEY")

def generate_completion(prompt, temperature=0.7):
    """
    Generate AI completion with error handling
    
    Args:
        prompt (str): User prompt
        temperature (float): Creativity level 0-1
    
    Returns:
        str: AI response
    """
    try:
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": prompt}
            ],
            temperature=temperature,
            max_tokens=500
        )
        return response.choices[0].message.content
    
    except openai.error.RateLimitError:
        # Handle rate limiting
        print("Rate limit exceeded. Waiting...")
        time.sleep(20)
        return generate_completion(prompt, temperature)
    
    except openai.error.APIError as e:
        print(f"API Error: {e}")
        return None
```

### Batch Processing System

**Use Case: Process 100 Customer Reviews**

```python
import pandas as pd
from concurrent.futures import ThreadPoolExecutor
import time

def analyze_review(review_text):
    """Analyze sentiment and extract insights"""
    prompt = f"""
    Analyze this customer review:
    "{review_text}"
    
    Provide:
    1. Sentiment: Positive/Negative/Neutral
    2. Key themes (2-3 bullet points)
    3. Action items if negative
    """
    
    return generate_completion(prompt, temperature=0.3)

def batch_process_reviews(reviews_df):
    """
    Process multiple reviews in parallel
    
    Args:
        reviews_df: DataFrame with 'review_text' column
    
    Returns:
        DataFrame with analysis results
    """
    results = []
    
    # Process in batches to respect rate limits
    batch_size = 10
    delay_between_batches = 5
    
    for i in range(0, len(reviews_df), batch_size):
        batch = reviews_df[i:i+batch_size]
        
        # Parallel processing within batch
        with ThreadPoolExecutor(max_workers=5) as executor:
            batch_results = list(executor.map(
                analyze_review, 
                batch['review_text']
            ))
        
        results.extend(batch_results)
        
        # Rate limiting
        if i + batch_size < len(reviews_df):
            time.sleep(delay_between_batches)
    
    reviews_df['ai_analysis'] = results
    return reviews_df

# Usage
reviews = pd.read_csv('customer_reviews.csv')
analyzed = batch_process_reviews(reviews)
analyzed.to_csv('analyzed_reviews.csv', index=False)
```

## Advanced Workflow Patterns

### Sequential Processing

**Pattern: Document → Summary → Action Items → Email**

```python
class DocumentWorkflow:
    def __init__(self, document_text):
        self.document = document_text
        self.summary = None
        self.action_items = None
        self.email = None
    
    def run(self):
        """Execute workflow steps"""
        self.summary = self.generate_summary()
        self.action_items = self.extract_actions()
        self.email = self.draft_email()
        return self.compile_results()
    
    def generate_summary(self):
        prompt = f"""
        Summarize this document in 3-4 sentences:
        {self.document}
        """
        return generate_completion(prompt, temperature=0.3)
    
    def extract_actions(self):
        prompt = f"""
        Based on this summary, list specific action items:
        {self.summary}
        
        Format as numbered list with owner and deadline.
        """
        return generate_completion(prompt, temperature=0.2)
    
    def draft_email(self):
        prompt = f"""
        Draft a professional email to the team:
        
        Summary: {self.summary}
        Action Items: {self.action_items}
        
        Tone: Professional but friendly
        Length: 150 words
        """
        return generate_completion(prompt, temperature=0.5)
    
    def compile_results(self):
        return {
            'summary': self.summary,
            'action_items': self.action_items,
            'email_draft': self.email
        }
```

### Conditional Branching

**Pattern: Route Based on Content Type**

```python
def smart_router(input_text):
    """Route to different workflows based on content"""
    
    # Classify input
    classification_prompt = f"""
    Classify this text as one of: email, report, note, question
    Text: "{input_text}"
    Return ONLY the category, nothing else.
    """
    
    category = generate_completion(classification_prompt, temperature=0.1).strip().lower()
    
    # Route to appropriate workflow
    workflows = {
        'email': process_email,
        'report': process_report,
        'note': process_note,
        'question': process_question
    }
    
    handler = workflows.get(category, default_handler)
    return handler(input_text)

def process_email(text):
    """Email-specific processing"""
    return generate_completion(f"Draft response to: {text}")

def process_report(text):
    """Report-specific processing"""
    return generate_completion(f"Summarize key findings: {text}")
```

## Error Handling Strategies

### Retry Logic

```python
from functools import wraps
import time

def retry_on_failure(max_attempts=3, delay=2, backoff=2):
    """Decorator for automatic retry with exponential backoff"""
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            attempt = 0
            current_delay = delay
            
            while attempt < max_attempts:
                try:
                    return func(*args, **kwargs)
                except Exception as e:
                    attempt += 1
                    if attempt >= max_attempts:
                        raise
                    
                    print(f"Attempt {attempt} failed: {e}")
                    print(f"Retrying in {current_delay} seconds...")
                    time.sleep(current_delay)
                    current_delay *= backoff
            
        return wrapper
    return decorator

@retry_on_failure(max_attempts=3, delay=1, backoff=2)
def api_call_with_retry(prompt):
    """API call with automatic retry"""
    return generate_completion(prompt)
```

### Error Logging

```python
import logging
from datetime import datetime

# Configure logging
logging.basicConfig(
    filename=f'automation_log_{datetime.now().strftime("%Y%m%d")}.log',
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)

def process_with_logging(input_data):
    """Process with comprehensive logging"""
    try:
        logging.info(f"Processing started: {input_data[:50]}...")
        
        result = generate_completion(input_data)
        
        logging.info(f"Processing completed: {len(result)} chars generated")
        return result
    
    except Exception as e:
        logging.error(f"Processing failed: {str(e)}")
        logging.error(f"Input data: {input_data}")
        raise
```

## Real-World Automation Examples

### Example 1: Content Repurposing Pipeline

```python
class ContentRepurposer:
    """Transform long-form content into multiple formats"""
    
    def __init__(self, blog_post):
        self.blog_post = blog_post
    
    def repurpose(self):
        """Generate all content variations"""
        return {
            'twitter_thread': self.create_twitter_thread(),
            'linkedin_post': self.create_linkedin_post(),
            'email_newsletter': self.create_newsletter(),
            'video_script': self.create_video_script()
        }
    
    def create_twitter_thread(self):
        prompt = f"""
        Convert this blog post into a Twitter thread (8-10 tweets):
        
        {self.blog_post}
        
        Requirements:
        - First tweet: Hook (under 280 chars)
        - Middle tweets: Key points (under 280 chars each)
        - Last tweet: CTA with link
        - Use emojis strategically
        """
        return generate_completion(prompt, temperature=0.7)
```

### Example 2: Customer Support Automation

```python
class SupportTicketAutomation:
    """Automate support ticket processing"""
    
    def process_ticket(self, ticket_text, customer_history):
        # Step 1: Classify urgency
        urgency = self.classify_urgency(ticket_text)
        
        # Step 2: Suggest response
        response = self.draft_response(ticket_text, customer_history)
        
        # Step 3: Suggest related KB articles
        articles = self.find_kb_articles(ticket_text)
        
        return {
            'urgency': urgency,
            'draft_response': response,
            'kb_articles': articles
        }
    
    def classify_urgency(self, text):
        prompt = f"""
        Classify urgency (1-5):
        1 = Question, no blocker
        5 = System down, revenue impact
        
        Ticket: "{text}"
        
        Return ONLY the number.
        """
        return int(generate_completion(prompt, temperature=0.1))
    
    def draft_response(self, ticket, history):
        prompt = f"""
        Draft support response:
        
        Current Issue: {ticket}
        Customer History: {history}
        
        Be empathetic, provide solution, set expectations.
        150-200 words.
        """
        return generate_completion(prompt, temperature=0.6)
```

## Monitoring and Optimization

### Performance Tracking

```python
import time
from dataclasses import dataclass
from typing import List

@dataclass
class WorkflowMetrics:
    total_runs: int = 0
    successful_runs: int = 0
    failed_runs: int = 0
    avg_duration: float = 0
    total_cost: float = 0

class MonitoredWorkflow:
    def __init__(self):
        self.metrics = WorkflowMetrics()
        self.run_history: List[dict] = []
    
    def execute(self, input_data):
        start_time = time.time()
        self.metrics.total_runs += 1
        
        try:
            result = self.process(input_data)
            self.metrics.successful_runs += 1
            status = 'success'
        except Exception as e:
            self.metrics.failed_runs += 1
            status = 'failed'
            result = None
        
        duration = time.time() - start_time
        
        # Update metrics
        self.metrics.avg_duration = (
            (self.metrics.avg_duration * (self.metrics.total_runs - 1) + duration) 
            / self.metrics.total_runs
        )
        
        # Log run
        self.run_history.append({
            'timestamp': time.time(),
            'duration': duration,
            'status': status,
            'input_length': len(str(input_data))
        })
        
        return result
    
    def get_report(self):
        success_rate = (self.metrics.successful_runs / self.metrics.total_runs * 100 
                       if self.metrics.total_runs > 0 else 0)
        
        return f"""
        Workflow Performance Report
        ==========================
        Total Runs: {self.metrics.total_runs}
        Success Rate: {success_rate:.1f}%
        Avg Duration: {self.metrics.avg_duration:.2f}s
        Failed Runs: {self.metrics.failed_runs}
        """
```

## Action Items

1. **Build Your First Automation:** Choose a repetitive task and automate it using Zapier or Make.com with AI

2. **API Practice:** Implement a batch processing script using the ChatGPT API

3. **Error Handling:** Add retry logic and logging to an existing automation

4. **Monitor Performance:** Track metrics for one automation over one week

5. **Workflow Library:** Document 3 automation workflows you could implement for your work

## Key Takeaways

- **AI automation** combines the scale of automation with the intelligence of AI
- **Platform integrations** (Zapier, Make.com) enable no-code AI workflows
- **ChatGPT API** provides flexibility for custom automation solutions
- **Batch processing** requires rate limiting and parallel execution strategies
- **Error handling** with retries and logging ensures reliability
- **Monitoring** tracks performance and enables continuous optimization

## Resources

- Zapier AI Actions documentation
- OpenAI API reference
- Make.com integrations guide
- Automation workflow templates

Next module: Integration strategies for connecting multiple AI tools into comprehensive systems.
