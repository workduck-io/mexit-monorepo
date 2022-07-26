import { InfobarMode, useLayoutStore } from '../Stores/useLayoutStore'

const useToggleElements = () => {
  const setInfobarMode = useLayoutStore((store) => store.setInfobarMode)
  const setRHSidebarExpanded = useLayoutStore((store) => store.setRHSidebarExpanded)

  const changeSidebarExpand = () => {
    const rhSidebar = useLayoutStore.getState().rhSidebar
    if (rhSidebar.show && !rhSidebar.expanded) {
      setRHSidebarExpanded(true)
    }
  }

  const toggleMode = (mode: InfobarMode, notToggle?: boolean) => {
    const infobar = useLayoutStore.getState().infobar
    changeSidebarExpand()
    if (infobar.mode === mode && !notToggle) {
      setInfobarMode('default')
    } else {
      setInfobarMode(mode)
    }
  }

  const toggleGraph = () => {
    toggleMode('graph')
  }

  const toggleSyncBlocks = () => {
    toggleMode('flow')
  }

  const toggleSuggestedNodes = () => {
    toggleMode('suggestions')
  }

  const toggleReminder = () => {
    toggleMode('reminders', true)
  }

  return {
    toggleSuggestedNodes,
    toggleGraph,
    toggleSyncBlocks,
    toggleReminder
  }
}

export default useToggleElements
