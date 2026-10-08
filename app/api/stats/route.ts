import { getVotingStats } from '@/lib/ranking'

export const dynamic = 'force-dynamic'

export async function GET() {
  const stats = await getVotingStats()
  return Response.json(stats)
}
