import { useParams, Link } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import { FaGithub, FaExternalLinkAlt, FaArrowLeft } from 'react-icons/fa'
import { projectsData } from '../data/projects'
import { getMermaidConfig } from '../utils/constants'
import { useTheme } from '../context/ThemeContext'

let mermaid = null
const loadMermaid = async () => {
  if (!mermaid) {
    mermaid = (await import('mermaid')).default
  }
  return mermaid
}

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

export function ProjectDetailPage() {
  const { slug } = useParams()
  const { theme } = useTheme()
  const project = projectsData.find(p => p.slug === slug)
  const mermaidRef = useRef(null)

  // Scroll to top when component mounts or slug changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [slug])

  useEffect(() => {
    if (project?.sequenceDiagram || project?.flowSequenceDiagram) {
      loadMermaid().then(m => {
        m.initialize(getMermaidConfig(theme))
        requestAnimationFrame(() => {
          m.contentLoaded()
        })
      })
    }
  }, [project, theme])

  if (!project) {
    return (
      <main className="min-h-screen py-24">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-text mb-4">Project not found</h1>
            <Link to="/projects" className="link">← Back to projects</Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen py-24">
      <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12">
        <Link 
          to="/projects" 
          className="group inline-flex items-center gap-2 px-4 py-2 rounded-lg mb-8 transition-all duration-200 border border-border/50 hover:border-accent/50 bg-surface/50 hover:bg-surface"
        >
          <FaArrowLeft className="w-3.5 h-3.5 transition-all duration-200 group-hover:-translate-x-1 text-text-subtle group-hover:text-accent" />
          <span className="text-sm font-medium text-text-subtle group-hover:bg-gradient-to-r group-hover:from-sky-500 group-hover:via-teal-400 group-hover:to-indigo-500 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-200">
            Back to projects
          </span>
        </Link>

        <article>
          {project.image && (
            <div className="mb-6 rounded-xl overflow-hidden border border-border">
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-auto"
                loading="eager"
                fetchpriority="high"
                decoding="async"
              />
            </div>
          )}
          {project.coverNote && (
            <p className="mb-8 text-sm text-text-subtle italic border-l-2 border-amber-500/50 dark:border-amber-400/50 pl-4 py-2 bg-amber-500/5 dark:bg-amber-400/5 rounded-r">
              {project.coverNote}
            </p>
          )}

          <header className="mb-8">
            <div className="flex flex-wrap items-start gap-x-4 gap-y-2 mb-4">
              <h1 className="text-4xl sm:text-5xl font-display font-light text-text leading-tight min-w-0">
                {project.title}
              </h1>
              <span className={`text-xs px-3 py-1.5 rounded-md border font-medium flex-shrink-0 ml-0 md:ml-4 ${typeColors[project.type]}`}>
                {typeLabels[project.type]}
              </span>
            </div>
            <p className="text-lg text-text-muted leading-relaxed">
              {project.description}
            </p>
            {project.headerNote && (
              <p className="mt-6 text-sm text-text-subtle italic border-l-2 border-amber-500/50 dark:border-amber-400/50 pl-4 py-2 bg-amber-500/5 dark:bg-amber-400/5 rounded-r">
                {project.headerNote}
              </p>
            )}
          </header>

          <div className="flex items-center gap-4 mb-12 pb-8 border-b border-border">
            {project.live && (
              <a
                href={project.live}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2 px-4 py-2.5 bg-surface border border-border rounded-lg text-sm font-medium text-text hover:border-accent hover:bg-surface/80 transition-all duration-200 hover:shadow-sm"
              >
                <FaExternalLinkAlt className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" />
                <span className="group-hover:bg-gradient-to-r group-hover:from-sky-500 group-hover:via-teal-400 group-hover:to-indigo-500 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-200">
                  {project.liveLabel || 'Live Demo'}
                </span>
              </a>
            )}
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2 px-4 py-2.5 bg-surface border border-border rounded-lg text-sm font-medium text-text hover:border-accent hover:bg-surface/80 transition-all duration-200 hover:shadow-sm"
              >
                <FaGithub className="w-4 h-4 transition-transform duration-200 group-hover:scale-110" />
                <span className="group-hover:bg-gradient-to-r group-hover:from-sky-500 group-hover:via-teal-400 group-hover:to-indigo-500 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-200">
                  View Code
                </span>
              </a>
            )}
          </div>

          <div className="space-y-12">
            {project.points && project.points.length > 0 && (
              <section>
                <h2 className="text-2xl font-semibold text-text mb-6">{project.pointsSectionTitle || 'Key Achievements'}</h2>
                <div className="space-y-4">
                  {project.points.map((point, index) => (
                    <div key={index} className="flex gap-4">
                      <span className="text-text-subtle mt-1 flex-shrink-0 text-lg">•</span>
                      <p className="text-text-muted leading-relaxed flex-1">
                        {point}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {project.sequenceDiagram && (
              <section>
                <h2 className="text-2xl font-semibold text-text mb-6">How it works</h2>
                <div className="bg-surface/50 border border-border rounded-lg p-6 overflow-x-auto" ref={mermaidRef}>
                  <div className="mermaid">
                    {project.sequenceDiagram}
                  </div>
                </div>
              </section>
            )}

            {project.flowSequenceDiagram && (
              <section>
                <h2 className="text-2xl font-semibold text-text mb-6">Execution flow</h2>
                <div className="bg-surface/50 border border-border rounded-lg p-6 overflow-x-auto">
                  <div className="mermaid">
                    {project.flowSequenceDiagram}
                  </div>
                </div>
              </section>
            )}

            {project.hldDiagram && (
              <section>
                <h2 className="text-2xl font-semibold text-text mb-6">High-Level Architecture</h2>
                <div className="bg-surface/50 border border-border rounded-lg p-6 overflow-hidden">
                  <img
                    src={project.hldDiagram}
                    alt="System architecture diagram"
                    className="w-full h-auto rounded"
                  />
                </div>
              </section>
            )}

            <section>
              <h2 className="text-2xl font-semibold text-text mb-6">Tech Stack</h2>
              {project.techStackSections ? (
                <div className="space-y-6">
                  {project.techStackSections.map((section, i) => (
                    <div key={i}>
                      <p className="text-xs font-semibold tracking-wider text-text-subtle uppercase mb-2">{section.label}</p>
                      <div className="flex flex-wrap gap-2">
                        {section.items.map((tech) => (
                          <span
                            key={tech}
                            className="px-4 py-2 bg-surface border border-border text-text-subtle rounded-lg text-sm font-medium transition-all duration-200 hover:border-accent/50 hover:text-text hover:shadow-sm"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {project.tech.map((tech) => (
                    <span
                      key={tech}
                      className="px-4 py-2 bg-surface border border-border text-text-subtle rounded-lg text-sm font-medium transition-all duration-200 hover:border-accent/50 hover:text-text hover:shadow-sm"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              )}
            </section>
          </div>
        </article>
      </div>
    </main>
  )
}

