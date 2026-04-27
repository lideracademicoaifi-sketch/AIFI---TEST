'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useRouter } from 'next/navigation'

export default function Dashboard() {
  const [email, setEmail] = useState('')
  const router = useRouter()

  const levels = [
    { id: 'A1', name: 'A1 - STARTERS' },
    { id: 'A2', name: 'A2 - EXPLORERS' },
    { id: 'B1', name: 'B1 - BUILDERS' },
    { id: 'B2', name: 'B2 - MASTERS' },
    { id: 'C1', name: 'C1 - EXPERTS' }
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
          🎓 Dashboard AIFI
        </h1>

        <p style={styles.subtitle}>
          Bienvenido
        </p>

        <p style={styles.email}>
          {email}
        </p>

        <h2 style={styles.sectionTitle}>
          📚 Selecciona tu nivel
        </h2>

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

        <div style={{ marginTop: 25 }}>
          <button
            onClick={logout}
            style={styles.logout}
          >
            Cerrar sesión
          </button>
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
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },

  card: {
    width: '100%',
    maxWidth: 650,
    background: 'white',
    borderRadius: 20,
    padding: 35,
    boxShadow: '0 20px 60px rgba(0,0,0,0.25)'
  },

  title: {
    fontSize: 32,
    color: '#0A36FF',
    marginBottom: 5
  },

  subtitle: {
    color: '#666'
  },

  email: {
    fontWeight: 'bold',
    marginBottom: 25
  },

  sectionTitle: {
    marginTop: 10,
    marginBottom: 15
  },

  grid: {
    display: 'grid',
    gridTemplateColumns:
      'repeat(auto-fit, minmax(200px, 1fr))',
    gap: 15
  },

  levelCard: {
    padding: 18,
    borderRadius: 14,
    border: 'none',
    background: '#0A36FF',
    color: 'white',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: '0.2s'
  },

  logout: {
    width: '100%',
    padding: 14,
    borderRadius: 12,
    border: '1px solid #ddd',
    background: '#f5f5f5',
    cursor: 'pointer'
  }
}
