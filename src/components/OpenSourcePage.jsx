import { useGithub } from '../context/GithubContext'
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa'
import { GitMergeIcon, GitPullRequestIcon } from '@primer/octicons-react'

export function OpenSourcePage() {
  const { contributions, isLoading, error } = useGithub()

  if (error) {
    return (
      <main className="min-h-screen py-24">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="mb-16">
            <h1 className="text-4xl sm:text-5xl font-display font-light text-text mb-2">
              Open{' '}
              <span className="font-calligraphic font-bold bg-gradient-to-r from-sky-600 via-teal-500 to-indigo-600 dark:from-sky-400 dark:via-teal-300 dark:to-indigo-400 bg-clip-text text-transparent">
                Source
              </span>
            </h1>
            <p className="text-sm text-text-subtle">
              Contributions to open source projects
            </p>
          </div>
          <div className="text-text-muted">
            Error loading contributions: {error}
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen py-24">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="mb-16">
          <h1 className="text-4xl sm:text-5xl font-display font-semibold text-text mb-2">
            Open{' '}
            <span className="font-calligraphic font-black bg-gradient-to-r from-sky-600 via-teal-500 to-indigo-600 dark:from-sky-400 dark:via-teal-300 dark:to-indigo-400 bg-clip-text text-transparent">
              Source
            </span>
          </h1>
          <p className="text-sm text-text-subtle">
            Contributions to open source projects
          </p>
        </div>

        {isLoading ? (
          <div className="text-center py-12 text-text-muted">Loading...</div>
        ) : contributions.length === 0 ? (
          <div className="text-text-subtle text-sm">No contributions found.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contributions
              .sort((a, b) => {
                const dateA = new Date(a.mergedAt || a.updatedAt || a.createdAt)
                const dateB = new Date(b.mergedAt || b.updatedAt || b.createdAt)
                return dateB - dateA
              })
              .map((pr) => (
              <a
                key={pr.id}
                href={pr.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group block"
              >
                <div className="h-full bg-surface border border-border rounded-xl p-6 hover:border-accent/50 transition-all duration-200 hover:shadow-lg flex flex-col">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-2 text-sm text-text-muted min-w-0">
                      <FaGithub className="w-4 h-4 flex-shrink-0" />
                      <span className="truncate">{pr.repo}</span>
                    </div>
                    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium flex-shrink-0 ${
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

                  <h3 className="text-lg font-semibold text-text mb-3 group-hover:text-accent transition-colors line-clamp-2 flex-grow">
                    {pr.title}
                  </h3>
                  
                  {pr.description && (
                    <p className="text-sm text-text-subtle mb-4 line-clamp-3 flex-grow">
                      {pr.description.replace(/<!--[\s\S]*?-->/g, '').trim()}
                    </p>
                  )}

                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-border">
                    <span className="text-xs text-text-subtle">
                      {new Date(pr.mergedAt || pr.updatedAt).toLocaleDateString('en-GB', {
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
        )}
      </div>
    </main>
  )
}
