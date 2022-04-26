import { idxKey, IpcAction } from '@mexit/core'
import { spawn, Worker } from 'threads'
import { useLinks } from './useLinks'
// import { useWorker } from './useWorker'

export const useSearch = () => {
  const { getPathFromNodeid } = useLinks()
  // const { handle } = useWorker()

  const addDocument = async (
    key: idxKey,
    nodeId: string,
    contents: any[],
    title: string | undefined = undefined,
    tags?: Array<string>
  ) => {
    // handle(IpcAction.ADD_DOCUMENT, key, nodeId, contents, title ?? getPathFromNodeid(nodeId), tags)
  }

  const updateDocument = async (
    key: idxKey,
    nodeId: string,
    contents: any[],
    title: string | undefined = undefined,
    tags?: Array<string>
  ) => {
    // await handle(IpcAction.UPDATE_DOCUMENT, key, nodeId, contents, title ?? getPathFromNodeid(nodeId), tags)
  }

  const removeDocument = async (key: idxKey, id: string) => {
    // await handle(IpcAction.REMOVE_DOCUMENT, key, id)
  }

  const queryIndex = async (key: idxKey | idxKey[], query: string, tags?: Array<string>) => {
    // const results = await handle(IpcAction.QUERY_INDEX, key, query, tags)
    return []
    // return results
  }

  const queryIndexByNodeId = async (key: idxKey | idxKey[], nodeId: string, query: string) => {
    // const results = await handle(IpcAction.QUERY_INDEX_BY_NODEID, key, nodeId, query)
    return []
    // return results
  }

  const queryIndexWithRanking = async (key: idxKey | idxKey[], query: string) => {
    // const results = await handle(IpcAction.QUERY_INDEX_WITH_RANKING, key, query)
    return []
    // return results
  }

  return { addDocument, updateDocument, removeDocument, queryIndex, queryIndexByNodeId, queryIndexWithRanking }
}
