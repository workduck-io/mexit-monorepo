import { useEffect } from 'react'

import { convertContentToRawText, extractLinksFromData, extractMetadata, mog, runBatch, Snippet } from '@mexit/core'
import { useSlashCommands } from '@mexit/shared'

import { useContentStore } from '../Stores/useContentStore'
import useDataStore from '../Stores/useDataStore'
import { useDescriptionStore } from '../Stores/useDescriptionStore'
import { useHighlightStore } from '../Stores/useHighlightStore'
import { useInitStore } from '../Stores/useInitStore'
import { useLinkStore } from '../Stores/useLinkStore'
import { useSmartCaptureStore } from '../Stores/useSmartCaptureStore'
import { useSnippetStore } from '../Stores/useSnippetStore'
import {
  getSearchIndexInitState,
  initSearchIndex,
  startRequestsWorkerService,
  wInitHighlights,
  wInitLinks,
  wInitNamespaces,
  wInitSmartCaptures,
  wInitSnippets
} from '../Sync/invokeOnWorker'
import { deserializeContent } from '../Utils/serializer'

import { useAuthStore } from './useAuth'
import { useSearch } from './useSearch'
import { useUpdater } from './useUpdater'

export const useInitLoader = () => {
  const isAuthenticated = useAuthStore((store) => store.authenticated)
  const iframeAdded = useInitStore((store) => store.iframeAdded)
  //   const initHighlightBlockMap = useHighlightStore((store) => store.initHighlightBlockMap)

  const snippetHydrated = useSnippetStore((store) => store._hasHydrated)
  const dataStoreHydrated = useDataStore((store) => store._hasHydrated)
  const contentStoreHydrated = useContentStore((store) => store._hasHydrated)

  const initSnippets = useSnippetStore((store) => store.initSnippets)

  const { setNamespaces, setIlinks, addInArchive } = useDataStore()

  const { updateFromContent } = useUpdater()
  const updateSnippetZus = useSnippetStore((store) => store.updateSnippet)
  const updateDescription = useDescriptionStore((store) => store.updateDescription)
  const setSlashCommands = useDataStore((store) => store.setSlashCommands)

  const { generateSlashCommands } = useSlashCommands()
  const { removeDocument, updateDocument } = useSearch()

  const setLinks = useLinkStore((store) => store.setLinks)
  const setHighlights = useHighlightStore((store) => store.setHighlights)
  const setConfig = useSmartCaptureStore((s) => s.setSmartCaptureList)

  const getAllNamespaces = async () => {
    const localILinks = useDataStore.getState().ilinks
    const { response, ns, newILinks, archivedILinks } = await wInitNamespaces(localILinks)

    mog('NamespacesInitResponse: ', { response, ns, newILinks, archivedILinks })

    setNamespaces(ns)

    setIlinks(newILinks)
    addInArchive(archivedILinks)

    const promises = []

    response.fulfilled.forEach((nodes) => {
      if (nodes) {
        const { rawResponse } = nodes

        if (rawResponse) {
          rawResponse.forEach((nodeResponse) => {
            const metadata = extractMetadata(nodeResponse) // added by Varshitha
            const content = deserializeContent(nodeResponse.data)

            promises.push(updateFromContent(nodeResponse.id, content, metadata))
          })
        }
      }
    })

    await Promise.allSettled(promises)
  }

  const updateSnippet = async (snippet: Snippet) => {
    updateSnippetZus(snippet.id, snippet)
    const tags = snippet?.template ? ['template'] : ['snippet']
    const idxName = snippet?.template ? 'template' : 'snippet'

    if (snippet?.template) {
      await removeDocument('snippet', snippet.id)
    } else {
      await removeDocument('template', snippet.id)
    }
    await updateDocument(idxName, snippet.id, snippet.content, snippet.title, tags)

    const slashCommands = generateSlashCommands(useSnippetStore.getState().snippets)
    setSlashCommands(slashCommands)

    updateDescription(snippet.id, {
      rawText: convertContentToRawText(snippet.content, '\n'),
      truncatedContent: snippet.content.slice(0, 8)
    })
  }

  const getAllSnippets = async () => {
    const localSnippets = useSnippetStore.getState().snippets
    const { newSnippets, response } = await wInitSnippets(localSnippets)

    initSnippets([...localSnippets, ...newSnippets])
    response.fulfilled.forEach(async (snippets) => {
      if (snippets) {
        mog('UpdatingSnippetsInExtension', { snippets })
        snippets.forEach((snippet) => {
          updateSnippet(snippet)
        })
      }
    })
  }

  const getAllLinks = async () => {
    const d = await wInitLinks()
    const links = extractLinksFromData(d)
    setLinks(links)
  }

  const getAllHighlights = async () => {
    const d = await wInitHighlights()
    setHighlights(d)
  }

  const getAllSmartCaptures = async () => {
    const d = await wInitSmartCaptures()
  }

  const fetchAll = async () => {
    runBatch<any>([getAllNamespaces(), getAllSnippets(), getAllLinks(), getAllHighlights(), getAllSmartCaptures()])
  }

  const startWorkers = async () => {
    mog('Starting Workers')
    const promises = [startRequestsWorkerService()]
    const searchIndexInitState = await getSearchIndexInitState()
    if (!searchIndexInitState) {
      const initData = {
        ilinks: useDataStore.getState().ilinks,
        archive: useDataStore.getState().archive,
        sharedNodes: useDataStore.getState().sharedNodes,
        snippets: useSnippetStore.getState().snippets,
        contents: useContentStore.getState().contents
      }
      mog('Search Worker was not initialized. Initializing', { initData })

      promises.push(initSearchIndex(initData))
    }

    await Promise.allSettled(promises)
  }

  useEffect(() => {
    if (isAuthenticated && snippetHydrated && dataStoreHydrated && contentStoreHydrated && iframeAdded) {
      startWorkers()
        .then(() => {
          mog('All workers initialized from extension. Fetching data now')
          fetchAll()
        })
        .catch((error) => {
          mog('Error while initializing: ', { error })
        })
    }
  }, [isAuthenticated, snippetHydrated, dataStoreHydrated, contentStoreHydrated, iframeAdded])
}
