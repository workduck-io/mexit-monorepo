import { useMemo } from 'react'
import { useMediaQuery } from 'react-responsive'
import { useSpring } from 'react-spring'

import { useTheme } from 'styled-components'

import { useLayoutStore } from '@mexit/core'
import { OverlaySidebarWindowWidth } from '@mexit/shared'

const sidebarCollapsedWidth = '86px'
const sidebarExpandedWidth = '362px'

export const useSidebarTransition = () => {
  const sidebar = useLayoutStore((state) => state.sidebar)
  const rhSidebar = useLayoutStore((state) => state.rhSidebar)
  const theme = useTheme()

  const overlaySidebar = useMediaQuery({ maxWidth: OverlaySidebarWindowWidth })

  const sidebarStyle = useMemo(() => {
    const showSidebar = sidebar?.show && sidebar.expanded
    const firstColumnWidth = `${showSidebar ? '276px' : '0px'}`
    if (!overlaySidebar) {
      const style = {
        width: firstColumnWidth
      }
      return style
    } else {
      const style = {
        width: firstColumnWidth
      }
      return style
    }
  }, [sidebar, overlaySidebar])

  const springProps = useSpring(sidebarStyle)

  const rhSidebarStyle = useMemo(() => {
    const showRHSidebar = rhSidebar?.show && rhSidebar.expanded
    const visibleEndColumnWidth = '400px'
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
  }, [rhSidebar, overlaySidebar])
  const rhSidebarSpringProps = useSpring(rhSidebarStyle)

  const { style: gridStyle, endColumnWidth } = useMemo(() => {
    const showSidebar = sidebar?.show && sidebar.expanded
    const showRHSidebar = rhSidebar?.show && rhSidebar.expanded
    const firstColumnWidth = `${showSidebar ? sidebarExpandedWidth : sidebarCollapsedWidth}`
    const visibleEndColumnWidth = '400px'
    const endColumnWidth = `${showRHSidebar ? visibleEndColumnWidth : '0px'}`
    const themeGap = `${theme.additional.hasBlocks ? '4rem' : '0rem'}`
    // mog('Overlay', { overlaySidebar, showSidebar, showRHSidebar })
    if (!overlaySidebar) {
      const style = {
        gridTemplateColumns: `${firstColumnWidth} calc(100vw - ${firstColumnWidth} - ${endColumnWidth} - ${themeGap}) ${endColumnWidth}`
      }
      // if (!sidebar.expanded || !sidebar.show) style.gridTemplateColumns = `${sidebarCollapsedWidth} 2fr auto`
      return { style, endColumnWidth }
    } else {
      const style = {
        gridTemplateColumns: `${sidebarCollapsedWidth} calc(100vw - ${sidebarCollapsedWidth} - 0px - ${themeGap}) 0px`
      }
      return { style, endColumnWidth }
    }
  }, [sidebar, rhSidebar, overlaySidebar, theme])

  const gridSpringProps = useSpring({ to: gridStyle, immediate: !sidebar?.show && !rhSidebar?.show })

  const switchWrapperStyle = useMemo(() => {
    const style = {
      width: `calc(100% - ${sidebarExpandedWidth} - ${theme.additional.hasBlocks ? '3rem' : '0px'})`
    }

    if (!sidebar?.expanded || !sidebar?.show) {
      style.width = `calc(100% - ${sidebarCollapsedWidth} - ${theme.additional.hasBlocks ? '3rem' : '0px'})`
    }
    return style
  }, [sidebar, theme])

  const switchWrapperSpringProps = useSpring(switchWrapperStyle)

  return {
    sidebarStyle,
    springProps,
    rhSidebarSpringProps,
    gridStyle,
    gridSpringProps,
    switchWrapperSpringProps,
    endColumnWidth,
    overlaySidebar
  }
}
