import { useAuthStore as useInternalAuthStore } from '@workduck-io/dwindle'
import { SharedWorker, spawn } from '@workduck-io/mex-threads.js'
import { type ExposedToThreadType } from '@workduck-io/mex-threads.js/types/master'

import {
  idxKey,
  ILink,
  mog,
  NodeEditorContent,
  PersistentData,
  SearchRepExtra,
  Snippets,
  useAuthStore,
  withTimeout
} from '@mexit/core'

import { WorkerRequestType } from '../Utils/worker'

import { type AnalysisWorkerInterface } from './analysis'
import { type RequestsWorkerInterface } from './requests'
import { type SearchWorkerInterface } from './search'

export type AnalysisModifier = SearchRepExtra
export interface AnalysisOptions {
  title?: boolean
  modifier?: AnalysisModifier
}

export interface AnalyseContentProps {
  content: NodeEditorContent
  nodeid: string
  options?: AnalysisOptions
}

export let analysisWorker: null | ExposedToThreadType<AnalysisWorkerInterface> = null
export let requestsWorker: null | ExposedToThreadType<RequestsWorkerInterface> = null
export let searchWorker: null | ExposedToThreadType<SearchWorkerInterface> = null

export const startRequestsWorkerService = async () => {
  if (!requestsWorker) {
    try {
      requestsWorker = await spawn<RequestsWorkerInterface>(
        new SharedWorker(new URL('requests.ts', import.meta.url), {
          type: 'module',
          name: 'Requests Worker'
        })
      )
    } catch (err) {
      console.error('REQUEST WORKER CRASHED', err)
      requestsWorker = null
    }
  }
  const token = useInternalAuthStore.getState().userCred.token
  const workspaceID = useAuthStore.getState().getWorkspaceId()

  initRequestClient(token, workspaceID)
}

export const runBatchWorker = async (
  requestType: WorkerRequestType,
  batchSize = 6,
  args: any[] | Record<any, any[]>
) => {
  const res = await requestsWorker.runBatchWorker(requestType, batchSize, args)
  mog('RUN_BATCH_WORKER', { res })
  return res
}

export const initRequestClient = (token: string, workspaceId: string) => {
  if (requestsWorker) {
    requestsWorker.initializeClient(token, workspaceId)
  }
}

export const terminateRequestWorker = async () => {
  // if (requestsWorker) requestsWorker = await Thread.terminate(requestsWorker)
}

export const analyseContent = async (props: AnalyseContentProps) => {
  try {
    if (!analysisWorker) {
      try {
        analysisWorker = await spawn<AnalysisWorkerInterface>(
          new SharedWorker(new URL('analysis.ts', import.meta.url), {
            type: 'module',
            name: 'Analysis Worker'
          })
        )
      } catch (err) {
        console.error('Could not start analysis worker: ', err)
        analysisWorker = null
      }
    }
    const analysis = await analysisWorker.analyseContent(props)
    return analysis
  } catch (error) {
    console.error(error)
    return
  }
}
export const startSearchWorker = async () => {
  if (!searchWorker) {
    try {
      searchWorker = await spawn<SearchWorkerInterface>(
        new SharedWorker(new URL('search.ts', import.meta.url), { type: 'module', name: 'Search Worker' })
      )
    } catch (err) {
      mog('UnabletoStartSearchWorker', { err })
      searchWorker = null
    }
  }
}

export const getSearchIndexInitState = async () => {
  try {
    if (!searchWorker) {
      await startSearchWorker()
    }

    return await searchWorker.getInitState()
  } catch (error) {
    mog('InitSearchWorkerError', { error })
  }
}

export const initSearchIndex = async (fileData: Partial<PersistentData>) => {
  try {
    if (!searchWorker) {
      await startSearchWorker()
    }

    await searchWorker.init(fileData)
  } catch (error) {
    mog('InitSearchWorkerError', { error })
  }
}

export const addDoc = async (
  key: idxKey,
  nodeId: string,
  contents: any[],
  title: string,
  tags?: Array<string>,
  extra?: SearchRepExtra
) => {
  try {
    if (!searchWorker) throw new Error('Search Worker Not Initialized')
    await searchWorker.addDoc(key, nodeId, contents, title, tags, extra)
  } catch (error) {
    mog('AddDocIndexError', { error })
  }
}

export const updateDoc = async (
  key: idxKey,
  nodeId: string,
  contents: any[],
  title: string,
  tags?: Array<string>,
  extra?: SearchRepExtra
) => {
  try {
    if (!searchWorker) throw new Error('Search Worker Not Initialized')
    await searchWorker.updateDoc(key, nodeId, contents, title, tags, extra)
  } catch (error) {
    mog('UpdateDocIndexError', { error })
  }
}

export const removeDoc = async (key: idxKey, id: string) => {
  try {
    if (!searchWorker) throw new Error('Search Worker Not Initialized')
    await searchWorker.removeDoc(key, id)
  } catch (error) {
    mog('RemoveDocIndexError', { error })
  }
}

export const searchIndex = async (key: idxKey | idxKey[], query: string, tags?: Array<string>) => {
  try {
    if (!searchWorker) throw new Error('Search Worker Not Initialized')

    const results = await withTimeout(searchWorker.searchIndex(key, query, tags), 1 * 500, 'Could not search')
    return results
  } catch (error) {
    mog('SearchIndexError', { error })
  }
}

export const searchIndexByNodeId = async (key: idxKey | idxKey[], nodeId: string, query: string) => {
  try {
    if (!searchWorker) throw new Error('Search Worker Not Initialized')

    const results = await searchWorker.searchIndexByNodeId(key, nodeId, query)
    return results
  } catch (error) {
    mog('SearchIndexByNodeIdError', { error, nodeId })
  }
}

export const searchIndexWithRanking = async (key: idxKey | idxKey[], query: string) => {
  try {
    if (!searchWorker) throw new Error('Search Worker Not Initialized')

    const results = await searchWorker.searchIndexWithRanking(key, query)
    return results
  } catch (error) {
    mog('SearchIndexError', { error })
  }
}

export const terminateAllWorkers = async () => {
  const terminateWorker = async (worker) => {
    try {
      await worker?.reset()
      worker = null
    } catch (error) {
      console.log('Termination error: ', error)
    }
  }

  const promises = [terminateWorker(analysisWorker), terminateWorker(searchWorker), terminateWorker(requestsWorker)]
  await Promise.allSettled(promises)
}

export const initNamespacesExtension = async (localILinks: ILink[]) => {
  try {
    if (!requestsWorker) throw new Error('Requests worker not initialized')
    const results = await requestsWorker.initializeNamespacesExtension(localILinks)
    return results
  } catch (error) {
    mog('InitNamespacesExtension', { error })
  }
}

export const initSnippetsExtension = async (localSnippets: Snippets) => {
  try {
    if (!requestsWorker) throw new Error('Requests worker not initialized')

    const results = await requestsWorker.initializeSnippetsExtension(localSnippets)
    return results
  } catch (error) {
    mog('InitSnippetsError', { error })
  }
}

export const initLinksExtension = async () => {
  try {
    if (!requestsWorker) throw new Error('Requests worker not initialized')

    const results = await requestsWorker.initializeLinksExtension()
    return results
  } catch (error) {
    return undefined
  }
}

export const initHighlightsExtension = async () => {
  try {
    if (!requestsWorker) throw new Error('Requests worker not initialized')

    const results = await requestsWorker.initializeHighlightsExtension()
    return results
  } catch (error) {
    return undefined
  }
}

export const initSmartCapturesExtension = async () => {
  try {
    if (!requestsWorker) throw new Error('Requests worker not initialized')

    const results = await requestsWorker.initializeSmartCapturesExtension()
    return results
  } catch (error) {
    return undefined
  }
}
