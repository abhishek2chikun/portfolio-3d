'use client'
import dynamic from 'next/dynamic'

const AIPortfolio = dynamic(
  () => import('../components/AIPortfolio'),
  {
    ssr: false,
    loading: () => (
      <div className="h-screen w-full flex items-center justify-center bg-black">
        <div className="text-white text-2xl">Loading 3D Portfolio...</div>
      </div>
    )
  }
)

export default function Home() {
  return <AIPortfolio />
}
