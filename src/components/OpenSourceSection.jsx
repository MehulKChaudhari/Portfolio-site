import { Link } from 'react-router-dom'
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa'
import { GitMergeIcon, GitPullRequestIcon } from '@primer/octicons-react'
import { useGithub } from '../context/GithubContext'

export function OpenSourceSection() {
  const { contributions, isLoading, error } = useGithub()
  
  const featuredPRs = contributions
    .filter(pr => pr.featured)
    .sort((a, b) => (a.featured_order || 999) - (b.featured_order || 999))
    .slice(0, 3)
  
  const displayPRs = featuredPRs.length > 0 
    ? featuredPRs 
    : contributions
        .sort((a, b) => {
          const dateA = new Date(a.mergedAt || a.updatedAt || a.createdAt)
          const dateB = new Date(b.mergedAt || b.updatedAt || b.createdAt)
          return dateB - dateA
        })
        .slice(0, 3)
  
  if (isLoading) {
    return null
  }
  
  if (error) {
    console.error('OpenSourceSection error:', error)
    return null
  }
  
  if (displayPRs.length === 0) {
    return null
  }

  return (
    <section>
      <div className="mb-12">
        <div className="flex items-center justify-between gap-4 mb-2">
          <h2 className="text-3xl sm:text-4xl font-display font-semibold text-text">
            Open{' '}
            <span className="font-calligraphic font-black bg-gradient-to-r from-sky-500 via-teal-400 to-indigo-500 dark:from-sky-400 dark:via-teal-300 dark:to-indigo-400 bg-clip-text text-transparent">
              Source
            </span>
          </h2>
          <Link 
            to="/open-source"
            className="link text-sm font-medium hover:text-accent transition-colors flex items-center gap-1 flex-shrink-0"
          >
            View all
            <span aria-hidden>→</span>
          </Link>
        </div>
        <p className="text-sm text-text-subtle">Selected contributions to open source projects</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayPRs.map((pr) => (
          <a
            key={pr.id}
            href={pr.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group block"
          >
            <div className="h-full bg-surface/95 border border-border/80 rounded-2xl p-6 transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-accent/60 hover:shadow-lg flex flex-col">
              <div className="h-1 w-full rounded-full bg-gradient-to-r from-purple-500 via-fuchsia-400 to-purple-500 dark:from-purple-500 dark:via-fuchsia-500 dark:to-purple-500 mb-4" />
              
              <div className="flex items-start justify-between gap-3 mb-4">
                <div className="flex items-start gap-2.5 min-w-0 flex-1">
                  <FaGithub className="w-4 h-4 flex-shrink-0 mt-1 text-text-muted" />
                  <div className="min-w-0 flex-1">
                    <h3 className="text-lg font-semibold text-text group-hover:text-accent transition-colors line-clamp-2">
                      {pr.title}
                    </h3>
                  </div>
                </div>
                <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-medium flex-shrink-0 ${
                  pr.status === 'merged'
                    ? 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20'
                    : pr.status === 'draft'
                    ? 'bg-gray-500/10 text-gray-600 dark:text-gray-400 border border-gray-500/20'
                    : 'bg-green-500/10 text-green-600 dark:text-green-400 border border-green-500/20'
                }`}>
                  {pr.status === 'merged' ? (
                    <GitMergeIcon size={12} />
                  ) : (
                    <GitPullRequestIcon size={12} />
                  )}
                  {pr.status}
                </div>
              </div>
              
              <p className="text-xs text-text-subtle mb-3">
                {pr.repo}
              </p>
              
              {pr.description && (
                <p className="text-sm text-text-subtle line-clamp-3 mb-4 flex-grow">
                  {pr.description.length > 120
                    ? `${pr.description.substring(0, 120)}...`
                    : pr.description}
                </p>
              )}

              <div className="flex items-center justify-between mt-auto pt-4 border-t border-border">
                <span className="text-xs text-text-subtle">
                  {new Date(pr.mergedAt || pr.createdAt).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric'
                  })}
                </span>
                <span className="text-xs link group-hover:text-accent-hover transition-colors flex items-center gap-1 font-medium">
                  View PR
                  <FaExternalLinkAlt className="w-3 h-3 text-orange-500 dark:text-orange-400" />
                </span>
              </div>
            </div>
          </a>
        ))}
      </div>
    </section>
  )
}
