import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle2, Clock, Users, Award, BookOpen, TrendingUp } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-[#212121] text-white py-20 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="mb-6 text-5xl leading-tight font-normal">
                Master AI & ChatGPT
              </h1>
              <p className="mb-8 text-gray-300 text-lg leading-8">
                Professional courses designed for busy people. Learn AI tools that save 10+ hours weekly.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/courses">
                  <Button className="bg-[#FF6F00] hover:bg-[#E65100] text-white px-8 py-3 text-base font-medium">
                    Browse courses
                  </Button>
                </Link>
                <Button variant="outline" className="border-white text-white hover:bg-white/10 px-8 py-3 text-base font-medium">
                  Learn more
                </Button>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="bg-[#424242]/30 backdrop-blur-sm rounded p-8 border border-gray-700">
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[#FF6F00]/20 rounded flex items-center justify-center flex-shrink-0">
                      <BookOpen className="w-6 h-6 text-[#FF6F00]" />
                    </div>
                    <div>
                      <div className="text-base font-medium">2 Launch Courses</div>
                      <div className="text-gray-400 text-sm">7+ hours of content</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[#FF6F00]/20 rounded flex items-center justify-center flex-shrink-0">
                      <Users className="w-6 h-6 text-[#FF6F00]" />
                    </div>
                    <div>
                      <div className="text-base font-medium">Expert Instruction</div>
                      <div className="text-gray-400 text-sm">Practical, real-world focused</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[#FF6F00]/20 rounded flex items-center justify-center flex-shrink-0">
                      <Award className="w-6 h-6 text-[#FF6F00]" />
                    </div>
                    <div>
                      <div className="text-base font-medium">Certificates Included</div>
                      <div className="text-gray-400 text-sm">Showcase your skills</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-gray-50 border-b border-gray-200">
        <div className="container mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-[#212121] mb-1 text-4xl font-normal">7+</div>
              <div className="text-[#757575] text-sm">Hours of content</div>
            </div>
            <div>
              <div className="text-[#212121] mb-1 text-4xl font-normal">130</div>
              <div className="text-[#757575] text-sm">Quiz questions</div>
            </div>
            <div>
              <div className="text-[#212121] mb-1 text-4xl font-normal">90+</div>
              <div className="text-[#757575] text-sm">Templates</div>
            </div>
            <div>
              <div className="text-[#FF6F00] mb-1 text-4xl font-normal">$19</div>
              <div className="text-[#757575] text-sm">Early bird pricing</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Featured Courses</h2>
            <p className="text-xl text-gray-600">Start your AI journey today with our professional courses</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Course 1 */}
            <Card className="hover:shadow-xl transition-shadow border-2 hover:border-blue-300">
              <CardHeader>
                <div className="flex items-start justify-between mb-4">
                  <div className="bg-gradient-to-br from-blue-500 to-purple-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    FEATURED
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500 line-through">$29</div>
                    <div className="text-2xl font-bold text-blue-600">$19</div>
                  </div>
                </div>
                <CardTitle className="text-2xl mb-2">ChatGPT Mastery for Professionals</CardTitle>
                <CardDescription className="text-base">
                  Master ChatGPT and transform your professional productivity with AI
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>4 hours • 7 modules</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">50+ prompt templates & business email templates</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Advanced prompt engineering techniques</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Save 10+ hours weekly on business tasks</span>
                    </div>
                  </div>
                  <Button className="w-full bg-blue-600 hover:bg-blue-700" size="lg">
                    Enroll Now - $19
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Course 2 */}
            <Card className="hover:shadow-xl transition-shadow border-2 hover:border-purple-300">
              <CardHeader>
                <div className="flex items-start justify-between mb-4">
                  <div className="bg-gradient-to-br from-purple-500 to-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    BEGINNER
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500 line-through">$29</div>
                    <div className="text-2xl font-bold text-purple-600">$19</div>
                  </div>
                </div>
                <CardTitle className="text-2xl mb-2">AI for Beginners (Zero to Hero)</CardTitle>
                <CardDescription className="text-base">
                  Start your AI journey from scratch - no technical background needed
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="w-4 h-4" />
                    <span>3 hours • 6 modules</span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Understand AI in plain English</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">Practical daily & work applications</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">40+ templates for everyday use</span>
                    </div>
                  </div>
                  <Button className="w-full bg-purple-600 hover:bg-purple-700" size="lg">
                    Enroll Now - $19
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gray-50 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Why Choose AI Learn Hub?</h2>
            <p className="text-xl text-gray-600">Professional training designed for real results</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Immediate Results</h3>
              <p className="text-gray-600">
                Start saving time on day one. Our students report 10+ hours saved weekly after completing courses.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Practical & Actionable</h3>
              <p className="text-gray-600">
                No fluff, just real-world techniques. Every module includes copy-paste templates you can use immediately.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Award className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Certification Included</h3>
              <p className="text-gray-600">
                Earn a professional certificate upon completion. Showcase your AI skills to employers and clients.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">What Students Say</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardContent className="pt-6">
                <div className="mb-4">
                  <div className="text-yellow-400 text-2xl">★★★★★</div>
                </div>
                <p className="text-gray-600 mb-4">
                  "This course helped me automate 15 hours of weekly tasks. The prompt templates alone were worth 10x the price."
                </p>
                <div className="font-semibold">Sarah Chen</div>
                <div className="text-sm text-gray-500">Marketing Director</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="mb-4">
                  <div className="text-yellow-400 text-2xl">★★★★★</div>
                </div>
                <p className="text-gray-600 mb-4">
                  "Finally understand how to use AI in my daily workflow. The beginner course made everything crystal clear."
                </p>
                <div className="font-semibold">Michael Rodriguez</div>
                <div className="text-sm text-gray-500">Healthcare Administrator</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="mb-4">
                  <div className="text-yellow-400 text-2xl">★★★★★</div>
                </div>
                <p className="text-gray-600 mb-4">
                  "Practical, actionable, and immediately useful. I've already implemented 10+ techniques at work."
                </p>
                <div className="font-semibold">Priya Patel</div>
                <div className="text-sm text-gray-500">Business Analyst</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-purple-600 text-white px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Master AI?</h2>
          <p className="text-xl mb-8 text-blue-100">
            Join hundreds of professionals already saving 10+ hours weekly with AI
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 text-lg px-8 py-6">
              Start Learning Now
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 text-lg px-8 py-6">
              Browse All Courses
            </Button>
          </div>
          <div className="mt-8 text-sm text-blue-100">
            30-day money-back guarantee • Lifetime access • New courses added regularly
          </div>
        </div>
      </section>
    </div>
  )
}
