import { useGithub } from '../context/GithubContext'
import { AnimatedCounter } from './AnimatedCounter'

function formatYearsSince(startYear) {
  const now = new Date()
  return (now.getFullYear() - startYear).toString()
}

export function StatsBar() {
  const { contributions, isLoading, error } = useGithub()

  const totalPRs = contributions.length
  const mergedPRs = contributions.filter((pr) => pr.status === 'merged').length
  const hasPRData = !isLoading && !error && contributions.length > 0

  const items = [
    {
      label: 'Years in production',
      value: formatYearsSince(2021),
      hint: 'Shipping software used by real users',
      gradient: 'from-sky-700 via-sky-600 to-sky-700 dark:from-sky-400 dark:via-sky-300 dark:to-sky-400',
    },
    {
      label: 'Open source PRs',
      value: isLoading ? '—' : hasPRData ? mergedPRs : '—',
      hint: isLoading ? 'Fetching…' : error ? 'Data unavailable' : hasPRData ? `merged of ${totalPRs} total` : 'Data unavailable',
      gradient: 'from-violet-700 via-fuchsia-600 to-violet-700 dark:from-violet-400 dark:via-fuchsia-300 dark:to-violet-400',
    },
    {
      label: 'Systems owned',
      value: '3+',
      hint: 'Feature areas & services I was responsible for',
      gradient: 'from-emerald-700 via-teal-600 to-emerald-700 dark:from-emerald-400 dark:via-teal-300 dark:to-emerald-400',
    },
    {
      label: 'Talks & sessions',
      value: '1',
      hint: 'Starting to share more in public',
      gradient: 'from-rose-700 via-orange-600 to-rose-700 dark:from-rose-400 dark:via-orange-300 dark:to-rose-400',
    },
  ]

  return (
    <section>
      <div className="mb-4 flex items-center justify-between gap-4">
        <p className="text-xs font-semibold tracking-[0.2em] uppercase text-text-subtle">
          Stats for engineers
        </p>
        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          Live
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map((item) => (
          <div
            key={item.label}
            className="relative overflow-hidden rounded-2xl border border-border/80 bg-surface/95 px-4 py-3 transition-transform duration-200 ease-out hover:-translate-y-0.5 hover:shadow-lg"
          >
            <div
              className={`pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r ${item.gradient}`}
            />
            <p className="text-xs text-text-subtle mb-1">{item.label}</p>
            <p className="text-xl font-semibold text-text mb-1">
              {typeof item.value === 'number' || (typeof item.value === 'string' && item.value !== '—' && !isNaN(parseFloat(item.value))) ? (
                <AnimatedCounter value={item.value} />
              ) : (
                item.value
              )}
            </p>
            <p className="text-xs text-text-subtle">{item.hint}</p>
          </div>
        ))}
      </div>

    </section>
  )
}

