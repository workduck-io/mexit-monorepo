import React, { useMemo } from 'react'

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

  const handleOpen = () => toggleOpen(ModalsType.quickNew)
  const handleClose = () => toggleOpen(undefined)

  const sections = useMemo(() => {
    const sections = getQuickNewItems()
    if (atSnippets) return [sections.snippet, sections.note, sections.space]

    return [sections.note, sections.space, sections.snippet]
  }, [atSnippets])

  return <Fleet sections={sections} isOpen={open} onClose={handleClose} onOpen={handleOpen} />
}

export default FleetContainer
