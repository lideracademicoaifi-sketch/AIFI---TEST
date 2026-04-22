'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Admin() {
  const [results, setResults] = useState([])

  useEffect(() => {
    loadResults()
  }, [])

  async function loadResults() {
    const { data } = await supabase
      .from('exam_results')
      .select('*')
      .order('created_at', { ascending: false })

    setResults(data || [])
  }

  return (
    <div style={{ padding: 30 }}>
      <h1>Panel Administrador</h1>

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
