import Link from 'next/link'
export default function Home(){
 return <main className='center'>
  <h1>AIFI CONNECT</h1>
  <p>Language Learning & Testing Platform</p>
  <Link href='/login' className='btn'>Ingresar</Link>
 </main>
}
