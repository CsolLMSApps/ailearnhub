'use client'

import { useState, useEffect, useActionState } from 'react'
import { useRouter } from 'next/navigation'
import { saveQuiz, deleteQuiz } from '@/app/actions/admin-quiz'

/* ── Types ─────────────────────────────────────────────────────────────────── */
interface Question {
  id: string
  question: string
  options: [string, string, string, string]
  correct: number
}
interface Course       { id: string; title: string; slug: string }
interface Module       { id: string; module_number: number; title: string }
interface ExistingQuiz { questions: Question[]; pass_percentage: number }

const BLANK_QUESTION: Question = {
  id: '',
  question: '',
  options: ['', '', '', ''],
  correct: 0,
}
const LABELS = ['A', 'B', 'C', 'D']
const initialState = { error: undefined, success: undefined }

/* ── Component ─────────────────────────────────────────────────────────────── */
export default function QuizEditorClient({
  courses,
  modules,
  existingQuiz,
  defaultCourseId,
  defaultModuleNumber,
}: {
  courses: Course[]
  modules: Module[]
  existingQuiz: ExistingQuiz | null
  defaultCourseId: string
  defaultModuleNumber: number | null
}) {
  const router = useRouter()
  const [saveState,   saveAction,   savePending]   = useActionState(saveQuiz,   initialState)
  const [deleteState, deleteAction, deletePending] = useActionState(deleteQuiz, initialState)

  /* ── Local state ── */
  const [selectedCourseId, setSelectedCourseId]   = useState(defaultCourseId)
  const [selectedModule,   setSelectedModule]     = useState<number | null>(defaultModuleNumber)
  const [passPercentage,   setPassPercentage]     = useState(existingQuiz?.pass_percentage ?? 70)
  const [questions,        setQuestions]          = useState<Question[]>(existingQuiz?.questions ?? [])

  // Question editor panel
  const [editingIdx, setEditingIdx] = useState<number | null>(null) // null = none, questions.length = new
  const [draft,      setDraft]      = useState<Question | null>(null)

  // Sync when navigated to a different module
  useEffect(() => {
    setQuestions(existingQuiz?.questions ?? [])
    setPassPercentage(existingQuiz?.pass_percentage ?? 70)
    setEditingIdx(null)
    setDraft(null)
  }, [existingQuiz, defaultCourseId, defaultModuleNumber])

  /* ── Navigation helpers ── */
  const handleCourseChange = (courseId: string) => {
    setSelectedCourseId(courseId)
    setSelectedModule(null)
    router.push(courseId ? `/admin/quiz?courseId=${courseId}` : '/admin/quiz')
  }

  const handleModuleChange = (num: number | null) => {
    setSelectedModule(num)
    if (selectedCourseId && num) {
      router.push(`/admin/quiz?courseId=${selectedCourseId}&moduleNumber=${num}`)
    }
  }

  /* ── Question CRUD ── */
  const startAdd = () => {
    setEditingIdx(questions.length)
    setDraft({ ...BLANK_QUESTION, id: `q${questions.length + 1}`, options: ['', '', '', ''] })
  }

  const startEdit = (idx: number) => {
    setEditingIdx(idx)
    setDraft({
      ...questions[idx],
      options: [...questions[idx].options] as [string, string, string, string],
    })
  }

  const cancelEdit = () => { setEditingIdx(null); setDraft(null) }

  const commitQuestion = () => {
    if (!draft) return
    if (!draft.question.trim())          { alert('Question text is required'); return }
    if (draft.options.some(o => !o.trim())) { alert('All 4 options are required'); return }

    const updated = [...questions]
    if (editingIdx === questions.length) {
      updated.push({ ...draft, id: draft.id || `q${updated.length + 1}` })
    } else if (editingIdx !== null) {
      updated[editingIdx] = draft
    }
    setQuestions(updated)
    setEditingIdx(null)
    setDraft(null)
  }

  const removeQuestion = (idx: number) => {
    if (!confirm('Remove this question?')) return
    setQuestions(qs => qs.filter((_, i) => i !== idx))
    if (editingIdx === idx) { setEditingIdx(null); setDraft(null) }
  }

  const moveQuestion = (idx: number, dir: -1 | 1) => {
    const target = idx + dir
    if (target < 0 || target >= questions.length) return
    const updated = [...questions];
    [updated[idx], updated[target]] = [updated[target], updated[idx]]
    setQuestions(updated)
  }

  const updateDraftOption = (i: number, value: string) => {
    if (!draft) return
    const opts = [...draft.options] as [string, string, string, string]
    opts[i] = value
    setDraft({ ...draft, options: opts })
  }

  const isEditorPanelOpen = draft !== null

  /* ── Render ── */
  return (
    <div>
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Quiz Editor</h1>
        <p className="text-sm text-gray-500 mt-1">
          Create and manage quiz questions for any course module
        </p>
      </div>

      {/* Status messages */}
      {(saveState.success || deleteState.success) && (
        <div className="mb-4 px-4 py-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
          ✅ {saveState.success || deleteState.success}
        </div>
      )}
      {(saveState.error || deleteState.error) && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          ❌ {saveState.error || deleteState.error}
        </div>
      )}

      {/* Course + Module + Pass % selector */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 mb-4">
        <div className="flex flex-wrap gap-4 items-end">
          {/* Course */}
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
              Course
            </label>
            <select
              value={selectedCourseId}
              onChange={e => handleCourseChange(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/30"
            >
              <option value="">— Select a course —</option>
              {courses.map(c => (
                <option key={c.id} value={c.id}>{c.title}</option>
              ))}
            </select>
          </div>

          {/* Module */}
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
              Module
            </label>
            <select
              value={selectedModule ?? ''}
              onChange={e => handleModuleChange(e.target.value ? parseInt(e.target.value) : null)}
              disabled={!selectedCourseId || modules.length === 0}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/30 disabled:bg-gray-50 disabled:text-gray-400"
            >
              <option value="">— Select a module —</option>
              {modules.map(m => (
                <option key={m.id} value={m.module_number}>
                  Module {m.module_number}: {m.title}
                </option>
              ))}
            </select>
          </div>

          {/* Pass percentage */}
          <div className="w-36">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
              Pass Percentage
            </label>
            <div className="relative">
              <input
                type="number"
                min={50}
                max={100}
                value={passPercentage}
                onChange={e => setPassPercentage(Math.min(100, Math.max(50, parseInt(e.target.value) || 70)))}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/30 pr-8"
              />
              <span className="absolute right-3 top-2 text-gray-400 text-sm">%</span>
            </div>
          </div>

          {/* Quiz status badge */}
          {selectedCourseId && selectedModule && (
            <div className="shrink-0">
              <span className={`px-3 py-2 rounded-lg text-xs font-semibold ${
                existingQuiz
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : 'bg-orange-50 text-orange-700 border border-orange-200'
              }`}>
                {existingQuiz
                  ? `✓ Quiz exists · ${existingQuiz.questions?.length ?? 0} questions`
                  : '+ No quiz yet'}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Empty state — no course/module selected */}
      {(!selectedCourseId || !selectedModule) && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-16 text-center">
          <p className="text-5xl mb-4">📝</p>
          <p className="text-gray-600 font-medium">Select a course and module above</p>
          <p className="text-gray-400 text-sm mt-1">to create or edit its quiz questions</p>
        </div>
      )}

      {/* Editor — shown when course + module selected */}
      {selectedCourseId && selectedModule && (
        <div className={`grid gap-4 ${isEditorPanelOpen ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>

          {/* ── Left: Question list ── */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div>
                <h2 className="font-bold text-gray-900">Questions</h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  {questions.length} question{questions.length !== 1 ? 's' : ''} · {passPercentage}% to pass
                </p>
              </div>
              <button
                onClick={startAdd}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-[#FF6F00] text-white text-xs font-bold rounded-lg hover:bg-[#E65100] transition-colors"
              >
                + Add Question
              </button>
            </div>

            {questions.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center py-16 text-center">
                <p className="text-4xl mb-3">❓</p>
                <p className="text-gray-500 font-medium text-sm">No questions yet</p>
                <p className="text-gray-400 text-xs mt-1">Click "Add Question" to get started</p>
              </div>
            ) : (
              <div className="flex-1 divide-y divide-gray-50 overflow-auto">
                {questions.map((q, idx) => (
                  <div
                    key={`${q.id}-${idx}`}
                    className={`px-5 py-3.5 flex items-start gap-3 transition-colors ${
                      editingIdx === idx
                        ? 'bg-orange-50 border-l-4 border-[#FF6F00]'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    {/* Number badge */}
                    <span className="mt-0.5 w-6 h-6 rounded-full bg-[#FF6F00]/10 text-[#FF6F00] text-xs font-bold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>

                    {/* Question + answer preview */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 leading-snug line-clamp-2">
                        {q.question}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Correct:{' '}
                        <span className="text-green-600 font-semibold">
                          {LABELS[q.correct]}. {q.options[q.correct]}
                        </span>
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-0.5 shrink-0">
                      <button
                        onClick={() => moveQuestion(idx, -1)}
                        disabled={idx === 0}
                        className="p-1.5 text-gray-300 hover:text-gray-500 disabled:opacity-0 transition-colors"
                        title="Move up"
                      >▲</button>
                      <button
                        onClick={() => moveQuestion(idx, 1)}
                        disabled={idx === questions.length - 1}
                        className="p-1.5 text-gray-300 hover:text-gray-500 disabled:opacity-0 transition-colors"
                        title="Move down"
                      >▼</button>
                      <button
                        onClick={() => startEdit(idx)}
                        className="px-2.5 py-1 text-xs font-semibold text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => removeQuestion(idx)}
                        className="px-2.5 py-1 text-xs font-semibold text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Save / Delete row */}
            <div className="px-5 py-4 border-t border-gray-100 flex gap-3">
              <form action={saveAction} className="flex-1">
                <input type="hidden" name="course_id"       value={selectedCourseId} />
                <input type="hidden" name="module_number"   value={selectedModule} />
                <input type="hidden" name="pass_percentage" value={passPercentage} />
                <input type="hidden" name="questions"       value={JSON.stringify(questions)} />
                <button
                  type="submit"
                  disabled={savePending || questions.length === 0}
                  className="w-full py-2.5 bg-[#FF6F00] text-white text-sm font-bold rounded-lg hover:bg-[#E65100] disabled:opacity-40 transition-colors"
                >
                  {savePending
                    ? 'Saving…'
                    : `💾 Save Quiz (${questions.length} question${questions.length !== 1 ? 's' : ''})`}
                </button>
              </form>

              {existingQuiz && (
                <form action={deleteAction}>
                  <input type="hidden" name="course_id"     value={selectedCourseId} />
                  <input type="hidden" name="module_number" value={selectedModule} />
                  <button
                    type="submit"
                    disabled={deletePending}
                    onClick={e => !confirm('Delete this entire quiz? Students will lose their attempt history.') && e.preventDefault()}
                    className="px-4 py-2.5 border border-red-200 text-red-500 text-sm font-semibold rounded-lg hover:bg-red-50 disabled:opacity-40 transition-colors"
                    title="Delete quiz"
                  >
                    {deletePending ? '…' : '🗑'}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* ── Right: Question editor panel ── */}
          {isEditorPanelOpen && draft && (
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
              {/* Panel header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                <h3 className="font-bold text-gray-900">
                  {editingIdx === questions.length
                    ? '✚ New Question'
                    : `✏️ Edit Question ${editingIdx! + 1}`}
                </h3>
                <button
                  onClick={cancelEdit}
                  className="text-gray-400 hover:text-gray-600 text-sm font-medium transition-colors"
                >
                  ✕ Cancel
                </button>
              </div>

              <div className="p-5 space-y-5">
                {/* Question text */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                    Question Text
                  </label>
                  <textarea
                    value={draft.question}
                    onChange={e => setDraft({ ...draft, question: e.target.value })}
                    rows={3}
                    placeholder="Enter the question…"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#FF6F00]/30 resize-none"
                  />
                </div>

                {/* Options */}
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                    Answer Options
                    <span className="ml-2 text-gray-400 normal-case font-normal">
                      (select the correct one)
                    </span>
                  </label>
                  <div className="space-y-2.5">
                    {LABELS.map((label, i) => {
                      const isCorrect = draft.correct === i
                      return (
                        <label
                          key={i}
                          className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                            isCorrect
                              ? 'border-green-400 bg-green-50'
                              : 'border-gray-100 hover:border-gray-200 bg-gray-50'
                          }`}
                        >
                          <input
                            type="radio"
                            name="correct_answer"
                            checked={isCorrect}
                            onChange={() => setDraft({ ...draft, correct: i })}
                            className="accent-green-500 w-4 h-4 shrink-0"
                          />
                          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                            isCorrect
                              ? 'bg-green-500 text-white'
                              : 'bg-gray-200 text-gray-500'
                          }`}>
                            {label}
                          </span>
                          <input
                            type="text"
                            value={draft.options[i]}
                            onChange={e => updateDraftOption(i, e.target.value)}
                            placeholder={`Option ${label}`}
                            className="flex-1 bg-transparent border-none outline-none text-sm text-gray-900 placeholder-gray-400"
                          />
                          {isCorrect && (
                            <span className="text-green-600 text-xs font-bold shrink-0">✓ Correct</span>
                          )}
                        </label>
                      )
                    })}
                  </div>
                </div>

                {/* Preview */}
                {draft.question && (
                  <div className="rounded-xl border border-gray-100 bg-gray-50 p-3">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Preview</p>
                    <p className="text-sm font-medium text-gray-900 mb-2">{draft.question}</p>
                    <div className="space-y-1">
                      {draft.options.map((opt, i) => opt && (
                        <p key={i} className={`text-xs px-2 py-1 rounded ${draft.correct === i ? 'bg-green-100 text-green-700 font-semibold' : 'text-gray-500'}`}>
                          {LABELS[i]}. {opt}
                        </p>
                      ))}
                    </div>
                  </div>
                )}

                {/* Commit button */}
                <button
                  onClick={commitQuestion}
                  className="w-full py-2.5 bg-[#FF6F00] text-white text-sm font-bold rounded-xl hover:bg-[#E65100] transition-colors"
                >
                  {editingIdx === questions.length ? '+ Add to Quiz' : '✓ Update Question'}
                </button>
              </div>
            </div>
          )}

          {/* Placeholder when no question is being edited */}
          {!isEditorPanelOpen && questions.length > 0 && (
            <div className="hidden lg:flex bg-white rounded-xl border border-gray-200 shadow-sm flex-col items-center justify-center py-16 text-center">
              <p className="text-4xl mb-3">✏️</p>
              <p className="text-gray-500 font-medium text-sm">Select a question to edit</p>
              <p className="text-gray-400 text-xs mt-1">or click "Add Question" to create a new one</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
