'use client'

import Link from 'next/link'
import { RefreshCw, Trophy } from 'lucide-react'
import { InklopLogo } from '@/components/inklop-logo'
import { useVotingStats } from '@/hooks/use-voting-stats'
import type { VotingStats } from '@/lib/ranking'

export function SiteHeader({ initialStats }: { initialStats: VotingStats }) {
  const { data, mutate, isValidating } = useVotingStats(initialStats)
  const total = data?.totalVotes ?? 0

  return (
    <header className="sticky top-0 z-30 border-b border-border/70 bg-card/85 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4">
        <div className="flex items-center gap-4">
          <Link href="/" aria-label="Inicio INKLOP Awards">
            <InklopLogo className="text-2xl" />
          </Link>
          <span className="hidden rounded-full bg-secondary px-3 py-1 text-xs font-semibold tracking-wide text-secondary-foreground sm:inline">
            PREMIOS 2026
          </span>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <span className="hidden items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs text-muted-foreground md:inline-flex">
            <span className="size-2 rounded-full bg-emerald-500" aria-hidden="true" />
            <span>
              <span className="font-semibold tabular-nums text-foreground">
                {total.toLocaleString('es-ES')}
              </span>{' '}
              votos registrados
            </span>
          </span>
          <Link
            href="/ranking"
            className="inline-flex items-center gap-1.5 rounded-full border border-secondary-foreground/25 bg-card px-4 py-1.5 text-sm font-semibold text-secondary-foreground transition-colors hover:bg-secondary"
          >
            <Trophy className="size-4 text-amber-500" aria-hidden="true" />
            Ver Ranking
          </Link>
          <button
            type="button"
            onClick={() => mutate()}
            className="rounded-full p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            aria-label="Actualizar conteo de votos"
          >
            <RefreshCw className={`size-4 ${isValidating ? 'animate-spin' : ''}`} aria-hidden="true" />
          </button>
        </div>
      </div>
    </header>
  )
}
