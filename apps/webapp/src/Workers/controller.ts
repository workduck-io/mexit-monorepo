import { spawn } from 'threads'
import { NodeEditorContent, PersistentData, idxKey, mog, SearchRepExtra } from '@mexit/core'

import analysisWorkerConstructor from './analysis?worker'
import searchWorkerConstructor from './search?worker'
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

export let analysisWorker = null
export let searchWorker = null

export const startAnalysisWorkerService = async () => {
  // console.log('startWorkerService')
  if (!analysisWorker) analysisWorker = await spawn(new analysisWorkerConstructor())
}

export const analyseContent = async (props: AnalyseContentProps) => {
  try {
    if (!analysisWorker) {
      await startAnalysisWorkerService()
      // console.log('Creating new analysis worker')
    } else {
      // console.log('Reusing analysis worker')
    }
    const analysis = await analysisWorker.analyseContent(props)
    return analysis
  } catch (error) {
    console.log(error)
    return
  }
}
export const startSearchWorker = async () => {
  if (!searchWorker) searchWorker = await spawn(new searchWorkerConstructor())
}

export const initSearchIndex = async (fileData: Partial<PersistentData>) => {
  try {
    if (!searchWorker) {
      await startSearchWorker()
      await searchWorker.init(fileData)
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
