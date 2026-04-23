'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useRouter } from 'next/navigation'

export default function Admin() {
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [results, setResults] = useState([])

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

    if (user.email !== 'lideracademicoaifi@gmail.com') {
      router.push('/dashboard')
      return
    }

    loadResults()
  }

  async function loadResults() {
    const { data } = await supabase
      .from('exam_results')
      .select('*')
      .order('created_at', { ascending: false })

    setResults(data || [])
    setLoading(false)
  }

  if (loading) {
    return (
      <div style={{ padding: 30 }}>
        <h1>Verificando acceso...</h1>
      </div>
    )
  }

  return (
    <div style={{ padding: 30 }}>
      <h1>Panel Administrador 🔐</h1>

      <button
        onClick={() => router.push('/dashboard')}
        style={{
          marginBottom: 20,
          padding: '10px 20px'
        }}
      >
        Volver Dashboard
      </button>

      <p>Total resultados: {results.length}</p>

      <table border="1" cellPadding="10">
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
              <td>{item.cancelled ? 'Sí' : 'No'}</td>
              <td>{item.incidents}</td>
              <td>{item.created_at}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
