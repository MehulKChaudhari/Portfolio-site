import { useRef, useEffect, useState } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { resumeData } from '../data/resume'
import { FaGithub, FaTwitter, FaLinkedin } from 'react-icons/fa'
import { AvatarWaveAnimation } from './AvatarWaveAnimation'

export function Hero() {
  const heroRef = useRef(null)
  const avatarRef = useRef(null)
  const [navbarPosition, setNavbarPosition] = useState({ x: 0, y: 0, size: 36 })
  
  useEffect(() => {
    const updateNavbarPosition = () => {
      const navbarAvatar = document.querySelector('[data-navbar-avatar]')
      if (navbarAvatar && avatarRef.current) {
        const navbarRect = navbarAvatar.getBoundingClientRect()
        const heroRect = avatarRef.current.getBoundingClientRect()
        
        setNavbarPosition({
          x: navbarRect.left - heroRect.left,
          y: navbarRect.top - heroRect.top,
          size: navbarRect.width,
        })
      }
    }
    
    updateNavbarPosition()
    window.addEventListener('resize', updateNavbarPosition)
    window.addEventListener('scroll', updateNavbarPosition)
    
    return () => {
      window.removeEventListener('resize', updateNavbarPosition)
      window.removeEventListener('scroll', updateNavbarPosition)
    }
  }, [])
  
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ['start start', 'end start'],
  })

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 35,
    restDelta: 0.001,
  })
  
  const clampedProgress = useTransform(smoothProgress, (value) => Math.min(value * 1.2, 1))

  const heroSizeRef = useRef(96)
  useEffect(() => {
    if (avatarRef.current) {
      heroSizeRef.current = avatarRef.current.offsetWidth
    }
  }, [])
  
  const scale = useTransform(
    clampedProgress,
    [0, 1],
    [1, navbarPosition.size > 0 && heroSizeRef.current > 0 ? navbarPosition.size / heroSizeRef.current : 0.375]
  )
  
  const x = useTransform(clampedProgress, [0, 1], [0, navbarPosition.x])
  const y = useTransform(clampedProgress, [0, 1], [0, navbarPosition.y])
  const opacity = useTransform(clampedProgress, [0, 0.8, 1], [1, 0.99, 0.97])
  const zIndex = useTransform(clampedProgress, [0, 0.2, 1], [10, 50, 1000])

  const socialLinks = {
    github: resumeData.contact.github,
    x: resumeData.contact.x,
    linkedin: resumeData.contact.linkedin,
  }

  return (
    <section ref={heroRef} className="min-h-[85vh] flex items-center py-16" aria-label="Hero section">
      <div className="w-full grid lg:grid-cols-2 gap-16 lg:gap-20 items-center">
        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
            <motion.div
              ref={avatarRef}
              className="relative inline-flex h-20 w-20 sm:h-24 sm:w-24 avatar-shell"
              style={{
                scale,
                x,
                y,
                opacity,
                zIndex,
                position: 'relative',
              }}
            >
              <div className="relative h-full w-full rounded-full overflow-hidden bg-[#12333a] shadow-md z-10" style={{ aspectRatio: '1 / 1' }}>
                <img
                  src="/assets/portfolio-site-image.jpeg"
                  alt={`${resumeData.name} - Software Engineer`}
                  className="h-full w-full object-cover"
                  style={{ aspectRatio: '1 / 1', borderRadius: '50%' }}
                  width="96"
                  height="96"
                  loading="eager"
                  fetchpriority="high"
                  decoding="sync"
                />
                <div className="pointer-events-none absolute inset-0">
                  <div className="absolute -left-1 -right-1 h-[130%] bg-white/10 rotate-[18deg]" />
                </div>
              </div>
              <AvatarWaveAnimation gradientIdPrefix="hero-wave" />
            </motion.div>
            <p className="text-xs font-medium tracking-[0.18em] uppercase text-text-subtle">
              Software engineer • Full stack • Open source • Business-aware
            </p>
          </div>

          <div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-light tracking-tight text-text mb-4 leading-tight">
              <span className="block">Building systems</span>
              <span className="block">
                that{' '}
                <span className="font-calligraphic text-5xl sm:text-6xl lg:text-7xl bg-gradient-to-r from-sky-600 via-teal-500 to-indigo-600 dark:from-sky-400 dark:via-teal-300 dark:to-indigo-400 bg-clip-text text-transparent drop-shadow-sm">
                  age well
                </span>
                .
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-text-muted font-light leading-relaxed max-w-xl">
              <span className="text-text-subtle/80">I am</span>{' '}
              <span className="font-medium text-text transition-all duration-300 hover:bg-gradient-to-r hover:from-sky-600 hover:via-teal-500 hover:to-indigo-600 hover:dark:from-sky-400 hover:dark:via-teal-300 hover:dark:to-indigo-400 hover:bg-clip-text hover:text-transparent cursor-default">
                {resumeData.name}
              </span>
              , and I work at the intersection of frontend, backend, and product. 
              I design APIs, shape UX, and make trade-offs that keep systems stable, maintainable, and aligned 
              with how businesses actually make money.
            </p>
          </div>

          <div className="flex items-center gap-6 pt-2">
            <a
              href={socialLinks.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-subtle hover:text-text transition-colors"
              aria-label="GitHub"
            >
              <FaGithub className="w-6 h-6" />
            </a>
            <a
              href={socialLinks.x}
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-subtle hover:text-text transition-colors"
              aria-label="X (Twitter)"
            >
              <FaTwitter className="w-6 h-6" />
            </a>
            <a
              href={socialLinks.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-subtle hover:text-text transition-colors"
              aria-label="LinkedIn"
            >
              <FaLinkedin className="w-6 h-6" />
            </a>
          </div>
        </div>

        <div className="w-full">
          <div className="w-full rounded-2xl border border-border bg-surface shadow-sm p-8 lg:p-10 flex flex-col gap-8 lg:gap-10 min-h-[460px] lg:min-h-[520px]">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400/70 dark:bg-emerald-400 opacity-75 animate-ping" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500 dark:bg-emerald-400" />
                </span>
                <p className="text-xs font-semibold tracking-[0.18em] uppercase text-text-subtle">
                  Currently
                </p>
              </div>
              <div>
                <p className="text-sm text-text-subtle mb-2">SDE · YUDEK</p>
                <p className="text-base lg:text-lg text-text-muted leading-relaxed">
                  Owning end to end features in a browser-first knowledge system — shipping from frontend interfaces to backend services and data models.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-xs font-semibold tracking-[0.18em] uppercase text-text-subtle">
                I care about
              </p>
              <ul className="space-y-3 text-sm lg:text-base text-text-muted leading-relaxed">
                <li>• Interfaces that feel obvious on first use, not just demo-ready.</li>
                <li>• Systems that can be debugged at 3am without guessing.</li>
                <li>• Shipping work that moves business metrics, not just tickets.</li>
              </ul>
            </div>

            <div className="flex flex-wrap gap-2 pt-6 border-t border-border text-xs text-text-subtle mt-auto">
              <span className="rounded-full border border-border px-3 py-1.5">
                Full‑stack JS/TS
              </span>
              <span className="rounded-full border border-border px-3 py-1.5">
                System design
              </span>
              <span className="rounded-full border border-border px-3 py-1.5">
                DX & docs
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

