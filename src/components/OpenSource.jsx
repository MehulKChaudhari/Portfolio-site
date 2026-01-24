import { motion, useMotionTemplate, useMotionValue } from 'framer-motion'
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa'
import { GitMergeIcon, GitPullRequestIcon } from '@primer/octicons-react'
import { SectionHeading } from './SectionHeading'
import { useGithub } from '../context/GithubContext'
import { useCallback } from 'react'

export function OpenSource() {
  const { contributions: prs, isLoading: loading, error } = useGithub()

  const Card = ({ pr, index }) => {
    const mouseX = useMotionValue(0)
    const mouseY = useMotionValue(0)
    const rotateX = useMotionValue(0)
    const rotateY = useMotionValue(0)

    const handleMouseMove = useCallback((e) => {
      const rect = e.currentTarget.getBoundingClientRect()
      const width = rect.width
      const height = rect.height
      const mouseXFromCenter = e.clientX - rect.left - width / 2
      const mouseYFromCenter = e.clientY - rect.top - height / 2
      const rotateXAmount = (mouseYFromCenter / height) * 10
      const rotateYAmount = (mouseXFromCenter / width) * -10

      mouseX.set(mouseXFromCenter)
      mouseY.set(mouseYFromCenter)
      rotateX.set(rotateXAmount)
      rotateY.set(rotateYAmount)
    }, [mouseX, mouseY, rotateX, rotateY])

    const handleMouseLeave = useCallback(() => {
      mouseX.set(0)
      mouseY.set(0)
      rotateX.set(0)
      rotateY.set(0)
    }, [mouseX, mouseY, rotateX, rotateY])

    const transform = useMotionTemplate`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`

    return (
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ 
          y: 0, 
          opacity: 1,
          transition: {
            delay: index * 0.1,
            duration: 0.5,
            ease: [0.48, 0.15, 0.25, 0.96]
          }
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ transform }}
        className="group relative bg-[#1a1a24]/80 rounded-xl p-6 backdrop-blur-md border border-[#fce7fa]/10 transition-all duration-200"
      >
        <motion.div
          style={{
            background: useMotionTemplate`
              radial-gradient(
                circle at ${mouseX}px ${mouseY}px,
                rgba(252, 231, 250, 0.1) 0%,
                rgba(252, 231, 250, 0) 50%
              )
            `,
          }}
          className="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition duration-300 group-hover:opacity-100"
        />

        <div className="relative">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center">
              <FaGithub className="w-5 h-5 text-[#fce7fa] opacity-70 group-hover:opacity-100 transition-opacity" />
              <span className="ml-2 text-sm text-[#fce7fa] opacity-70 group-hover:opacity-100 transition-opacity">{pr.repo}</span>
            </div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              className={`flex items-center px-3 py-1 rounded-full text-xs ${
                pr.status === 'merged' 
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/20'
                  : pr.status === 'draft'
                  ? 'bg-gray-500/20 text-gray-300 border border-gray-500/20'
                  : 'bg-green-500/20 text-green-300 border border-green-500/20'
              }`}
            >
              {pr.status === 'merged' ? (
                <GitMergeIcon className="mr-1" size={14} />
              ) : (
                <GitPullRequestIcon className="mr-1" size={14} />
              )}
              {pr.status}
            </motion.div>
          </div>

          <h3 className="text-lg font-medium text-[#fce7fa] mb-2 line-clamp-2">{pr.title}</h3>
          {pr.description && (
            <p className="text-sm text-[#e4e4e7] mb-4 line-clamp-3 opacity-80">
              {pr.description}
            </p>
          )}

          <div className="mt-auto flex items-center justify-between">
            <span className="text-xs text-[#fce7fa]/50">
              {new Date(pr.mergedAt || pr.updatedAt).toLocaleDateString()}
            </span>
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href={pr.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-[#fce7fa]/70 hover:text-[#fce7fa] transition-colors group"
            >
              <span className="text-sm mr-1 relative">
                View PR
                <span className="absolute inset-x-0 -bottom-0.5 h-px bg-gradient-to-r from-[#fce7fa]/0 via-[#fce7fa]/50 to-[#fce7fa]/0 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />
              </span>
              <FaExternalLinkAlt className="w-3 h-3" />
            </motion.a>
          </div>
        </div>
      </motion.div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen py-16 px-4 sm:px-8 lg:px-16">
        <SectionHeading title="Open Source Contributions" />
        <div className="mt-12 text-center text-[#fce7fa]">
          Error loading contributions: {error}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-16 px-4 sm:px-8 lg:px-16">
      <SectionHeading title="Open Source Contributions" />
      
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full text-center py-12 text-text-muted">
            Loading...
          </div>
        ) : (
          prs
            .sort((a, b) => {
              const dateA = new Date(a.mergedAt || a.updatedAt || a.createdAt)
              const dateB = new Date(b.mergedAt || b.updatedAt || b.createdAt)
              return dateB - dateA
            })
            .map((pr, index) => (
              <Card key={pr.id} pr={pr} index={index} />
            ))
        )}
      </div>
    </div>
  )
} 