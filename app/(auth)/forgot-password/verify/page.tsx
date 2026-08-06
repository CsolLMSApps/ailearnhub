import { redirect } from 'next/navigation'

// OTP verify flow replaced by Supabase built-in reset link.
export default function VerifyOTPPage() {
  redirect('/forgot-password')
}
