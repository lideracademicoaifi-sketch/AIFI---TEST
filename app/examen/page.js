'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { supabase } from '../lib/supabase'

export default function Examen() {
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

  // 📥 cargar preguntas por examen
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

  // ⏱ timer
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

  // 🚨 anti-trampa
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

  // 💾 guardar resultado + desbloqueo
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

    // 2. obtener examen actual
    const { data: exam } = await supabase
      .from('exams')
      .select('*')
      .eq('id', examId)
      .single()

    const passScore = 60
    const passed = score >= passScore

    // 3. guardar progreso
    await supabase.from('student_progress').upsert([
      {
        user_id: user.id,
        exam_id: examId,
        status: passed ? 'passed' : 'failed',
        score
      }
    ])

    // 4. desbloquear siguiente examen
    if (passed && exam) {
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

  // 🧠 responder
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
  if (loading) {
    return (
      <main style={styles.page}>
        <div style={styles.card}>
          <h2>Cargando examen...</h2>
        </div>
      </main>
    )
  }

  // ▶️ start
  if (!started) {
    return (
      <main style={styles.page}>
        <div style={styles.card}>
          <h1>Examen AIFI 🧠</h1>
          <p>Duración: 5 minutos</p>

          <button
            style={styles.primary}
            onClick={() => setStarted(true)}
          >
            Iniciar examen
          </button>
        </div>
      </main>
    )
  }

  // ❌ cancelado
  if (cancelled) {
    return (
      <main style={styles.page}>
        <div style={styles.card}>
          <h1>Examen Cancelado</h1>
          <p>Se detectaron múltiples salidas.</p>
        </div>
      </main>
    )
  }

  // ✅ finalizado
  if (finished) {
    return (
      <main style={styles.page}>
        <div style={styles.card}>
          <h1>Resultado Final</h1>
          <h2>{score}</h2>
          <p>Resultado guardado correctamente</p>
        </div>
      </main>
    )
  }

  // ❗ sin preguntas
  if (questions.length === 0) {
    return (
      <main style={styles.page}>
        <div style={styles.card}>
          <h1>No hay preguntas</h1>
          <p>Este examen no tiene contenido</p>
        </div>
      </main>
    )
  }

  return (
    <main style={styles.page}>
      <div style={styles.card}>
        <h1>Examen en Curso</h1>

        <p>Tiempo: {time}s</p>
        <p>Advertencias: {warnings}/3</p>

        <div style={styles.bar}>
          <div
            style={{
              ...styles.fill,
              width: progress + '%'
            }}
          />
        </div>

        <p>
          Pregunta {current + 1} de {questions.length}
        </p>

        <h2>{questions[current].question}</h2>

        {[
          questions[current].option_a,
          questions[current].option_b,
          questions[current].option_c,
          questions[current].option_d
        ].map((op) => (
          <button
            key={op}
            style={styles.option}
            onClick={() => answer(op)}
          >
            {op}
          </button>
        ))}
      </div>
    </main>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg,#0A36FF,#111827)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  card: {
    width: '100%',
    maxWidth: 600,
    background: 'white',
    borderRadius: 20,
    padding: 35
  },
  primary: {
    width: '100%',
    padding: 14,
    border: 'none',
    borderRadius: 12,
    background: '#0A36FF',
    color: 'white'
  },
  option: {
    width: '100%',
    padding: 14,
    marginTop: 12,
    border: '1px solid #ddd',
    borderRadius: 12
  },
  bar: {
    width: '100%',
    height: 10,
    background: '#eee',
    borderRadius: 20,
    margin: '15px 0'
  },
  fill: {
    height: '100%',
    background: '#0A36FF',
    borderRadius: 20
  }
}
