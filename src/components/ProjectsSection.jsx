import { Link, useNavigate } from 'react-router-dom'
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa'
import { curatedProjects } from '../data/projects'

const typeLabels = {
  'full-stack': 'Full-stack',
  'frontend': 'Frontend',
  'backend': 'Backend',
  'sdk': 'SDK / npm package – full-stack demo'
}

const typeColors = {
  'full-stack': 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
  'frontend': 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
  'backend': 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20',
  'sdk': 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
}

export function ProjectsSection() {
  return (
    <section>
      <div className="flex items-end justify-between mb-12">
        <div>
          <h2 className="text-3xl sm:text-4xl font-display font-light text-text mb-2">
            <span className="font-calligraphic font-bold bg-gradient-to-r from-sky-500 via-teal-400 to-indigo-500 dark:from-sky-400 dark:via-teal-300 dark:to-indigo-400 bg-clip-text text-transparent">
              Projects
            </span>
          </h2>
          <p className="text-sm text-text-subtle">Selected work</p>
        </div>
        <Link 
          to="/projects"
          className="link text-sm hover:text-accent-hover transition-colors flex items-center gap-1 font-medium"
        >
          View all
          <span>→</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {curatedProjects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </section>
  )
}

function ProjectCard({ project }) {
  const navigate = useNavigate()

  const handleCardClick = (e) => {
    // Don't navigate if clicking on a link
    if (e.target.closest('a')) {
      return
    }
    // Scroll to top before navigating
    window.scrollTo({ top: 0, behavior: 'instant' })
    navigate(`/projects/${project.slug}`)
  }

  return (
    <div
      onClick={handleCardClick}
      className="group bg-surface/95 border border-border/80 rounded-2xl overflow-hidden transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-accent/60 hover:shadow-lg cursor-pointer"
    >
            {project.image && (
              <div className="aspect-video w-full overflow-hidden bg-surface">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                  decoding="async"
                />
              </div>
            )}
            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-lg font-semibold text-text group-hover:text-accent transition-colors">
                  {project.title}
                </h3>
                <span className={`text-xs px-2 py-0.5 rounded-md border font-medium flex-shrink-0 ml-2 ${typeColors[project.type]}`}>
                  {typeLabels[project.type]}
                </span>
              </div>

              <p className="text-sm text-text-muted mb-4 leading-relaxed">
                {project.description}
              </p>

              {project.points && project.points.length > 0 && (
                <div className="space-y-2 mb-4">
                  {project.points.slice(0, 2).map((point, index) => (
                    <div key={index} className="flex gap-2">
                      <span className="text-text-subtle mt-0.5 flex-shrink-0 text-xs">•</span>
                      <p className="text-xs text-text-muted leading-relaxed line-clamp-2 flex-1">
                        {point}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              <div className="mb-4">
                <p className="text-xs font-medium text-text-subtle mb-2">Tech Stack</p>
                <div className="flex flex-wrap gap-1.5">
                  {project.tech.map((tech) => (
                    <span
                      key={tech}
                      className="text-xs px-2 py-0.5 bg-surface border border-border/50 text-text-subtle rounded transition-all duration-200 hover:border-accent/30 hover:text-text"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div className="flex items-center gap-3">
                  {project.live && (
                    <a
                      href={project.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="group/link flex items-center gap-1.5 text-xs text-text-subtle hover:text-accent transition-all duration-200"
                    >
                      <FaExternalLinkAlt className="w-3 h-3 transition-transform duration-200 group-hover/link:scale-110" />
                      <span>Live</span>
                    </a>
                  )}
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="group/link flex items-center gap-1.5 text-xs text-text-subtle hover:text-accent transition-all duration-200"
                    >
                      <FaGithub className="w-3 h-3 transition-transform duration-200 group-hover/link:scale-110" />
                      <span>Code</span>
                    </a>
                  )}
                </div>
                <span className="text-xs text-text-subtle group-hover:text-text transition-colors">
                  Details →
                </span>
              </div>
            </div>
    </div>
  )
}
