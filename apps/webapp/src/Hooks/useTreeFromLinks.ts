import { sanatizeLinks } from '@mexit/core'
import { useMemo } from 'react'
import { useDataStore } from '../Stores/useDataStore'
import { useEditorStore } from '../Stores/useEditorStore'
import { useTreeStore } from '../Stores/useTreeStore'
import { generateTree } from '../Utils/tree'

export const useTreeFromLinks = () => {
  const node = useEditorStore((state) => state.node)
  const ilinks = useDataStore((store) => store.ilinks)
  const expanded = useTreeStore((store) => store.expanded)
  const links = ilinks.map((i) => ({ id: i.path, nodeid: i.nodeid, icon: i.icon }))
  const sanatizedLinks = sanatizeLinks(links)
  const tree = useMemo(() => generateTree(sanatizedLinks, expanded), [ilinks, node])

  return tree
}

export const useFlatTreeFromILinks = () => {
  return useTreeFromLinks()
}
