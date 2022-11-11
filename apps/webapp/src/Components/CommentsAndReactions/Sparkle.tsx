import React from 'react'
import styled, { keyframes } from 'styled-components'

const range = (n) => Array.from(Array(n).keys())

interface Sparkle {
  id: string
  createdAt: number
  size: number
  style: {
    top: number
    left: number
  }
}
const generateSparkle = () => {
  const sparkle = {
    id: String(random(10000, 99999)),
    createdAt: Date.now(),
    size: random(10, 20),
    style: {
      top: random(0, 100) + '%',
      left: random(0, 100) + '%'
    }
  }
  return sparkle
}

const usePrefersReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = React.useState(false)

  React.useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onChange = () => {
      setPrefersReducedMotion(mediaQuery.matches)
    }
    mediaQuery.addListener(onChange)
    setPrefersReducedMotion(mediaQuery.matches)
    return () => mediaQuery.removeListener(onChange)
  }, [])

  return prefersReducedMotion
}

// Utility helper for random number generation
const random = (min, max) => Math.floor(Math.random() * (max - min)) + min

const useRandomInterval = (callback, minDelay, maxDelay, repeat = false) => {
  const timeoutId = React.useRef(null)
  const savedCallback = React.useRef(callback)

  React.useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  React.useEffect(() => {
    const isEnabled = typeof minDelay === 'number' && typeof maxDelay === 'number'
    if (isEnabled) {
      const handleTick = () => {
        const nextTickAt = random(minDelay, maxDelay)
        timeoutId.current = window.setTimeout(() => {
          savedCallback.current()
          if (repeat) handleTick()
        }, nextTickAt)
      }
      handleTick()
    }
    return () => window.clearTimeout(timeoutId.current)
  }, [minDelay, maxDelay, repeat])

  const cancel = React.useCallback(function () {
    window.clearTimeout(timeoutId.current)
  }, [])
  return cancel
}

interface SparklesProps {
  color?: string
  count?: number
  icon?: string // Unicode emoji
  show?: boolean
  repeat?: boolean
  children?: React.ReactNode
}

const Sparkles = ({ children, count = 3, repeat = true, show = true, icon = '🔥' }: SparklesProps) => {
  const [sparkles, setSparkles] = React.useState(() => {
    return range(count).map(() => generateSparkle())
  })
  const prefersReducedMotion = usePrefersReducedMotion()
  useRandomInterval(
    () => {
      const sparkle = generateSparkle()
      const now = Date.now()
      const nextSparkles = sparkles.filter((sp) => {
        const delta = now - sp.createdAt
        return delta < 750
      })
      nextSparkles.push(sparkle)
      setSparkles(nextSparkles)
    },
    prefersReducedMotion ? null : 50,
    prefersReducedMotion ? null : 150,
    repeat
  )
  // mog('sparkles', { show, sparkles })
  return (
    <Wrapper>
      {show &&
        sparkles.map((sparkle) => <Sparkle key={sparkle.id} icon={icon} size={sparkle.size} style={sparkle.style} />)}
      <ChildWrapper>{children}</ChildWrapper>
    </Wrapper>
  )
}

interface SparkleProps {
  icon: string // Unicode Emoji
  size: number
  style: React.CSSProperties
}
const Sparkle = ({ icon, size, style }: SparkleProps) => {
  return (
    <SparkleWrapper style={style}>
      <SparkleSvg style={{ fontSize: `${size}px` }}>{icon}</SparkleSvg>
    </SparkleWrapper>
  )
}
const comeInOut = keyframes`
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1);
  }
  100% {
    transform: scale(0);
  }
`
const Wrapper = styled.span`
  display: inline-block;
  position: relative;
`
const SparkleWrapper = styled.span`
  position: absolute;
  display: block;
  z-index: 10;
  @media (prefers-reduced-motion: no-preference) {
    animation: ${comeInOut} 700ms forwards;
  }
`
const SparkleSvg = styled.div`
  display: block;
  opacity: 0.8;
  @media (prefers-reduced-motion: no-preference) {
  }
`
const ChildWrapper = styled.strong`
  position: relative;
  z-index: 1;
  font-weight: bold;
`
export default Sparkles
