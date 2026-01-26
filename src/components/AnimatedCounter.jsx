import { useEffect, useRef, useState } from 'react'
import { useInView, useMotionValue, useSpring } from 'framer-motion'

export function AnimatedCounter({ value }) {
  const ref = useRef(null)
  const [displayValue, setDisplayValue] = useState('0')
  const motionValue = useMotionValue(0)
  const springValue = useSpring(motionValue, {
    damping: 60,
    stiffness: 100,
  })
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  
  // Extract numeric value and suffix (e.g., "3+" -> 3, "+")
  const parseValue = (val) => {
    if (typeof val === 'number') {
      return { num: val, suffix: '' }
    }
    if (typeof val === 'string') {
      const match = val.match(/^(\d+)(.*)$/)
      if (match) {
        return { num: parseInt(match[1], 10), suffix: match[2] }
      }
      return { num: null, suffix: val }
    }
    return { num: null, suffix: String(val) }
  }
  
  const { num, suffix } = parseValue(value)
  
  useEffect(() => {
    if (isInView && num !== null) {
      motionValue.set(0)
      const timer = setTimeout(() => {
        motionValue.set(num)
      }, 100)
      
      return () => clearTimeout(timer)
    }
  }, [motionValue, isInView, num])
  
  useEffect(() => {
    if (num === null) {
      setDisplayValue(suffix)
      return
    }
    
    const unsubscribe = springValue.on('change', (latest) => {
      setDisplayValue(Math.floor(latest).toLocaleString() + suffix)
    })
    
    return () => unsubscribe()
  }, [springValue, num, suffix])
  
  if (num === null) {
    return <span>{value}</span>
  }
  
  return <span ref={ref}>{displayValue}</span>
}
