import { useMemo } from 'react'
import { useSpring } from 'react-spring'

import { useTheme } from 'styled-components'

import { useLayoutStore } from '@mexit/core'

export const useSidebarTransition = () => {
  const rhSidebar = useLayoutStore((state) => state.rhSidebar)
  const theme = useTheme()

  const rhSidebarStyle = useMemo(() => {
    const showRHSidebar = rhSidebar.show && rhSidebar.expanded
    const visibleEndColumnWidth = '400px'
    const endColumnWidth = `${showRHSidebar ? visibleEndColumnWidth : '0px'}`
    const style = {
      width: endColumnWidth
    }

    return style
  }, [rhSidebar])

  const rhSidebarSpringProps = useSpring(rhSidebarStyle)

  const { style: gridStyle, endColumnWidth } = useMemo(() => {
    const showRHSidebar = rhSidebar.show && rhSidebar.expanded
    const visibleEndColumnWidth = '400px'
    const endColumnWidth = `${showRHSidebar ? visibleEndColumnWidth : '0px'}`
    // mog('Overlay', { overlaySidebar, showSidebar, showRHSidebar })
    const style = {
      gridTemplateColumns: `90vw`
    }
    return { style, endColumnWidth }
  }, [rhSidebar, theme])

  const gridSpringProps = useSpring({ to: gridStyle, immediate: !rhSidebar.show })

  return {
    rhSidebarSpringProps,
    gridStyle,
    gridSpringProps,
    endColumnWidth
  }
}
