import { useEffect, useState } from 'react'

export const useWindowDimensions = () => {
  const [windowDimensions, setWindowDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  })

  const [isMobile, setIsMobile] = useState(window.innerWidth < 800)

  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight
      })
      setIsMobile(window.innerWidth < 800)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return { windowDimensions, isMobile }
}
