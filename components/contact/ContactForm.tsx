'use client'

// components/contact/ContactForm.tsx
// Smart contact form with email validation

import { useState } from 'react'

interface ContactFormProps {
  defaultName?: string
  defaultEmail?: string
  isAuthenticated: boolean
}

export default function ContactForm({ defaultName = '', defaultEmail = '', isAuthenticated }: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: defaultName,
    email: defaultEmail,
    subject: '',
    message: ''
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)

    // Validation
    if (!formData.name.trim()) {
      setError('Please enter your name')
      setLoading(false)
      return
    }

    if (!formData.email.trim()) {
      setError('Please enter your email')
      setLoading(false)
      return
    }

    if (!validateEmail(formData.email)) {
      setError('Please enter a valid email address')
      setLoading(false)
      return
    }

    if (!formData.subject.trim()) {
      setError('Please enter a subject')
      setLoading(false)
      return
    }

    if (!formData.message.trim()) {
      setError('Please enter a message')
      setLoading(false)
      return
    }

    if (formData.message.trim().length < 10) {
      setError('Message must be at least 10 characters')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message')
      }

      setSuccess(true)
      setFormData({
        name: defaultName,
        email: defaultEmail,
        subject: '',
        message: ''
      })
    } catch (err: any) {
      setError(err.message || 'Failed to send message. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
      {success && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-800 font-medium">✓ Message sent successfully!</p>
          <p className="text-green-700 text-sm mt-1">
            We'll get back to you within 24 hours at {formData.email}
          </p>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800">✕ {error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Name {!isAuthenticated && <span className="text-red-500">*</span>}
          </label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            disabled={isAuthenticated}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6F00] focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
            placeholder="Your name"
          />
          {isAuthenticated && (
            <p className="text-xs text-gray-500 mt-1">Using your account name</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email {!isAuthenticated && <span className="text-red-500">*</span>}
          </label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            disabled={isAuthenticated}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6F00] focus:border-transparent disabled:bg-gray-50 disabled:text-gray-500"
            placeholder="your.email@example.com"
          />
          {isAuthenticated && (
            <p className="text-xs text-gray-500 mt-1">Using your account email</p>
          )}
        </div>

        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
            Subject <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="subject"
            value={formData.subject}
            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6F00] focus:border-transparent"
            placeholder="How can we help?"
          />
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
            Message <span className="text-red-500">*</span>
          </label>
          <textarea
            id="message"
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            rows={6}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF6F00] focus:border-transparent"
            placeholder="Please describe your question or issue..."
          />
          <p className="text-xs text-gray-500 mt-1">Minimum 10 characters</p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#FF6F00] text-white font-bold py-3 px-6 rounded-lg hover:bg-[#E65100] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Sending...' : 'Send Message'}
        </button>

        <p className="text-sm text-gray-500 text-center">
          Or email us directly at{' '}
          <a href="mailto:support@ailearnhub.io" className="text-[#FF6F00] hover:underline">
            support@ailearnhub.io
          </a>
        </p>
      </form>
    </div>
  )
}
