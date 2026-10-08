import { count, desc, eq, asc } from 'drizzle-orm'
import { db } from '@/lib/db'
import { creators, votaciones } from '@/lib/db/schema'

export type RankedCreator = {
  id: number
  name: string
  handle: string
  avatarUrl: string
  votes: number
}

export type VotingStats = {
  totalVotes: number
  ranking: RankedCreator[]
}

export async function getVotingStats(): Promise<VotingStats> {
  const rows = await db
    .select({
      id: creators.id,
      name: creators.name,
      handle: creators.handle,
      avatarUrl: creators.avatarUrl,
      votes: count(votaciones.id),
    })
    .from(creators)
    .leftJoin(votaciones, eq(votaciones.opcion, creators.handle))
    .groupBy(
      creators.id,
      creators.name,
      creators.handle,
      creators.avatarUrl
    )
    .orderBy(desc(count(votaciones.id)), asc(creators.name))

  const totalVotes = rows.reduce((sum, row) => sum + Number(row.votes), 0)
  return { totalVotes, ranking: rows }
}