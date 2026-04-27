'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useRouter } from 'next/navigation'

export default function Dashboard() {
  const [email, setEmail] = useState('')
  const router = useRouter()

  const levels = [
    { id: 'A1', name: 'Nivel A1 - Básico' },
    { id: 'A2', name: 'Nivel A2 - Elemental' },
    { id: 'B1', name: 'Nivel B1 - Intermedio' },
    { id: 'B2', name: 'Nivel B2 - Intermedio Alto' },
    { id: 'C1', name: 'Nivel C1 - Avanzado' }
  ]

  useEffect(() => {
    checkUser()
  }, [])

  async function checkUser() {
    const {
      data: { user }
    } = await supabase.auth.getUser()

    if (!user) {
      router.push('/login')
      return
    }

    setEmail(user.email)
  }

  async function logout() {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <main style={styles.page}>
      <div style={styles.card}>

        <h1 style={styles.title}>
          🏫 Plataforma de Exámenes AIFI
        </h1>

        <p style={styles.subtitle}>
          Bienvenido estudiante
        </p>

        <p style={styles.email}>
          {email}
        </p>

        <h2 style={styles.sectionTitle}>
          📚 Selecciona el nivel de evaluación
        </h2>

        <p style={styles.note}>
          Cada nivel contiene exámenes oficiales disponibles.
        </p>

        <div style={styles.grid}>
          {levels.map((level) => (
            <button
              key={level.id}
              onClick={() =>
                router.push(`/level/${level.id}`)
              }
              style={styles.levelCard}
            >
              {level.name}
            </button>
          ))}
        </div>

        <button onClick={logout} style={styles.logout}>
          Cerrar sesión
        </button>

      </div>
    </main>
  )
}

const styles = {
  page: {
    minHeight: '100vh',
    background:
      'linear-gradient(135deg,#0A36FF,#111827)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },

  card: {
    width: '100%',
    maxWidth: 700,
    background: 'white',
    borderRadius: 20,
    padding: 35
  },

  title: {
    fontSize: 28,
    color: '#0A36FF',
    marginBottom: 5
  },

  subtitle: {
    color: '#555'
  },

  email: {
    fontWeight: 'bold',
    marginBottom: 25
  },

  sectionTitle: {
    marginTop: 10,
    marginBottom: 5
  },

  note: {
    fontSize: 13,
    color: '#777',
    marginBottom: 20
  },

  grid: {
    display: 'grid',
    gridTemplateColumns:
      'repeat(auto-fit, minmax(220px, 1fr))',
    gap: 15
  },

  levelCard: {
    padding: 18,
    borderRadius: 12,
    border: '1px solid #ddd',
    background: '#f9f9f9',
    cursor: 'pointer',
    fontWeight: 'bold'
  },

  logout: {
    marginTop: 25,
    width: '100%',
    padding: 14,
    borderRadius: 12,
    border: '1px solid #ddd',
    background: '#eee',
    cursor: 'pointer'
  }
}
