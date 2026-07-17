import { ResumeBlastFloat } from '@/components/ResumeBlastFloat'

export default function LearnLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ResumeBlastFloat />
    </>
  )
}
