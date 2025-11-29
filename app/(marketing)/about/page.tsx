import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Award, BookOpen, Users, TrendingUp } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="flex flex-col">
      {/* Header */}
      <section className="bg-[#212121] text-white py-16 px-6">
        <div className="container mx-auto max-w-6xl">
          <h1 className="mb-4 text-5xl leading-tight font-normal">About AI Learn Hub</h1>
          <p className="text-gray-300 text-lg leading-8 max-w-3xl">
            Empowering professionals to master AI and transform their careers
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 px-6 bg-white">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-[#212121] mb-6 text-3xl font-normal">Our Mission</h2>
          <p className="text-[#424242] text-base leading-7 mb-6">
            AI Learn Hub was founded with a simple mission: make professional AI education accessible, 
            practical, and immediately applicable for busy professionals.
          </p>
          <p className="text-[#424242] text-base leading-7 mb-6">
            We believe that AI isn't just for tech companies or data scientists—it's a transformative 
            tool that every professional should know how to use. Our courses are designed by practitioners 
            for practitioners, focusing on real-world applications that save time and boost productivity.
          </p>
          <p className="text-[#424242] text-base leading-7">
            Whether you're in healthcare, finance, marketing, education, or any other field, our courses 
            will teach you how to leverage AI tools like ChatGPT to work smarter, not harder.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-gray-50 px-6">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="w-16 h-16 bg-[#FF6F00]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-[#FF6F00]" />
              </div>
              <div className="text-[#212121] text-4xl font-normal mb-2">7+</div>
              <div className="text-[#757575] text-sm">Hours of Content</div>
            </div>
            <div>
              <div className="w-16 h-16 bg-[#FF6F00]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-[#FF6F00]" />
              </div>
              <div className="text-[#212121] text-4xl font-normal mb-2">500+</div>
              <div className="text-[#757575] text-sm">Students Enrolled</div>
            </div>
            <div>
              <div className="w-16 h-16 bg-[#FF6F00]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-[#FF6F00]" />
              </div>
              <div className="text-[#212121] text-4xl font-normal mb-2">90+</div>
              <div className="text-[#757575] text-sm">Templates Included</div>
            </div>
            <div>
              <div className="w-16 h-16 bg-[#FF6F00]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="w-8 h-8 text-[#FF6F00]" />
              </div>
              <div className="text-[#212121] text-4xl font-normal mb-2">10+</div>
              <div className="text-[#757575] text-sm">Hours Saved Weekly</div>
            </div>
          </div>
        </div>
      </section>

      {/* Instructor */}
      <section className="py-20 px-6 bg-white">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-[#212121] mb-12 text-3xl font-normal text-center">Meet Your Instructor</h2>
          
          <div className="bg-gray-50 border border-gray-200 p-8">
            <h3 className="text-[#212121] text-2xl font-medium mb-4">Srikanth Merianda</h3>
            <p className="text-[#424242] text-base leading-7 mb-4">
              Published author and AI educator with extensive experience in RPA (Robotic Process Automation) 
              and artificial intelligence. Srikanth has written multiple books on AI and automation, available 
              on Amazon Kindle, helping thousands of professionals understand and implement AI in their workflows.
            </p>
            <p className="text-[#424242] text-base leading-7 mb-4">
              With a background in enterprise software and a passion for making complex technology accessible, 
              Srikanth created AI Learn Hub to bridge the gap between theoretical AI knowledge and practical, 
              everyday applications.
            </p>
            <p className="text-[#424242] text-base leading-7">
              His teaching philosophy: "AI should empower people, not replace them. The goal is to help 
              professionals work smarter and focus on what humans do best—creativity, strategy, and connection."
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-gray-50 px-6">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-[#212121] mb-12 text-3xl font-normal text-center">What We Believe</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 border border-gray-200">
              <h3 className="text-[#212121] text-lg font-medium mb-3">Practical Over Theoretical</h3>
              <p className="text-[#424242] text-base leading-7">
                Every lesson focuses on what you can actually use today. No academic jargon, just real-world techniques.
              </p>
            </div>

            <div className="bg-white p-6 border border-gray-200">
              <h3 className="text-[#212121] text-lg font-medium mb-3">Accessible to Everyone</h3>
              <p className="text-[#424242] text-base leading-7">
                You don't need a tech background. Our courses are designed for complete beginners and busy professionals.
              </p>
            </div>

            <div className="bg-white p-6 border border-gray-200">
              <h3 className="text-[#212121] text-lg font-medium mb-3">Immediate Results</h3>
              <p className="text-[#424242] text-base leading-7">
                Start saving time from day one. Our students report 10+ hours saved weekly after completing our courses.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-[#212121] text-white px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="mb-4 text-3xl font-normal">Ready to transform your workflow?</h2>
          <p className="mb-8 text-gray-300 text-lg leading-7">
            Join hundreds of professionals already mastering AI with our courses
          </p>
          <Link href="/courses">
            <Button className="bg-[#FF6F00] hover:bg-[#E65100] text-white px-8 py-3 text-base font-medium">
              Browse courses
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
