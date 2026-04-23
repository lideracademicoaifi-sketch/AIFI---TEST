import dynamic from 'next/dynamic'

const ExamenClient = dynamic(() => import('./ExamenClient'), {
  ssr: false
})

export default function Page() {
  return <ExamenClient />
}
