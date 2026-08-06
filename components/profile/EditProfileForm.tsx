'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function EditProfileForm({ initialName }: { initialName: string }) {
  const [name, setName] = useState(initialName)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    setLoading(true)
    setMessage(null)

    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({
      data: { full_name: name.trim() },
    })

    setMessage(
      error
        ? { type: 'error', text: error.message }
        : { type: 'success', text: 'Name updated successfully!' }
    )
    setLoading(false)
  }

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

      <div>
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">
          Full Name
        </label>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          required
          disabled={loading}
          className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-900 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/30 focus:border-[#FF6F00] disabled:opacity-50"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-[#FF6F00] hover:bg-[#E65100] disabled:opacity-50 text-white text-sm font-bold px-5 py-2.5 rounded-lg transition-colors"
      >
        {loading ? 'Saving...' : 'Save Changes'}
      </button>
    </form>
  )
}
