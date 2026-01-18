import { StatsBar } from './StatsBar'
import { resumeData } from '../data/resume'
import { FaGithub, FaTwitter, FaLinkedin } from 'react-icons/fa'

export function Footer() {
  const socialLinks = {
    github: resumeData.contact.github,
    x: resumeData.contact.x,
    linkedin: resumeData.contact.linkedin,
  }

  return (
    <footer className="mt-24">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 py-16">
        <StatsBar />
        
        <div className="mt-8 flex flex-col items-center gap-4">
          <div className="flex items-center gap-6">
            <a
              href={socialLinks.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-muted hover:text-text transition-colors"
              aria-label="GitHub"
            >
              <FaGithub className="w-5 h-5" />
            </a>
            <a
              href={socialLinks.x}
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-muted hover:text-text transition-colors"
              aria-label="X (Twitter)"
            >
              <FaTwitter className="w-5 h-5" />
            </a>
            <a
              href={socialLinks.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-muted hover:text-text transition-colors"
              aria-label="LinkedIn"
            >
              <FaLinkedin className="w-5 h-5" />
            </a>
          </div>
          
          <p className="text-sm text-text-muted">
            Made by{' '}
            <a 
              href="https://github.com/MehulKChaudhari" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-text font-medium hover:bg-gradient-to-r hover:from-sky-500 hover:via-teal-400 hover:to-indigo-500 hover:bg-clip-text hover:text-transparent transition-all"
            >
              MehulKC
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}

