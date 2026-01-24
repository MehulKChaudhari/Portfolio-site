import { Link } from 'react-router-dom'
import { curatedArticles } from '../data/articles'

export function ArticlesSection() {
  return (
    <section>
      <div className="flex items-end justify-between mb-12">
        <div>
          <h2 className="text-3xl sm:text-4xl font-display font-light text-text mb-2">
            <span className="font-calligraphic font-bold bg-gradient-to-r from-sky-500 via-teal-400 to-indigo-500 dark:from-sky-400 dark:via-teal-300 dark:to-indigo-400 bg-clip-text text-transparent">
              Articles
            </span>
          </h2>
          <p className="text-sm text-text-subtle">Technical insights and learnings</p>
        </div>
        <Link 
          to="/articles"
          className="link text-sm hover:text-accent-hover transition-colors flex items-center gap-1 font-medium"
        >
          View all
          <span>→</span>
        </Link>
      </div>

      {curatedArticles.length === 0 ? (
        <div className="text-center py-12 text-text-muted">
          <p>No articles yet. Check back soon!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {curatedArticles.map((article, index) => (
            <Link
              key={article.id}
              to={`/articles/${article.slug}`}
              className="group bg-surface/95 border border-border/80 rounded-2xl overflow-hidden transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-accent/60 hover:shadow-lg"
            >
              {article.image && (
                <div className="aspect-video w-full overflow-hidden bg-surface">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading={index < 3 ? "eager" : "lazy"}
                    fetchpriority={index < 3 ? "high" : "low"}
                    decoding="async"
                    width="640"
                    height="360"
                  />
                </div>
              )}
              <div className="p-5">
                <p className="text-xs text-text-subtle mb-1.5">
                  {new Date(article.date).toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>
                <h3 className="text-base font-semibold text-text mb-2 group-hover:text-accent transition-colors line-clamp-2">
                  {article.title}
                </h3>
                <p className="text-sm text-text-muted leading-snug mb-3 line-clamp-2">
                  {article.description}
                </p>
                {article.tags && article.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {article.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-2 py-0.5 bg-surface border border-border/50 text-text-subtle rounded-md hover:border-accent/50 hover:text-accent transition-colors"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  )
}

