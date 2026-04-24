'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function ExamenClient() {
  const searchParams = useSearchParams()
  const examId = searchParams.get('exam')

  const [exam, setExam] = useState(null)
  const [questions, setQuestions] = useState([])
  const [current, setCurrent] = useState(0)
  const [answers, setAnswers] = useState({})
  const [started, setStarted] = useState(false)
  const [finished, setFinished] = useState(false)
  const [score, setScore] = useState(0)
  const [time, setTime] = useState(300)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (examId) loadExam()
  }, [examId])

  async function loadExam() {
    const { data: examData } = await supabase
      .from('exams')
      .select('*')
      .eq('id', examId)
      .single()

    const { data: questionData } = await supabase
      .from('questions')
      .select('*')
      .eq('exam_id', examId)
      .order('sort_order')

    setExam(examData)
    setQuestions(questionData || [])
    setTime((examData?.time_limit || 5) * 60)
    setLoading(false)
  }

  useEffect(() => {
    if (!started || finished) return

    const timer = setInterval(() => {
      setTime(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          submitExam()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [started, finished])

  function chooseAnswer(option) {
    setAnswers({
      ...answers,
      [questions[current].id]: option
    })

    if (current + 1 < questions.length) {
      setCurrent(current + 1)
    } else {
      submitExam()
    }
  }

  async function submitExam() {
    let correct = 0

    questions.forEach(q => {
      if (answers[q.id] === q.correct_answer) {
        correct++
      }
    })

    const percentage = Math.round(
      (correct / questions.length) * 100
    )

    setScore(percentage)
    setFinished(true)

    const {
      data: { user }
    } = await supabase.auth.getUser()

    if (user) {
      await supabase.from('exam_results').insert({
        user_id: user.id,
        exam_id: examId,
        score: correct,
        total_questions: questions.length,
        correct_answers: correct,
        passed: percentage >= exam.passing_score,
        completed: true,
        finished_at: new Date()
      })
    }
  }

  if (loading) return <div className="p-10">Loading...</div>

  if (!started)
    return (
      <div className="p-10 max-w-xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">
          {exam.title}
        </h1>
        <p>{exam.description}</p>

        <button
          onClick={() => setStarted(true)}
          className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-xl"
        >
          Start Exam
        </button>
      </div>
    )

  if (finished)
    return (
      <div className="p-10 text-center">
        <h1 className="text-4xl font-bold">
          {score >= exam.passing_score
            ? 'PASSED 🎉'
            : 'FAILED 😢'}
        </h1>

        <p className="mt-4 text-xl">
          Score: {score}%
        </p>
      </div>
    )

  const q = questions[current]

  return (
    <div className="p-10 max-w-2xl mx-auto">
      <div className="flex justify-between mb-6">
        <span>
          Question {current + 1}/{questions.length}
        </span>

        <span>{time}s</span>
      </div>

      <h2 className="text-2xl font-bold mb-6">
        {q.question}
      </h2>

      {[
        q.option_a,
        q.option_b,
        q.option_c,
        q.option_d
      ].map(option => (
        <button
          key={option}
          onClick={() => chooseAnswer(option)}
          className="block w-full border p-4 rounded-xl mb-3 hover:bg-gray-100"
        >
          {option}
        </button>
      ))}
    </div>
  )
}
