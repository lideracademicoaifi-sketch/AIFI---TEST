'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { supabase } from '../lib/supabase'
'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { supabase } from '../lib/supabase'

export default function ExamenClient() {
  const searchParams = useSearchParams()
  const examId = searchParams.get('exam')

  const [started, setStarted] = useState(false)
  const [time, setTime] = useState(300)
  const [questions, setQuestions] = useState([])
  const [current, setCurrent] = useState(0)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)
  const [warnings, setWarnings] = useState(0)
  const [cancelled, setCancelled] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!examId) return
    loadQuestions()
  }, [examId])

  async function loadQuestions() {
    const { data } = await supabase
      .from('questions')
      .select('*')
      .eq('exam_id', examId)

    setQuestions(data || [])
    setLoading(false)
  }

  useEffect(() => {
    let timer

    if (started && !finished && time > 0) {
      timer = setInterval(() => {
        setTime((prev) => prev - 1)
      }, 1000)
    }

    if (time === 0 && started) {
      setFinished(true)
    }

    return () => clearInterval(timer)
  }, [started, finished, time])

  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden && started && !finished) {
        const newWarnings = warnings + 1
        setWarnings(newWarnings)

        if (newWarnings >= 3) {
          setCancelled(true)
          setFinished(true)
        }
      }
    }

    document.addEventListener('visibilitychange', handleVisibility)

    return () =>
      document.removeEventListener('visibilitychange', handleVisibility)
  }, [started, finished, warnings])

  async function saveResult() {
    const {
      data: { user }
    } = await supabase.auth.getUser()

    if (!user) return

    await supabase.from('exam_results').insert([
      {
        user_id: user.id,
        score,
        cancelled,
        incidents: warnings,
        exam_id: examId
      }
    ])
  }

  useEffect(() => {
    if (finished) saveResult()
  }, [finished])

  function answer(option) {
    if (option === questions[current].answer) {
      setScore((prev) => prev + 20)
    }

    const next = current + 1

    if (next < questions.length) {
      setCurrent(next)
    } else {
      setFinished(true)
    }
  }

  if (loading) return <p>Cargando...</p>

  if (!started)
    return (
      <div style={{ padding: 30 }}>
        <h1>Examen AIFI 🧠</h1>
        <button onClick={() => setStarted(true)}>
          Iniciar
        </button>
      </div>
    )

  if (cancelled)
    return (
      <div>
        <h1>Examen cancelado</h1>
      </div>
    )

  if (finished)
    return (
      <div>
        <h1>Resultado: {score}</h1>
      </div>
    )

  return (
    <div style={{ padding: 30 }}>
      <h1>Examen</h1>
      <p>Tiempo: {time}</p>

      <h2>{questions[current].question}</h2>

      {[
        questions[current].option_a,
        questions[current].option_b,
        questions[current].option_c,
        questions[current].option_d
      ].map((op) => (
        <button key={op} onClick={() => answer(op)}>
          {op}
        </button>
      ))}
    </div>
  )
}
