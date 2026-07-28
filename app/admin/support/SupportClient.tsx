'use client'

// app/admin/support/SupportClient.tsx
// Ticket list + thread view + reply form for admin support panel.

import { useState } from 'react'

interface Ticket {
  id: string
  ticket_number: string
  name: string
  email: string
  subject: string
  status: 'open' | 'replied' | 'closed'
  created_at: string
  updated_at: string
}

interface Message {
  id: string
  ticket_id: string
  direction: 'inbound' | 'outbound'
  sender_name: string
  sender_email: string
  body: string
  created_at: string
}

const STATUS_STYLES: Record<string, string> = {
  open:    'bg-red-100 text-red-700',
  replied: 'bg-blue-100 text-blue-700',
  closed:  'bg-gray-100 text-gray-500',
}

const STATUS_LABELS: Record<string, string> = {
  open: '🔴 Open',
  replied: '🔵 Replied',
  closed: '⚫ Closed',
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins  = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days  = Math.floor(diff / 86400000)
  if (mins < 1)   return 'just now'
  if (mins < 60)  return `${mins}m ago`
  if (hours < 24) return `${hours}h ago`
  return `${days}d ago`
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

export default function SupportClient({ tickets: initialTickets }: { tickets: Ticket[] }) {
  const [tickets, setTickets]           = useState<Ticket[]>(initialTickets)
  const [selected, setSelected]         = useState<Ticket | null>(null)
  const [messages, setMessages]         = useState<Message[]>([])
  const [loadingThread, setLoadingThread] = useState(false)
  const [replyBody, setReplyBody]       = useState('')
  const [sending, setSending]           = useState(false)
  const [replyError, setReplyError]     = useState('')
  const [replySuccess, setReplySuccess] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [search, setSearch]             = useState('')

  const filtered = tickets.filter(t => {
    const matchStatus = statusFilter === 'all' || t.status === statusFilter
    const q = search.toLowerCase()
    const matchSearch = !q || t.name.toLowerCase().includes(q) ||
      t.email.toLowerCase().includes(q) ||
      t.subject.toLowerCase().includes(q) ||
      t.ticket_number.toLowerCase().includes(q)
    return matchStatus && matchSearch
  })

  const openTickets   = tickets.filter(t => t.status === 'open').length
  const repliedTickets = tickets.filter(t => t.status === 'replied').length
  const closedTickets = tickets.filter(t => t.status === 'closed').length

  async function openTicket(ticket: Ticket) {
    setSelected(ticket)
    setReplyBody('')
    setReplyError('')
    setReplySuccess('')
    setLoadingThread(true)
    try {
      const res = await fetch(`/api/admin/support/messages?ticketId=${ticket.id}`)
      const data = await res.json()
      setMessages(data.messages ?? [])
    } catch {
      setMessages([])
    } finally {
      setLoadingThread(false)
    }
  }

  async function sendReply() {
    if (!selected || !replyBody.trim()) return
    setSending(true)
    setReplyError('')
    setReplySuccess('')
    try {
      const res = await fetch('/api/admin/support/reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticketId: selected.id, body: replyBody.trim() }),
      })
      const data = await res.json()
      if (!res.ok) {
        setReplyError(data.error || 'Failed to send reply.')
      } else {
        // Append the new message to thread
        if (data.message) {
          setMessages(prev => [...prev, data.message])
        }
        setReplyBody('')
        setReplySuccess('Reply sent successfully!')
        setTimeout(() => setReplySuccess(''), 4000)
        // Update status in list to 'replied'
        setTickets(prev => prev.map(t =>
          t.id === selected.id ? { ...t, status: 'replied' } : t
        ))
        setSelected(prev => prev ? { ...prev, status: 'replied' } : prev)
      }
    } catch (err: any) {
      setReplyError(err.message || 'Something went wrong.')
    } finally {
      setSending(false)
    }
  }

  async function updateStatus(ticketId: string, status: 'open' | 'replied' | 'closed') {
    const res = await fetch('/api/admin/support/update-status', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ticketId, status }),
    })
    if (res.ok) {
      setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, status } : t))
      if (selected?.id === ticketId) {
        setSelected(prev => prev ? { ...prev, status } : prev)
      }
    }
  }

  return (
    <div className="space-y-4">

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Open', count: openTickets,   color: 'text-red-600',  bg: 'bg-red-50',  border: 'border-red-100' },
          { label: 'Replied', count: repliedTickets, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
          { label: 'Closed', count: closedTickets,  color: 'text-gray-600', bg: 'bg-gray-50', border: 'border-gray-100' },
        ].map(s => (
          <div key={s.label} className={`${s.bg} ${s.border} border rounded-xl p-4 text-center`}>
            <p className={`text-2xl font-bold ${s.color}`}>{s.count}</p>
            <p className="text-xs text-gray-500 font-medium mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-4 h-[calc(100vh-280px)] min-h-[500px]">

        {/* ── Left panel: ticket list ───────────────────────── */}
        <div className="w-80 shrink-0 flex flex-col bg-white rounded-xl border border-gray-200 overflow-hidden">

          {/* Filters */}
          <div className="p-3 border-b border-gray-100 space-y-2">
            <input
              type="text"
              placeholder="Search name, email, subject…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full text-sm border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#FF6F00]"
            />
            <div className="flex gap-1">
              {['all', 'open', 'replied', 'closed'].map(f => (
                <button
                  key={f}
                  onClick={() => setStatusFilter(f)}
                  className={`flex-1 text-xs font-medium py-1.5 rounded-lg transition-colors capitalize ${
                    statusFilter === f
                      ? 'bg-[#FF6F00] text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Ticket list */}
          <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
            {filtered.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-12">No tickets found.</p>
            ) : (
              filtered.map(ticket => (
                <button
                  key={ticket.id}
                  onClick={() => openTicket(ticket)}
                  className={`w-full text-left px-4 py-3 hover:bg-orange-50 transition-colors ${
                    selected?.id === ticket.id ? 'bg-orange-50 border-l-2 border-[#FF6F00]' : ''
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-xs font-mono text-gray-400">{ticket.ticket_number}</span>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${STATUS_STYLES[ticket.status]}`}>
                      {ticket.status}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-gray-900 truncate">{ticket.subject}</p>
                  <p className="text-xs text-gray-500 truncate">{ticket.name} · {ticket.email}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{timeAgo(ticket.created_at)}</p>
                </button>
              ))
            )}
          </div>
        </div>

        {/* ── Right panel: thread + reply ──────────────────── */}
        <div className="flex-1 flex flex-col bg-white rounded-xl border border-gray-200 overflow-hidden">

          {!selected ? (
            <div className="flex-1 flex items-center justify-center text-center p-12">
              <div>
                <span className="text-5xl">📩</span>
                <p className="text-gray-500 mt-4 text-sm">Select a ticket to view the conversation</p>
              </div>
            </div>
          ) : (
            <>
              {/* Ticket header */}
              <div className="px-6 py-4 border-b border-gray-100 flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-mono text-gray-400">{selected.ticket_number}</span>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${STATUS_STYLES[selected.status]}`}>
                      {STATUS_LABELS[selected.status]}
                    </span>
                  </div>
                  <h2 className="text-base font-bold text-gray-900 mt-1 truncate">{selected.subject}</h2>
                  <p className="text-sm text-gray-500">
                    {selected.name} · <a href={`mailto:${selected.email}`} className="text-[#FF6F00] hover:underline">{selected.email}</a>
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">Opened {formatDate(selected.created_at)}</p>
                </div>
                {/* Status controls */}
                <div className="flex items-center gap-2 shrink-0">
                  {(['open', 'replied', 'closed'] as const).filter(s => s !== selected.status).map(s => (
                    <button
                      key={s}
                      onClick={() => updateStatus(selected.id, s)}
                      className="text-xs border border-gray-300 text-gray-600 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors capitalize"
                    >
                      Mark {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Messages thread */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {loadingThread ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-6 w-6 border-2 border-[#FF6F00] border-t-transparent" />
                  </div>
                ) : messages.length === 0 ? (
                  <p className="text-sm text-gray-400 text-center py-8">No messages in this thread yet.</p>
                ) : (
                  messages.map(msg => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.direction === 'outbound' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[75%] rounded-xl px-4 py-3 ${
                        msg.direction === 'outbound'
                          ? 'bg-[#FF6F00] text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`text-xs font-semibold ${msg.direction === 'outbound' ? 'text-white/80' : 'text-gray-500'}`}>
                            {msg.direction === 'outbound' ? '👤 Support Team' : `👤 ${msg.sender_name}`}
                          </span>
                          <span className={`text-xs ${msg.direction === 'outbound' ? 'text-white/60' : 'text-gray-400'}`}>
                            {formatDate(msg.created_at)}
                          </span>
                        </div>
                        <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.body}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Reply box */}
              {selected.status !== 'closed' && (
                <div className="px-6 py-4 border-t border-gray-100">
                  {replyError && (
                    <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-3">{replyError}</p>
                  )}
                  {replySuccess && (
                    <p className="text-xs text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2 mb-3">{replySuccess}</p>
                  )}
                  <textarea
                    rows={4}
                    placeholder={`Reply to ${selected.name}…`}
                    value={replyBody}
                    onChange={e => setReplyBody(e.target.value)}
                    disabled={sending}
                    className="w-full text-sm border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#FF6F00] resize-none disabled:opacity-50"
                  />
                  <div className="flex items-center justify-between mt-3">
                    <p className="text-xs text-gray-400">
                      Will be sent to <strong>{selected.email}</strong> from support@ailearnhub.io
                    </p>
                    <button
                      onClick={sendReply}
                      disabled={sending || !replyBody.trim()}
                      className="px-5 py-2 bg-[#FF6F00] text-white text-sm font-bold rounded-lg hover:bg-[#E65100] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {sending ? 'Sending…' : 'Send Reply ✉️'}
                    </button>
                  </div>
                </div>
              )}

              {selected.status === 'closed' && (
                <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
                  <p className="text-sm text-gray-400 text-center">
                    This ticket is closed.{' '}
                    <button onClick={() => updateStatus(selected.id, 'open')} className="text-[#FF6F00] hover:underline font-medium">
                      Reopen it
                    </button>{' '}
                    to send a reply.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
