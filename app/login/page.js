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
    if (!email || !password) {
      alert('Completa correo y contraseña')
      return
    }

    setLoading(true)

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      alert(error.message)
      setLoading(false)
      return
    }

    const userId = data.user.id

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single()

    if (profileError || !profile) {
      alert('Perfil no encontrado')
      setLoading(false)
      return
    }

    if (profile.role === 'admin') {
      router.push('/admin')
    } else {
      router.push('/dashboard')
    }

    router.refresh()
    setLoading(false)
  }

  async function signUp() {
    if (!email || !password) {
      alert('Completa correo y contraseña')
      return
    }

    if (password.length < 6) {
      alert('La contraseña debe tener mínimo 6 caracteres')
      return
    }

    setLoading(true)

    const { data, error } = await supabase.auth.signUp({
      email,
      password
    })

    if (error) {
      alert(error.message)
      setLoading(false)
      return
    }

    const user = data.user

    if (user) {
      await supabase.from('profiles').insert([
        {
          id: user.id,
          email: user.email,
          role: 'student'
        }
      ])
    }

    alert('Cuenta creada correctamente. Ahora inicia sesión.')
    setLoading(false)
  }

  return (
    <main
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg,#0A36FF,#111827)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 420,
          background: 'white',
          borderRadius: 22,
          padding: 35,
          boxShadow: '0 20px 60px rgba(0,0,0,0.25)'
        }}
      >
        <h1
          style={{
            color: '#0A36FF',
            fontSize: 34,
            marginBottom: 10
          }}
        >
          AIFI LOGIN
        </h1>

        <p style={{ color: '#666', marginBottom: 25 }}>
          Plataforma Inteligente de Exámenes
        </p>

        <input
          placeholder="Correo electrónico"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            width: '100%',
            padding: 14,
            marginBottom: 15,
            borderRadius: 12,
            border: '1px solid #ddd',
            fontSize: 15
          }}
        />

        <input
          placeholder="Contraseña"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            width: '100%',
            padding: 14,
            marginBottom: 20,
            borderRadius: 12,
            border: '1px solid #ddd',
            fontSize: 15
          }}
        />

        <button
          onClick={signIn}
          disabled={loading}
          style={{
            width: '100%',
            padding: 14,
            border: 'none',
            borderRadius: 12,
            background: '#0A36FF',
            color: 'white',
            fontSize: 16,
            cursor: 'pointer',
            marginBottom: 12
          }}
        >
          {loading ? 'Entrando...' : 'Entrar'}
        </button>

        <button
          onClick={signUp}
          disabled={loading}
          style={{
            width: '100%',
            padding: 14,
            border: 'none',
            borderRadius: 12,
            background: '#111827',
            color: 'white',
            fontSize: 16,
            cursor: 'pointer'
          }}
        >
          Crear Cuenta
        </button>
      </div>
    </main>
  )
}
