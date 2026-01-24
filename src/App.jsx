import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import { Navbar } from './components/Navbar'
import { HomePage } from './components/HomePage'
import { Footer } from './components/Footer'
import { GithubProvider } from './context/GithubContext'
import { ThemeProvider } from './context/ThemeContext'
import './App.css'

const ProjectsPage = lazy(() => import('./components/ProjectsPage').then(m => ({ default: m.ProjectsPage })))
const ProjectDetailPage = lazy(() => import('./components/ProjectDetailPage').then(m => ({ default: m.ProjectDetailPage })))
const TalksPage = lazy(() => import('./components/TalksPage').then(m => ({ default: m.TalksPage })))
const OpenSourcePage = lazy(() => import('./components/OpenSourcePage').then(m => ({ default: m.OpenSourcePage })))
const ArticlesListPage = lazy(() => import('./components/BlogsListPage').then(m => ({ default: m.ArticlesListPage })))
const ArticlePage = lazy(() => import('./components/BlogPage').then(m => ({ default: m.ArticlePage })))

const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-text-muted">Loading...</div>
  </div>
)

function App() {
  return (
    <Router>
      <ThemeProvider>
        <GithubProvider>
          <div className="min-h-screen bg-bg text-text transition-colors flex flex-col">
            <Navbar />
            <div className="flex-1">
              <Suspense fallback={<LoadingFallback />}>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/projects" element={<ProjectsPage />} />
                  <Route path="/projects/:slug" element={<ProjectDetailPage />} />
                  <Route path="/open-source" element={<OpenSourcePage />} />
                  <Route path="/talks" element={<TalksPage />} />
                  <Route path="/articles" element={<ArticlesListPage />} />
                  <Route path="/articles/:slug" element={<ArticlePage />} />
                </Routes>
              </Suspense>
            </div>
            <Footer />
          </div>
        </GithubProvider>
      </ThemeProvider>
    </Router>
  )
}

export default App
