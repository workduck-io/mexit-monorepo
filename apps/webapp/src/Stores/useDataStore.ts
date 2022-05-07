import { DataStoreState, mog } from '@mexit/core'
import { dataStoreConstructor, sanatizeLinks } from '@mexit/shared'
import { useMemo } from 'react'
import create from 'zustand'
import { devtools } from 'zustand/middleware'
import getFlatTree, { generateTree } from '../Utils/tree'
import useEditorStore from './useEditorStore'
import { useTreeStore } from './useTreeStore'

const useDataStore = create<DataStoreState>(devtools(dataStoreConstructor))

export const useTreeFromLinks = () => {
  const node = useEditorStore((state) => state.node)
  const ilinks = useDataStore((store) => store.ilinks)
  const expanded = useTreeStore((store) => store.expanded)
  const links = ilinks.map((i) => ({ id: i.path, nodeid: i.nodeid, icon: i.icon }))
  const sanatizedLinks = sanatizeLinks(links)
  mog('Sanatized links', { sanatizedLinks })
  // const sortedTree = sortTree(sanatizeLinks, contents)
  const tree = useMemo(() => generateTree(sanatizedLinks, expanded), [ilinks, node])

  // mog('Tree', { ilinks, contents, links, sanatizedLinks, sortedTree, tree })

  return tree
}

export const useFlatTreeFromILinks = () => {
  return useTreeFromLinks()
}

export default useDataStore
