'use server'

import { eq, sql } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'
import { db } from '@/lib/db'
import { creators, votaciones, votes } from '@/lib/db/schema'
import { getClientIp, superaLimiteIp } from '@/lib/votaciones'

export type VoteInput = {
  fullName: string
  email: string
  creatorId: number
  wantsToAttend: boolean
  acceptedRules: boolean
}

export type VoteResult =
  | { ok: true; creatorName: string }
  | { ok: false; error: string; field?: keyof VoteInput }

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export async function submitVote(input: VoteInput): Promise<VoteResult> {
  const fullName = String(input.fullName ?? '').trim().replace(/\s+/g, ' ')
  const email = String(input.email ?? '').trim().toLowerCase()
  const creatorId = Number(input.creatorId)

  if (fullName.length < 3 || fullName.length > 80 || !fullName.includes(' ')) {
    return { ok: false, field: 'fullName', error: 'Ingresa tu nombre y apellido.' }
  }
  if (!EMAIL_PATTERN.test(email) || email.length > 120) {
    return { ok: false, field: 'email', error: 'Ingresa un correo electrónico válido.' }
  }
  if (!Number.isInteger(creatorId) || creatorId <= 0) {
    return { ok: false, field: 'creatorId', error: 'Selecciona un creador para emitir tu voto.' }
  }
  if (input.acceptedRules !== true) {
    return {
      ok: false,
      field: 'acceptedRules',
      error: 'Debes aceptar que solo se permite 1 voto por persona.',
    }
  }

  const [creator] = await db
    .select({ id: creators.id, name: creators.name, handle: creators.handle })
    .from(creators)
    .where(eq(creators.id, creatorId))
    .limit(1)

  if (!creator) {
    return { ok: false, field: 'creatorId', error: 'El creador seleccionado no existe.' }
  }

  const [existing] = await db
    .select({ id: votes.id })
    .from(votes)
    .where(sql`lower(${votes.email}) = ${email}`)
    .limit(1)

  if (existing) {
    return { ok: false, field: 'email', error: 'Este correo ya registró un voto.' }
  }

  const ipUsuario = getClientIp(await headers())
  if (await superaLimiteIp(ipUsuario)) {
    return {
      ok: false,
      error: 'Has alcanzado el límite de votos desde esta conexión. Intenta más tarde.',
    }
  }

  try {
    await db.transaction(async (tx) => {
      await tx.insert(votes).values({
        fullName,
        email,
        creatorId: creator.id,
        wantsToAttend: Boolean(input.wantsToAttend),
      })
      await tx.insert(votaciones).values({ opcion: creator.handle, ipUsuario })
    })
  } catch (error) {
    if ((error as { code?: string }).code === '23505') {
      return { ok: false, field: 'email', error: 'Este correo ya registró un voto.' }
    }
    throw error
  }

  revalidatePath('/')
  revalidatePath('/ranking')
  return { ok: true, creatorName: creator.name }
}
