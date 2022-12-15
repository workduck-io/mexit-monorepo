import { useAuthStore as useInternalAuthStore } from '@workduck-io/dwindle'
import { SharedWorker, spawn, Thread } from '@workduck-io/mex-threads.js'
import { type ExposedToThreadType } from '@workduck-io/mex-threads.js/types/master'
import { type WorkerFunction, type WorkerModule } from '@workduck-io/mex-threads.js/types/worker'

import { idxKey, ILink, mog, NodeEditorContent, PersistentData, SearchRepExtra, Snippet } from '@mexit/core'

import { useAuthStore } from '../Stores/useAuth'
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

enum WORKER_STATUS {
  NOT_STARTED = 'NOT_STARTED',
  INITIALIZING = 'INITIALIZING',
  CRASHED = 'CRASHED',
  RUNNING = 'RUNNING'
}

interface MWorker<T extends WorkerModule<any> | WorkerFunction = any> {
  status: WORKER_STATUS
  instance: null | ExposedToThreadType<T>
}

export const analysisWorker: MWorker<AnalysisWorkerInterface> = {
  status: WORKER_STATUS.NOT_STARTED,
  instance: null
}

export const requestsWorker: MWorker<RequestsWorkerInterface> = {
  status: WORKER_STATUS.NOT_STARTED,
  instance: null
}

export const searchWorker: MWorker<SearchWorkerInterface> = {
  status: WORKER_STATUS.NOT_STARTED,
  instance: null
}

export const startRequestsWorkerService = async () => {
  if (requestsWorker.status === WORKER_STATUS.CRASHED || requestsWorker.status === WORKER_STATUS.NOT_STARTED) {
    requestsWorker.status = WORKER_STATUS.INITIALIZING
    try {
      requestsWorker.instance = await spawn<RequestsWorkerInterface>(
        new SharedWorker(new URL('requests.ts', import.meta.url), {
          type: 'module',
          name: 'Requests Worker'
        })
      )
      const token = useInternalAuthStore.getState().userCred.token
      const workspaceID = useAuthStore.getState().getWorkspaceId()

      initRequestClient(token, workspaceID)
      requestsWorker.status = WORKER_STATUS.RUNNING
    } catch (err) {
      console.error('REQUEST WORKER CRASHED', err)
      requestsWorker.instance = null
      requestsWorker.status = WORKER_STATUS.CRASHED
    }
  }
}

export const runBatchWorker = async (
  requestType: WorkerRequestType,
  batchSize = 6,
  args: any[] | Record<any, any[]>
) => {
  const token = useInternalAuthStore.getState().userCred.token
  const workspaceID = useAuthStore.getState().getWorkspaceId()

  const res = await requestsWorker.instance.runBatchWorker(requestType, batchSize, args)
  return res
}

export const initRequestClient = (token: string, workspaceId: string) => {
  if (requestsWorker.instance) {
    requestsWorker.instance.initializeClient(token, workspaceId)
  }
}

export const terminateRequestWorker = async () => {
  // if (requestsWorker) requestsWorker = await Thread.terminate(requestsWorker)
}

export const startAnalysisWorkerService = async () => {
  if (analysisWorker.status === WORKER_STATUS.CRASHED || analysisWorker.status === WORKER_STATUS.NOT_STARTED) {
    analysisWorker.status = WORKER_STATUS.INITIALIZING
    try {
      analysisWorker.instance = await spawn<AnalysisWorkerInterface>(
        new SharedWorker(new URL('analysis.ts', import.meta.url), {
          type: 'module',
          name: 'Analysis Worker'
        })
      )
      analysisWorker.status = WORKER_STATUS.RUNNING
    } catch (err) {
      analysisWorker.instance = null
      analysisWorker.status = WORKER_STATUS.CRASHED
    }
  }
}

export const analyseContent = async (props: AnalyseContentProps) => {
  try {
    if (analysisWorker.status !== WORKER_STATUS.RUNNING || !analysisWorker.instance) {
      await startAnalysisWorkerService()
      // console.log('Creating new analysis worker')
    } else {
      // console.log('Reusing analysis worker')
    }
    const analysis = await analysisWorker.instance.analyseContent(props)
    return analysis
  } catch (error) {
    console.log(error)
    return
  }
}
export const startSearchWorker = async () => {
  // console.log('MILLAAAA KYAAAAA', { w: requestsWorker, r: !!requestsWorker })
  if (searchWorker.status === WORKER_STATUS.CRASHED || searchWorker.status === WORKER_STATUS.NOT_STARTED) {
    searchWorker.status = WORKER_STATUS.INITIALIZING
    try {
      searchWorker.instance = await spawn<SearchWorkerInterface>(
        new SharedWorker(new URL('search.ts', import.meta.url), {
          type: 'module',
          name: 'Search Worker'
        })
      )
      searchWorker.status = WORKER_STATUS.RUNNING
    } catch (err) {
      searchWorker.instance = null
      searchWorker.status = WORKER_STATUS.CRASHED
    }
  }
}

export const getSearchIndexInitState = async () => {
  try {
    if (searchWorker.status !== WORKER_STATUS.RUNNING || !searchWorker.instance) {
      await startSearchWorker()
    }

    return await searchWorker.instance.getInitState()
  } catch (error) {
    mog('InitSearchWorkerError', { error })
  }
}

export const initSearchIndex = async (fileData: Partial<PersistentData>) => {
  try {
    if (searchWorker.status !== WORKER_STATUS.RUNNING || !searchWorker.instance) {
      await startSearchWorker()
    }

    await searchWorker.instance.init(fileData)
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
    if (searchWorker.status !== WORKER_STATUS.RUNNING) throw new Error('Search Worker Not Initialized')
    await searchWorker.instance.addDoc(key, nodeId, contents, title, tags, extra)
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
    if (searchWorker.status !== WORKER_STATUS.RUNNING) throw new Error('Search Worker Not Initialized')
    await searchWorker.instance.updateDoc(key, nodeId, contents, title, tags, extra)
  } catch (error) {
    mog('UpdateDocIndexError', { error })
  }
}

export const removeDoc = async (key: idxKey, id: string) => {
  try {
    if (searchWorker.status !== WORKER_STATUS.RUNNING) throw new Error('Search Worker Not Initialized')
    await searchWorker.instance.removeDoc(key, id)
  } catch (error) {
    mog('RemoveDocIndexError', { error })
  }
}

export const searchIndex = async (key: idxKey | idxKey[], query: string, tags?: Array<string>) => {
  try {
    if (searchWorker.status !== WORKER_STATUS.RUNNING) throw new Error('Search Worker Not Initialized')

    const results = await searchWorker.instance.searchIndex(key, query, tags)
    return results
  } catch (error) {
    mog('SearchIndexError', { error })
  }
}

// export const dumpIndexDisk = async (location: string) => {
//   try {
//     if (searchWorker.status !== WORKER_STATUS.RUNNING) throw new Error('Search Worker Not Initialized')
//     await searchWorker.instance.dumpIndexDisk(location)
//   } catch (error) {
//     mog('ErrorDumpingIndexToDisk', { error })
//   }
// }

export const searchIndexByNodeId = async (key: idxKey | idxKey[], nodeId: string, query: string) => {
  try {
    if (searchWorker.status !== WORKER_STATUS.RUNNING) throw new Error('Search Worker Not Initialized')

    const results = await searchWorker.instance.searchIndexByNodeId(key, nodeId, query)
    return results
  } catch (error) {
    mog('SearchIndexByNodeIdError', { error, nodeId })
  }
}

export const searchIndexWithRanking = async (key: idxKey | idxKey[], query: string) => {
  try {
    if (searchWorker.status !== WORKER_STATUS.RUNNING) throw new Error('Search Worker Not Initialized')

    const results = await searchWorker.instance.searchIndexWithRanking(key, query)
    return results
  } catch (error) {
    mog('SearchIndexError', { error })
  }
}

export const terminateAllWorkers = async () => {
  await Thread.terminate(analysisWorker.instance)
  analysisWorker.status = WORKER_STATUS.NOT_STARTED
  analysisWorker.instance = null

  await Thread.terminate(requestsWorker.instance)
  requestsWorker.status = WORKER_STATUS.NOT_STARTED
  requestsWorker.instance = null

  await Thread.terminate(searchWorker.instance)
  searchWorker.status = WORKER_STATUS.NOT_STARTED
  searchWorker.instance = null
}

export const initNamespacesExtension = async (localILinks: ILink[]) => {
  try {
    if (requestsWorker.status !== WORKER_STATUS.RUNNING) throw new Error('Requests worker not initialized')
    const results = await requestsWorker.instance.initializeNamespacesExtension(localILinks)
    return results
  } catch (error) {
    mog('InitNamespacesExtension', { error })
  }
}

export const initSnippetsExtension = async (localSnippets: Snippet[]) => {
  try {
    if (requestsWorker.status !== WORKER_STATUS.RUNNING) throw new Error('Requests worker not initialized')

    const results = await requestsWorker.instance.initializeSnippetsExtension(localSnippets)
    return results
  } catch (error) {
    mog('InitSnippetsError', { error })
  }
}

export const initLinksExtension = async () => {
  try {
    if (requestsWorker.status !== WORKER_STATUS.RUNNING) throw new Error('Requests worker not initialized')

    const results = await requestsWorker.instance.initializeLinksExtension()
    return results
  } catch (error) {
    return undefined
  }
}

export const initHighlightsExtension = async () => {
  try {
    if (requestsWorker.status !== WORKER_STATUS.RUNNING) throw new Error('Requests worker not initialized')

    const results = await requestsWorker.instance.initializeHighlightsExtension()
    return results
  } catch (error) {
    return undefined
  }
}

export const initSmartCapturesExtension = async () => {
  try {
    if (requestsWorker.status !== WORKER_STATUS.RUNNING) throw new Error('Requests worker not initialized')

    const results = await requestsWorker.instance.initializeSmartCapturesExtension()
    return results
  } catch (error) {
    return undefined
  }
}
