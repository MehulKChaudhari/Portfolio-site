import { resumeData } from '../data/resume'
import { useState } from 'react'

export function WorkExperience() {
  const { work_experience } = resumeData;
  const [hoveredIndex, setHoveredIndex] = useState(null)

  return (
      <section>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          {/* Header */}
          <div className="mb-16">
            <div className="inline-flex items-center gap-2.5 rounded-full border border-border bg-surface/50 backdrop-blur-sm px-4 py-1.5 text-xs text-text-subtle shadow-sm">
              <div className="relative inline-flex h-5 w-5 items-center justify-center">
                <span className="absolute inset-0 rounded-full bg-gradient-to-tr from-sky-500 via-teal-400 to-indigo-500 dark:from-indigo-500 dark:via-sky-500 dark:to-emerald-400 animate-pulse opacity-20" />
                <span className="relative inline-flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-tr from-sky-500 via-teal-400 to-indigo-500 dark:from-indigo-500 dark:via-sky-500 dark:to-emerald-400 text-[0.65rem] font-bold text-white shadow-lg">
                  MC
                </span>
              </div>
              <span>Day-to-day work that shaped my judgment</span>
            </div>
            <h2 className="mt-6 text-4xl sm:text-5xl font-display font-black text-text mb-3">
              <span className="font-calligraphic font-black bg-gradient-to-r from-sky-500 via-teal-400 to-indigo-500 dark:from-sky-400 dark:via-teal-300 dark:to-indigo-400 bg-clip-text text-transparent">
                Experience
              </span>
            </h2>
            <p className="text-base text-text-subtle">Professional journey</p>
          </div>
  
          {/* Timeline */}
          <div className="relative">
            {/* Vertical dotted line */}
            <div className="absolute left-0 top-0 bottom-0 lg:left-8" 
              style={{
                width: '2px',
                borderLeft: '2px dashed rgba(148, 163, 184, 0.4)',
              }}
            />
  
            <div className="space-y-0">
              {work_experience.map((job, index) => {
                const isLast = index === work_experience.length - 1
                const isHovered = hoveredIndex === index
  
                return (
                  <div
                    key={index}
                    className="relative pb-16 last:pb-0"
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    {/* Timeline marker - centered on the line */}
                    <div className="absolute left-0 top-8 -translate-x-1/2 lg:left-8 lg:-translate-x-1/2 z-10">
                      <div className="relative flex items-center justify-center">
                        {/* Outer glow ring */}
                        <div className="absolute h-5 w-5 rounded-full bg-sky-500/15 dark:bg-indigo-500/15" />
                        {/* Main marker - solid with border */}
                        <div className="relative h-3.5 w-3.5 rounded-full bg-sky-500 dark:bg-indigo-500 border-2 border-bg shadow-md transition-all duration-300 hover:scale-110 hover:bg-sky-400 dark:hover:bg-indigo-400" />
                      </div>
                    </div>
  
  
                    {/* Content card */}
                    <div className="pl-8 lg:pl-20">
                      <div className={`group relative bg-surface border rounded-2xl shadow-sm transition-all duration-500 ${
                        isHovered 
                          ? 'border-sky-500/40 dark:border-indigo-500/40 shadow-lg shadow-sky-500/10 dark:shadow-indigo-500/10 -translate-y-1' 
                          : 'border-border hover:border-border/80'
                      }`}>
                        {/* Gradient overlay on hover */}
                        <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br from-sky-500/5 via-teal-400/5 to-indigo-500/5 dark:from-indigo-500/5 dark:via-sky-500/5 dark:to-emerald-400/5 opacity-0 transition-opacity duration-500 ${isHovered ? 'opacity-100' : ''}`} />
                        
                        <div className="relative px-6 py-6 lg:px-8 lg:py-7">
                          {/* Header */}
                          <div className="mb-6 pb-6 border-b border-border/60 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                            <div className="flex-1">
                              <div className="flex items-start gap-3 mb-2">
                                <h3 className="text-2xl sm:text-3xl font-bold text-text leading-tight">
                                  {job.company || job.title}
                                </h3>
                                {job.location && (
                                  <span className="mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-sky-500/10 dark:bg-indigo-500/10 text-xs font-medium text-sky-600 dark:text-indigo-400">
                                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                    {job.location}
                                  </span>
                                )}
                              </div>
            {job.company && (
                                <p className="text-lg font-medium text-text-muted">{job.title}</p>
            )}
                            </div>
            {job.duration && (
                              <div className="flex items-center gap-2 text-sm text-text-subtle uppercase tracking-wider font-bold whitespace-nowrap">
                                <svg className="w-4 h-4 text-sky-500 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="bg-gradient-to-r from-sky-600 via-teal-600 to-indigo-600 dark:from-indigo-400 dark:via-sky-400 dark:to-emerald-400 bg-clip-text text-transparent">
                                  {job.duration}
                                </span>
                              </div>
                            )}
                          </div>
  
                          {/* Points */}
                          <ul className="space-y-4 mb-6">
              {job.points.map((point, i) => (
                              <li key={i} className="flex items-start gap-3.5 group/item">
                                <span className="mt-2.5 flex-shrink-0 transition-colors duration-300">
                                  <svg className="w-1.5 h-1.5 text-sky-500 dark:text-indigo-400 group-hover/item:text-teal-500 dark:group-hover/item:text-sky-400 transition-colors" fill="currentColor" viewBox="0 0 8 8">
                      <circle cx="4" cy="4" r="3" />
                    </svg>
                  </span>
                                <span className="text-text-muted leading-relaxed text-[15px] group-hover/item:text-text transition-colors duration-200">
                                  {point}
                                </span>
                </li>
              ))}
            </ul>

                          {/* Tech Stack / Skills */}
                          {job.tech_stack && job.tech_stack.length > 0 && (
                            <div className="pt-6 border-t border-border/60">
                              <div className="flex items-center gap-2 mb-3">
                                <svg className="w-4 h-4 text-text-subtle" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                                </svg>
                                <span className="text-xs font-semibold tracking-wider uppercase text-text-subtle">Tech Stack & Systems</span>
                              </div>
                              <div className="flex flex-wrap gap-2">
                                {job.tech_stack.map((tech, i) => (
                                  <span
                                    key={i}
                                    className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-medium bg-surface border border-border/60 text-text-muted hover:border-sky-500/40 dark:hover:border-indigo-500/40 hover:text-text transition-all duration-200"
                                  >
                                    {tech}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
  
                        {/* Bottom accent line */}
                        <div className={`h-1 rounded-b-2xl bg-gradient-to-r from-sky-500/20 via-teal-400/20 to-indigo-500/20 dark:from-indigo-500/20 dark:via-sky-500/20 dark:to-emerald-400/20 transition-all duration-500 ${isHovered ? 'opacity-100 from-sky-500/60 via-teal-400/60 to-indigo-500/60 dark:from-indigo-500/60 dark:via-sky-500/60 dark:to-emerald-400/60' : 'opacity-0'}`} />
                      </div>
                    </div>
  
                  </div>
                )
              })}
            </div>
  
            {/* Bottom fade */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-bg to-transparent pointer-events-none" />
          </div>
      </div>
    </section>
  )
} 

