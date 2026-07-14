import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function HomePage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section - Lighter, More Informative */}
      <section className="relative py-20 md:py-32 bg-gradient-to-br from-white via-orange-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-6xl font-bold text-[#212121] mb-6 leading-tight">
                Master AI & ChatGPT in Hours,{" "}
                <span className="text-[#FF6F00]">Not Months</span>
              </h1>
              <p className="text-xl md:text-2xl text-[#424242] mb-8 max-w-3xl mx-auto">
                Learn practical AI skills that will transform your career and boost your productivity from day one
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Link href="/courses">
                  <Button 
                    size="lg" 
                    className="bg-[#FF6F00] hover:bg-[#E65100] text-white font-medium px-8 py-6 text-lg w-full sm:w-auto"
                  >
                    Start Learning Now →
                  </Button>
                </Link>
                <Link href="/courses">
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="border-2 border-[#FF6F00] text-[#FF6F00] hover:bg-[#FF6F00] hover:text-white font-medium px-8 py-6 text-lg w-full sm:w-auto"
                  >
                    Browse Courses
                  </Button>
                </Link>
              </div>
              
              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-16">
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#FF6F00]">7+</div>
                  <div className="text-sm text-[#757575]">Hours of Content</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#FF6F00]">130</div>
                  <div className="text-sm text-[#757575]">Quiz Questions</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#FF6F00]">90+</div>
                  <div className="text-sm text-[#757575]">Templates</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-[#FF6F00]">$19</div>
                  <div className="text-sm text-[#757575]">Starting Price</div>
                </div>
              </div>
            </div>

            {/* Benefits Section */}
            <div className="grid md:grid-cols-3 gap-6 text-left">
              <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-[#FF6F00] hover:shadow-lg transition-shadow">
                <div className="text-3xl mb-4">🚀</div>
                <h3 className="text-lg font-semibold text-[#212121] mb-3">
                  Immediate Results
                </h3>
                <p className="text-[#757575] leading-relaxed">
                  Apply AI skills from day one. See real productivity gains immediately with practical, hands-on training.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-[#FF6F00] hover:shadow-lg transition-shadow">
                <div className="text-3xl mb-4">💼</div>
                <h3 className="text-lg font-semibold text-[#212121] mb-3">
                  Career Advancement
                </h3>
                <p className="text-[#757575] leading-relaxed">
                  AI skills are in high demand. Stand out in your field with cutting-edge knowledge that employers want.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-[#FF6F00] hover:shadow-lg transition-shadow">
                <div className="text-3xl mb-4">📊</div>
                <h3 className="text-lg font-semibold text-[#212121] mb-3">
                  Proven Success
                </h3>
                <p className="text-[#757575] leading-relaxed">
                  Join thousands who've transformed their workflow with our comprehensive, beginner-friendly courses.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#212121] mb-4">
              Featured Courses
            </h2>
            <p className="text-lg text-[#757575] max-w-2xl mx-auto">
              Start your AI journey with our expertly crafted courses
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Course 1: ChatGPT Mastery */}
            <Card className="border-2 border-gray-200 hover:border-[#FF6F00] transition-colors">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-3 py-1 bg-[#FF6F00] text-white text-xs font-semibold rounded-full">
                    FEATURED
                  </span>
                  <span className="text-2xl font-bold text-[#FF6F00]">$19</span>
                </div>
                <CardTitle className="text-2xl text-[#212121]">
                  ChatGPT Mastery for Professionals
                </CardTitle>
                <CardDescription className="text-[#757575]">
                  Master ChatGPT for business communication, content creation, and productivity
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center text-sm text-[#424242]">
                    <span className="text-[#FF6F00] mr-2">✓</span>
                    7 comprehensive modules
                  </li>
                  <li className="flex items-center text-sm text-[#424242]">
                    <span className="text-[#FF6F00] mr-2">✓</span>
                    4 hours of expert training
                  </li>
                  <li className="flex items-center text-sm text-[#424242]">
                    <span className="text-[#FF6F00] mr-2">✓</span>
                    50+ prompt templates included
                  </li>
                  <li className="flex items-center text-sm text-[#424242]">
                    <span className="text-[#FF6F00] mr-2">✓</span>
                    Completion certificate
                  </li>
                </ul>
                <Link href="/courses/chatgpt-mastery">
                  <Button className="w-full bg-[#FF6F00] hover:bg-[#E65100] text-white">
                    Enroll Now
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Course 2: AI for Beginners */}
            <Card className="border-2 border-gray-200 hover:border-[#FF6F00] transition-colors">
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-3 py-1 bg-[#424242] text-white text-xs font-semibold rounded-full">
                    BEGINNER
                  </span>
                  <span className="text-2xl font-bold text-[#FF6F00]">$19</span>
                </div>
                <CardTitle className="text-2xl text-[#212121]">
                  AI for Beginners (Zero to Hero)
                </CardTitle>
                <CardDescription className="text-[#757575]">
                  Perfect introduction to AI for complete beginners
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 mb-6">
                  <li className="flex items-center text-sm text-[#424242]">
                    <span className="text-[#FF6F00] mr-2">✓</span>
                    6 easy-to-follow modules
                  </li>
                  <li className="flex items-center text-sm text-[#424242]">
                    <span className="text-[#FF6F00] mr-2">✓</span>
                    2.9 hours of training
                  </li>
                  <li className="flex items-center text-sm text-[#424242]">
                    <span className="text-[#FF6F00] mr-2">✓</span>
                    30+ practical templates
                  </li>
                  <li className="flex items-center text-sm text-[#424242]">
                    <span className="text-[#FF6F00] mr-2">✓</span>
                    Completion certificate
                  </li>
                </ul>
                <Link href="/courses/ai-for-beginners">
                  <Button className="w-full bg-[#FF6F00] hover:bg-[#E65100] text-white">
                    Enroll Now
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-[#212121] mb-12">
              Why Learn AI with <span className="text-[#FF6F00]">AI Learn Hub</span>?
            </h2>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-[#FF6F00] rounded-lg flex items-center justify-center text-white text-xl font-bold">
                  1
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-[#212121] mb-2">
                    Practical & Actionable
                  </h3>
                  <p className="text-[#757575]">
                    No theory-only content. Every lesson includes practical examples and templates you can use immediately.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-[#FF6F00] rounded-lg flex items-center justify-center text-white text-xl font-bold">
                  2
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-[#212121] mb-2">
                    Self-Paced Learning
                  </h3>
                  <p className="text-[#757575]">
                    Learn at your own pace, on your own schedule. Lifetime access to all course materials.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-[#FF6F00] rounded-lg flex items-center justify-center text-white text-xl font-bold">
                  3
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-[#212121] mb-2">
                    Expert Instruction
                  </h3>
                  <p className="text-[#757575]">
                    Learn from industry professionals with real-world AI implementation experience.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-12 h-12 bg-[#FF6F00] rounded-lg flex items-center justify-center text-white text-xl font-bold">
                  4
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-[#212121] mb-2">
                    Certificate of Completion
                  </h3>
                  <p className="text-[#757575]">
                    Earn a professional certificate to showcase your AI skills to employers and clients.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-br from-[#212121] to-[#424242] text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Master AI?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who are already using AI to transform their careers
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/courses">
              <Button 
                size="lg" 
                className="bg-[#FF6F00] hover:bg-[#E65100] text-white font-medium px-8 py-6 text-lg"
              >
                Get Started Today
              </Button>
            </Link>
            <Link href="/pricing">
              <Button 
                variant="white" 
                size="lg"
                className="font-medium px-8 py-6 text-lg"
              >
                View Pricing
              </Button>
            </Link>
          </div>
          <p className="text-sm text-gray-400 mt-6">
Lifetime access • No subscription required
          </p>
        </div>
      </section>
    </div>
  )
}
