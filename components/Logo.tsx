import React from 'react'

interface LogoProps {
  className?: string
  width?: number
  height?: number
}

export function Logo({ className = '', width = 180, height = 50 }: LogoProps) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 180 50"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* AI text */}
      <text
        x="10"
        y="35"
        fontFamily="Inter, system-ui, sans-serif"
        fontSize="32"
        fontWeight="700"
        fill="url(#gradient1)"
      >
        AI
      </text>
      
      {/* Dot separator */}
      <circle cx="58" cy="28" r="4" fill="url(#gradient1)" />
      
      {/* Hub text */}
      <text
        x="70"
        y="35"
        fontFamily="Inter, system-ui, sans-serif"
        fontSize="32"
        fontWeight="700"
        fill="#1e293b"
        className="dark:fill-white"
      >
        Hub
      </text>
      
      {/* Gradient definition */}
      <defs>
        <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#3b82f6', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#6366f1', stopOpacity: 1 }} />
        </linearGradient>
      </defs>
    </svg>
  )
}

export function LogoIcon({ className = '', size = 40 }: { className?: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Circuit-inspired AI icon */}
      <rect width="40" height="40" rx="8" fill="url(#iconGradient)" />
      <path
        d="M20 10L20 14M20 26L20 30M10 20L14 20M26 20L30 20M14.5 14.5L17 17M23 23L25.5 25.5M25.5 14.5L23 17M17 23L14.5 25.5"
        stroke="white"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <circle cx="20" cy="20" r="3" fill="white" />
      
      <defs>
        <linearGradient id="iconGradient" x1="0" y1="0" x2="40" y2="40">
          <stop offset="0%" style={{ stopColor: '#3b82f6' }} />
          <stop offset="100%" style={{ stopColor: '#6366f1' }} />
        </linearGradient>
      </defs>
    </svg>
  )
}
