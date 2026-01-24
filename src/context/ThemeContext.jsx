import { createContext, useContext, useSyncExternalStore, useLayoutEffect } from 'react'

const ThemeContext = createContext(null)

function getSnapshot() {
  const saved = localStorage.getItem('theme')
  return saved || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
}

const listeners = new Set()

function subscribe(callback) {
  listeners.add(callback)
  const handler = (e) => {
    if (e.key === 'theme') callback()
  }
  addEventListener('storage', handler)
  return () => {
    listeners.delete(callback)
    removeEventListener('storage', handler)
  }
}

export function ThemeProvider({ children }) {
  const theme = useSyncExternalStore(subscribe, getSnapshot)

  useLayoutEffect(() => {
    document.documentElement.classList.remove('dark', 'light')
    document.documentElement.classList.add(theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    localStorage.setItem('theme', newTheme)
    listeners.forEach(cb => cb())
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === null) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

