import { cn } from '@/lib/utils'

export function InklopLogo({ className }: { className?: string }) {
  return (
    <span
      className={cn('inline-flex items-baseline font-bold tracking-tight text-foreground', className)}
      aria-label="INKLOP"
    >
      <span aria-hidden="true">inkl</span>
      <span
        aria-hidden="true"
        className="mx-[0.04em] inline-block size-[0.72em] translate-y-[0.12em] rounded-full border-[0.16em] border-accent border-r-primary"
      />
      <span aria-hidden="true">p</span>
    </span>
  )
}
