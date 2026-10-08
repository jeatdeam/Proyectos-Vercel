import { InklopLogo } from '@/components/inklop-logo'

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-2 px-4 py-8 text-center">
        <InklopLogo className="text-xl" />
        <p className="text-sm text-muted-foreground">
          © 2026 INKLOP Inc. Todos los derechos reservados. Sistema oficial de votación para
          creadores de contenido.
        </p>
        <p className="text-xs text-muted-foreground">
          Términos de servicio • Política de Privacidad • 1 voto por usuario registrado
        </p>
      </div>
    </footer>
  )
}
