import { useParams, Link, useLocation } from 'react-router-dom'
import { FaArrowLeft } from 'react-icons/fa'
import { useState, useEffect, useRef, useMemo } from 'react'
import { articlesData } from '../data/articles'
import { getMermaidConfig, READING_TIME_WPM, SCROLL_BEHAVIOR } from '../utils/constants'
import { useTheme } from '../context/ThemeContext'

let ReactMarkdown = null
let remarkGfm = null
let rehypeHighlight = null
let rehypeRaw = null
let mermaid = null

const loadMarkdown = async () => {
  if (!ReactMarkdown) {
    const [rm, rgfm, rh, rr] = await Promise.all([
      import('react-markdown'),
      import('remark-gfm'),
      import('rehype-highlight'),
      import('rehype-raw')
    ])
    ReactMarkdown = rm.default
    remarkGfm = rgfm.default
    rehypeHighlight = rh.default
    rehypeRaw = rr.default
  }
  return { ReactMarkdown, remarkGfm, rehypeHighlight, rehypeRaw }
}

const loadMermaid = async () => {
  if (!mermaid) {
    mermaid = (await import('mermaid')).default
  }
  return mermaid
}

const generateHeadingId = (text) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-')

export function ArticlePage() {
  const { slug } = useParams()
  const location = useLocation()
  const { theme } = useTheme()
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [markdownLoaded, setMarkdownLoaded] = useState(false)
  const [markdownComponents, setMarkdownComponents] = useState(null)
  const article = articlesData.find(a => a.slug === slug)
  const mermaidRef = useRef(null)
  const hasMermaidRef = useRef(false)

  // Scroll to top when component mounts or slug changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [slug])

  const headings = useMemo(() => {
    if (!content) return []
    const headingRegex = /^##+\s+(.+)$/gm
    const matches = []
    let match
    while ((match = headingRegex.exec(content)) !== null) {
      const level = match[0].match(/^#+/)[0].length
      const text = match[1].trim()
      const id = generateHeadingId(text)
      const displayText = text.replace(/^\d+\)\s*/, '')
      matches.push({ level, text, id, displayText })
    }
    return matches
  }, [content])

  useEffect(() => {
    const scrollToHash = () => {
      const hash = location.hash.slice(1)
      if (hash) {
        const element = document.getElementById(hash)
        if (element) {
          requestAnimationFrame(() => {
            element.scrollIntoView(SCROLL_BEHAVIOR)
          })
        }
      }
    }

    scrollToHash()
    window.addEventListener('hashchange', scrollToHash)
    return () => window.removeEventListener('hashchange', scrollToHash)
  }, [location.hash, headings])

  const readingTime = content ? Math.max(1, Math.ceil(content.split(/\s+/).filter(word => word.length > 0).length / READING_TIME_WPM)) : 0

  useEffect(() => {
    if (!article) {
      setError('Article not found')
      setLoading(false)
      return
    }

    Promise.all([
      fetch(article.contentPath).then(res => {
        if (!res.ok) throw new Error('Failed to load article content')
        return res.text()
      }),
      loadMarkdown()
    ])
      .then(([text, components]) => {
        setContent(text)
        setMarkdownComponents(components)
        setMarkdownLoaded(true)
        hasMermaidRef.current = text.includes('```mermaid')
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [article])

  useEffect(() => {
    if (content && hasMermaidRef.current && mermaidRef.current) {
      loadMermaid().then(m => {
        m.initialize(getMermaidConfig(theme))
        m.contentLoaded()
      })
    }
  }, [content, theme])

  if (!article) {
    return (
      <main className="min-h-screen py-24">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-text mb-4">Article not found</h1>
            <Link to="/articles" className="link">← Back to articles</Link>
          </div>
        </div>
      </main>
    )
  }

  if (loading) {
    return (
      <main className="min-h-screen py-24">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center text-text-muted">Loading...</div>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="min-h-screen py-24">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center">
            <p className="text-text-muted mb-4">Error: {error}</p>
            <Link to="/articles" className="link">← Back to articles</Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <Link 
          to="/articles" 
          className="group inline-flex items-center gap-2 px-4 py-2 rounded-lg mb-12 transition-all duration-200 border border-border/50 hover:border-accent/50 bg-surface/50 hover:bg-surface"
        >
          <FaArrowLeft className="w-3.5 h-3.5 transition-all duration-200 group-hover:-translate-x-1 text-text-subtle group-hover:text-accent" />
          <span className="text-sm font-medium text-text-subtle group-hover:bg-gradient-to-r group-hover:from-sky-500 group-hover:via-teal-400 group-hover:to-indigo-500 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-200">
            Back to articles
          </span>
        </Link>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          <article className="flex-1 max-w-4xl">
            <header className="mb-8 -mx-6 sm:-mx-8 lg:-mx-0 px-6 sm:px-8 lg:px-0">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-display font-light text-text mb-4 leading-tight tracking-tight max-w-6xl transition-all duration-300 hover:bg-gradient-to-r hover:from-sky-500 hover:via-teal-400 hover:to-indigo-500 hover:dark:from-sky-400 hover:dark:via-teal-300 hover:dark:to-indigo-400 hover:bg-clip-text hover:text-transparent cursor-default">
                {article.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-text-subtle mb-6">
                <time dateTime={article.date} className="flex items-center gap-1.5">
                  <span>{new Date(article.date).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}</span>
                  {content && (
                    <>
                      <span className="text-text-subtle/50">•</span>
                      <span className="text-text-subtle/70">
                        {readingTime} min read
                      </span>
                    </>
                  )}
                </time>
              </div>
              {article.tags && article.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-8 lg:hidden">
                  {article.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-sm px-3 py-1.5 bg-surface border border-border/50 text-text-subtle rounded-md hover:border-accent/50 hover:text-accent transition-colors font-medium"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </header>

            {article.image && article.showCoverImage !== false && (
              <div className="mb-12 -mx-6 sm:-mx-8 lg:-mx-0 overflow-hidden aspect-video sm:aspect-[21/9] bg-surface rounded-2xl shadow-lg">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover"
                  loading="eager"
                  fetchpriority="high"
                  decoding="async"
                  width="1200"
                  height="675"
                />
              </div>
            )}

            {!markdownLoaded ? (
              <div className="text-center py-12 text-text-subtle">Loading...</div>
            ) : markdownComponents ? (
                  <div className="prose prose-lg max-w-none mt-12" ref={mermaidRef}>
                    <markdownComponents.ReactMarkdown
                      remarkPlugins={[markdownComponents.remarkGfm]}
                      rehypePlugins={[markdownComponents.rehypeRaw, markdownComponents.rehypeHighlight]}
                      components={{
                        img(props) {
                          return (
                            <div className="my-8 flex justify-center">
                              <img
                                {...props}
                                className="max-w-full rounded-lg shadow-lg"
                                style={{ maxWidth: '700px' }}
                                loading="lazy"
                                decoding="async"
                                width="700"
                                height="400"
                              />
                            </div>
                          )
                        },
                pre({ children, ...props }) {
                  return (
                    <pre className="border rounded-lg p-5 overflow-x-auto my-6" {...props}>
                      {children}
                    </pre>
                  )
                },
                code({ inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '')
                  const isMermaid = match && match[1] === 'mermaid'
                  
                  if (!inline && isMermaid) {
                    return (
                      <div className="mermaid my-8">
                        {String(children).replace(/\n$/, '')}
                      </div>
                    )
                  }
                  
                  if (inline) {
                    return (
                      <code className="bg-surface/50 px-1.5 py-0.5 rounded text-sm font-mono" {...props}>
                        {children}
                      </code>
                    )
                  }
                  
                  return (
                    <code className={`${className || ''} font-mono`} {...props}>
                      {children}
                    </code>
                  )
                },
                h2({ children, ...props }) {
                  const text = String(children).replace(/\n$/, '')
                  const id = generateHeadingId(text)
                  return (
                    <h2
                      id={id}
                      {...props}
                      className="text-3xl font-semibold text-text mt-20 mb-8 first:mt-0 scroll-mt-24 pt-2 border-t border-border/50 first:border-t-0 first:pt-0 [h1+&]:border-t-0 [h1+&]:pt-0"
                    >
                      {children}
                    </h2>
                  )
                },
                h1({ children, ...props }) {
                  const text = String(children).replace(/\n$/, '')
                  const id = generateHeadingId(text)
                  return (
                    <h1
                      id={id}
                      {...props}
                      className="text-4xl font-semibold text-text mt-20 mb-8 first:mt-0 scroll-mt-24"
                    >
                      {children}
                    </h1>
                  )
                },
                h3({ children, ...props }) {
                  const text = String(children).replace(/\n$/, '')
                  const id = generateHeadingId(text)
                  return (
                    <h3
                      id={id}
                      {...props}
                      className="text-2xl font-semibold text-text mt-14 mb-5 scroll-mt-24"
                    >
                      {children}
                    </h3>
                  )
                },
                p(props) {
                  return (
                    <p
                      {...props}
                      className="text-lg leading-relaxed text-text-muted mb-6 first:mt-0"
                    />
                  )
                },
                ul(props) {
                  return (
                    <ul
                      {...props}
                      className="list-disc pl-6 space-y-2 mb-6 text-text-muted"
                    />
                  )
                },
                ol(props) {
                  return (
                    <ol
                      {...props}
                      className="list-decimal pl-6 space-y-2 mb-6 text-text-muted"
                    />
                  )
                },
                li(props) {
                  return (
                    <li
                      {...props}
                      className="text-lg leading-relaxed"
                    />
                  )
                },
                strong(props) {
                  return (
                    <strong
                      {...props}
                      className="font-semibold text-text"
                    />
                  )
                },
                div({ className, children, ...props }) {
                  if (className === 'note') {
                    return (
                      <div className="note" {...props}>
                        {children}
                      </div>
                    )
                  }
                  return <div className={className} {...props}>{children}</div>
                }
                  }}
                >
                  {content}
                </markdownComponents.ReactMarkdown>
              </div>
            ) : null}
          </article>

          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24 space-y-8">
              {headings.length > 0 && (
                <div className="bg-surface/50 border border-border/50 rounded-lg p-5">
                  <h3 className="text-xs font-semibold text-text-subtle mb-4 uppercase tracking-wider">
                    On this page
                  </h3>
                  <nav className="space-y-0.5">
                    {headings.map((heading, index) => {
                      const isActive = location.hash.slice(1) === heading.id
                      return (
                        <a
                          key={index}
                          href={`#${heading.id}`}
                          className={`block text-sm transition-all duration-200 py-1.5 ${
                            heading.level === 2 ? 'pl-0 font-medium' : 'pl-4 text-xs'
                          } ${
                            isActive
                              ? 'bg-gradient-to-r from-sky-500 via-teal-400 to-indigo-500 bg-clip-text text-transparent'
                              : 'text-text-subtle hover:text-text'
                          } ${
                            heading.level === 3 && !isActive ? 'text-text-subtle/70' : ''
                          }`}
                          onClick={(e) => {
                            e.preventDefault()
                            window.location.hash = heading.id
                            const element = document.getElementById(heading.id)
                            if (element) {
                              element.scrollIntoView(SCROLL_BEHAVIOR)
                            }
                          }}
                        >
                          {heading.displayText || heading.text}
                        </a>
                      )
                    })}
                  </nav>
                </div>
              )}

              {article.tags && article.tags.length > 0 && (
                <div>
                  <h3 className="text-xs font-semibold mb-4 uppercase tracking-wider bg-gradient-to-r from-sky-500 via-teal-400 to-indigo-500 dark:from-sky-400 dark:via-teal-300 dark:to-indigo-400 bg-clip-text text-transparent">
                    Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {article.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-2.5 py-1 bg-surface/80 border border-border/50 text-text-subtle rounded-md hover:border-accent/50 hover:text-accent transition-all duration-200 font-medium"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}

