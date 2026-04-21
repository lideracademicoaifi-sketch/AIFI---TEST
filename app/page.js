import Link from 'next/link'

export default function Home() {
  return (
    <main style={{
      minHeight:'100vh',
      display:'flex',
      flexDirection:'column',
      justifyContent:'center',
      alignItems:'center'
    }}>
      <h1 style={{color:'#0A36FF'}}>AIFI CONNECT</h1>
      <p>Language Learning & Testing Platform</p>

      <Link href="/login" style={{
        marginTop:'20px',
        background:'#FF1A1A',
        color:'white',
        padding:'12px 24px',
        borderRadius:'10px',
        textDecoration:'none'
      }}>
        Ingresar
      </Link>
    </main>
  )
}
