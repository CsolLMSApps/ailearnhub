import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { BookOpen, Award, Clock } from 'lucide-react'

export default function DashboardPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto max-w-6xl px-6 py-8">
          <h1 className="text-3xl font-normal text-[#212121] mb-2">My Courses</h1>
          <p className="text-[#424242]">Continue learning where you left off</p>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto max-w-6xl px-6 py-12">
        {/* Empty State - No courses yet */}
        <Card className="border border-gray-200">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="w-16 h-16 bg-[#FF6F00]/10 rounded-full flex items-center justify-center mb-4">
              <BookOpen className="w-8 h-8 text-[#FF6F00]" />
            </div>
            <h2 className="text-xl font-medium text-[#212121] mb-2">No courses yet</h2>
            <p className="text-[#424242] text-center mb-6 max-w-md">
              You haven't enrolled in any courses yet. Browse our catalog and start learning today.
            </p>
            <Link href="/courses">
              <Button className="bg-[#FF6F00] hover:bg-[#E65100] text-white">
                Browse courses
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* When user has courses, show this instead */}
        {/* 
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="border border-gray-200 hover:border-[#FF6F00] transition-all">
            <CardHeader>
              <CardTitle className="text-xl font-medium text-[#212121]">ChatGPT Mastery for Professionals</CardTitle>
              <CardDescription>Continue from Module 3</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-[#424242]">Progress</span>
                  <span className="text-[#424242]">43%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-[#FF6F00] h-2 rounded-full" style={{ width: '43%' }}></div>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm text-[#757575] mb-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>4 hours</span>
                </div>
                <div>•</div>
                <div>3/7 modules completed</div>
              </div>
              <Link href="/learn/chatgpt-mastery">
                <Button className="w-full bg-[#FF6F00] hover:bg-[#E65100] text-white">
                  Continue learning
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
        */}
      </div>
    </div>
  )
}
