'use client'

interface QuestionCardProps {
  question: {
    id: string
    question: string
    options: string[]
  }
  questionNumber: number
  selectedAnswer?: number
  onSelectAnswer: (index: number) => void
  showCorrect?: boolean
  correctAnswer?: number
}

export function QuestionCard({
  question,
  questionNumber,
  selectedAnswer,
  onSelectAnswer,
  showCorrect = false,
  correctAnswer
}: QuestionCardProps) {
  return (
    <div className="bg-white rounded-lg border-2 border-gray-200 p-8">
      {/* Question */}
      <div className="mb-6">
        <span className="inline-block px-3 py-1 bg-[#FF6F00] text-white rounded-full text-sm font-bold mb-4">
          Question {questionNumber}
        </span>
        <h3 className="text-xl font-bold text-gray-900">
          {question.question}
        </h3>
      </div>

      {/* Options */}
      <div className="space-y-3">
        {question.options.map((option, index) => {
          const isSelected = selectedAnswer === index
          const isCorrect = showCorrect && correctAnswer === index
          const isWrong = showCorrect && isSelected && selectedAnswer !== correctAnswer

          let bgColor = 'bg-white hover:bg-gray-50'
          let borderColor = 'border-gray-300'
          let textColor = 'text-gray-900'

          if (showCorrect) {
            if (isCorrect) {
              bgColor = 'bg-green-50'
              borderColor = 'border-green-500'
              textColor = 'text-green-900'
            } else if (isWrong) {
              bgColor = 'bg-red-50'
              borderColor = 'border-red-500'
              textColor = 'text-red-900'
            }
          } else if (isSelected) {
            bgColor = 'bg-orange-50'
            borderColor = 'border-[#FF6F00]'
            textColor = 'text-[#FF6F00]'
          }

          return (
            <button
              key={index}
              onClick={() => !showCorrect && onSelectAnswer(index)}
              disabled={showCorrect}
              className={`w-full text-left p-4 rounded-lg border-2 transition-all ${bgColor} ${borderColor} ${textColor} ${!showCorrect && 'hover:border-[#FF6F00] cursor-pointer'}`}
            >
              <div className="flex items-center gap-3">
                <span className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full border-2 ${borderColor} font-bold`}>
                  {String.fromCharCode(65 + index)}
                </span>
                <span className="flex-1">{option}</span>
                {showCorrect && isCorrect && (
                  <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
                {showCorrect && isWrong && (
                  <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
