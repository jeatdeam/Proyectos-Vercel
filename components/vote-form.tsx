'use client'

import { useState, useTransition } from 'react'
import Image from 'next/image'
import { ChevronDown, CircleAlert, PartyPopper, Star } from 'lucide-react'
import { submitVote, type VoteInput } from '@/app/actions/vote'
import { InklopLogo } from '@/components/inklop-logo'
import { useVotingStats } from '@/hooks/use-voting-stats'
import type { VotingStats } from '@/lib/ranking'
import { cn } from '@/lib/utils'

type Field = 'fullName' | 'email' | 'creatorId' | 'acceptedRules'
type Errors = Partial<Record<Field, string>>

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

function validate(values: VoteInput): Errors {
  const errors: Errors = {}
  const name = values.fullName.trim()
  if (!name) errors.fullName = 'Por favor ingresa tu nombre y apellido.'
  else if (!name.includes(' ')) errors.fullName = 'Incluye tu nombre y apellido.'
  if (!values.email.trim()) errors.email = 'Por favor ingresa tu correo electrónico.'
  else if (!EMAIL_PATTERN.test(values.email.trim())) errors.email = 'Ingresa un correo electrónico válido.'
  if (!values.creatorId) errors.creatorId = 'Selecciona un creador para emitir tu voto.'
  if (!values.acceptedRules)
    errors.acceptedRules = 'Debes aceptar que solo se permite 1 voto por persona.'
  return errors
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null
  return (
    <p id={id} className="mt-1.5 flex items-start gap-1.5 text-xs text-destructive">
      <CircleAlert className="mt-px size-3.5 shrink-0" aria-hidden="true" />
      {message}
    </p>
  )
}

const inputClass =
  'h-12 w-full rounded-xl border bg-card px-4 text-sm outline-none transition-colors placeholder:text-muted-foreground/70 focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-primary/20'

export function VoteForm({ initialStats }: { initialStats: VotingStats }) {
  const { data, mutate } = useVotingStats(initialStats)
  const creators = [...(data?.ranking ?? [])].sort((a, b) => a.name.localeCompare(b.name))

  const [values, setValues] = useState<VoteInput>({
    fullName: '',
    email: '',
    creatorId: 0,
    wantsToAttend: true,
    acceptedRules: false,
  })
  const [errors, setErrors] = useState<Errors>({})
  const [submitted, setSubmitted] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function update<K extends keyof VoteInput>(key: K, value: VoteInput[K]) {
    const next = { ...values, [key]: value }
    setValues(next)
    if (submitted) setErrors(validate(next))
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmitted(true)
    setFormError(null)
    const nextErrors = validate(values)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return

    startTransition(async () => {
      try {
        const result = await submitVote(values)
        if (result.ok) {
          setSuccess(result.creatorName)
          mutate()
        } else if (result.field && result.field !== 'wantsToAttend') {
          setErrors({ [result.field]: result.error })
        } else {
          setFormError(result.error)
        }
      } catch {
        setFormError('No pudimos registrar tu voto. Inténtalo de nuevo.')
      }
    })
  }

  const selected = creators.find((c) => c.id === values.creatorId)

  return (
    <div className="flex w-full flex-col items-center gap-5">
      <div className="relative w-full rounded-[2rem] border border-border bg-card p-6 shadow-xl shadow-primary/10 sm:p-8">
        <InklopLogo className="text-2xl" />

        {success ? (
          <div className="flex flex-col items-center gap-4 py-10 text-center" role="status">
            <span className="flex size-16 items-center justify-center rounded-full bg-secondary text-primary">
              <PartyPopper className="size-8" aria-hidden="true" />
            </span>
            <h2 className="text-2xl font-bold">{'¡Gracias por votar!'}</h2>
            <p className="text-pretty text-muted-foreground">
              Tu voto por <span className="font-semibold text-foreground">{success}</span> fue
              registrado.
              {values.wantsToAttend
                ? ' Si gana, entrarás al sorteo para asistir a la gala.'
                : ''}
            </p>
          </div>
        ) : (
          <>
            <h2 className="mt-6 text-3xl font-bold tracking-tight">
              Tu voto <span className="text-primary">cuenta</span>
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Completa el formulario para apoyar a tu creador favorito.
            </p>

            <form onSubmit={handleSubmit} noValidate className="mt-6 flex flex-col gap-5">
              <div>
                <label htmlFor="fullName" className="mb-2 block text-sm font-semibold">
                  Nombre y apellido
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  autoComplete="name"
                  placeholder="Ej. Ana Torres"
                  maxLength={80}
                  value={values.fullName}
                  onChange={(e) => update('fullName', e.target.value)}
                  aria-invalid={Boolean(errors.fullName)}
                  aria-describedby={errors.fullName ? 'fullName-error' : undefined}
                  className={cn(inputClass, errors.fullName ? 'border-destructive' : 'border-input')}
                />
                <FieldError id="fullName-error" message={errors.fullName} />
              </div>

              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-semibold">
                  Correo electrónico
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="Ej. ana@email.com"
                  maxLength={120}
                  value={values.email}
                  onChange={(e) => update('email', e.target.value)}
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? 'email-error' : undefined}
                  className={cn(inputClass, errors.email ? 'border-destructive' : 'border-input')}
                />
                <FieldError id="email-error" message={errors.email} />
              </div>

              <div>
                <label htmlFor="creatorId" className="mb-2 block text-sm font-semibold">
                  Selecciona tu creador favorito
                </label>
                <div className="relative">
                  {selected && (
                    <Image
                      src={selected.avatarUrl || '/placeholder.svg'}
                      alt=""
                      width={28}
                      height={28}
                      className="pointer-events-none absolute left-3 top-1/2 size-7 -translate-y-1/2 rounded-full object-cover"
                    />
                  )}
                  <select
                    id="creatorId"
                    name="creatorId"
                    value={values.creatorId || ''}
                    onChange={(e) => update('creatorId', Number(e.target.value))}
                    aria-invalid={Boolean(errors.creatorId)}
                    aria-describedby={errors.creatorId ? 'creatorId-error' : undefined}
                    className={cn(
                      inputClass,
                      'appearance-none pr-10',
                      selected ? 'pl-12' : 'text-muted-foreground/70',
                      errors.creatorId ? 'border-destructive' : 'border-input',
                    )}
                  >
                    <option value="" disabled>
                      Selecciona una opción
                    </option>
                    {creators.map((creator) => (
                      <option key={creator.id} value={creator.id} className="text-foreground">
                        {creator.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                    aria-hidden="true"
                  />
                </div>
                <FieldError id="creatorId-error" message={errors.creatorId} />
              </div>

              <fieldset>
                <legend className="mb-2 text-sm font-semibold">
                  {'¿Quieres asistir con tu creador si gana?'}
                </legend>
                <div className="grid grid-cols-2 gap-1 rounded-xl border border-input p-1">
                  {[
                    { label: 'Sí', value: true },
                    { label: 'No', value: false },
                  ].map((option) => {
                    const checked = values.wantsToAttend === option.value
                    return (
                      <label
                        key={option.label}
                        className={cn(
                          'flex h-10 cursor-pointer items-center gap-2.5 rounded-lg px-4 text-sm font-medium transition-colors has-[:focus-visible]:ring-3 has-[:focus-visible]:ring-primary/20',
                          checked ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:bg-muted',
                        )}
                      >
                        <input
                          type="radio"
                          name="wantsToAttend"
                          checked={checked}
                          onChange={() => update('wantsToAttend', option.value)}
                          className="size-4 accent-primary"
                        />
                        {option.label}
                      </label>
                    )
                  })}
                </div>
              </fieldset>

              <div>
                <label className="flex cursor-pointer items-start gap-3 text-sm text-muted-foreground">
                  <input
                    type="checkbox"
                    checked={values.acceptedRules}
                    onChange={(e) => update('acceptedRules', e.target.checked)}
                    aria-invalid={Boolean(errors.acceptedRules)}
                    aria-describedby={errors.acceptedRules ? 'rules-error' : undefined}
                    className="mt-0.5 size-5 shrink-0 cursor-pointer rounded accent-primary"
                  />
                  <span>
                    Acepto que solo se permite <strong className="text-foreground">1 voto</strong>{' '}
                    por persona.
                  </span>
                </label>
                <FieldError id="rules-error" message={errors.acceptedRules} />
              </div>

              {formError && (
                <p role="alert" className="rounded-xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
                  {formError}
                </p>
              )}

              <button
                type="submit"
                disabled={isPending}
                className="mt-2 h-14 w-full rounded-full bg-gradient-to-r from-primary to-accent text-base font-bold uppercase tracking-wide text-primary-foreground shadow-lg shadow-primary/30 transition-[transform,opacity] hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70"
              >
                {isPending ? 'Enviando…' : 'Enviar voto'}
              </button>
            </form>
          </>
        )}
      </div>

      <span className="inline-flex items-center gap-2 rounded-full border border-secondary-foreground/20 bg-secondary px-5 py-2 text-sm font-semibold text-secondary-foreground">
        <Star className="size-4 fill-current" aria-hidden="true" />1 voto por persona
      </span>
    </div>
  )
}
