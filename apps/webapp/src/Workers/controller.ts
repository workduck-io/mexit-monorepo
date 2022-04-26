import { spawn, Worker } from 'threads'
import { NodeEditorContent, PersistentData, idxKey, mog } from '@mexit/core'

export interface AnalysisOptions {
  title?: boolean
}

export interface AnalyseContentProps {
  content: NodeEditorContent
  nodeid: string
  options?: AnalysisOptions
}

// const testWorkerURL = new URL('./test.ts', import.meta.url).toString()
// @ts-expect-error it don't want .ts
// eslint-disable-next-line
import testWorkerURL from 'threads-plugin/dist/loader?name=test!./test.ts'

// @ts-expect-error it don't want .ts
// eslint-disable-next-line
import analysisWorkerURL from 'threads-plugin/dist/loader?name=analysis!./analysis.ts'

// @ts-expect-error it don't want .ts
// eslint-disable-next-line
import searchWorkerURL from 'threads-plugin/dist/loader?name=search!./search.ts'

// import workerURL from 'threads-plugin/dist/loader?name=test!./test.ts'

export let testWorker = null
export let analysisWorker = null
export let searchWorker = null

export const startTestWorker = async () => {
  console.log('Starting Test Worker')
  if (!testWorker) {
    testWorker = await spawn(new Worker(testWorkerURL))
  }
}

export const hashPasswordWithWorker = async (data: any) => {
  try {
    if (!testWorker) {
      await startTestWorker()
      console.log('Starting new test worker')
    } else {
      console.log('Reusing test worker')
    }

    const results = testWorker.hashPassword(data)
    return results
  } catch (error) {
    console.log('Error occured in testWorker: ', error)
  }
}

export const startAnalysisWorkerService = async () => {
  console.log('startWorkerService')
  if (!analysisWorker) analysisWorker = await spawn(new Worker(analysisWorkerURL))
}

export const analyseContent = async (props: AnalyseContentProps) => {
  try {
    if (!analysisWorker) {
      await startAnalysisWorkerService()
      console.log('Creating new analysis worker')
    } else {
      console.log('Reusing analysis worker')
    }
    const analysis = await analysisWorker.analyseContent(props)
    return analysis
  } catch (error) {
    console.log(error)
    return
  }
}
export const startSearchWorker = async () => {
  console.log('startSearchWorkerService')
  if (!searchWorker) searchWorker = await spawn(new Worker(searchWorkerURL))
}
export const initSearchIndex = async (fileData: PersistentData, indexData: Record<idxKey, any>) => {
  try {
    if (!searchWorker) {
      console.log('Creating new search worker')
      await startSearchWorker()
      await searchWorker.init(fileData, indexData)
    } else {
      console.log('Found existing search worker, reusing')
    }
  } catch (error) {
    mog('InitSearchWorkerError', { error })
  }
}

export const addDoc = async (key: idxKey, nodeId: string, contents: any[], title: string, tags?: Array<string>) => {
  try {
    if (!searchWorker) throw new Error('Search Worker Not Initialized')
    await searchWorker.addDoc(key, nodeId, contents, title, tags)
  } catch (error) {
    mog('AddDocIndexError', { error })
  }
}

export const updateDoc = async (key: idxKey, nodeId: string, contents: any[], title: string, tags?: Array<string>) => {
  try {
    if (!searchWorker) throw new Error('Search Worker Not Initialized')
    await searchWorker.updateDoc(key, nodeId, contents, title, tags)
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

export const searchIndex = async (key: idxKey, query: string, tags?: Array<string>) => {
  try {
    if (!searchWorker) throw new Error('Search Worker Not Initialized')

    const results = await searchWorker.searchIndex(key, query, tags)
    return results
  } catch (error) {
    mog('SearchIndexError', { error })
  }
}

export const dumpIndexDisk = async (location: string) => {
  try {
    if (!searchWorker) throw new Error('Search Worker Not Initialized')
    await searchWorker.dumpIndexDisk(location)
  } catch (error) {
    mog('ErrorDumpingIndexToDisk', { error })
  }
}

export const searchIndexByNodeId = async (key: idxKey, nodeId: string, query: string) => {
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
