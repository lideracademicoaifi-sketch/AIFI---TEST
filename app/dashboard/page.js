'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
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
        padding: '40px',
        minHeight: '100vh',
        background: '#f5f7fa'
      }}
    >
      <h1 style={{ color: '#0A36FF' }}>
        Dashboard AIFI
      </h1>

      <p>Bienvenido:</p>
      <p>{email}</p>

      <br />

      <button
        onClick={() => router.push('/examen')}
        style={{ padding: '10px 20px' }}
      >
        Ir al Examen
      </button>

      <br /><br />

      {isAdmin && (
        <>
          <button
            onClick={() => router.push('/admin')}
            style={{
              padding: '10px 20px',
              background: '#111',
              color: 'white'
            }}
          >
            Panel Admin
          </button>

          <br /><br />
        </>
      )}

      <button
        onClick={logout}
        style={{ padding: '10px 20px' }}
      >
        Cerrar sesión
      </button>
    </main>
  )
}
