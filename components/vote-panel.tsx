import Image from 'next/image'
import { VoteForm } from '@/components/vote-form'
import type { VotingStats } from '@/lib/ranking'

export function VotePanel({ initialStats }: { initialStats: VotingStats }) {
  return (
    <div className="mx-auto flex w-full max-w-md flex-col">
      <div className="flex items-end justify-between px-2">
        <div className="pb-6">
          <p className="text-3xl font-bold leading-tight text-primary">
            <span className="text-muted-foreground/50">¿Quieres</span>
            <br />
            votar?
          </p>
          <span className="mt-1 inline-block rounded-full bg-primary px-3 py-1 text-sm font-semibold text-primary-foreground">
            por tu favorito
          </span>
        </div>
        <Image
          src="/mascot.png"
          alt=""
          width={180}
          height={180}
          priority
          className="mb-4 size-36 rounded-full object-cover shadow-lg shadow-primary/15 ring-4 ring-card sm:size-40"
        />
      </div>
      <VoteForm initialStats={initialStats} />
    </div>
  )
}
