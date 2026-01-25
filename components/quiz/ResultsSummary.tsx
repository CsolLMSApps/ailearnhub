'use client'

import { QuestionCard } from './QuestionCard'

interface ResultsSummaryProps {
  results: {
    score: number
    total_questions: number
    percentage: number
    passed: boolean
    attempt_number: number
    courseSlug: string
  }
  questions: any[]
  userAnswers: { [key: string]: number }
  passPercentage: number
  onRetry: () => void
}

export function ResultsSummary({
  results,
  questions,
  userAnswers,
  passPercentage,
  onRetry
}: ResultsSummaryProps) {
  const { score, total_questions, percentage, passed, attempt_number, courseSlug } = results

  return (
    <div className="max-w-4xl mx-auto">
      {/* Results Header */}
      <div className={`rounded-lg p-8 mb-8 ${passed ? 'bg-green-50 border-2 border-green-500' : 'bg-red-50 border-2 border-red-500'}`}>
        <div className="text-center">
          {passed ? (
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          ) : (
            <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
          )}

          <h2 className={`text-3xl font-bold mb-2 ${passed ? 'text-green-900' : 'text-red-900'}`}>
            {passed ? 'Congratulations! You Passed!' : 'Not Quite There Yet'}
          </h2>

          <p className={`text-lg mb-4 ${passed ? 'text-green-800' : 'text-red-800'}`}>
            You scored {score} out of {total_questions} ({percentage}%)
          </p>

          <p className="text-gray-600">
            {passed 
              ? 'You can now proceed to the next module.'
              : `You need ${passPercentage}% to pass. Don't worry, you can retry as many times as needed!`
            }
          </p>

          {attempt_number > 1 && (
            <p className="text-sm text-gray-500 mt-2">
              Attempt #{attempt_number}
            </p>
          )}
        </div>
      </div>

      {/* Score Breakdown */}
      <div className="bg-white rounded-lg border-2 border-gray-200 p-6 mb-8">
        <h3 className="text-xl font-bold mb-4">Score Breakdown</h3>
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-3xl font-bold text-[#FF6F00]">{score}</p>
            <p className="text-sm text-gray-600">Correct</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-gray-400">{total_questions - score}</p>
            <p className="text-sm text-gray-600">Incorrect</p>
          </div>
          <div>
            <p className="text-3xl font-bold text-[#FF6F00]">{percentage}%</p>
            <p className="text-sm text-gray-600">Final Score</p>
          </div>
        </div>
      </div>

      {/* Review Answers */}
      <div className="mb-8">
        <h3 className="text-2xl font-bold mb-6">Review Your Answers</h3>
        <div className="space-y-6">
          {questions.map((question, index) => (
            <div key={question.id}>
              <QuestionCard
                question={question}
                questionNumber={index + 1}
                selectedAnswer={userAnswers[question.id]}
                onSelectAnswer={() => {}}
                showCorrect={true}
                correctAnswer={question.correct}
              />
              {question.explanation && (
                <div className="mt-3 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
                  <p className="text-sm text-blue-900">
                    <strong>Explanation:</strong> {question.explanation}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4">
        {!passed && (
          <button
            onClick={onRetry}
            className="px-8 py-3 bg-[#FF6F00] text-white rounded-lg hover:bg-[#E65100] transition-colors font-bold"
          >
            Retry Quiz
          </button>
        )}
        <a
          href={`/learn/${courseSlug}`}
          className="px-8 py-3 border-2 border-[#FF6F00] text-[#FF6F00] rounded-lg hover:bg-[#FF6F00] hover:text-white transition-colors font-bold inline-block"
        >
          Back to Course
        </a>
      </div>
    </div>
  )
}
