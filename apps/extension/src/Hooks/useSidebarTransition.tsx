import { OverlaySidebarWindowWidth, size } from '@mexit/shared'
import { useMemo } from 'react'
import { useMediaQuery } from 'react-responsive'
import { useSpring } from 'react-spring'
import { useTheme } from 'styled-components'

import { useLayoutStore } from '../Stores/useLayoutStore'

export const useSidebarTransition = () => {
  const rhSidebar = useLayoutStore((state) => state.rhSidebar)
  const theme = useTheme()

  const isDesktop = useMediaQuery({ minWidth: size.wide })
  const overlaySidebar = useMediaQuery({ maxWidth: OverlaySidebarWindowWidth })

  const rhSidebarStyle = useMemo(() => {
    const showRHSidebar = rhSidebar.show && rhSidebar.expanded
    const visibleEndColumnWidth = `${isDesktop ? '600px' : '415px'}`
    const endColumnWidth = `${showRHSidebar ? visibleEndColumnWidth : '0px'}`
    if (!overlaySidebar) {
      const style = {
        width: endColumnWidth
      }
      return style
    } else {
      const style = {
        width: endColumnWidth
      }
      return style
    }
  }, [rhSidebar, overlaySidebar, isDesktop])
  const rhSidebarSpringProps = useSpring(rhSidebarStyle)

  const { style: gridStyle, endColumnWidth } = useMemo(() => {
    const showRHSidebar = rhSidebar.show && rhSidebar.expanded
    const visibleEndColumnWidth = `${isDesktop ? '600px' : '415px'}`
    const endColumnWidth = `${showRHSidebar ? visibleEndColumnWidth : '0px'}`
    const themeGap = `${theme.additional.hasBlocks ? '4rem' : '0rem'}`
    // mog('Overlay', { overlaySidebar, showSidebar, showRHSidebar })
    if (!overlaySidebar) {
      const style = {
        gridTemplateColumns: `calc(100vw - ${endColumnWidth} - ${themeGap}) ${endColumnWidth}`
      }
      // if (!sidebar.expanded || !sidebar.show) style.gridTemplateColumns = `${sidebarCollapsedWidth} 2fr auto`
      return { style, endColumnWidth }
    } else {
      const style = {
        gridTemplateColumns: ` calc(100vw - 0px - ${themeGap}) 0px`
      }
      return { style, endColumnWidth }
    }
  }, [isDesktop, rhSidebar, overlaySidebar, theme])

  const gridSpringProps = useSpring({ to: gridStyle, immediate: !rhSidebar.show })

  return {
    rhSidebarSpringProps,
    gridStyle,
    gridSpringProps,
    endColumnWidth,
    overlaySidebar
  }
}
