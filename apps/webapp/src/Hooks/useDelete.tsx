import { mog, ILink, isMatch } from '@mexit/core'
import { getAllParentIds } from '@mexit/shared'
import { useDataStore, useLinks, useEditorStore, getContent } from '@workduck-io/mex-editor'

import { useHistoryStore } from '../Stores/useHistoryStore'
import { useRecentsStore } from '../Stores/useRecentsStore'
import useArchive from './useArchive'
import { useSearch } from './useSearch'

export const useDelete = () => {
  const ilinks = useDataStore((state) => state.ilinks)

  const setILinks = useDataStore((state) => state.setIlinks)
  const setBaseNodeId = useDataStore((state) => state.setBaseNodeId)

  const historyStack = useHistoryStore((state) => state.stack)
  const currentIndex = useHistoryStore((state) => state.currentNodeIndex)
  const updateHistory = useHistoryStore((state) => state.update)
  const { getNodeidFromPath } = useLinks()

  const { updateDocument, removeDocument } = useSearch()

  const lastOpened = useRecentsStore((state) => state.lastOpened)
  const updateLastOpened = useRecentsStore((state) => state.update)
  const { addArchiveData } = useArchive()

  const getMockDelete = (del: string) => {
    const archivedNodes = ilinks.filter((i) => {
      const match = isMatch(i.path, del)
      return match
    })

    const newIlinks = ilinks.filter((i) => archivedNodes.map((i) => i.path).indexOf(i.path) === -1)

    return { archivedNodes, newIlinks }
  }

  const execDelete = (del: string) => {
    const currentNode = useEditorStore.getState().node
    const oldHistory = useHistoryStore.getState().stack
    const { archivedNodes, newIlinks } = getMockDelete(del)

    addArchiveData(archivedNodes)

    // Update history
    const { newIds: newHistory, currentIndex: newCurIndex } = applyDeleteToIds(historyStack, currentIndex, newIlinks)
    updateHistory(newHistory, newCurIndex)

    // Update Recents
    const { newIds: newRecents } = applyDeleteToIds(lastOpened, 0, newIlinks)
    updateLastOpened(newRecents)

    // Update BaseNodeId
    const baseId = archivedNodes.map((item) => item.path).indexOf(useDataStore.getState().baseNodeId)
    if (baseId !== -1 && newIlinks.length > 0) {
      setBaseNodeId(newIlinks[0].path)
    }

    archivedNodes.map(async (item) => {
      mog('Archiving', { item })
      const { path, nodeid } = item
      const content = getContent(nodeid)

      await removeDocument('node', nodeid)
      await updateDocument('archive', nodeid, content.content, path)
    })

    setILinks(newIlinks)

    const allParents = getAllParentIds(currentNode.path)
    const isCurrent = newIlinks.map((i) => i.path).indexOf(currentNode.path) !== -1
    let toLoad: string

    if (isCurrent) toLoad = currentNode.nodeid
    if (!toLoad) toLoad = allParents.length > 1 ? getNodeidFromPath(allParents[allParents.length - 2]) : undefined
    if (!toLoad) toLoad = newHistory.length > 0 ? newHistory[0] : undefined
    if (!toLoad) toLoad = newIlinks.length > 0 ? newIlinks[0].nodeid : undefined

    return { archivedNodes, toLoad }
  }

  return { getMockDelete, execDelete }
}

const applyDeleteToIds = (ids: string[], currentIndex: number, newIlinks: ILink[]) => {
  const curIndexOffset = 0
  const newIds: string[] = []

  ids.forEach((nodeid) => {
    const isPresent = newIlinks.some((l) => l.nodeid === nodeid)
    if (isPresent) {
      newIds.push(nodeid)
    }
  })

  return { newIds, currentIndex: currentIndex + curIndexOffset }
}

/* eslint-disable @typescript-eslint/no-explicit-any */

// Used to wrap a class component to provide hooks
export const withDelete = (Component: any) => {
  // eslint-disable-next-line space-before-function-paren
  return function C2(props: any) {
    const { getMockDelete, execDelete } = useDelete()

    return <Component getMockDelete={getMockDelete} execDelete={execDelete} {...props} /> // eslint-disable-line react/jsx-props-no-spreading
  }
}
