import Link from 'next/link'

export default function Login() {
  return (
    <main style={{
      minHeight:'100vh',
      display:'flex',
      justifyContent:'center',
      alignItems:'center'
    }}>
      <div style={{
        width:'320px',
        padding:'30px',
        border:'1px solid #ddd',
        borderRadius:'15px'
      }}>
        <h1>AIFI LOGIN</h1>

        <input placeholder="Email" style={{
          width:'100%',
          padding:'10px',
          marginTop:'15px'
        }} />

        <input placeholder="Password" type="password" style={{
          width:'100%',
          padding:'10px',
          marginTop:'15px'
        }} />

        <Link href="/dashboard" style={{
          display:'block',
          marginTop:'20px',
          background:'#FF1A1A',
          color:'white',
          textAlign:'center',
          padding:'12px',
          borderRadius:'10px',
          textDecoration:'none'
        }}>
          Entrar
        </Link>
      </div>
    </main>
  )
}
