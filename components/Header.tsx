"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"

export default function Header() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#424242] bg-[#212121] text-white">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold">
              <span className="text-[#FF6F00]">AI</span>
              <span className="text-white"> Learn Hub</span>
            </span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              href="/courses"
              className={`text-sm font-medium transition-colors hover:text-[#FF6F00] ${
                isActive("/courses") ? "text-[#FF6F00]" : "text-white"
              }`}
            >
              Courses
            </Link>
            <Link
              href="/pricing"
              className={`text-sm font-medium transition-colors hover:text-[#FF6F00] ${
                isActive("/pricing") ? "text-[#FF6F00]" : "text-white"
              }`}
            >
              Pricing
            </Link>
            <Link
              href="/about"
              className={`text-sm font-medium transition-colors hover:text-[#FF6F00] ${
                isActive("/about") ? "text-[#FF6F00]" : "text-white"
              }`}
            >
              About
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/auth/login">
            <Button 
              variant="ghost" 
              className="text-white hover:text-white hover:bg-[#424242]"
            >
              Log In
            </Button>
          </Link>
          <Link href="/auth/signup">
            <Button className="bg-[#FF6F00] text-white hover:bg-[#E65100] font-medium">
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
