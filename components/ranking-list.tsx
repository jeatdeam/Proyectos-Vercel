'use client'

import Image from 'next/image'
import { useVotingStats } from '@/hooks/use-voting-stats'
import type { VotingStats } from '@/lib/ranking'
import { cn } from '@/lib/utils'

export function RankingList({ initialStats }: { initialStats: VotingStats }) {
  const { data } = useVotingStats(initialStats)
  const ranking = data?.ranking ?? []
  const total = data?.totalVotes || 1

  return (
    <ol className="mt-8 flex flex-col gap-3">
      {ranking.map((creator, index) => {
        const percent = Math.round((creator.votes / total) * 1000) / 10
        return (
          <li
            key={creator.id}
            className={cn(
              'flex items-center gap-4 rounded-2xl border bg-card p-4 shadow-sm',
              index === 0 ? 'border-primary/40' : 'border-border',
            )}
          >
            <span
              className={cn(
                'flex size-9 shrink-0 items-center justify-center rounded-full text-sm font-bold tabular-nums',
                index < 3 ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground',
              )}
            >
              {index + 1}
            </span>
            <Image
              src={creator.avatarUrl || '/placeholder.svg'}
              alt={creator.name}
              width={48}
              height={48}
              className="size-12 shrink-0 rounded-full object-cover"
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-baseline justify-between gap-2">
                <p className="truncate font-semibold">{creator.name}</p>
                <p className="shrink-0 text-sm font-semibold tabular-nums text-primary">
                  {creator.votes.toLocaleString('es-ES')} votos
                </p>
              </div>
              <p className="text-xs text-muted-foreground">{creator.handle}</p>
              <div
                className="mt-2 h-2 overflow-hidden rounded-full bg-muted"
                role="progressbar"
                aria-valuenow={percent}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`${percent}% de los votos`}
              >
                <div
                  className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
          </li>
        )
      })}
    </ol>
  )
}
