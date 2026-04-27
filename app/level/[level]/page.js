'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabase'
import { useRouter } from 'next/navigation'

export default function LevelPage({ params }) {
  const router = useRouter()
  const { level } = params

  const [exams, setExams] = useState([])

  useEffect(() => {
    loadExams()
  }, [])

  async function loadExams() {
    const { data } = await supabase
      .from('exams')
      .select('*')
      .eq('level', level)

    setExams(data || [])
  }

  return (
    <main style={styles.page}>
      <div style={styles.box}>
        <h1>📘 Nivel {level}</h1>

        <button onClick={() => router.push('/dashboard')}>
          ← Volver
        </button>

        <div style={styles.grid}>
          {exams.map((exam) => (
            <button
              key={exam.id}
              onClick={() => router.push(`/exam/${exam.id}`)}
              style={styles.card}
            >
              📝 {exam.title}
            </button>
          ))}
        </div>
      </div>
    </main>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    background: '#0A36FF',
    padding: 30
  },
  box: {
    maxWidth: 900,
    margin: '0 auto',
    background: 'white',
    padding: 30,
    borderRadius: 20
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))',
    gap: 15,
    marginTop: 20
  },
  card: {
    padding: 20,
    borderRadius: 15,
    border: 'none',
    background: '#111',
    color: 'white',
    cursor: 'pointer'
  }
}
