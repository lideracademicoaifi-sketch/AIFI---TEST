'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useRouter } from 'next/navigation'

export default function Admin() {
  const router = useRouter()

  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)

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
      .order('created_at', {
        ascending: false
      })

    setResults(data || [])
    setLoading(false)
  }

  const total = results.length

  const cancelled = results.filter(
    (r) => r.cancelled
  ).length

  const average =
    total > 0
      ? Math.round(
          results.reduce(
            (sum, r) => sum + r.score,
            0
          ) / total
        )
      : 0

  if (loading) {
    return (
      <main style={styles.page}>
        <div style={styles.card}>
          <h1>Cargando...</h1>
        </div>
      </main>
    )
  }

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>
          Panel Administrador 🔐
        </h1>

        <div style={styles.grid}>
          <div style={styles.stat}>
            <h3>Total</h3>
            <p>{total}</p>
          </div>

          <div style={styles.stat}>
            <h3>Promedio</h3>
            <p>{average}</p>
          </div>

          <div style={styles.stat}>
            <h3>Cancelados</h3>
            <p>{cancelled}</p>
          </div>
        </div>

        <button
          onClick={() =>
            router.push('/dashboard')
          }
          style={styles.button}
        >
          Volver Dashboard
        </button>

        <div style={styles.tableWrap}>
          <table
            border="1"
            cellPadding="10"
            style={styles.table}
          >
            <thead>
              <tr>
                <th>Score</th>
                <th>Cancelado</th>
                <th>Incidentes</th>
                <th>Fecha</th>
              </tr>
            </thead>

            <tbody>
              {results.map((item) => (
                <tr key={item.id}>
                  <td>{item.score}</td>
                  <td>
                    {item.cancelled
                      ? 'Sí'
                      : 'No'}
                  </td>
                  <td>{item.incidents}</td>
                  <td>
                    {item.created_at}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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

  container: {
    maxWidth: 1100,
    margin: '0 auto',
    background: 'white',
    borderRadius: 20,
    padding: 30,
    boxShadow:
      '0 20px 60px rgba(0,0,0,0.25)'
  },

  title: {
    marginBottom: 25
  },

  grid: {
    display: 'grid',
    gridTemplateColumns:
      'repeat(auto-fit,minmax(180px,1fr))',
    gap: 15,
    marginBottom: 25
  },

  stat: {
    padding: 20,
    borderRadius: 16,
    background: '#f5f7fa',
    textAlign: 'center'
  },

  button: {
    padding: 12,
    border: 'none',
    borderRadius: 12,
    background: '#111827',
    color: 'white',
    marginBottom: 25,
    cursor: 'pointer'
  },

  tableWrap: {
    overflowX: 'auto'
  },

  table: {
    width: '100%',
    borderCollapse: 'collapse'
  },

  card: {
    background: 'white',
    padding: 30,
    borderRadius: 20
  }
}
