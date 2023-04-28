import React, { useMemo, useRef } from 'react'
import { useSpring } from 'react-spring'

import { DrawerType, useLayoutStore } from '@mexit/core'

import { DRAWER_HEIGHT_STATES, DrawerContainer } from './styled'

interface DrawerProps {
  show: boolean
  children: React.ReactNode
}

export const Drawer: React.FC<DrawerProps> = ({ show, children }) => {
  const ref = useRef<HTMLDivElement>(null)
  const closeDrawer = useLayoutStore((s) => s.setDrawer)
  const drawerType = useLayoutStore((s) => s.drawer?.type)

  // * Returns the offset for the drawer based on the height
  const getOffset = (height: DRAWER_HEIGHT_STATES) => {
    return -(Number(height.slice(0, -2)) * 16 + 40)
  }

  const style = useMemo(() => {
    const defaultStyle = {
      bottom: getOffset(DRAWER_HEIGHT_STATES.NORMAL)
      // height: 'fit-content'
    }

    switch (drawerType) {
      case DrawerType.LOADING:
        return {
          bottom: show ? 0 : getOffset(DRAWER_HEIGHT_STATES.LOADING)
        }
      default:
        return {
          ...defaultStyle,
          bottom: show ? 0 : getOffset(DRAWER_HEIGHT_STATES.NORMAL)
        }
    }
  }, [show, drawerType])

  const props = useSpring(style)

  // useEffect(() => {
  //   function handleClickOutside(event) {
  //     if (ref.current && !ref.current.contains(event.target)) {
  //       closeDrawer(undefined)
  //     }
  //   }

  //   if (show) {
  //     document.addEventListener('mousedown', handleClickOutside)
  //   }

  //   return () => {
  //     // Unbind the event listener on clean up
  //     document.removeEventListener('mousedown', handleClickOutside)
  //   }
  // }, [ref, show])

  return (
    // @ts-ignore
    <DrawerContainer ref={ref} style={props}>
      {children}
    </DrawerContainer>
  )
}
