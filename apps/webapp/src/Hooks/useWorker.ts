import { IpcAction } from '@mexit/core'
import { spawn, Worker } from 'threads'
import {
  addDoc,
  analyseContent,
  initSearchIndex,
  removeDoc,
  searchIndex,
  searchIndexByNodeId,
  searchIndexWithRanking,
  updateDoc,
  dumpIndexDisk
} from '../Utils/Workers/controller'

interface Options {
  [IpcAction.ADD_DOCUMENT]: {
    key: any
    nodeId: any
    contents: any
    title: any
    tags: any
  }
}

export const useWorker = () => {
  const handle = (type: string, ...args: any[]) => {
    switch (type) {
      case IpcAction.ADD_DOCUMENT:
        ;async ([key, nodeId, contents, title, tags] = args) => {
          await addDoc(key, nodeId, contents, title, tags)
        }
        break
      case IpcAction.UPDATE_DOCUMENT:
        ;async ([key, nodeId, contents, title, tags] = args) => {
          await updateDoc(key, nodeId, contents, title, tags)
        }
        break
      case IpcAction.REMOVE_DOCUMENT:
        ;async ([key, id] = args) => {
          await removeDoc(key, id)
        }
        break
      case IpcAction.QUERY_INDEX:
        ;async ([key, query, tags] = args) => {
          const results = await searchIndex(key, query, tags)
          return results
        }
        break
      case IpcAction.QUERY_INDEX_BY_NODEID:
        ;async ([key, nodeId, query] = args) => {
          const results = await searchIndexByNodeId(key, nodeId, query)
          return results
        }
        break
      case IpcAction.QUERY_INDEX_WITH_RANKING:
        ;async ([key, query] = args) => {
          const results = await searchIndexWithRanking(key, query)
          return results
        }
        break
    }
  }
  return { handle }
}
