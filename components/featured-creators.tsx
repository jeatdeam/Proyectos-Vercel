'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ExternalLink } from 'lucide-react'
import { useVotingStats } from '@/hooks/use-voting-stats'
import type { VotingStats } from '@/lib/ranking'

export function FeaturedCreators({ initialStats }: { initialStats: VotingStats }) {
  const { data } = useVotingStats(initialStats)
  const ranking = data?.ranking ?? []
  const top = ranking.slice(0, 3)

  return (
    <section aria-labelledby="featured-title" className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <h2 id="featured-title" className="text-sm font-semibold uppercase tracking-wide">
          Creadores destacados en el ranking:
        </h2>
        <Link
          href="/ranking"
          className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
        >
          Ver todos ({ranking.length})
          <ExternalLink className="size-3.5" aria-hidden="true" />
        </Link>
      </div>
      <ol className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {top.map((creator, index) => (
          <li
            key={creator.id}
            className="flex flex-col items-center gap-2 rounded-2xl border border-border bg-card p-4 text-center shadow-sm"
          >
            <div className="relative">
              <Image
                src={creator.avatarUrl || '/placeholder.svg'}
                alt={creator.name}
                width={56}
                height={56}
                className="size-14 rounded-full object-cover ring-2 ring-secondary"
              />
              <span className="absolute -bottom-1 -right-1 flex size-6 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground ring-2 ring-card">
                #{index + 1}
              </span>
            </div>
            <p className="text-sm font-semibold leading-tight">{creator.name}</p>
            <p className="text-xs font-medium tabular-nums text-primary">
              {creator.votes.toLocaleString('es-ES')} votos
            </p>
          </li>
        ))}
      </ol>
    </section>
  )
}
