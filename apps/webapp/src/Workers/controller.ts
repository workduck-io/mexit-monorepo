import { useAuthStore as useInternalAuthStore } from '@workduck-io/dwindle'
import { Indexes, ISearchQuery, IUpdateDoc } from '@workduck-io/mex-search'
import { SharedWorker, spawn } from '@workduck-io/mex-threads.js'
import { type ExposedToThreadType } from '@workduck-io/mex-threads.js/types/master'

import {
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
import { type SearchWorkerInterface, InitializeSearchEntity } from './search'

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

export const updateILink = async (ilink: ILink) => {
  try {
    if (!searchWorker) throw new Error('Search Worker Not Initialized')
    await searchWorker.updateILink(ilink)
  } catch (error) {
    mog('AddDocIndexError', { error })
  }
}

export const getEntitiyInitializer = async <T extends keyof InitializeSearchEntity>(
  updateType: T,
  data: InitializeSearchEntity[T]
) => {
  try {
    if (!searchWorker) throw new Error('Search Worker Not Initialized')
    return await searchWorker.initializeEntities(updateType, data)
  } catch (error) {
    mog('Get SearchX instance', { error })
  }
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

export const addDoc = async (doc: IUpdateDoc) => {
  try {
    if (!searchWorker) throw new Error('Search Worker Not Initialized')
    await searchWorker.addDoc(doc)
  } catch (error) {
    mog('AddDocIndexError', { error })
  }
}

export const updateDoc = async (doc: IUpdateDoc) => {
  try {
    if (!searchWorker) throw new Error('Search Worker Not Initialized')

    await searchWorker.updateDoc(doc)
  } catch (error) {
    mog('UpdateDocIndexError', { error })
  }
}

export const removeDoc = async (indexKey: Indexes, id: string) => {
  try {
    if (!searchWorker) throw new Error('Search Worker Not Initialized')
    await searchWorker.removeDoc(indexKey, id)
  } catch (error) {
    mog('RemoveDocIndexError', { error })
  }
}

export const searchIndex = async (key: Indexes, query: ISearchQuery) => {
  try {
    if (!searchWorker) throw new Error('Search Worker Not Initialized')
    const results = await withTimeout(searchWorker.searchIndex(key, query), 1000, 'Could not search')
    return results
  } catch (error) {
    mog('SearchIndexError', { error })
  }
}

export const searchIndexByNodeId = async (key: Indexes, nodeId: string, query: ISearchQuery) => {
  try {
    if (!searchWorker) throw new Error('Search Worker Not Initialized')

    const results = await searchWorker.searchIndexByNodeId(key, nodeId, query)
    return results
  } catch (error) {
    mog('SearchIndexByNodeIdError', { error, nodeId })
  }
}

export const updateOrAppendBlocks = async (doc: IUpdateDoc) => {
  try {
    if (!searchWorker) throw new Error('Search Worker Not Initialized')

    const results = await searchWorker.updateBlock(doc)
    return results
  } catch (error) {
    mog('UpdateOrAppendBlocksError', { error, nodeId: doc.id })
  }
}

export const searchIndexWithRanking = async (key: Indexes, query: ISearchQuery) => {
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
