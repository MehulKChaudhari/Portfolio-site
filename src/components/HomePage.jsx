import { lazy, Suspense } from 'react'
import { Hero } from './Hero'
import { OpenSourceSection } from './OpenSourceSection'
import { WorkExperience } from './WorkExperience'

const ProjectsSection = lazy(() => import('./ProjectsSection').then(m => ({ default: m.ProjectsSection })))
const TalksSection = lazy(() => import('./TalksSection').then(m => ({ default: m.TalksSection })))
const ArticlesSection = lazy(() => import('./BlogsSection').then(m => ({ default: m.ArticlesSection })))

export function HomePage() {
  return (
    <main>
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <Hero />
        
        <div className="space-y-32 lg:space-y-40 py-24 lg:py-32">
          <OpenSourceSection />
          <WorkExperience />
          <Suspense fallback={null}>
            <ProjectsSection />
          </Suspense>
          <Suspense fallback={null}>
            <ArticlesSection />
          </Suspense>
          <Suspense fallback={null}>
            <TalksSection />
          </Suspense>
        </div>
      </div>
    </main>
  )
}

