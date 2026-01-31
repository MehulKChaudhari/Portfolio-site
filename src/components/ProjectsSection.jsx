import { Link } from 'react-router-dom'
import { ProjectCard } from './ProjectCard'
import { curatedProjects } from '../data/projects'

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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
        {curatedProjects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </section>
  )
}
