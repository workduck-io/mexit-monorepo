import { DataStoreState, mog } from '@mexit/core'
import { dataStoreConstructor, sanatizeLinks } from '@mexit/shared'
import { useMemo } from 'react'
import create from 'zustand'
import { persist } from 'zustand/middleware'
import { generateTree } from '../Utils/tree'
import useEditorStore from './useEditorStore'
import { useTreeStore } from './useTreeStore'
import IDBStorage from '../Utils/idbStorageAdapter'

const useDataStore = create<DataStoreState>(
  persist(dataStoreConstructor, { name: 'mexit-data-store', getStorage: () => IDBStorage })
)

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

export default useDataStore
