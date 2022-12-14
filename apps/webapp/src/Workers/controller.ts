import { useAuthStore as useInternalAuthStore } from '@workduck-io/dwindle'
import { SharedWorker, spawn } from '@workduck-io/mex-threads.js'

import { idxKey, mog, NodeEditorContent, PersistentData, SearchRepExtra } from '@mexit/core'

import { useAuthStore } from '../Stores/useAuth'
import { WorkerRequestType } from '../Utils/worker'

// import analysisWorkerConstructor from './analysis?worker'
import requestsWorkerConstructor from './requests?worker'
// import searchWorkerConstructor from './search?worker'

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

export const analysisWorker = {
  status: WORKER_STATUS.NOT_STARTED,
  instance: null
}

export const requestsWorker = {
  status: WORKER_STATUS.NOT_STARTED,
  instance: null
}

export const searchWorker = {
  status: WORKER_STATUS.NOT_STARTED,
  instance: null
}

export const startRequestsWorkerService = async () => {
  if (requestsWorker.status === WORKER_STATUS.CRASHED || requestsWorker.status === WORKER_STATUS.NOT_STARTED) {
    requestsWorker.status = WORKER_STATUS.INITIALIZING
    try {
      requestsWorker.instance = await spawn(new requestsWorkerConstructor())
      requestsWorker.status = WORKER_STATUS.RUNNING
    } catch (err) {
      console.error(err)
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

  if (requestsWorker.status !== WORKER_STATUS.RUNNING || !requestsWorker.instance) {
    await startRequestsWorkerService()
    initRequestClient(token, workspaceID)
  }

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
      analysisWorker.instance = await spawn(
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
      searchWorker.instance = await spawn(
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

export const initSearchIndex = async (fileData: Partial<PersistentData>) => {
  try {
    if (searchWorker.status !== WORKER_STATUS.RUNNING || !searchWorker.instance) {
      await startSearchWorker()
      await searchWorker.instance.init(fileData)
    }
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

export const dumpIndexDisk = async (location: string) => {
  try {
    if (searchWorker.status !== WORKER_STATUS.RUNNING) throw new Error('Search Worker Not Initialized')
    await searchWorker.instance.dumpIndexDisk(location)
  } catch (error) {
    mog('ErrorDumpingIndexToDisk', { error })
  }
}

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
