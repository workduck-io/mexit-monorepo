import { useMemo } from 'react'

import { sanatizeLinks, ILink } from '@mexit/core'

import { useDataStore } from '../Stores/useDataStore'
import { useEditorStore } from '../Stores/useEditorStore'
import { useTreeStore } from '../Stores/useTreeStore'
import { generateTree } from '../Utils/tree'

export const useTreeFromLinks = () => {
  const getTreeFromLinks = (links: ILink[]) => {
    const expanded = useTreeStore.getState().expanded

    const sanatizedLinks = sanatizeLinks(links)
    const tree = generateTree(sanatizedLinks, expanded)

    return tree
  }

  return { getTreeFromLinks }
}

export const useFlatTreeFromILinks = () => {
  return useTreeFromLinks()
}
