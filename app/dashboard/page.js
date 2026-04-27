'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function Dashboard() {
  const [email, setEmail] = useState('')
  const router = useRouter()

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

  const isAdmin =
    email === 'lideracademicoaifi@gmail.com'

  return (
    <main
      style={{
        minHeight: '100vh',
        background:
          'linear-gradient(135deg,#0A36FF,#111827)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 500,
          background: 'white',
          borderRadius: 20,
          padding: 35,
          boxShadow:
            '0 20px 60px rgba(0,0,0,0.25)'
        }}
      >
        <h1
          style={{
            marginBottom: 10,
            color: '#0A36FF',
            fontSize: 32
          }}
        >
          Dashboard AIFI
        </h1>

        <p style={{ color: '#555' }}>
          Bienvenido
        </p>

        <p
          style={{
            fontWeight: 'bold',
            marginBottom: 30
          }}
        >
          {email}
        </p>

        <button
          onClick={() => router.push('/examen')}
          style={{
            width: '100%',
            padding: 14,
            border: 'none',
            borderRadius: 12,
            background: '#0A36FF',
            color: 'white',
            fontSize: 16,
            cursor: 'pointer',
            marginBottom: 15
          }}
        >
          Ir al Examen
        </button>

        {isAdmin && (
          <button
            onClick={() => router.push('/admin')}
            style={{
              width: '100%',
              padding: 14,
              border: 'none',
              borderRadius: 12,
              background: '#111827',
              color: 'white',
              fontSize: 16,
              cursor: 'pointer',
              marginBottom: 15
            }}
          >
            Panel Admin
          </button>
        )}

        <button
          onClick={logout}
          style={{
            width: '100%',
            padding: 14,
            border: '1px solid #ddd',
            borderRadius: 12,
            background: '#f8f8f8',
            fontSize: 16,
            cursor: 'pointer'
          }}
        >
          Cerrar sesión
        </button>
      </div>
    </main>
  )
}
