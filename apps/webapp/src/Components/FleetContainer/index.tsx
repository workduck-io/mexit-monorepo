import React, { useCallback, useEffect, useMemo } from 'react'
import { useMatch } from 'react-router-dom'

import { Fleet } from '@workduck-io/mex-components'

import { ROUTE_PATHS } from '../../Hooks/useRouting'
import useModalStore, { ModalsType } from '../../Stores/useModalStore'

import { useOnNewItem } from './useOnNewItem'

const FleetContainer = () => {
  const { getQuickNewItems } = useOnNewItem()

  const toggleOpen = useModalStore((store) => store.toggleOpen)
  const open = useModalStore((store) => store.open) === ModalsType.quickNew

  const atSnippets = useMatch(`${ROUTE_PATHS.snippets}/*`)
  const atTasks = useMatch(ROUTE_PATHS.tasks)

  const handleOpen = () => {
    toggleOpen(ModalsType.quickNew)
  }

  const handleClose = useCallback(() => {
    const isFleetOpen = useModalStore.getState().open === ModalsType.quickNew

    if (isFleetOpen) toggleOpen(undefined)
  }, [])

  const handleEscapeClose = useCallback((ev) => {
    if (ev.key === 'Escape') handleClose()
  }, [])

  useEffect(() => {
    if (open) window.addEventListener('keydown', handleEscapeClose)

    return () => {
      window.removeEventListener('keydown', handleEscapeClose)
    }
  }, [open])

  const sections = useMemo(() => {
    const sections = getQuickNewItems()
    if (atSnippets) return [sections.snippet, sections.note, sections.task, sections.space]
    if (atTasks) return [sections.task, sections.note, sections.snippet, sections.space]

    return [sections.note, sections.space, sections.task, sections.snippet]
  }, [atSnippets, atTasks])

  return <Fleet sections={sections} isOpen={open} onClose={handleClose} onOpen={handleOpen} />
}

export default FleetContainer
