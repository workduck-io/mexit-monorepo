import { Indexes } from '@workduck-io/mex-search'

import { getAllParentIds, ILink, isMatch, mog, RefactorPath } from '@mexit/core'

import { useDataStore } from '../Stores/useDataStore'
import { getContent, useEditorStore } from '../Stores/useEditorStore'
import { useHistoryStore } from '../Stores/useHistoryStore'
import { useRecentsStore } from '../Stores/useRecentsStore'

import useArchive from './useArchive'
import { useLinks } from './useLinks'
import { useSearch } from './useSearch'

export const useDelete = () => {
  const ilinks = useDataStore((state) => state.ilinks)

  const setILinks = useDataStore((state) => state.setIlinks)
  const setBaseNodeId = useDataStore((state) => state.setBaseNodeId)
  const addInArchive = useDataStore((store) => store.addInArchive)

  const historyStack = useHistoryStore((state) => state.stack)
  const currentIndex = useHistoryStore((state) => state.currentNodeIndex)
  const updateHistory = useHistoryStore((state) => state.update)
  const { getNodeidFromPath } = useLinks()

  const { updateDocument, removeDocument } = useSearch()

  const lastOpened = useRecentsStore((state) => state.lastOpened)
  const updateLastOpened = useRecentsStore((state) => state.update)
  const { addArchiveData } = useArchive()

  const getMockArchive = (del: RefactorPath) => {
    const archivedNodes = ilinks.filter((i) => {
      const match = isMatch(i.path, del.path) && i.namespace === del.namespaceID
      return match
    })

    const newIlinks = ilinks.filter((i) => archivedNodes.map((i) => i.path).indexOf(i.path) === -1)

    // mog('Mock Archive', { archivedNodes, newIlinks })
    return { archivedNodes, newIlinks }
  }

  const getNotesToDelete = (noteId: string, archive: ILink[], notesToDelete: Array<ILink>) => {
    const archiveNote = archive.find((i) => i.parentNodeId === noteId)

    // mog('Archive note', { archiveNote, notesToDelete })

    if (!archiveNote) {
      return notesToDelete
    }

    return getNotesToDelete(archiveNote.nodeid, archive, [...notesToDelete, archiveNote])
  }

  const getMockDelete = (archiveNoteId: string) => {
    const archive = useDataStore.getState().archive

    const archiveNote = archive.find((i) => i.nodeid === archiveNoteId)

    // * Find ILinks with this parentNode, if exists repeat same for others
    const notesToDelete = getNotesToDelete(archiveNoteId, archive, [archiveNote])

    return notesToDelete
  }

  const execArchive = async (del: string, namespace: string) => {
    const currentNode = useEditorStore.getState().node
    const { archivedNodes, newIlinks } = getMockArchive({ path: del, namespaceID: namespace })
    // mog('EXEC ARCHIVE Delete', { archivedNodes, newIlinks })

    try {
      await addArchiveData(archivedNodes, namespace)

      // Update history
      const { newIds: newHistory, currentIndex: newCurIndex } = applyDeleteToIds(historyStack, currentIndex, newIlinks)
      updateHistory(newHistory, newCurIndex)

      // Update Recents
      const { newIds: newRecents } = applyDeleteToIds(lastOpened, 0, newIlinks)
      updateLastOpened(newRecents)

      // Update BaseNodeId
      const baseId = archivedNodes.map((item) => item.path).indexOf(useDataStore.getState().baseNodeId)
      if (baseId !== -1 && newIlinks.length > 0) {
        setBaseNodeId(newIlinks[0].nodeid)
      }

      archivedNodes.map(async (item) => {
        const { path, nodeid } = item
        const content = getContent(nodeid)

        await removeDocument(Indexes.MAIN, nodeid)
        await updateDocument({ indexKey: Indexes.ARCHIVE, id: nodeid, contents: content.content, title: path })
      })

      mog('Delete', { archivedNodes, newIlinks, newHistory, newRecents })
      setILinks(newIlinks)
      addInArchive(archivedNodes)

      const allParents = getAllParentIds(currentNode.path)
      const isCurrent = newIlinks.map((i) => i.path).indexOf(currentNode.path) !== -1
      let toLoad: string

      if (isCurrent) toLoad = currentNode.nodeid
      if (!toLoad)
        toLoad =
          allParents.length > 1
            ? getNodeidFromPath(allParents[allParents.length - 2], currentNode.namespace)
            : undefined
      if (!toLoad) toLoad = newHistory.length > 0 ? newHistory[0] : undefined
      if (!toLoad) toLoad = newIlinks.length > 0 ? newIlinks[0].nodeid : undefined

      return { archivedNodes, toLoad }
    } catch (err) {
      mog('Unable to Archive Note')
    }
  }

  return { getMockArchive, execArchive, getMockDelete }
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
    const { getMockArchive, execArchive } = useDelete()

    return <Component getMockArchive={getMockArchive} execArchive={execArchive} {...props} /> // eslint-disable-line react/jsx-props-no-spreading
  }
}
