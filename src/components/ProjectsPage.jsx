import { ProjectCard } from './ProjectCard'
import { projectsData } from '../data/projects'

export function ProjectsPage() {
  return (
    <main className="min-h-screen py-24">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="mb-16">
          <h1 className="text-4xl sm:text-5xl font-display font-light text-text mb-2">
            <span className="font-calligraphic font-bold bg-gradient-to-r from-sky-600 via-teal-500 to-indigo-600 dark:from-sky-400 dark:via-teal-300 dark:to-indigo-400 bg-clip-text text-transparent">
              Projects
            </span>
          </h1>
          <p className="text-sm text-text-subtle">
            Engineering work and systems I've built
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {projectsData.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </main>
  )
}
