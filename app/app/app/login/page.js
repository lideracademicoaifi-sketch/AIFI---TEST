import Link from 'next/link'

export default function Login() {
  return (
    <main style={{
      minHeight:'100vh',
      display:'flex',
      justifyContent:'center',
      alignItems:'center',
      fontFamily:'Arial'
    }}>

      <div style={{
        width:'350px',
        padding:'30px',
        border:'1px solid #ddd',
        borderRadius:'15px',
        boxShadow:'0 5px 15px rgba(0,0,0,0.08)'
      }}>

        <h1 style={{color:'#0A36FF'}}>AIFI LOGIN</h1>

        <input placeholder="Email"
        style={{
          width:'100%',
          padding:'10px',
          marginTop:'15px'
        }} />

        <input placeholder="Password"
        type="password"
        style={{
          width:'100%',
          padding:'10px',
          marginTop:'15px'
        }} />

        <Link href="/dashboard"
        style={{
          display:'block',
          textAlign:'center',
          background:'#FF1A1A',
          color:'white',
          padding:'12px',
          borderRadius:'10px',
          marginTop:'20px',
          textDecoration:'none'
        }}>
          Entrar
        </Link>

      </div>

    </main>
  )
}
