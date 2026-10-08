import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'
import { votaciones } from '@/lib/db/schema'
import {
  getClientIp,
  getConteoVotaciones,
  opcionExiste,
  superaLimiteIp,
} from '@/lib/votaciones'

export const dynamic = 'force-dynamic'

export async function GET() {
  const conteo = await getConteoVotaciones()
  return Response.json(conteo, { headers: { 'Cache-Control': 'no-store' } })
}

export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'El cuerpo debe ser JSON válido.' }, { status: 400 })
  }

  const opcion =
    typeof body === 'object' && body !== null && 'opcion' in body
      ? String((body as { opcion: unknown }).opcion ?? '').trim()
      : ''

  if (!opcion || opcion.length > 64) {
    return Response.json({ error: 'El campo "opcion" es obligatorio.' }, { status: 400 })
  }
  if (!(await opcionExiste(opcion))) {
    return Response.json({ error: 'La opción indicada no existe.' }, { status: 404 })
  }

  const ipUsuario = getClientIp(request.headers)
  if (await superaLimiteIp(ipUsuario)) {
    return Response.json(
      { error: 'Has alcanzado el límite de votos desde esta conexión. Intenta más tarde.' },
      { status: 429 },
    )
  }

  const [voto] = await db
    .insert(votaciones)
    .values({ opcion, ipUsuario })
    .returning({ id: votaciones.id, opcion: votaciones.opcion, fecha: votaciones.fecha })

  revalidatePath('/')
  revalidatePath('/ranking')

  const conteo = await getConteoVotaciones()
  return Response.json({ voto, conteo }, { status: 201 })
}
