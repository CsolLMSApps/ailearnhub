'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { QuestionCard } from './QuestionCard'
import { ResultsSummary } from './ResultsSummary'

interface Question {
  id: string
  question: string
  options: string[]
  correct: number
  explanation?: string
}

interface QuizComponentProps {
  slug: string
  moduleNumber: number
  questions: Question[]
  passPercentage?: number
}

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export function QuizComponent({
  slug,
  moduleNumber,
  questions: originalQuestions,
  passPercentage = 70,
}: QuizComponentProps) {
  const router = useRouter()

  // Shuffle on first load
  const [shuffledQuestions, setShuffledQuestions] = useState<Question[]>(() =>
    shuffleArray(originalQuestions)
  )
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [userAnswers, setUserAnswers] = useState<{ [key: string]: number }>({})
  const [showResults, setShowResults] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [quizResults, setQuizResults] = useState<any>(null)
  const [submitAttempted, setSubmitAttempted] = useState(false)

  const totalQuestions = shuffledQuestions.length
  const answeredCount = Object.keys(userAnswers).length
  const allAnswered = answeredCount === totalQuestions

  // Unanswered question indices for quick navigation
  const unansweredIndices = shuffledQuestions
    .map((q, i) => (userAnswers[q.id] === undefined ? i : null))
    .filter((i): i is number => i !== null)

  const handleAnswer = (questionId: string, answerIndex: number) => {
    setUserAnswers(prev => ({ ...prev, [questionId]: answerIndex }))
  }

  const handleNext = () => {
    if (currentQuestion < totalQuestions - 1) setCurrentQuestion(prev => prev + 1)
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) setCurrentQuestion(prev => prev - 1)
  }

  const handleSubmit = async () => {
    setSubmitAttempted(true)

    if (!allAnswered) {
      // Jump to first unanswered question
      if (unansweredIndices.length > 0) setCurrentQuestion(unansweredIndices[0])
      return
    }

    setSubmitting(true)
    try {
      const response = await fetch('/api/quiz/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, moduleNumber, answers: userAnswers }),
      })

      if (!response.ok) throw new Error('Failed to submit quiz')

      const results = await response.json()
      setQuizResults(results)
      setShowResults(true)

      if (results.passed) router.refresh()
    } catch (error) {
      console.error('Quiz submission error:', error)
      alert('Failed to submit quiz. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleRetry = () => {
    // Reshuffle questions on every retry
    setShuffledQuestions(shuffleArray(originalQuestions))
    setCurrentQuestion(0)
    setUserAnswers({})
    setShowResults(false)
    setQuizResults(null)
    setSubmitAttempted(false)
  }

  if (showResults && quizResults) {
    return (
      <ResultsSummary
        results={quizResults}
        passPercentage={passPercentage}
        onRetry={handleRetry}
      />
    )
  }

  const question = shuffledQuestions[currentQuestion]

  return (
    <div className="max-w-3xl mx-auto">

      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600">
            Question {currentQuestion + 1} of {totalQuestions}
          </span>
          <span className={`text-sm font-medium ${allAnswered ? 'text-green-600' : 'text-gray-500'}`}>
            {answeredCount}/{totalQuestions} answered
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-[#FF6F00] h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestion + 1) / totalQuestions) * 100}%` }}
          />
        </div>
      </div>

      {/* Question navigator */}
      <div className="mb-6 bg-gray-50 border border-gray-200 rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Questions</p>
          <div className="flex items-center gap-3 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-green-400 inline-block" /> Answered
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-red-400 inline-block" /> Unanswered
            </span>
            <span className="flex items-center gap-1">
              <span className="w-3 h-3 rounded-full bg-[#FF6F00] inline-block" /> Current
            </span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {shuffledQuestions.map((q, i) => {
            const isAnswered = userAnswers[q.id] !== undefined
            const isCurrent = i === currentQuestion
            return (
              <button
                key={q.id}
                onClick={() => setCurrentQuestion(i)}
                className={`w-9 h-9 rounded-xl text-sm font-bold transition-all shadow-sm border-2 ${
                  isCurrent
                    ? 'bg-[#FF6F00] text-white border-[#FF6F00] scale-110 shadow-md'
                    : isAnswered
                    ? 'bg-green-500 text-white border-green-500 hover:bg-green-600'
                    : submitAttempted
                    ? 'bg-red-500 text-white border-red-500 animate-pulse hover:bg-red-600'
                    : 'bg-red-100 text-red-600 border-red-200 hover:bg-red-200'
                }`}
                title={`Q${i + 1} — ${isAnswered ? 'Answered' : 'Not answered yet'}`}
              >
                {i + 1}
              </button>
            )
          })}
        </div>
      </div>

      {/* Unanswered warning after submit attempt */}
      {submitAttempted && !allAnswered && (
        <div className="mb-5 flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
          <svg className="w-5 h-5 text-red-500 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <div>
            <p className="text-sm font-semibold text-red-700">
              {unansweredIndices.length} question{unansweredIndices.length > 1 ? 's' : ''} unanswered
            </p>
            <p className="text-xs text-red-500 mt-0.5">
              All questions must be answered before submitting. Red dots above show which ones are missing.
            </p>
          </div>
        </div>
      )}

      {/* Question Card */}
      <QuestionCard
        question={question}
        questionNumber={currentQuestion + 1}
        selectedAnswer={userAnswers[question.id]}
        onSelectAnswer={(index: number) => handleAnswer(question.id, index)}
      />

      {/* Navigation */}
      <div className="mt-8 flex justify-between items-center">
        <button
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
          className="px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:border-[#FF6F00] hover:text-[#FF6F00] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ← Previous
        </button>

        <div className="flex gap-3">
          {currentQuestion < totalQuestions - 1 && (
            <button
              onClick={handleNext}
              className="px-6 py-2 bg-[#FF6F00] text-white rounded-lg hover:bg-[#E65100] transition-colors"
            >
              Next →
            </button>
          )}

          {/* Submit always visible, disabled until all answered */}
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className={`px-8 py-2 rounded-lg font-bold transition-colors ${
              allAnswered
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            } ${submitting ? 'opacity-50 cursor-not-allowed' : ''}`}
            title={allAnswered ? 'Submit quiz' : `Answer all ${totalQuestions} questions first`}
          >
            {submitting ? 'Submitting…' : allAnswered ? '✓ Submit Quiz' : `Submit (${answeredCount}/${totalQuestions})`}
          </button>
        </div>
      </div>

    </div>
  )
}
