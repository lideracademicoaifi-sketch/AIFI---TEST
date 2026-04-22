'use client'

import { useState, useEffect } from 'react'

export default function Examen() {
  const [started, setStarted] = useState(false)
  const [time, setTime] = useState(60)
  const [score, setScore] = useState(0)

  useEffect(() => {
    let timer

    if (started && time > 0) {
      timer = setInterval(() => {
        setTime((prev) => prev - 1)
      }, 1000)
    }

    if (time === 0 && started) {
      alert('Se acabó el examen. Score: ' + score)
      setStarted(false)
    }

    return () => clearInterval(timer)
  }, [started, time, score])

  const answer = (option) => {
    if (option === 'Bogotá') {
      setScore(score + 10)
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Examen 🧠</h1>

      <p>Tiempo: {time}</p>
      <p>Puntos: {score}</p>

      {!started && (
        <button onClick={() => setStarted(true)}>
          Iniciar examen
        </button>
      )}

      {started && (
        <div>
          <h3>¿Capital de Colombia?</h3>

          <button onClick={() => answer('Bogotá')}>Bogotá</button>
          <button onClick={() => answer('Medellín')}>Medellín</button>
          <button onClick={() => answer('Cali')}>Cali</button>
        </div>
      )}
    </div>
  )
}
