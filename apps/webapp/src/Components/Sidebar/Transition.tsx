import { transparentize } from 'polished'
import { useMemo } from 'react'
import { useMediaQuery } from 'react-responsive'
import { useSpring } from 'react-spring'
import { useTheme } from 'styled-components'

import { size } from '@mexit/shared'

import { useLayoutStore } from '../../Stores/useLayoutStore'

const sidebarCollapsedWidth = '86px'
const sidebarExpandedWidth = '362px'

export const useSidebarTransition = () => {
  const sidebar = useLayoutStore((state) => state.sidebar)
  const rhSidebar = useLayoutStore((state) => state.rhSidebar)
  const theme = useTheme()

  const isDesktop = useMediaQuery({ minWidth: size.wide })
  const isSmall = useMediaQuery({ maxWidth: size.small })

  const sidebarStyle = useMemo(() => {
    const showSidebar = sidebar.show && sidebar.expanded
    const firstColumnWidth = `${showSidebar ? '276px' : '0px'}`
    if (!isSmall) {
      const style = {
        backdropFilter: 'blur(10px)',
        width: firstColumnWidth,
        background: transparentize(0.5, theme.colors.gray[9])
      }
      return style
    } else {
      const style = {
        width: firstColumnWidth,
        position: 'absolute',
        top: theme.additional.hasBlocks ? '2rem' : '0',
        background: transparentize(0.25, theme.colors.gray[9]),
        backdropFilter: 'blur(10px)',
        left: theme.additional.hasBlocks ? 'calc(86px + 1rem)' : '86px',
        zIndex: '10'
      }
      return style
    }
  }, [sidebar, isSmall, theme])

  const springProps = useSpring(sidebarStyle)

  const rhSidebarStyle = useMemo(() => {
    const showRHSidebar = rhSidebar.show && rhSidebar.expanded
    const visibleEndColumnWidth = `${isDesktop ? '600px' : '400px'}`
    const endColumnWidth = `${showRHSidebar ? visibleEndColumnWidth : '0px'}`
    if (!isSmall) {
      const style = {
        width: endColumnWidth,
        backdropFilter: 'blur(10px)',
        background: transparentize(0.5, theme.colors.gray[9])
      }
      return style
    } else {
      const style = {
        width: endColumnWidth,
        position: 'absolute',
        backdropFilter: 'blur(10px)',
        top: theme.additional.hasBlocks ? '2rem' : '0',
        background: transparentize(0.25, theme.colors.gray[9]),
        zIndex: '10',
        right: theme.additional.hasBlocks ? '1rem' : '0px'
      }
      return style
    }
  }, [rhSidebar, theme, isSmall, isDesktop])

  const rhSidebarSpringProps = useSpring(rhSidebarStyle)

  const { style: gridStyle, endColumnWidth } = useMemo(() => {
    const showSidebar = sidebar.show && sidebar.expanded
    const showRHSidebar = rhSidebar.show && rhSidebar.expanded
    const firstColumnWidth = `${showSidebar ? sidebarExpandedWidth : sidebarCollapsedWidth}`
    const visibleEndColumnWidth = `${isDesktop ? '600px' : '400px'}`
    const endColumnWidth = `${showRHSidebar ? visibleEndColumnWidth : '0px'}`
    if (!isSmall) {
      const style = {
        gridTemplateColumns: `${firstColumnWidth} 2fr ${endColumnWidth}`
      }
      // if (!sidebar.expanded || !sidebar.show) style.gridTemplateColumns = `${sidebarCollapsedWidth} 2fr auto`
      return { style, endColumnWidth }
    } else {
      const style = { gridTemplateColumns: `${sidebarCollapsedWidth} 2fr 0px` }
      return { style, endColumnWidth }
    }
  }, [sidebar, isDesktop, rhSidebar, isSmall])

  const gridSpringProps = useSpring({ to: gridStyle, immediate: !sidebar.show && !rhSidebar.show })

  const switchWrapperStyle = useMemo(() => {
    const style = {
      width: `calc(100% - ${sidebarExpandedWidth} - ${theme.additional.hasBlocks ? '3rem' : '0px'})`
    }

    if (!sidebar.expanded || !sidebar.show) {
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
    endColumnWidth
  }
}
