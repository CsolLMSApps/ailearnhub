'use client'

import { useActionState, useEffect, useRef } from 'react'
import { addAdminEmail, removeAdminEmail } from '@/app/actions/admin-access'

interface DynamicAdmin {
  email: string
  added_by: string
  added_at: string
}

interface Props {
  superAdmins: string[]
  dynamicAdmins: DynamicAdmin[]
  fetchError: string | null
}

const initialState = { error: undefined, success: undefined }

export default function AdminAccessClient({ superAdmins, dynamicAdmins, fetchError }: Props) {
  const [addState, addAction, addPending] = useActionState(addAdminEmail, initialState)
  const [removeState, removeAction, removePending] = useActionState(removeAdminEmail, initialState)

  const formRef = useRef<HTMLFormElement>(null)

  // Clear the add form on success
  useEffect(() => {
    if (addState.success) {
      formRef.current?.reset()
    }
  }, [addState.success])

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('en-GB', {
      day: 'numeric', month: 'short', year: 'numeric',
    })

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Admin Access</h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage who has access to the admin panel. Permanent admins are built in and cannot be removed here.
        </p>
      </div>

      {/* ── Add New Admin ─────────────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-1">Grant Admin Access</h2>
        <p className="text-sm text-gray-500 mb-4">
          Enter an email address to give that person access to the admin panel.
          They must already have an account or sign up first.
        </p>

        <form ref={formRef} action={addAction} className="flex gap-3 items-start">
          <div className="flex-1">
            <input
              type="email"
              name="email"
              placeholder="email@example.com"
              required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6F00] focus:border-transparent placeholder-gray-400"
            />
          </div>
          <button
            type="submit"
            disabled={addPending}
            className="px-5 py-2.5 bg-[#FF6F00] text-white text-sm font-semibold rounded-lg hover:bg-[#e65c00] disabled:opacity-50 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
          >
            {addPending ? 'Adding…' : '+ Grant Access'}
          </button>
        </form>

        {addState.success && (
          <p className="mt-3 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-4 py-2.5">
            ✅ {addState.success}
          </p>
        )}
        {addState.error && (
          <p className="mt-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">
            ❌ {addState.error}
          </p>
        )}
      </div>

      {/* ── Remove feedback (shown outside the row since removeAction is shared) */}
      {removeState.success && (
        <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-4 py-2.5">
          ✅ {removeState.success}
        </p>
      )}
      {removeState.error && (
        <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-2.5">
          ❌ {removeState.error}
        </p>
      )}

      {/* ── Current Admin List ────────────────────────────────────── */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-3 py-3 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">
            Current Admins
            <span className="ml-2 text-sm font-normal text-gray-400">
              ({superAdmins.length + dynamicAdmins.length} total)
            </span>
          </h2>
        </div>

        {fetchError && (
          <div className="px-6 py-4 text-sm text-amber-700 bg-amber-50">
            ⚠️ Could not load dynamic admins: {fetchError}.
            Run the SQL migration in your Supabase dashboard first.
          </div>
        )}

        <div className="overflow-x-auto"><table className="w-full text-sm">
          <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
            <tr>
              <th className="px-3 py-3 text-left">Email</th>
              <th className="px-3 py-3 text-left">Type</th>
              <th className="px-3 py-3 text-left">Added By</th>
              <th className="px-3 py-3 text-left">Added</th>
              <th className="px-3 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {/* Permanent superadmins */}
            {superAdmins.map((email) => (
              <tr key={email} className="hover:bg-gray-50 transition-colors">
                <td className="px-3 py-3 font-medium text-gray-900">{email}</td>
                <td className="px-3 py-3">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    🔒 Permanent
                  </span>
                </td>
                <td className="px-3 py-3 text-gray-400">—</td>
                <td className="px-3 py-3 text-gray-400">—</td>
                <td className="px-3 py-3 text-right">
                  <span className="text-xs text-gray-400">Cannot remove</span>
                </td>
              </tr>
            ))}

            {/* Dynamic admins from DB */}
            {dynamicAdmins.map((admin) => (
              <tr key={admin.email} className="hover:bg-gray-50 transition-colors">
                <td className="px-3 py-3 font-medium text-gray-900">{admin.email}</td>
                <td className="px-3 py-3">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                    ✅ Dynamic
                  </span>
                </td>
                <td className="px-3 py-3 text-gray-500">{admin.added_by}</td>
                <td className="px-3 py-3 text-gray-500">{formatDate(admin.added_at)}</td>
                <td className="px-3 py-3 text-right">
                  <form action={removeAction}>
                    <input type="hidden" name="email" value={admin.email} />
                    <button
                      type="submit"
                      disabled={removePending}
                      className="text-red-600 hover:text-red-800 text-xs font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      onClick={(e) => {
                        if (!confirm(`Remove admin access for ${admin.email}?`)) {
                          e.preventDefault()
                        }
                      }}
                    >
                      {removePending ? 'Removing…' : 'Remove'}
                    </button>
                  </form>
                </td>
              </tr>
            ))}

            {dynamicAdmins.length === 0 && !fetchError && (
              <tr>
                <td colSpan={5} className="px-3 py-8 text-center text-gray-400 text-sm">
                  No additional admins added yet. Use the form above to grant access.
                </td>
              </tr>
            )}
          </tbody>
        </table></div>
      </div>

      {/* ── How it works note ─────────────────────────────────────── */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 text-sm text-blue-800">
        <p className="font-semibold mb-1">ℹ️ How admin access works</p>
        <ul className="list-disc list-inside space-y-1 text-blue-700">
          <li><strong>Permanent admins</strong> are hardcoded in the app and always have access.</li>
          <li><strong>Dynamic admins</strong> are stored in the database — you can add or remove them here instantly, no redeploy needed.</li>
          <li>The person must sign up or already have an account on AILearnHub.IO.</li>
          <li>Access takes effect on their next page load — no action required on their end.</li>
        </ul>
      </div>
    </div>
  )
}
