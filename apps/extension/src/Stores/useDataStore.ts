import create from 'zustand'
import { persist } from 'zustand/middleware'

import { DataStoreState } from '@mexit/core'

import { storageAdapter } from '@mexit/core'
import { dataStoreConstructor, generateTree, getFlatTree, sanatizeLinks } from '@mexit/shared'

const useDataStore = create<DataStoreState>(
  persist(dataStoreConstructor, { name: 'mexit-data-store', ...storageAdapter })
)

export const useTreeFromLinks = () => {
  const ilinks = useDataStore((store) => store.ilinks)
  const links = ilinks.map((i) => ({ id: i.path, nodeid: i.nodeid, icon: i.icon }))
  const sanatizedLinks = sanatizeLinks(links)
  const tree = generateTree(sanatizedLinks)

  return tree
}

export const useFlatTreeFromILinks = () => {
  return getFlatTree(useTreeFromLinks())
}

export default useDataStore
