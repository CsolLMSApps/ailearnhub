'use client'

import { useState } from 'react'
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

export function QuizComponent({
  slug,
  moduleNumber,
  questions,
  passPercentage = 70,
}: QuizComponentProps) {
  const router = useRouter()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [userAnswers, setUserAnswers] = useState<{ [key: string]: number }>({})
  const [showResults, setShowResults] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [quizResults, setQuizResults] = useState<any>(null)

  const handleAnswer = (questionId: string, answerIndex: number) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }))
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1)
    }
  }

  const handleSubmit = async () => {
    setSubmitting(true)

    try {
      const response = await fetch('/api/quiz/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug,
          moduleNumber,
          answers: userAnswers
        })
      })

      if (!response.ok) {
        throw new Error('Failed to submit quiz')
      }

      const results = await response.json()
      setQuizResults(results)
      setShowResults(true)

      // If passed, refresh the server component so progress + nav update
      if (results.passed) {
        router.refresh()
      }

    } catch (error) {
      console.error('Quiz submission error:', error)
      alert('Failed to submit quiz. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleRetry = () => {
    setCurrentQuestion(0)
    setUserAnswers({})
    setShowResults(false)
    setQuizResults(null)
  }

  // Check if all questions answered
  const allAnswered = questions.every((q: Question) => userAnswers[q.id] !== undefined)

  if (showResults && quizResults) {
    return (
      <ResultsSummary
        results={quizResults}
        passPercentage={passPercentage}
        onRetry={handleRetry}
      />
    )
  }

  const question = questions[currentQuestion]

  return (
    <div className="max-w-3xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-600">
            Question {currentQuestion + 1} of {questions.length}
          </span>
          <span className="text-sm text-gray-600">
            {Object.keys(userAnswers).length}/{questions.length} answered
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-[#FF6F00] h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

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
          Previous
        </button>

        <div className="flex gap-4">
          {currentQuestion < questions.length - 1 ? (
            <button
              onClick={handleNext}
              className="px-6 py-2 bg-[#FF6F00] text-white rounded-lg hover:bg-[#E65100] transition-colors"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!allAnswered || submitting}
              className="px-8 py-2 bg-[#FF6F00] text-white rounded-lg hover:bg-[#E65100] transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-bold"
            >
              {submitting ? 'Submitting...' : 'Submit Quiz'}
            </button>
          )}
        </div>
      </div>

      {/* Answer indicator */}
      {!allAnswered && currentQuestion === questions.length - 1 && (
        <p className="text-center mt-4 text-red-600 text-sm">
          Please answer all questions before submitting
        </p>
      )}
    </div>
  )
}
