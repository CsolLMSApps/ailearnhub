'use client'

interface ResultsSummaryProps {
  results: {
    score: number
    total_questions: number
    percentage: number
    passed: boolean
    attempt_number: number
    slug: string
  }
  passPercentage: number
  onRetry: () => void
}

export function ResultsSummary({
  results,
  passPercentage,
  onRetry,
}: ResultsSummaryProps) {
  const { score, total_questions, percentage, passed, attempt_number, slug } = results

  return (
    <div className="max-w-2xl mx-auto">
      {/* Result Header */}
      <div className={`rounded-xl p-8 mb-6 text-center ${passed ? 'bg-green-50 border-2 border-green-500' : 'bg-red-50 border-2 border-red-400'}`}>
        <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${passed ? 'bg-green-500' : 'bg-red-500'}`}>
          {passed ? (
            <svg className="w-9 h-9 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg className="w-9 h-9 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
        </div>

        <h2 className={`text-3xl font-bold mb-2 ${passed ? 'text-green-900' : 'text-red-900'}`}>
          {passed ? 'Congratulations! You Passed!' : 'Not Quite There Yet'}
        </h2>

        {attempt_number > 1 && (
          <p className="text-sm text-gray-500 mb-3">Attempt #{attempt_number}</p>
        )}

        <p className={`text-base ${passed ? 'text-green-700' : 'text-red-700'}`}>
          {passed
            ? 'Great work! Your certificate is now available.'
            : `You need ${passPercentage}% to pass. Review the modules and try again!`}
        </p>
      </div>

      {/* Score — only numbers, no answer breakdown */}
      <div className="bg-white rounded-xl border-2 border-gray-200 p-8 mb-6">
        <h3 className="text-lg font-bold text-gray-900 text-center mb-6">Your Score</h3>
        <div className="grid grid-cols-3 gap-6 text-center">
          <div>
            <p className="text-4xl font-bold text-green-600">{score}</p>
            <p className="text-sm text-gray-500 mt-1">Correct</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-[#FF6F00]">{percentage}%</p>
            <p className="text-sm text-gray-500 mt-1">Score</p>
          </div>
          <div>
            <p className="text-4xl font-bold text-red-400">{total_questions - score}</p>
            <p className="text-sm text-gray-500 mt-1">Incorrect</p>
          </div>
        </div>

        {/* Pass threshold indicator */}
        <div className="mt-6">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>0%</span>
            <span className="text-[#FF6F00] font-semibold">Pass: {passPercentage}%</span>
            <span>100%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 relative">
            <div
              className={`h-3 rounded-full transition-all duration-700 ${passed ? 'bg-green-500' : 'bg-red-400'}`}
              style={{ width: `${percentage}%` }}
            />
            {/* Pass line marker */}
            <div
              className="absolute top-0 h-3 w-0.5 bg-[#FF6F00]"
              style={{ left: `${passPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-center gap-4">
        {!passed && (
          <button
            onClick={onRetry}
            className="px-8 py-3 bg-[#FF6F00] text-white rounded-lg hover:bg-[#E65100] transition-colors font-bold"
          >
            Retry Quiz
          </button>
        )}
        {passed && (
          <a
            href={`/learn/${slug}`}
            className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-bold inline-block"
          >
            🏆 View My Certificate →
          </a>
        )}
        <a
          href={`/learn/${slug}`}
          className="px-8 py-3 border-2 border-gray-300 text-gray-600 rounded-lg hover:border-[#FF6F00] hover:text-[#FF6F00] transition-colors font-bold inline-block"
        >
          Back to Course
        </a>
      </div>
    </div>
  )
}
