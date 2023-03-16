import { useEffect } from 'react'

import {
  convertContentToRawText,
  DefaultMIcons,
  extractLinksFromData,
  extractMetadata,
  mog,
  nicePromise,
  Snippet,
  useAuthStore,
  useContentStore,
  useDataStore,
  useDescriptionStore,
  useHighlightStore,
  useInitStore,
  useLinkStore,
  useSmartCaptureStore,
  useSnippetStore} from '@mexit/core'
import { useSlashCommands } from '@mexit/shared'

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

import { useSearch } from './useSearch'
import { useUpdater } from './useUpdater'

export const useInitLoader = () => {
  const isAuthenticated = useAuthStore((store) => store.authenticated)
  const iframeAdded = useInitStore((store) => store.iframeAdded)
  //   const initHighlightBlockMap = useHighlightStore((store) => store.initHighlightBlockMap)

  const snippetHydrated = useSnippetStore((store) => store._hasHydrated)
  const dataStoreHydrated = useDataStore((store) => store._hasHydrated)
  const contentStoreHydrated = useContentStore((store) => store._hasHydrated)

  const { setNamespaces, setIlinks, addInArchive } = useDataStore()

  const { updateFromNotes } = useUpdater()
  const updateDescription = useDescriptionStore((store) => store.updateDescription)
  const setSlashCommands = useDataStore((store) => store.setSlashCommands)

  const updateSnippetsInStore = useSnippetStore((state) => state.initSnippets)
  const { removeDocument, updateDocument } = useSearch()

  const setLinks = useLinkStore((store) => store.setLinks)
  const setHighlights = useHighlightStore((store) => store.setHighlights)
  const setConfig = useSmartCaptureStore((s) => s.setSmartCaptureList)

  const { generateSlashCommands } = useSlashCommands()

  const getAllNamespaces = async () => {
    const localILinks = useDataStore.getState().ilinks
    const { response, ns, newILinks, archivedILinks } = await wInitNamespaces(localILinks)

    mog('NamespacesInitResponse: ', { response, ns, newILinks, archivedILinks })

    if (ns.length === 0) {
      return
    }

    setNamespaces(ns)

    setIlinks(newILinks)
    addInArchive(archivedILinks)

    response?.fulfilled?.forEach(async (nodes) => {
      if (nodes) {
        const notes = {}
        const metadatas = {}

        nodes.rawResponse?.map((note) => {
          metadatas[note.id] = extractMetadata(note, { icon: DefaultMIcons.NOTE })
          notes[note.id] = { type: 'editor', content: deserializeContent(note.data) }
        })

        await updateFromNotes(notes, metadatas)
      }
    })
  }

  const updateSnippetIndex = async (snippet) => {
    const tags = snippet?.template ? ['template'] : ['snippet']
    const idxName = snippet?.template ? 'template' : 'snippet'

    if (snippet?.template) {
      await removeDocument('snippet', snippet.id)
    } else {
      await removeDocument('template', snippet.id)
    }
    await updateDocument(idxName, snippet.id, snippet.content, snippet.title, tags)
  }

  const updateSlashCommands = (snippets: Snippet[]) => {
    const slashCommands = generateSlashCommands(snippets)
    setSlashCommands(slashCommands)
  }

  const updateSnippets = async (snippets: Record<string, Snippet>) => {
    const existingSnippets = useSnippetStore.getState().snippets

    const newSnippets = { ...(Array.isArray(existingSnippets) ? {} : existingSnippets), ...snippets }

    updateSnippetsInStore(newSnippets)
    const snippetsArr = Object.values(newSnippets)
    updateSlashCommands(snippetsArr)

    for await (const snippet of snippetsArr) {
      updateDescription(snippet.id, {
        rawText: convertContentToRawText(snippet.content, '\n'),
        truncatedContent: snippet.content.slice(0, 8)
      })
      try {
        await updateSnippetIndex(snippet)
      } catch (error) {
        mog('ErrorUpdatingSnippetIdx', { error })
      }
    }
  }

  const getAllSnippets = async () => {
    const localSnippets = useSnippetStore.getState().snippets
    const { response } = await wInitSnippets(localSnippets)

    response?.fulfilled?.forEach(async (snippets) => {
      const snippetsRecord = snippets.reduce((prev, snippet) => ({ ...prev, [snippet.id]: snippet }), {})
      await updateSnippets(snippetsRecord)
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
    setConfig(d)
  }

  const fetchAll = async () => {
    await nicePromise(getAllNamespaces)
    await nicePromise(getAllSnippets)
    await nicePromise(getAllHighlights)
    await nicePromise(getAllLinks)
    await nicePromise(getAllSmartCaptures)

    // await Promise.allSettled([
    //   getAllNamespaces(),
    //   getAllSnippets(),
    //   getAllHighlights(),
    //   getAllLinks(),
    //   getAllSmartCaptures()
    // ])
    mog('Fetch All Resolved completely')
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
  }, [snippetHydrated, dataStoreHydrated, contentStoreHydrated, iframeAdded])
}
