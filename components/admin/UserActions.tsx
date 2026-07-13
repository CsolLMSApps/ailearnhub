'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

// ── Delete Button ──────────────────────────────────────────────────────────────
export function DeleteUserButton({ userId, email }: { userId: string; email: string }) {
  const [confirming, setConfirming] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleDelete() {
    setLoading(true)
    const res = await fetch('/api/admin/delete-user', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    })
    setLoading(false)
    if (res.ok) {
      setConfirming(false)
      router.refresh()
    } else {
      const j = await res.json()
      alert('Error: ' + (j.error ?? 'Unknown error'))
    }
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs text-red-600 font-medium">Delete {email}?</span>
        <button
          onClick={handleDelete}
          disabled={loading}
          className="px-2 py-1 text-xs bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
        >
          {loading ? 'Deleting…' : 'Confirm'}
        </button>
        <button
          onClick={() => setConfirming(false)}
          className="px-2 py-1 text-xs bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
        >
          Cancel
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="px-2 py-1 text-xs text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
    >
      Delete
    </button>
  )
}

// ── Add User Modal ─────────────────────────────────────────────────────────────
export function AddUserButton() {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [form, setForm] = useState({ email: '', password: '', fullName: '' })
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)
    const res = await fetch('/api/admin/create-user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    const j = await res.json()
    setLoading(false)
    if (res.ok) {
      setSuccess(`User ${form.email} created successfully!`)
      setForm({ email: '', password: '', fullName: '' })
      router.refresh()
    } else {
      setError(j.error ?? 'Failed to create user')
    }
  }

  return (
    <>
      <button
        onClick={() => { setOpen(true); setSuccess(''); setError('') }}
        className="inline-flex items-center gap-2 px-4 py-2 bg-[#FF6F00] text-white text-sm font-semibold rounded-xl hover:bg-[#E65100] transition-colors shadow-sm"
      >
        + Add User
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-bold text-gray-900">Add New User</h2>
              <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600 text-xl leading-none">✕</button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Full Name (optional)</label>
                <input
                  type="text"
                  value={form.fullName}
                  onChange={e => setForm(f => ({ ...f, fullName: e.target.value }))}
                  placeholder="e.g. John Smith"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/40 focus:border-[#FF6F00]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  placeholder="user@example.com"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/40 focus:border-[#FF6F00]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Temporary Password *</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  placeholder="Min. 6 characters"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/40 focus:border-[#FF6F00]"
                />
              </div>

              {error && <p className="text-xs text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>}
              {success && <p className="text-xs text-green-700 bg-green-50 rounded-lg px-3 py-2">{success}</p>}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="flex-1 py-2.5 border border-gray-200 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-2.5 bg-[#FF6F00] text-white text-sm font-semibold rounded-xl hover:bg-[#E65100] disabled:opacity-50 transition-colors"
                >
                  {loading ? 'Creating…' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
