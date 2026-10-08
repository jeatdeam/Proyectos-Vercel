import { CalendarDays, CircleCheck, Flame, MapPin, Ticket, Check } from 'lucide-react'

const PERKS = [
  { title: 'Entrada VIP Doble', description: 'Acceso a la mesa principal del creador.' },
  { title: 'Alfombra Roja', description: 'Fotos oficiales y mención especial.' },
  { title: 'Backstage Exclusivo', description: 'Conoce a todos los nominados en persona.' },
  { title: 'Kit INKLOP VIP', description: 'Merchandising exclusivo edición limitada.' },
]

const FACTS = [
  { icon: CalendarDays, label: 'Cierre de votación: 14 de Octubre' },
  { icon: MapPin, label: 'Gran Gala Presencial' },
  { icon: CircleCheck, label: '1 Voto por persona auditado' },
]

export function HeroInfo() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-5">
        <span className="inline-flex w-fit items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-orange-700">
          <Flame className="size-3.5" aria-hidden="true" />
          Votación oficial INKLOP Awards
        </span>
        <h1 className="text-balance text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
          {'¡Haz que tu creador '}
          <span className="bg-gradient-to-r from-brand-blue via-primary to-accent bg-clip-text text-transparent">
            sea el ganador!
          </span>
        </h1>
        <p className="max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
          Vota por tu influencer favorito en INKLOP. Si resulta ganador y marcaste la opción de
          asistir, entrarás automáticamente al sorteo para acompañarlo en la alfombra roja y la gala
          exclusiva.
        </p>
      </div>

      <section
        aria-labelledby="perks-title"
        className="rounded-3xl border border-border bg-card p-6 shadow-sm"
      >
        <h2
          id="perks-title"
          className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-secondary-foreground"
        >
          <Ticket className="size-4" aria-hidden="true" />
          {'¿Qué incluye asistir con tu creador?'}
        </h2>
        <ul className="mt-4 grid gap-4 sm:grid-cols-2">
          {PERKS.map((perk) => (
            <li key={perk.title} className="flex gap-3">
              <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-secondary text-primary">
                <Check className="size-3.5" aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-semibold">{perk.title}</p>
                <p className="text-xs leading-relaxed text-muted-foreground">{perk.description}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <ul className="flex flex-wrap gap-3">
        {FACTS.map(({ icon: Icon, label }) => (
          <li
            key={label}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-sm text-muted-foreground"
          >
            <Icon className="size-4 text-primary" aria-hidden="true" />
            {label}
          </li>
        ))}
      </ul>
    </div>
  )
}
