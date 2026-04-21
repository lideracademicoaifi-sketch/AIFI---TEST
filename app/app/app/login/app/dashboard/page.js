export default function Dashboard() {
  return (
    <main style={{
      minHeight:'100vh',
      padding:'40px',
      fontFamily:'Arial',
      background:'#f5f7fa'
    }}>

      <h1 style={{color:'#0A36FF'}}>
        Dashboard AIFI CONNECT
      </h1>

      <p>Bienvenido Administrador</p>

      <div style={{
        display:'grid',
        gridTemplateColumns:'repeat(3,1fr)',
        gap:'20px',
        marginTop:'30px'
      }}>

        <div style={{
          background:'white',
          padding:'20px',
          borderRadius:'15px'
        }}>
          <h3>Estudiantes</h3>
          <p>1,024</p>
        </div>

        <div style={{
          background:'white',
          padding:'20px',
          borderRadius:'15px'
        }}>
          <h3>Exámenes</h3>
          <p>18</p>
        </div>

        <div style={{
          background:'white',
          padding:'20px',
          borderRadius:'15px'
        }}>
          <h3>Resultados</h3>
          <p>96%</p>
        </div>

      </div>

    </main>
  )
}
