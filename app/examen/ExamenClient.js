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

  // 📥 cargar preguntas
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

  // ⏱ TIMER
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

  // 🚨 ANTI-TRAMPA
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

  // 💾 GUARDAR RESULTADO + REGLAS DE NIVEL
  async function saveResult() {
    const {
      data: { user }
    } = await supabase.auth.getUser()

    if (!user) return

    // 1. guardar resultado
    await supabase.from('exam_results').insert([
      {
        user_id: user.id,
        score,
        cancelled,
        incidents: warnings,
        exam_id: examId
      }
    ])

    // 2. obtener examen
    const { data: exam } = await supabase
      .from('exams')
      .select('*')
      .eq('id', examId)
      .single()

    if (!exam) return

    // 3. regla de aprobación por nivel
    let passScore = 75

    if (exam.level === 'B1' || exam.level === 'B2') {
      passScore = 80
    }

    if (exam.level === 'C1') {
      passScore = 85
    }

    const passed = score >= passScore

    // 4. guardar progreso
    await supabase.from('student_progress').upsert([
      {
        user_id: user.id,
        exam_id: examId,
        status: passed ? 'passed' : 'failed',
        score
      }
    ])

    // 5. desbloqueo siguiente examen
    if (passed) {
      const { data: nextExam } = await supabase
        .from('exams')
        .select('*')
        .eq('order_index', exam.order_index + 1)
        .single()

      if (nextExam) {
        await supabase.from('student_progress').upsert([
          {
            user_id: user.id,
            exam_id: nextExam.id,
            status: 'available',
            score: 0
          }
        ])
      }
    }
  }

  useEffect(() => {
    if (finished) saveResult()
  }, [finished])

  // 🧠 RESPONDER
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

  const progress =
    questions.length > 0
      ? ((current + 1) / questions.length) * 100
      : 0

  // ⛔ loading
  if (loading) return <p>Cargando...</p>

  // ▶️ start
  if (!started)
    return (
      <div style={{ padding: 30 }}>
        <h1>Examen AIFI 🧠</h1>
        <button onClick={() => setStarted(true)}>
          Iniciar
        </button>
      </div>
    )

  // ❌ cancelado
  if (cancelled)
    return (
      <div>
        <h1>Examen cancelado</h1>
      </div>
    )

  // ✅ terminado
  if (finished)
    return (
      <div>
        <h1>Resultado: {score}</h1>
      </div>
    )

  // ❗ sin preguntas
  if (questions.length === 0)
    return (
      <div>
        <h1>No hay preguntas</h1>
      </div>
    )

  return (
    <div style={{ padding: 30 }}>
      <h1>Examen en curso</h1>

      <p>Tiempo: {time}</p>
      <p>Advertencias: {warnings}/3</p>

      <div style={{
        width: '100%',
        height: 10,
        background: '#eee',
        borderRadius: 20,
        margin: '10px 0'
      }}>
        <div style={{
          width: progress + '%',
          height: '100%',
          background: '#0A36FF',
          borderRadius: 20
        }} />
      </div>

      <h2>{questions[current].question}</h2>

      {[
        questions[current].option_a,
        questions[current].option_b,
        questions[current].option_c,
        questions[current].option_d
      ].map((op) => (
        <button
          key={op}
          onClick={() => answer(op)}
          style={{
            display: 'block',
            marginTop: 10,
            padding: 10
          }}
        >
          {op}
        </button>
      ))}
    </div>
  )
}
