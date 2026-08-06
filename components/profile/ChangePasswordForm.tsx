'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function ChangePasswordForm({ email }: { email: string }) {
  const [form, setForm] = useState({ current: '', next: '', confirm: '' })
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNext, setShowNext] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.id]: e.target.value })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)

    if (form.next !== form.confirm) {
      setMessage({ type: 'error', text: 'New passwords do not match.' })
      return
    }
    if (form.next.length < 6) {
      setMessage({ type: 'error', text: 'New password must be at least 6 characters.' })
      return
    }

    setLoading(true)
    const supabase = createClient()

    // Verify current password by re-authenticating
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password: form.current,
    })
    if (authError) {
      setMessage({ type: 'error', text: 'Current password is incorrect.' })
      setLoading(false)
      return
    }

    // Update to new password
    const { error } = await supabase.auth.updateUser({ password: form.next })
    if (error) {
      setMessage({ type: 'error', text: error.message })
    } else {
      setMessage({ type: 'success', text: 'Password updated successfully!' })
      setForm({ current: '', next: '', confirm: '' })
    }
    setLoading(false)
  }

  const EyeIcon = ({ show }: { show: boolean }) => show ? (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
  ) : (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
  )

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {message && (
        <div className={`p-3 rounded-lg text-sm ${
          message.type === 'success'
            ? 'bg-green-50 border border-green-200 text-green-700'
            : 'bg-red-50 border border-red-200 text-red-600'
        }`}>
          {message.text}
        </div>
      )}

      {/* Current password */}
      <div>
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
          Current Password
        </label>
        <div className="relative">
          <input
            id="current"
            type={showCurrent ? 'text' : 'password'}
            value={form.current}
            onChange={handleChange}
            required
            disabled={loading}
            placeholder="••••••••"
            className="w-full px-4 py-2.5 pr-10 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/30 focus:border-[#FF6F00] disabled:opacity-50"
          />
          <button type="button" tabIndex={-1} onClick={() => setShowCurrent(v => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
            <EyeIcon show={showCurrent} />
          </button>
        </div>
      </div>

      {/* New password */}
      <div>
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
          New Password
        </label>
        <div className="relative">
          <input
            id="next"
            type={showNext ? 'text' : 'password'}
            value={form.next}
            onChange={handleChange}
            required
            disabled={loading}
            placeholder="Min 6 characters"
            minLength={6}
            className="w-full px-4 py-2.5 pr-10 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/30 focus:border-[#FF6F00] disabled:opacity-50"
          />
          <button type="button" tabIndex={-1} onClick={() => setShowNext(v => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
            <EyeIcon show={showNext} />
          </button>
        </div>
      </div>

      {/* Confirm password */}
      <div>
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
          Confirm New Password
        </label>
        <input
          id="confirm"
          type="password"
          value={form.confirm}
          onChange={handleChange}
          required
          disabled={loading}
          placeholder="Repeat new password"
          className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/30 focus:border-[#FF6F00] disabled:opacity-50"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-[#FF6F00] hover:bg-[#E65100] disabled:opacity-50 text-white text-sm font-bold px-5 py-2.5 rounded-lg transition-colors"
      >
        {loading ? 'Updating...' : 'Update Password'}
      </button>
    </form>
  )
}
