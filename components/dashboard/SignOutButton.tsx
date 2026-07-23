'use client'

// components/dashboard/SignOutButton.tsx
// Wraps the sign-out action. If the user hasn't completed profile setup,
// shows a warning modal before allowing sign-out.
// "Complete Setup" fires a custom event that opens the SetupNotification dropdown.

import { useState } from 'react'

interface SignOutButtonProps {
  passwordSet: boolean
}

export default function SignOutButton({ passwordSet }: SignOutButtonProps) {
  const [showModal, setShowModal] = useState(false)

  const handleClick = () => {
    if (!passwordSet) {
      setShowModal(true)
    } else {
      submitSignOut()
    }
  }

  const submitSignOut = () => {
    const form = document.createElement('form')
    form.method = 'POST'
    form.action = '/auth/signout'
    document.body.appendChild(form)
    form.submit()
  }

  const handleCompleteSetup = () => {
    setShowModal(false)
    // Signal SetupNotification to open its dropdown
    window.dispatchEvent(new CustomEvent('open-setup-notification'))
  }

  return (
    <>
      <button
        onClick={handleClick}
        className="text-sm text-gray-600 hover:text-gray-900 px-4 py-2 rounded-lg hover:bg-gray-100"
      >
        Sign Out
      </button>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowModal(false)}
          />

          {/* Modal */}
          <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full p-8 z-10">
            {/* Warning icon */}
            <div className="flex justify-center mb-4">
              <div className="h-14 w-14 rounded-full bg-orange-100 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-[#FF6F00]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                </svg>
              </div>
            </div>

            {/* Heading */}
            <h2 className="text-xl font-bold text-gray-900 text-center mb-3">
              Wait — your course access is at risk!
            </h2>

            {/* Body */}
            <p className="text-gray-600 text-sm text-center leading-relaxed mb-6">
              You purchased a course but haven't completed your account setup yet.
              If you sign out now, you won't be able to log back in because no
              password has been set for your account.
              <br /><br />
              Complete your setup now — it only takes 30 seconds. Just enter your
              name and choose a password.
            </p>

            {/* Buttons */}
            <div className="flex flex-col gap-3">
              <button
                onClick={handleCompleteSetup}
                className="w-full bg-[#FF6F00] text-white font-bold py-3 rounded-xl hover:bg-[#E65100] transition-colors text-sm"
              >
                Complete Setup
              </button>
              <button
                onClick={submitSignOut}
                className="w-full text-gray-500 hover:text-gray-700 font-medium py-3 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors text-sm"
              >
                Ignore and Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
