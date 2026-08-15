import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'

const SHOWCASE_STATUSES = new Set(['merged', 'open', 'draft'])
const FILTER_STATUSES = new Set(['all', 'open', 'merged'])

export function isShowcasePR(pr) {
  return SHOWCASE_STATUSES.has(pr.status)
}

export function matchesStatus(pr, status) {
  if (!status || status === 'all') return true
  if (status === 'open') return pr.status === 'open' || pr.status === 'draft'
  return pr.status === status
}

export function useContributionFilters(contributions) {
  const [searchParams, setSearchParams] = useSearchParams()
  const requested = searchParams.get('status')
  const status = FILTER_STATUSES.has(requested) ? requested : 'merged'

  const showcase = useMemo(
    () => contributions.filter(isShowcasePR),
    [contributions]
  )

  const filtered = useMemo(
    () =>
      showcase
        .filter((pr) => matchesStatus(pr, status))
        .sort((a, b) => {
          const dateA = new Date(a.mergedAt || a.updatedAt || a.createdAt)
          const dateB = new Date(b.mergedAt || b.updatedAt || b.createdAt)
          return dateB - dateA
        }),
    [showcase, status]
  )

  const counts = useMemo(
    () => ({
      all: showcase.length,
      merged: showcase.filter((pr) => pr.status === 'merged').length,
      open: showcase.filter((pr) => pr.status === 'open' || pr.status === 'draft').length,
    }),
    [showcase]
  )

  const setStatus = (next) => {
    const params = new URLSearchParams(searchParams)
    if (next === 'merged') params.delete('status')
    else params.set('status', next)
    setSearchParams(params, { replace: true })
  }

  return { status, setStatus, filtered, counts }
}
