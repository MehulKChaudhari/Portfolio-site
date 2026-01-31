import { useNavigate } from 'react-router-dom'
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa'

export const typeLabels = {
  'full-stack': 'Full-stack',
  'frontend': 'Frontend',
  'backend': 'Backend',
  'sdk': 'SDK / npm package – full-stack demo'
}

export const typeColors = {
  'full-stack': 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
  'frontend': 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
  'backend': 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20',
  'sdk': 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
}

export function ProjectCard({ project }) {
  const navigate = useNavigate()

  const handleCardClick = (e) => {
    if (e.target.closest('a')) return
    window.scrollTo({ top: 0, behavior: 'instant' })
    navigate(`/projects/${project.slug}`)
  }

  const tech = project.techStackSections
    ? project.techStackSections.flatMap(s => s.items)
    : project.tech
  const hasLive = !!project.live
  const hasGithub = !!project.github

  return (
    <div
      onClick={handleCardClick}
      className="group relative flex h-full flex-col bg-surface border border-border rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl hover:shadow-black/5 dark:hover:shadow-black/20 hover:border-sky-500/30 dark:hover:border-sky-400/30"
    >
      {/* Top accent bar - design system gradient */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-sky-500 via-teal-400 to-indigo-500 dark:from-sky-400 dark:via-teal-300 dark:to-indigo-400 opacity-80 z-10" aria-hidden />

      {project.image && (
        <div className="relative aspect-video w-full flex-shrink-0 overflow-hidden bg-surface">
          <div className="absolute inset-0 bg-gradient-to-t from-bg/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-[1]" aria-hidden />
          <img
            src={project.image}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
            loading="lazy"
            decoding="async"
          />
        </div>
      )}

      <div className="relative flex flex-1 flex-col min-h-0 p-5">
        {/* Content grows so footer stays at bottom */}
        <div className="flex flex-1 flex-col min-h-0">
          {/* Type - no "View package" chip */}
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className={`text-xs px-2.5 py-1 rounded-lg border font-medium ${typeColors[project.type]}`}>
              {typeLabels[project.type]}
            </span>
          </div>

          <h3 className="text-lg font-display font-semibold text-text mb-2 leading-tight line-clamp-2 transition-colors duration-200 group-hover:bg-gradient-to-r group-hover:from-sky-500 group-hover:via-teal-400 group-hover:to-indigo-500 group-hover:dark:from-sky-400 group-hover:dark:via-teal-300 group-hover:dark:to-indigo-400 group-hover:bg-clip-text group-hover:text-transparent">
            {project.title}
          </h3>

          <p className="text-sm text-text-muted leading-relaxed mb-4 line-clamp-3">
            {project.description}
          </p>

          {/* Tech stack */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {tech.slice(0, 8).map((t) => (
              <span
                key={t}
                className="text-[11px] px-2 py-0.5 rounded-md bg-bg/80 dark:bg-bg/40 border border-border/70 text-text-subtle transition-colors duration-200 group-hover:border-sky-500/20 dark:group-hover:border-sky-400/20"
              >
                {t}
              </span>
            ))}
            {tech.length > 8 && (
              <span className="text-[11px] px-2 py-0.5 text-text-subtle font-medium">+{tech.length - 8}</span>
            )}
          </div>
        </div>

        {/* Footer - always at bottom with same spacing */}
        <div className="pt-4 mt-auto border-t border-border/80">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {hasLive && (
                <a
                  href={project.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-text-subtle hover:text-accent transition-colors duration-200"
                >
                  <FaExternalLinkAlt className="w-3 h-3 opacity-80" />
                  <span>{project.liveLabel || 'Live'}</span>
                </a>
              )}
              {hasGithub && (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-text-subtle hover:text-accent transition-colors duration-200"
                >
                  <FaGithub className="w-3 h-3 opacity-80" />
                  <span>Code</span>
                </a>
              )}
            </div>
            <span className="text-xs font-medium text-text-subtle group-hover:text-text transition-colors duration-200">
              Details →
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
