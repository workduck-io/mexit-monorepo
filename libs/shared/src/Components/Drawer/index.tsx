import React, { useEffect, useRef } from 'react'
import { useSpring } from 'react-spring'

import { useLayoutStore } from '@mexit/core'

import { DrawerContainer } from './styled'

interface DrawerProps {
  show: boolean
  children: React.ReactNode
}

export const Drawer: React.FC<DrawerProps> = ({ show, children }) => {
  const ref = useRef<HTMLDivElement>(null)
  const closeDrawer = useLayoutStore((s) => s.setDrawer)

  const props = useSpring({
    top: show ? window.innerHeight - 300 : window.innerHeight + 40
  })

  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        event.preventDefault()
        event.stopPropagation()
        closeDrawer(undefined)
      }
    }

    if (show) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [ref, show])

  return (
    <DrawerContainer ref={ref} style={props}>
      {children}
    </DrawerContainer>
  )
}
