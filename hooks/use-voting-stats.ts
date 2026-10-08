'use client'

import useSWR from 'swr'
import type { VotingStats } from '@/lib/ranking'

const fetcher = (url: string) => fetch(url).then((res) => res.json() as Promise<VotingStats>)

export function useVotingStats(fallbackData?: VotingStats) {
  return useSWR<VotingStats>('/api/stats', fetcher, {
    fallbackData,
    refreshInterval: 5000,
    revalidateOnFocus: true,
  })
}
