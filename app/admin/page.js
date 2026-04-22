'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Admin() {
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadResults()
  }, [])

  async function loadResults() {
    const { data, error } = await supabase
      .from('exam_results')
      .select('*')

    if (error) {
      alert(error.message)
      setLoading(false)
      return
    }

    setResults(data || [])
    setLoading(false)
  }

  return (
    <div style={{ padding: 30 }}>
      <h1>Panel Administrador</h1>

      {loading && <p>Cargando...</p>}

      {!loading && (
        <>
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
        </>
      )}
    </div>
  )
}
