import { FeaturedCreators } from '@/components/featured-creators'
import { HeroInfo } from '@/components/hero-info'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'
import { VotePanel } from '@/components/vote-panel'
import { getVotingStats } from '@/lib/ranking'

export const dynamic = 'force-dynamic'

export default async function Page() {
  const stats = await getVotingStats()

  return (
    <div className="flex min-h-screen flex-col bg-[radial-gradient(ellipse_at_top_left,oklch(0.95_0.04_340/0.6),transparent_55%),radial-gradient(ellipse_at_bottom_right,oklch(0.95_0.04_30/0.5),transparent_50%)]">
      <SiteHeader initialStats={stats} />
      <main className="mx-auto grid w-full max-w-6xl flex-1 gap-12 px-4 py-12 lg:grid-cols-[1.15fr_1fr] lg:gap-16 lg:py-16">
        <div className="flex flex-col gap-10">
          <HeroInfo />
          <FeaturedCreators initialStats={stats} />
        </div>
        <VotePanel initialStats={stats} />
      </main>
      <SiteFooter />
    </div>
  )
}
