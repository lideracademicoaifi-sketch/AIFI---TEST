'use client'

import { useEffect, useState } from 'react'

const questions = [
  {
    question: '¿Capital de Colombia?',
    options: ['Bogotá', 'Cali', 'Medellín', 'Cartagena'],
    answer: 'Bogotá'
  },
  {
    question: '2 + 2 = ?',
    options: ['3', '4', '5', '6'],
    answer: '4'
  },
  {
    question: 'Color del cielo normalmente',
    options: ['Rojo', 'Azul', 'Verde', 'Negro'],
    answer: 'Azul'
  },
  {
    question: '¿Cuál es un mamífero?',
    options: ['Tiburón', 'Perro', 'Lagarto', 'Águila'],
    answer: 'Perro'
  },
  {
    question: '¿Idioma oficial de Brasil?',
    options: ['Español', 'Portugués', 'Francés', 'Italiano'],
    answer: 'Portugués'
  }
]

export default function Examen() {
  const [started, setStarted] = useState(false)
  const [time, setTime] = useState(300)
  const [current, setCurrent] = useState(0)
  const [score, setScore] = useState(0)
  const [finished, setFinished] = useState(false)

  useEffect(() => {
    let timer

    if (started && !finished && time > 0) {
      timer = setInterval(() => {
        setTime((prev) => prev - 1)
      }, 1000)
    }

    if (time === 0) {
      setFinished(true)
    }

    return () => clearInterval(timer)
  }, [started, time, finished])

  const answerQuestion = (option) => {
    if (option === questions[current].answer) {
      setScore((prev) => prev + 20)
    }

    const next = current + 1

    if (next < questions.length) {
      setCurrent(next)
    } else {
      setFinished(true)
    }
  }

  if (!started) {
    return (
      <div style={{ padding: 30 }}>
        <h1>Examen 🧠</h1>
        <p>Duración: 5 minutos</p>
        <button onClick={() => setStarted(true)}>Iniciar examen</button>
      </div>
    )
  }

  if (finished) {
    return (
      <div style={{ padding: 30 }}>
        <h1>Resultado Final</h1>
        <p>Puntaje: {score}/100</p>
      </div>
    )
  }

  return (
    <div style={{ padding: 30 }}>
      <h1>Examen en curso</h1>
      <p>Tiempo restante: {time}s</p>
      <p>Pregunta {current + 1} de {questions.length}</p>

      <h2>{questions[current].question}</h2>

      {questions[current].options.map((option) => (
        <div key={option} style={{ marginBottom: 10 }}>
          <button onClick={() => answerQuestion(option)}>
            {option}
          </button>
        </div>
      ))}
    </div>
  )
}
