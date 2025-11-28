import { Database } from './database.types'

export type Course = Database['public']['Tables']['courses']['Row']
export type CourseModule = Database['public']['Tables']['course_modules']['Row']
export type Quiz = Database['public']['Tables']['quizzes']['Row']
export type Purchase = Database['public']['Tables']['purchases']['Row']
export type Progress = Database['public']['Tables']['progress']['Row']
export type QuizResult = Database['public']['Tables']['quiz_results']['Row']
export type Certificate = Database['public']['Tables']['certificates']['Row']

export interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correct: number
}

export interface QuizSubmission {
  [questionId: string]: number
}

export interface CourseWithProgress extends Course {
  progress?: Progress
  hasPurchased: boolean
}

export interface ModuleWithQuiz extends CourseModule {
  quiz?: Quiz
  quizResult?: QuizResult
}
