import { spawn, Worker } from 'threads'

// eslint-disable-next-line
// import workerURL from 'threads-plugin/dist/loader?name=worker!./analysis.ts'
// // @ts-expect-error it don't want .ts
// //eslint-disable-next-line
// import searchWorkerURL from 'threads-plugin/dist/loader?name=searchWorker!./search.ts'
import { NodeEditorContent, PersistentData, idxKey } from '@mexit/core'
import { mog } from '@workduck-io/mex-editor'

export const WORKER_LOCATION = '/apps/webapp/src/Utils/Workers'
export let worker = null

export let search_worker = null

const workerURL = new URL('./analysis.ts', import.meta.url).toString()
const searchWorkerURL = new URL('./search.ts', import.meta.url).toString()

export const startAnalysisWorkerService = async () => {
  console.log('startWorkerService')
  if (!worker) worker = await spawn(new Worker(workerURL))
}

export interface AnalysisOptions {
  title?: boolean
}

export interface AnalyseContentProps {
  content: NodeEditorContent
  nodeid: string
  options?: AnalysisOptions
}

export const analyseContent = async (props: AnalyseContentProps, callback: (data: any) => void) => {
  try {
    if (!worker) {
      await startAnalysisWorkerService()
      console.log('Creating new analysis worker')
    } else {
      console.log('Reusing analysis worker')
    }
    const analysis = await worker.analyseContent(props)
    callback(analysis)
  } catch (error) {
    console.log(error)
    callback({ outline: [], tags: [] })
  }
}
export const startSearchWorker = async () => {
  console.log('startSearchWorkerService')
  if (!search_worker) search_worker = await spawn(new Worker(searchWorkerURL))
}
export const initSearchIndex = async (fileData: PersistentData, indexData: Record<idxKey, any>) => {
  try {
    if (!search_worker) {
      console.log('Creating new search worker')
      await startSearchWorker()
      await search_worker.init(fileData, indexData)
    } else {
      console.log('Found existing search worker, reusing')
    }
  } catch (error) {
    mog('InitSearchWorkerError', { error })
  }
}

export const addDoc = async (key: idxKey, nodeId: string, contents: any[], title: string, tags?: Array<string>) => {
  try {
    if (!search_worker) throw new Error('Search Worker Not Initialized')
    await search_worker.addDoc(key, nodeId, contents, title, tags)
  } catch (error) {
    mog('AddDocIndexError', { error })
  }
}

export const updateDoc = async (key: idxKey, nodeId: string, contents: any[], title: string, tags?: Array<string>) => {
  try {
    if (!search_worker) throw new Error('Search Worker Not Initialized')
    await search_worker.updateDoc(key, nodeId, contents, title, tags)
  } catch (error) {
    mog('UpdateDocIndexError', { error })
  }
}

export const removeDoc = async (key: idxKey, id: string) => {
  try {
    if (!search_worker) throw new Error('Search Worker Not Initialized')
    await search_worker.removeDoc(key, id)
  } catch (error) {
    mog('RemoveDocIndexError', { error })
  }
}

export const searchIndex = async (key: idxKey, query: string, tags?: Array<string>) => {
  try {
    if (!search_worker) throw new Error('Search Worker Not Initialized')

    const results = await search_worker.searchIndex(key, query, tags)
    return results
  } catch (error) {
    mog('SearchIndexError', { error })
  }
}

export const dumpIndexDisk = async (location: string) => {
  try {
    if (!search_worker) throw new Error('Search Worker Not Initialized')
    await search_worker.dumpIndexDisk(location)
  } catch (error) {
    mog('ErrorDumpingIndexToDisk', { error })
  }
}

export const searchIndexByNodeId = async (key: idxKey, nodeId: string, query: string) => {
  try {
    if (!search_worker) throw new Error('Search Worker Not Initialized')

    const results = await search_worker.searchIndexByNodeId(key, nodeId, query)
    return results
  } catch (error) {
    mog('SearchIndexByNodeIdError', { error, nodeId })
  }
}

export const searchIndexWithRanking = async (key: idxKey | idxKey[], query: string) => {
  try {
    if (!search_worker) throw new Error('Search Worker Not Initialized')

    const results = await search_worker.searchIndexWithRanking(key, query)
    return results
  } catch (error) {
    mog('SearchIndexError', { error })
  }
}
