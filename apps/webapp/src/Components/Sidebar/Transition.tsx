import { useMemo } from 'react'
import { useSpring } from 'react-spring'
import { useTheme } from 'styled-components'
import { useLayoutStore } from '../../Stores/useLayoutStore'

const sidebarCollapsedWidth = '86px'
const sidebarExpandedWidth = '300px'

export const useSidebarTransition = () => {
  const sidebar = useLayoutStore((state) => state.sidebar)
  const theme = useTheme()

  const sidebarStyle = useMemo(() => {
    const style = { width: sidebarExpandedWidth }

    if (!sidebar.expanded) style.width = sidebarCollapsedWidth

    return style
  }, [sidebar])

  const springProps = useSpring(sidebarStyle)

  const gridStyle = useMemo(() => {
    const style = {
      gridTemplateColumns: `${sidebarExpandedWidth} 2fr auto`
    }
    if (!sidebar.expanded) style.gridTemplateColumns = `${sidebarCollapsedWidth} 2fr auto`
    return style
  }, [sidebar])
  const gridSpringProps = useSpring(gridStyle)

  const switchWrapperStyle = useMemo(() => {
    const style = {
      width: `calc(100% - ${sidebarExpandedWidth} - ${theme.additional.hasBlocks ? '3rem' : '0px'})`
    }

    if (!sidebar.expanded) {
      style.width = `calc(100% - ${sidebarCollapsedWidth} - ${theme.additional.hasBlocks ? '3rem' : '0px'})`
    }
    return style
  }, [sidebar, theme])

  const switchWrapperSpringProps = useSpring(switchWrapperStyle)

  return { sidebarStyle, springProps, gridStyle, gridSpringProps, switchWrapperSpringProps }
}
