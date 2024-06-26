import { useCallback, useEffect } from 'react'

import { useLayoutStore } from '@mexit/core'
import { ExtInfobarMode } from '@mexit/shared'

import { useRightSidebarItems } from '../Stores/useRightSidebarItems'

export const useRightSidebarShortcuts = () => {
  const toggleRightSidebar = useLayoutStore((l) => l.toggleRHSidebar)
  const setInfobarMode = useLayoutStore((l) => l.setInfobarMode)

  const { getNextTab } = useRightSidebarItems()

  const onKeydown = useCallback((event: KeyboardEvent) => {
    if (event.metaKey && event.code === 'Slash') {
      event.stopPropagation()
      event.preventDefault()

      const isSidebarExpanded = useLayoutStore.getState().rhSidebar?.expanded

      if (isSidebarExpanded) {
        const nextTab = getNextTab()
        if (nextTab) setInfobarMode(nextTab.type as ExtInfobarMode)
      } else {
        toggleRightSidebar()
      }
    }
  }, [])

  useEffect(() => {
    window.addEventListener('keydown', onKeydown)

    return () => window.removeEventListener('keydown', onKeydown)
  }, [onKeydown])
}
