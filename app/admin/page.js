'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useRouter } from 'next/navigation'

export default function Admin() {
  const router = useRouter()

  const [results, setResults] = useState([])
  const [questions, setQuestions] = useState([])

  const [question, setQuestion] = useState('')
  const [a, setA] = useState('')
  const [b, setB] = useState('')
  const [c, setC] = useState('')
  const [d, setD] = useState('')
  const [answer, setAnswer] = useState('')

  useEffect(() => {
    checkAccess()
  }, [])

  async function checkAccess() {
    const {
      data: { user }
    } = await supabase.auth.getUser()

    if (!user) {
      router.push('/login')
      return
    }

    if (
      user.email !==
      'lideracademicoaifi@gmail.com'
    ) {
      router.push('/dashboard')
      return
    }

    loadData()
  }

  async function loadData() {
    const { data } = await supabase
      .from('exam_results')
      .select('*')

    setResults(data || [])

    const { data: q } = await supabase
      .from('questions')
      .select('*')
      .order('created_at', {
        ascending: false
      })

    setQuestions(q || [])
  }

  async function addQuestion() {
    await supabase.from('questions').insert([
      {
        question,
        option_a: a,
        option_b: b,
        option_c: c,
        option_d: d,
        answer
      }
    ])

    setQuestion('')
    setA('')
    setB('')
    setC('')
    setD('')
    setAnswer('')

    loadData()
  }

  async function deleteQuestion(id) {
    await supabase
      .from('questions')
      .delete()
      .eq('id', id)

    loadData()
  }

  return (
    <main style={styles.page}>
      <div style={styles.box}>
        <h1>Panel Admin 🔐</h1>

        <button
          onClick={() =>
            router.push('/dashboard')
          }
          style={styles.btnDark}
        >
          Volver Dashboard
        </button>

        <hr />

        <h2>Crear Pregunta</h2>

        <input
          placeholder="Pregunta"
          value={question}
          onChange={(e) =>
            setQuestion(e.target.value)
          }
          style={styles.input}
        />

        <input
          placeholder="Opción A"
          value={a}
          onChange={(e) => setA(e.target.value)}
          style={styles.input}
        />

        <input
          placeholder="Opción B"
          value={b}
          onChange={(e) => setB(e.target.value)}
          style={styles.input}
        />

        <input
          placeholder="Opción C"
          value={c}
          onChange={(e) => setC(e.target.value)}
          style={styles.input}
        />

        <input
          placeholder="Opción D"
          value={d}
          onChange={(e) => setD(e.target.value)}
          style={styles.input}
        />

        <input
          placeholder="Respuesta correcta"
          value={answer}
          onChange={(e) =>
            setAnswer(e.target.value)
          }
          style={styles.input}
        />

        <button
          onClick={addQuestion}
          style={styles.btnBlue}
        >
          Guardar Pregunta
        </button>

        <hr />

        <h2>Preguntas Guardadas</h2>

        {questions.map((item) => (
          <div
            key={item.id}
            style={styles.card}
          >
            <p>
              <b>{item.question}</b>
            </p>

            <p>
              A) {item.option_a}
              <br />
              B) {item.option_b}
              <br />
              C) {item.option_c}
              <br />
              D) {item.option_d}
            </p>

            <p>
              Correcta: {item.answer}
            </p>

            <button
              onClick={() =>
                deleteQuestion(item.id)
              }
              style={styles.btnRed}
            >
              Eliminar
            </button>
          </div>
        ))}
      </div>
    </main>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    background:
      'linear-gradient(135deg,#0A36FF,#111827)',
    padding: 30
  },

  box: {
    maxWidth: 900,
    margin: '0 auto',
    background: 'white',
    padding: 30,
    borderRadius: 20
  },

  input: {
    width: '100%',
    padding: 12,
    marginBottom: 10,
    borderRadius: 10,
    border: '1px solid #ddd'
  },

  btnBlue: {
    padding: 12,
    border: 'none',
    borderRadius: 10,
    background: '#0A36FF',
    color: 'white',
    cursor: 'pointer',
    marginBottom: 20
  },

  btnDark: {
    padding: 12,
    border: 'none',
    borderRadius: 10,
    background: '#111',
    color: 'white',
    cursor: 'pointer',
    marginBottom: 20
  },

  btnRed: {
    padding: 10,
    border: 'none',
    borderRadius: 10,
    background: 'red',
    color: 'white',
    cursor: 'pointer'
  },

  card: {
    border: '1px solid #ddd',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15
  }
}
