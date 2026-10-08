import { and, count, desc, eq, gte } from 'drizzle-orm'
import { db } from '@/lib/db'
import { creators, votaciones } from '@/lib/db/schema'

export const MAX_VOTOS_POR_IP_POR_HORA = 10

export type ConteoVotaciones = {
  total: number
  porOpcion: { opcion: string; votos: number }[]
}

export function getClientIp(headerList: Headers): string {
  const forwarded = headerList.get('x-forwarded-for')
  const ip =
    forwarded?.split(',')[0]?.trim() ||
    headerList.get('x-real-ip')?.trim() ||
    headerList.get('x-vercel-forwarded-for')?.trim()
  return ip ? ip.slice(0, 64) : 'desconocida'
}

export async function opcionExiste(opcion: string): Promise<boolean> {
  const [row] = await db
    .select({ id: creators.id })
    .from(creators)
    .where(eq(creators.handle, opcion))
    .limit(1)
  return Boolean(row)
}

export async function superaLimiteIp(ipUsuario: string): Promise<boolean> {
  const haceUnaHora = new Date(Date.now() - 60 * 60 * 1000)
  const [row] = await db
    .select({ total: count() })
    .from(votaciones)
    .where(and(eq(votaciones.ipUsuario, ipUsuario), gte(votaciones.fecha, haceUnaHora)))
  return (row?.total ?? 0) >= MAX_VOTOS_POR_IP_POR_HORA
}

export async function getConteoVotaciones(): Promise<ConteoVotaciones> {
  const porOpcion = await db
    .select({ opcion: votaciones.opcion, votos: count(votaciones.id) })
    .from(votaciones)
    .groupBy(votaciones.opcion)
    .orderBy(desc(count(votaciones.id)))

  const total = porOpcion.reduce((sum, row) => sum + row.votos, 0)
  return { total, porOpcion }
}
