import { useState, useEffect } from 'react'

const transformPRData = (pr) => {
  let status = 'open'
  if (pr.merged) {
    status = 'merged'
  } else if (pr.draft) {
    status = 'draft'
  } else if (pr.state === 'open') {
    status = 'open'
  } else {
    status = pr.state
  }
  
  return {
    id: pr.id,
    title: pr.title,
    repo: pr.repository_full_name,
    repoOwner: pr.repository_owner?.toLowerCase() || '',
    status,
    description: pr.description || '',
    url: pr.html_url,
    createdAt: pr.created_at,
    mergedAt: pr.merged_at,
    updatedAt: pr.updated_at,
    additions: pr.additions || 0,
    deletions: pr.deletions || 0,
    changedFiles: pr.changed_files || 0,
    commits: pr.commits || 0,
    comments: pr.comments || 0,
    labels: pr.labels || [],
    featured: pr.featured || false,
    featured_order: pr.featured_order
  }
}

export const useGithubPRs = () => {
  const [state, setState] = useState({
    contributions: [],
    isLoading: true,
    error: null
  })

  useEffect(() => {
    let mounted = true
    let retryCount = 0
    const maxRetries = 3

    const loadPRs = async (retry = 0) => {
      try {
        const url = '/data/github-prs.json'
        const response = await fetch(url, {
          headers: {
            'Accept': 'application/json',
          },
          cache: retry > 0 ? 'no-cache' : 'default'
        })
        
        if (!response.ok) {
          if (response.status === 404 && retry < maxRetries) {
            setTimeout(() => loadPRs(retry + 1), 1000 * (retry + 1))
            return
          }
          throw new Error(`Failed to load PR data: ${response.status} ${response.statusText}`)
        }
        
        const data = await response.json()

        if (!mounted) return

        if (!Array.isArray(data)) {
          throw new Error('Invalid data format: expected array')
        }

        const transformedData = data.map(transformPRData)

        setState({
          contributions: transformedData,
          isLoading: false,
          error: null
        })
      } catch (error) {
        if (!mounted) return
        
        if (retry < maxRetries && error.message.includes('Failed to fetch')) {
          setTimeout(() => loadPRs(retry + 1), 1000 * (retry + 1))
          return
        }
        
        console.error('Error loading GitHub PRs:', error)
        setState(prev => ({
          ...prev,
          error: error.message,
          isLoading: false
        }))
      }
    }

    loadPRs()
    return () => { mounted = false }
  }, [])

  return state
}
