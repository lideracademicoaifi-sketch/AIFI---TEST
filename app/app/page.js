import Link from 'next/link'

export default function Home() {
  return (
    <main style={{
      minHeight:'100vh',
      display:'flex',
      flexDirection:'column',
      justifyContent:'center',
      alignItems:'center',
      fontFamily:'Arial'
    }}>
      <h1 style={{color:'#0A36FF'}}>AIFI CONNECT</h1>

      <p>Language Learning & Testing Platform</p>

      <Link href="/login" style={{
        background:'#FF1A1A',
        color:'white',
        padding:'12px 24px',
        borderRadius:'10px',
        textDecoration:'none',
        marginTop:'20px'
      }}>
        Ingresar
      </Link>
    </main>
  )
}
