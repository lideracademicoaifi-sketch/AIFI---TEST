'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../lib/supabase'

export default function Login() {
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function signIn() {
    setLoading(true)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      alert(error.message)
      setLoading(false)
      return
    }

    router.push('/dashboard')
    router.refresh()
  }

  async function signUp() {
    setLoading(true)

    const { error } = await supabase.auth.signUp({
      email,
      password
    })

    if (error) {
      alert(error.message)
      setLoading(false)
      return
    }

    alert('Cuenta creada. Ahora inicia sesión.')
    setLoading(false)
  }

  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <div
        style={{
          width: '320px',
          padding: '30px',
          border: '1px solid #ddd',
          borderRadius: '15px'
        }}
      >
        <h1>AIFI LOGIN</h1>

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            width: '100%',
            padding: '10px',
            marginTop: '15px'
          }}
        />

        <input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            width: '100%',
            padding: '10px',
            marginTop: '15px'
          }}
        />

        <button
          onClick={signIn}
          disabled={loading}
          style={{
            width: '100%',
            marginTop: '20px',
            background: '#FF1A1A',
            color: 'white',
            padding: '12px',
            borderRadius: '10px',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          {loading ? 'Cargando...' : 'Entrar'}
        </button>

        <button
          onClick={signUp}
          disabled={loading}
          style={{
            width: '100%',
            marginTop: '12px',
            background: '#0A36FF',
            color: 'white',
            padding: '12px',
            borderRadius: '10px',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          Crear Cuenta
        </button>
      </div>
    </main>
  )
}
