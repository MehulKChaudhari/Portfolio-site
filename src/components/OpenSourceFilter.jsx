import { useRef, useLayoutEffect, useState } from 'react'
import { useTheme } from '../context/ThemeContext'

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'merged', label: 'Merged' },
  { id: 'open', label: 'Open' },
]

export function OpenSourceFilter({ status, counts, onStatusChange }) {
  const { theme } = useTheme()
  const containerRef = useRef(null)
  const buttonRefs = useRef({})
  const [indicator, setIndicator] = useState({ left: 0, width: 0, visible: false })

  useLayoutEffect(() => {
    const updateIndicator = () => {
      const container = containerRef.current
      const button = buttonRefs.current[status]
      if (!container || !button) return

      const containerRect = container.getBoundingClientRect()
      const buttonRect = button.getBoundingClientRect()

      setIndicator({
        left: buttonRect.left - containerRect.left,
        width: buttonRect.width,
        visible: true,
      })
    }

    updateIndicator()
    window.addEventListener('resize', updateIndicator)
    return () => window.removeEventListener('resize', updateIndicator)
  }, [status, counts, theme])

  return (
    <div
      ref={containerRef}
      role="tablist"
      aria-label="Pull request status"
      className="relative inline-flex items-center gap-1 rounded-full border border-border bg-bg p-1 mb-10 shadow-sm"
    >
      {indicator.visible && (
        <div
          className="pointer-events-none absolute top-1/2 -translate-y-1/2 h-8 rounded-full transition-all duration-500 ease-out"
          style={{
            left: indicator.left,
            width: indicator.width,
            background: theme === 'dark'
              ? 'radial-gradient(circle at center, rgba(148, 163, 184, 0.18) 0%, rgba(100, 116, 139, 0.12) 50%, rgba(71, 85, 105, 0.08) 100%)'
              : 'radial-gradient(circle at center, rgba(241, 245, 249, 0.95) 0%, rgba(226, 232, 240, 0.85) 50%, rgba(203, 213, 225, 0.75) 100%)',
            boxShadow: theme === 'dark'
              ? '0 0 0 1px rgba(148, 163, 184, 0.15), 0 2px 8px rgba(71, 85, 105, 0.2), 0 4px 16px rgba(51, 65, 85, 0.15), inset 0 1px 2px rgba(255, 255, 255, 0.15), inset 0 -1px 2px rgba(0, 0, 0, 0.05)'
              : '0 0 0 1px rgba(203, 213, 225, 0.4), 0 2px 8px rgba(100, 116, 139, 0.15), 0 4px 16px rgba(71, 85, 105, 0.1), inset 0 2px 4px rgba(255, 255, 255, 0.8), inset 0 -1px 3px rgba(148, 163, 184, 0.1)',
            border: theme === 'dark'
              ? '1px solid rgba(148, 163, 184, 0.2)'
              : '1px solid rgba(226, 232, 240, 0.8)',
            backdropFilter: 'blur(16px) saturate(1.3)',
          }}
        />
      )}

      {FILTERS.map((filter) => {
        const active = status === filter.id

        return (
          <button
            key={filter.id}
            type="button"
            role="tab"
            aria-selected={active}
            ref={(el) => {
              buttonRefs.current[filter.id] = el
            }}
            onClick={() => onStatusChange(filter.id)}
            className="group relative z-10 px-3.5 py-1.5 rounded-full flex items-center gap-1.5 whitespace-nowrap transition-all duration-300 ease-out cursor-pointer"
          >
            <span
              className={[
                'text-sm transition-all duration-300 ease-out',
                active
                  ? 'bg-gradient-to-r from-sky-600 via-teal-500 to-indigo-600 dark:from-sky-400 dark:via-teal-300 dark:to-indigo-400 bg-clip-text text-transparent font-semibold'
                  : 'text-text-subtle group-hover:bg-gradient-to-r group-hover:from-sky-600 group-hover:via-teal-500 group-hover:to-indigo-600 dark:group-hover:from-sky-400 dark:group-hover:via-teal-300 dark:group-hover:to-indigo-400 group-hover:bg-clip-text group-hover:text-transparent',
              ].join(' ')}
            >
              {filter.label}
            </span>
            <span
              className={[
                'text-xs tabular-nums transition-all duration-300 ease-out',
                active
                  ? 'bg-gradient-to-r from-sky-600 via-teal-500 to-indigo-600 dark:from-sky-400 dark:via-teal-300 dark:to-indigo-400 bg-clip-text text-transparent font-medium'
                  : 'text-text-subtle/70 group-hover:text-text-subtle',
              ].join(' ')}
            >
              {counts[filter.id]}
            </span>
          </button>
        )
      })}
    </div>
  )
}
