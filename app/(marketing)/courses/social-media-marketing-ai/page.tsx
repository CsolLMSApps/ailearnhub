import { Metadata } from 'next'
import Link from 'next/link'
import { CheckCircle, Clock, Award, Users, TrendingUp, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export const metadata: Metadata = {
  title: 'Social Media Marketing with AI Course - Master AI-Powered Social Media | AI Learn Hub',
  description: 'Learn to dominate social media using AI tools like ChatGPT, Canva AI, and automation platforms. Create content 10x faster, analyze performance, and grow your audience. Perfect for marketers and entrepreneurs. Enroll now for $29!',
  keywords: [
    'social media marketing course',
    'ai social media marketing',
    'chatgpt social media',
    'ai content creation',
    'social media automation',
    'ai marketing course',
    'learn social media marketing',
    'ai for instagram',
    'ai for tiktok',
    'social media strategy',
    'content marketing ai',
    'social media analytics',
    'influencer marketing course',
    'ai powered social media',
  ],
  openGraph: {
    title: 'Social Media Marketing with AI - Complete Course',
    description: 'Master AI-powered social media marketing. Create content 10x faster, analyze data, and grow your audience. $29 course with certificate.',
    type: 'website',
    url: 'https://ailearnhub.io/courses/social-media-marketing-ai',
    images: [
      {
        url: 'https://ailearnhub.io/images/courses/social-media-marketing-ai-og.jpg',
        width: 1200,
        height: 630,
        alt: 'Social Media Marketing with AI Course',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Social Media Marketing with AI Course',
    description: 'Master AI-powered social media marketing in 2.7 hours. Enroll for $29!',
  },
}

export default function SocialMediaMarketingAIPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#FF6F00] to-[#E65100] text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-block bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <span className="text-sm font-medium">NEW COURSE</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Social Media Marketing with AI
            </h1>
            
            <p className="text-xl md:text-2xl mb-8 text-white/90">
              Master AI-powered social media marketing strategies, tools, and automation to grow your brand 10x faster
            </p>

            <div className="flex flex-wrap justify-center gap-6 mb-8">
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5" />
                <span>2.7 hours</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5" />
                <span>6 modules</span>
              </div>
              <div className="flex items-center space-x-2">
                <Award className="w-5 h-5" />
                <span>Certificate included</span>
              </div>
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5" />
                <span>Intermediate</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-white text-[#FF6F00] hover:bg-gray-100 text-lg px-8 py-6"
                asChild
              >
                <Link href="/signup">Enroll Now - $29</Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="border-2 border-white text-white hover:bg-white/10 text-lg px-8 py-6"
                asChild
              >
                <Link href="#curriculum">View Curriculum</Link>
              </Button>
            </div>

            <p className="mt-4 text-sm text-white/80">
              30-day money-back guarantee • Lifetime access • Certificate upon completion
            </p>
          </div>
        </div>
      </section>

      {/* What You'll Learn */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-[#212121]">
              What You'll Learn
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                'Create engaging social media content 10x faster using AI',
                'Develop data-driven social media strategies that drive results',
                'Generate professional visuals and videos with AI design tools',
                'Analyze performance data and optimize campaigns for better ROI',
                'Automate community management while maintaining authenticity',
                'Build and execute multi-platform campaigns efficiently',
                'Leverage influencer marketing and partnership programs',
                'Master advanced analytics and attribution models',
                'Future-proof your marketing skills with emerging AI technologies',
              ].map((item, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-[#FF6F00] flex-shrink-0 mt-1" />
                  <p className="text-gray-700">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Course Curriculum */}
      <section id="curriculum" className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-[#212121]">
              Course Curriculum
            </h2>

            <div className="space-y-4">
              {/* Module 1 */}
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl">Module 1: AI for Social Media Strategy</CardTitle>
                      <CardDescription className="mt-2">
                        Master AI tools for audience research, content planning, and platform-specific strategies
                      </CardDescription>
                    </div>
                    <span className="text-sm text-gray-600 whitespace-nowrap ml-4">25 min</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• AI tools landscape (ChatGPT, Jasper, Copy.ai, Canva AI)</li>
                    <li>• Audience research and persona development</li>
                    <li>• Content calendar automation</li>
                    <li>• Platform-specific strategies</li>
                    <li>• 90-day growth strategy framework</li>
                  </ul>
                </CardContent>
              </Card>

              {/* Module 2 */}
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl">Module 2: AI-Powered Content Creation</CardTitle>
                      <CardDescription className="mt-2">
                        Learn to create compelling captions, hashtag strategies, and repurpose content using AI
                      </CardDescription>
                    </div>
                    <span className="text-sm text-gray-600 whitespace-nowrap ml-4">30 min</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Caption writing formulas (Hook + Value + CTA + Hashtags)</li>
                    <li>• Platform-specific content strategies</li>
                    <li>• Hashtag research and optimization</li>
                    <li>• Content repurposing (1 piece → 10+ formats)</li>
                    <li>• Viral content frameworks</li>
                  </ul>
                </CardContent>
              </Card>

              {/* Module 3 */}
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl">Module 3: Visual Content & AI Design Tools</CardTitle>
                      <CardDescription className="mt-2">
                        Master AI image generation, Canva AI features, and video creation
                      </CardDescription>
                    </div>
                    <span className="text-sm text-gray-600 whitespace-nowrap ml-4">25 min</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• AI image generation (DALL-E, Midjourney, Stable Diffusion)</li>
                    <li>• Perfect image prompt formulas</li>
                    <li>• Canva AI features (Magic Write, Magic Design, Magic Edit)</li>
                    <li>• Platform-specific visual formats</li>
                    <li>• AI video creation basics</li>
                  </ul>
                </CardContent>
              </Card>

              {/* Module 4 */}
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl">Module 4: AI for Social Media Analytics</CardTitle>
                      <CardDescription className="mt-2">
                        Use AI to analyze performance, track metrics, run A/B tests, and calculate ROI
                      </CardDescription>
                    </div>
                    <span className="text-sm text-gray-600 whitespace-nowrap ml-4">30 min</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• AI-powered data analysis</li>
                    <li>• Engagement metrics and performance tracking</li>
                    <li>• A/B testing frameworks with AI</li>
                    <li>• ROI calculation and optimization</li>
                    <li>• Predictive analytics for content planning</li>
                  </ul>
                </CardContent>
              </Card>

              {/* Module 5 */}
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl">Module 5: AI-Powered Community Management</CardTitle>
                      <CardDescription className="mt-2">
                        Automate responses, integrate customer service AI, monitor sentiment, and manage crises
                      </CardDescription>
                    </div>
                    <span className="text-sm text-gray-600 whitespace-nowrap ml-4">25 min</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Automated comment response systems</li>
                    <li>• AI-assisted customer service</li>
                    <li>• Sentiment analysis and monitoring</li>
                    <li>• Crisis management protocols</li>
                    <li>• Community building strategies</li>
                  </ul>
                </CardContent>
              </Card>

              {/* Module 6 */}
              <Card>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl">Module 6: Advanced AI Marketing Tactics</CardTitle>
                      <CardDescription className="mt-2">
                        Master influencer outreach, ad optimization, multi-platform campaigns, and future trends
                      </CardDescription>
                    </div>
                    <span className="text-sm text-gray-600 whitespace-nowrap ml-4">25 min</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Influencer outreach automation</li>
                    <li>• AI-powered ad copy optimization</li>
                    <li>• Multi-platform campaign management</li>
                    <li>• Email and CRM integration</li>
                    <li>• Future trends in AI marketing</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Course Deliverables */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-[#212121]">
              What's Included
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              {[
                '100+ social media caption templates',
                '50+ hashtag sets for different goals',
                '30+ AI image generation prompts',
                '20+ content calendar templates',
                'Video script templates (Reels, TikTok, Shorts)',
                'Analytics report templates',
                'Crisis management playbook',
                'Influencer outreach templates',
                'Email-social integration workflows',
                'Completion certificate with verification',
              ].map((item, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <Star className="w-5 h-5 text-[#FF6F00] flex-shrink-0 mt-1" />
                  <p className="text-gray-700">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Who This Is For */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-[#212121]">
              Who This Course Is For
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="w-5 h-5 text-[#FF6F00]" />
                    <span>Perfect For</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-gray-700">
                    <li>• Social media managers and coordinators</li>
                    <li>• Digital marketers and marketing managers</li>
                    <li>• Content creators and influencers</li>
                    <li>• Small business owners and entrepreneurs</li>
                    <li>• Marketing agency professionals</li>
                    <li>• Freelance social media specialists</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-[#FF6F00]" />
                    <span>Prerequisites</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 text-gray-700">
                    <li>• Basic social media platform knowledge</li>
                    <li>• Free ChatGPT account (recommended)</li>
                    <li>• Active social media account to practice</li>
                    <li>• No prior AI experience required</li>
                    <li>• Willingness to learn and experiment</li>
                    <li>• Any device with internet connection</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-[#FF6F00] to-[#E65100] text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Master AI-Powered Social Media Marketing?
            </h2>
            <p className="text-xl mb-8 text-white/90">
              Join thousands of marketers who are already using AI to grow their brands faster. 
              Enroll now and start transforming your social media presence today.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
              <Button 
                size="lg" 
                className="bg-white text-[#FF6F00] hover:bg-gray-100 text-lg px-8 py-6"
                asChild
              >
                <Link href="/signup">Enroll Now - $29</Link>
              </Button>
            </div>

            <div className="flex flex-wrap justify-center gap-8 text-sm">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5" />
                <span>30-Day Money-Back Guarantee</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5" />
                <span>Lifetime Access</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5" />
                <span>Certificate Included</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-[#212121]">
              Frequently Asked Questions
            </h2>

            <div className="space-y-6">
              {[
                {
                  q: 'Do I need any AI experience to take this course?',
                  a: 'No! This course is designed for beginners. We start with AI basics and guide you through every tool and technique step-by-step.',
                },
                {
                  q: 'What platforms does this course cover?',
                  a: 'We cover all major platforms: Instagram, Facebook, TikTok, LinkedIn, Twitter/X, Pinterest, and YouTube. You\'ll learn platform-specific strategies for each.',
                },
                {
                  q: 'Do I need paid AI tools to complete this course?',
                  a: 'No! While we show premium tools, all core lessons can be completed with free tools like ChatGPT, Canva Free, and built-in platform analytics.',
                },
                {
                  q: 'How long does it take to complete?',
                  a: 'The course is 2.7 hours of video content, but we recommend spending 1-2 weeks to practice and implement what you learn as you go.',
                },
                {
                  q: 'Will I get a certificate?',
                  a: 'Yes! After completing all modules and passing the quizzes (70% score), you\'ll receive a verified completion certificate you can share on LinkedIn.',
                },
                {
                  q: 'What if I\'m not satisfied?',
                  a: 'We offer a 30-day money-back guarantee. If you\'re not happy with the course for any reason, just contact us for a full refund.',
                },
              ].map((faq, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-lg">{faq.q}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-700">{faq.a}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
