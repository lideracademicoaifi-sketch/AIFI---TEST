import Link from 'next/link'
export default function Login(){
 return <main className='center'>
 <h1>Login</h1>
 <input placeholder='Email' className='input'/>
 <input placeholder='Password' type='password' className='input'/>
 <Link href='/dashboard' className='btn'>Entrar</Link>
 </main>
}
