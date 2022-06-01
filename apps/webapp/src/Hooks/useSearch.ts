/* eslint-disable @typescript-eslint/no-explicit-any */

import { idxKey } from '@mexit/core'
import { useLinks } from '@workduck-io/mex-editor'

import {
  addDoc,
  updateDoc,
  removeDoc,
  searchIndex,
  searchIndexWithRanking,
  searchIndexByNodeId
} from '../Workers/controller'

export const useSearch = () => {
  const { getPathFromNodeid } = useLinks()

  const addDocument = async (
    key: idxKey,
    nodeId: string,
    contents: any[],
    title: string | undefined = undefined,
    tags?: Array<string>
  ) => {
    await addDoc(key, nodeId, contents, title ?? getPathFromNodeid(nodeId), tags)
  }

  const updateDocument = async (
    key: idxKey,
    nodeId: string,
    contents: any[],
    title: string | undefined = undefined,
    tags?: Array<string>
  ) => {
    await updateDoc(key, nodeId, contents, title ?? getPathFromNodeid(nodeId), tags)
  }

  const removeDocument = async (key: idxKey, id: string) => {
    await removeDoc(key, id)
  }

  const queryIndex = async (key: idxKey | idxKey[], query: string, tags?: Array<string>) => {
    const results = await searchIndex(key, query, tags)
    return results
  }

  const queryIndexByNodeId = async (key: idxKey | idxKey[], nodeId: string, query: string) => {
    const results = await searchIndexByNodeId(key, nodeId, query)
    return results
  }

  const queryIndexWithRanking = async (key: idxKey | idxKey[], query: string) => {
    const results = await searchIndexWithRanking(key, query)
    return results
  }

  return { addDocument, updateDocument, removeDocument, queryIndex, queryIndexByNodeId, queryIndexWithRanking }
}
