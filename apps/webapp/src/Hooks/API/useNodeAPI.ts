import {
  API,
  batchArray,
  DEFAULT_NAMESPACE,
  defaultContent,
  extractMetadata,
  GET_REQUEST_MINIMUM_GAP_IN_MS,
  getTagsFromContent,
  getTodosFromContent,
  mog,
  NodeEditorContent,
  removeNulls
} from '@mexit/core'

import { useAuthStore } from '../../Stores/useAuth'
import { useContentStore } from '../../Stores/useContentStore'
import { useDataStore } from '../../Stores/useDataStore'
import { useSnippetStore } from '../../Stores/useSnippetStore'
import { useTodoStore } from '../../Stores/useTodoStore'
import { deserializeContent, serializeContent } from '../../Utils/serializer'
import { WorkerRequestType } from '../../Utils/worker'
import { runBatchWorker } from '../../Workers/controller'
import { useInternalLinks } from '../useInternalLinks'
import { useLastOpened } from '../useLastOpened'
import { useLinks } from '../useLinks'
import { useNodes } from '../useNodes'
import { useSnippets } from '../useSnippets'
import { useUpdater } from '../useUpdater'

export const useApi = () => {
  const getMetadata = useContentStore((store) => store.getMetadata)
  const setMetadata = useContentStore((store) => store.setMetadata)
  const setContent = useContentStore((store) => store.setContent)
  const { getTitleFromNoteId } = useLinks()
  const updateNodeTodos = useTodoStore((store) => store.replaceContentOfTodos)
  const { updateILinksFromAddedRemovedPaths } = useInternalLinks()
  const { setNodePublic, setNodePrivate, checkNodePublic } = useDataStore()
  const { updateFromContent } = useUpdater()
  const { getSharedNode } = useNodes()
  const initSnippets = useSnippetStore((store) => store.initSnippets)
  const { updateSnippet } = useSnippets()

  const currentUser = useAuthStore((store) => store.userDetails)

  const { addLastOpened } = useLastOpened()

  /*
   * Saves new node data in the backend
   * Also updates the incoming data in the store
   */

  const saveSingleNewNode = async (
    noteID: string,
    namespaceID: string,
    options?: {
      path: string
      parentNoteId: string
      content: NodeEditorContent
    }
  ) => {
    const reqData = {
      id: noteID,
      title: getTitleFromNoteId(noteID),
      referenceID: options?.parentNoteId,
      namespaceID: namespaceID,
      data: serializeContent(options.content ?? defaultContent.content, noteID),
      tags: getTagsFromContent(options.content)
    }

    const data = await API.node
      .save(reqData)
      .then((d) => {
        const metadata = extractMetadata(d)
        const content = d.data ? deserializeContent(d.data) : options.content
        updateFromContent(noteID, content, metadata)
        addLastOpened(noteID)
        return d
      })
      .catch((e) => {
        console.error(e)
      })

    return data
  }

  const bulkCreateNodes = async (
    noteID: string,
    namespaceID: string,
    options: {
      path: string
      content: NodeEditorContent
    }
  ) => {
    options.content = options.content ?? defaultContent.content

    const reqData = {
      nodePath: {
        path: options.path,
        namespaceID: namespaceID
      },
      id: noteID,
      title: getTitleFromNoteId(noteID),
      namespaceID: namespaceID,
      tags: getTagsFromContent(options.content),
      data: serializeContent(options.content, noteID)
    }
    mog('BulkCreateNodes', { reqData, noteID, namespaceID, options })
    setContent(noteID, options.content)

    const data = await API.node.bulkCreate(reqData).then((d) => {
      const addedILinks = []
      const removedILinks = []
      const { changedPaths, node } = d
      Object.entries(changedPaths).forEach(([nsId, changed]: [string, any]) => {
        const { addedPaths: nsAddedILinks, removedPaths: nsRemovedILinks } = changed
        addedILinks.push(...nsAddedILinks)
        removedILinks.push(...nsRemovedILinks)
      })

      updateILinksFromAddedRemovedPaths(addedILinks, removedILinks)
      setMetadata(noteID, extractMetadata(node))
      addLastOpened(noteID)
    })

    return data
  }

  const appendToNode = async (noteId: string, content: NodeEditorContent, options?: { isShared?: boolean }) => {
    const reqData = {
      type: 'ElementRequest',
      elements: serializeContent(content, noteId)
    }

    // * TODO: Add append to Note for shared notes

    const res = await API.node.append(noteId, reqData)

    if (res) {
      // toast('Task added!')
    }
  }

  /*
   * Saves data in the backend
   * Also updates the incoming data in the store
   */
  const saveDataAPI = async (
    noteID: string,
    namespaceID: string,
    content: NodeEditorContent,
    isShared = false,
    title?: string,
    templateID?: string
  ) => {
    const reqData = {
      id: noteID,
      title: title || getTitleFromNoteId(noteID),
      namespaceID: namespaceID,
      tags: getTagsFromContent(content),
      data: serializeContent(content ?? defaultContent.content, noteID),
      // Because we have to send templateID with every node save call so that it doesn't get unset
      // We are checking if the id is __null__ for the case when the user wants to remove the template
      // If not, we send what was passed as prop, if nothing then from metadata
      metadata: { templateID: templateID === '__null__' ? null : templateID ?? getMetadata(noteID)?.templateID }
    }

    if (isShared) {
      const node = getSharedNode(noteID)
      if (node.currentUserAccess[noteID] === 'READ') return
      reqData['namespaceID'] = undefined
    }

    const dataPromise = isShared ? API.share.updateNode(reqData) : API.node.save(reqData)

    const data = await dataPromise
      .then((d) => {
        const contentToSet = d.data ? deserializeContent(d.data) : content
        const origMetadata = extractMetadata(d)
        const metadata = isShared
          ? {
              ...origMetadata,
              updatedAt: Date.now(),
              lastEditedBy: currentUser.userID
            }
          : extractMetadata(d)

        setContent(noteID, contentToSet, metadata)

        addLastOpened(noteID)
        return d
      })
      .catch((e) => {
        console.error(e)
      })
    return data
  }

  const getDataAPI = async (nodeid: string, isShared = false, isRefresh = false, isUpdate = true) => {
    const res = await API.node
      .getById(nodeid, { enabled: !isRefresh || !isShared, expiry: GET_REQUEST_MINIMUM_GAP_IN_MS })
      .then((d) => {
        if (d) {
          const content = d?.data?.length ? deserializeContent(d.data) : defaultContent.content
          // mog('[API]: Get Note data', { content })
          if (isUpdate) updateFromContent(nodeid, content)

          return { data: content, metadata: extractMetadata(d), version: d.version ?? undefined }
        }
      })
      .catch((e) => {
        console.error(`MexError: Fetching nodeid ${nodeid} failed with: `, e)
        return undefined
      })

    return res
  }

  const makeNotePublic = async (nodeId: string) => {
    return await API.node
      .makePublic(nodeId)
      .then((resp) => {
        setNodePublic(nodeId)
        return nodeId
      })
      .catch((error) => {
        mog('makeNotePublicError', { error })
      })
  }

  const makeNotePrivate = async (nodeId: string) => {
    return await API.node
      .makePrivate(nodeId)
      .then((resp) => {
        setNodePrivate(nodeId)
        return nodeId
      })
      .catch((error) => {
        mog('makeNotePrivateError', { error })
      })
  }

  const getPublicNodeAPI = async (nodeId: string) => {
    const res = await API.node.getPublic(nodeId, { enabled: true, expiry: GET_REQUEST_MINIMUM_GAP_IN_MS }).then((d) => {
      if (!d) return
      const metadata = {
        createdBy: d.createdBy,
        createdAt: d.createdAt,
        lastEditedBy: d.lastEditedBy,
        updatedAt: d.updatedAt
      }

      // console.log(metadata, d.data, todos)
      return {
        title: d.title,
        data: d.data,
        metadata: removeNulls(metadata),
        version: d.version ?? undefined
      }
    })

    const content = deserializeContent(res.data)
    const todos = getTodosFromContent(content)
    updateNodeTodos(nodeId, todos)

    if (res) {
      return {
        id: nodeId,
        title: res.title ?? '',
        content: content,
        metadata: res.metadata ?? undefined,
        version: res.version
      }
    }
  }

  const isPublic = (nodeid: string) => {
    return checkNodePublic(nodeid)
  }

  const saveSnippetAPI = async ({
    snippetId,
    snippetTitle,
    content,
    template
  }: {
    snippetId: string
    snippetTitle: string
    content: any[]
    template?: boolean
  }) => {
    const reqData = {
      id: snippetId,
      type: 'SnippetRequest',
      title: snippetTitle,
      namespaceIdentifier: DEFAULT_NAMESPACE,
      data: serializeContent(content ?? defaultContent.content, snippetId),
      template: template ?? false
    }

    const data = await API.snippet
      .create(reqData)
      .then((d) => {
        mog('savedData', { d })
        setMetadata(snippetId, extractMetadata(d))
        return d
      })
      .catch((e) => {
        console.error(e)
      })
    return data
  }

  const getAllSnippetsByWorkspace = async () => {
    const data = await API.snippet
      .allOfWorkspace()
      .then((d) => {
        const snippets = useSnippetStore.getState().snippets

        const newSnippets = d.filter((snippet) => {
          const existSnippet = snippets.find((s) => s.id === snippet.snippetID)
          return existSnippet === undefined
        })

        initSnippets([
          ...snippets,
          ...newSnippets.map((item) => ({
            icon: 'ri:quill-pen-line',
            id: item.snippetID,
            template: item.template,
            title: item.title,
            content: defaultContent.content
          }))
        ])

        return newSnippets
      })
      .then(async (newSnippets) => {
        const toUpdateSnippets = newSnippets?.map((item) => item.snippetID)
        mog('NewSnippets', { newSnippets, toUpdateSnippets })
        if (toUpdateSnippets && toUpdateSnippets.length > 0) {
          const ids = batchArray(toUpdateSnippets, 10)
          if (ids && ids.length > 0) {
            const res = await runBatchWorker(WorkerRequestType.GET_SNIPPETS, 6, ids)
            res.fulfilled.forEach(async (snippets) => {
              if (snippets) {
                snippets.forEach((snippet) => updateSnippet(snippet))
              }
            })
            mog('RunBatchWorkerSnippetsRes', { res, ids })
          }
        }
      })

    return data
  }

  const getById = async (id: string) => {
    const data = await API.snippet.getById(id)
    return data
  }

  const refactorHierarchy = async (
    existingNodePath: { path: string; namespaceID?: string },
    newNodePath: { path: string; namespaceID?: string },
    nodeId: string
  ) => {
    const reqData = {
      existingNodePath,
      newNodePath,
      nodeID: nodeId
    }

    const data = await API.node.refactor(reqData).catch((error) => {
      console.error(error)
    })

    return data
  }

  const deleteAllVersionOfSnippet = async (snippetID: string) => {
    await API.snippet
      .deleteAllVersions(snippetID)
      .then((response) => {
        mog('SnippetDeleteSuccessful')
      })
      .catch((error) => {
        mog('SnippetDeleteFailed', { error })
      })
  }

  return {
    saveDataAPI,
    getDataAPI,
    bulkCreateNodes,
    saveSingleNewNode,
    makeNotePublic,
    makeNotePrivate,
    isPublic,
    getPublicNodeAPI,
    appendToNode,
    saveSnippetAPI,
    getAllSnippetsByWorkspace,
    getById,
    refactorHierarchy,
    deleteAllVersionOfSnippet
  }
}
