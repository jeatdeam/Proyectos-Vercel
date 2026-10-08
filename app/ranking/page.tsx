import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { RankingList } from '@/components/ranking-list'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'
import { getVotingStats } from '@/lib/ranking'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Ranking en vivo | INKLOP Awards 2026',
  description: 'Consulta el ranking en tiempo real de los creadores nominados a los INKLOP Awards 2026.',
}

export default async function RankingPage() {
  const stats = await getVotingStats()

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader initialStats={stats} />
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-12">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Volver a votar
        </Link>
        <h1 className="mt-4 text-4xl font-bold tracking-tight">
          Ranking <span className="text-primary">en vivo</span>
        </h1>
        <p className="mt-2 text-muted-foreground">
          Los resultados se actualizan automáticamente cada pocos segundos.
        </p>
        <RankingList initialStats={stats} />
      </main>
      <SiteFooter />
    </div>
  )
}
