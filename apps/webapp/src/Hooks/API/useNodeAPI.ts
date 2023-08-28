import {
  API,
  batchArray,
  DEFAULT_NAMESPACE,
  defaultContent,
  deserializeContent,
  extractMetadata,
  GET_REQUEST_MINIMUM_GAP_IN_MS,
  getDefaultContent,
  getTagsFromContent,
  getTodosFromContent,
  mog,
  NodeEditorContent,
  removeNulls,
  serializeContent,
  useAuthStore,
  useContentStore,
  useMetadataStore,
  useTodoStore
} from '@mexit/core'
import { DefaultMIcons, useLinks, useNodes } from '@mexit/shared'

import { WorkerRequestType } from '../../Utils/worker'
import { runBatchWorker } from '../../Workers/controller'
import { useInternalLinks } from '../useInternalLinks'
import { useLastOpened } from '../useLastOpened'
import { useNamespaces } from '../useNamespaces'
import { useSnippets } from '../useSnippets'
import { useUpdater } from '../useUpdater'

export const useApi = () => {
  const addMetadata = useMetadataStore((store) => store.addMetadata)
  const updateMetadata = useMetadataStore((store) => store.updateMetadata)
  const setContent = useContentStore((store) => store.setContent)
  const { getTitleFromNoteId } = useLinks()
  const updateNodeTodos = useTodoStore((store) => store.replaceContentOfTodos)
  const { updateILinksFromAddedRemovedPaths } = useInternalLinks()
  const { updateFromContent } = useUpdater()
  const { getSharedNode } = useNodes()
  const { getNamespaceOfNodeid } = useNamespaces()
  const { updateSnippets, getSnippet } = useSnippets()

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
    const content = options.content ?? [getDefaultContent()]
    mog('saveSingleNewNode', { noteID, namespaceID, options, content })
    const reqData = {
      id: noteID,
      title: getTitleFromNoteId(noteID),
      referenceID: options?.parentNoteId,
      namespaceID: namespaceID,
      data: serializeContent(content),
      tags: getTagsFromContent(content)
    }

    const data = await API.node
      .save(reqData)
      .then((d) => {
        const metadata = extractMetadata(d, { icon: DefaultMIcons.NOTE })
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
    options.content = options.content ?? [getDefaultContent()]

    const reqData = {
      nodePath: {
        path: options.path,
        namespaceID: namespaceID
      },
      id: noteID,
      title: getTitleFromNoteId(noteID),
      namespaceID: namespaceID,
      tags: getTagsFromContent(options.content),
      data: serializeContent(options.content)
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
      addMetadata('notes', { [noteID]: extractMetadata(node, { icon: DefaultMIcons.NOTE }) })
      addLastOpened(noteID)
    })

    return data
  }

  const appendToNode = async (noteId: string, content: NodeEditorContent, options?: { isShared?: boolean }) => {
    const reqData = {
      type: 'ElementRequest',
      elements: serializeContent(content)
    }

    // * TODO: Add append to Note for shared notes

    const res = await API.node.append(noteId, reqData)

    if (res) {
      // toast('Task added!')
    }
  }

  /**
   * Move Block from One Note to Another without block Data
   */

  const moveBlock = async (blockId: string, sourceNodeId: string, destinationNodeId: string) => {
    const sourceNamespaceId = getNamespaceOfNodeid(sourceNodeId)?.id
    const destinationNamespaceId = getNamespaceOfNodeid(destinationNodeId)?.id

    const res = await API.node.move({
      blockId,
      sourceNodeId,
      destinationNodeId,
      sourceNamespaceId,
      destinationNamespaceId
    })

    return res
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
      data: serializeContent(content ?? defaultContent.content)
    }

    if (isShared) {
      const node = getSharedNode(noteID)
      if (node.currentUserAccess[noteID] === 'READ') return
      reqData['namespaceID'] = undefined
    }

    const dataPromise = isShared ? API.share.updateNode(reqData) : API.node.save(reqData)

    const data = await dataPromise
      .then((d) => {
        let metadata = useMetadataStore.getState().metadata.notes[noteID] ?? {}
        const contentToSet = d?.data ? deserializeContent(d.data) : content

        if (isShared) {
          metadata = {
            ...metadata,
            updatedAt: Date.now(),
            lastEditedBy: currentUser.id
          }
        }

        if (d) {
          metadata = { ...metadata, ...(extractMetadata(d) ?? {}) }
        }

        updateFromContent(noteID, contentToSet, metadata)

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
      .getById(nodeid, { enabled: !isRefresh && !isShared, expiry: GET_REQUEST_MINIMUM_GAP_IN_MS })
      .then((d) => {
        if (d) {
          const content = d?.data?.length ? deserializeContent(d.data) : defaultContent.content
          const metadata = extractMetadata(d, { icon: isShared ? DefaultMIcons.SHARED_NOTE : DefaultMIcons.NOTE })
          if (isUpdate) updateFromContent(nodeid, content, metadata)

          return { data: content, metadata, version: d.version ?? undefined }
        }
      })
      .catch((e) => {
        console.error(`MexError: Fetching nodeid ${nodeid} failed with: `, e)
        return undefined
      })

    return res
  }

  const setPublic = (noteId: string, isPublic: boolean) => {
    updateMetadata('notes', noteId, { publicAccess: isPublic })
  }

  const makeNotePublic = async (nodeId: string) => {
    return await API.node
      .makePublic(nodeId)
      .then((resp) => {
        setPublic(nodeId, true)
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
        setPublic(nodeId, false)
        return nodeId
      })
      .catch((error) => {
        mog('makeNotePrivateError', { error })
      })
  }

  const getPublicNodeAPI = async (nodeId: string) => {
    if (!nodeId) return

    const res = await API.node.getPublic(nodeId, { enabled: true, expiry: GET_REQUEST_MINIMUM_GAP_IN_MS }).then((d) => {
      if (!d) return

      const metadata = {
        createdBy: d.createdBy,
        createdAt: d.createdAt,
        lastEditedBy: d.lastEditedBy,
        updatedAt: d.updatedAt,
        icon: d?.metadata?.icon
      }

      return {
        title: d.title,
        data: d.data,
        metadata: removeNulls(metadata),
        version: d.version ?? undefined
      }
    })

    if (res) {
      const content = deserializeContent(res.data)
      const todos = getTodosFromContent(content)
      updateNodeTodos(nodeId, todos)

      return {
        id: nodeId,
        title: res.title ?? '',
        content: content,
        metadata: res.metadata ?? undefined,
        version: res.version
      }
    }
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
      data: serializeContent(content ?? defaultContent.content),
      template: template ?? false
    }

    const data = await API.snippet
      .create(reqData)
      .then((d) => {
        mog('savedData', { d })
        updateMetadata('snippets', snippetId, extractMetadata(d, { icon: DefaultMIcons.SNIPPET }))
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
        const newSnippets = d.filter((snippet) => {
          const existSnippet = getSnippet(snippet.snippetID)
          return existSnippet === undefined
        })

        return newSnippets
      })
      .then(async (newSnippets) => {
        const toUpdateSnippets = newSnippets?.map((item) => item.snippetID)
        // mog('NewSnippets', { newSnippets, toUpdateSnippets })

        if (toUpdateSnippets && toUpdateSnippets.length > 0) {
          const ids = batchArray(toUpdateSnippets, 10)
          if (ids && ids.length > 0) {
            try {
              const res = await runBatchWorker(WorkerRequestType.GET_SNIPPETS, 6, ids)
              res.fulfilled.forEach(async (snippets) => {
                const snippetsRecord = snippets.reduce((prev, snippet) => ({ ...prev, [snippet.id]: snippet }), {})
                await updateSnippets(snippetsRecord)
              })
              mog('RunBatchWorkerSnippetsRes, updateSnippets', { res, ids })
            } catch (error) {
              mog('SnippetsWorkerError', { error })
            }
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
    getPublicNodeAPI,
    appendToNode,
    saveSnippetAPI,
    getAllSnippetsByWorkspace,
    getById,
    moveBlock,
    refactorHierarchy,
    deleteAllVersionOfSnippet
  }
}
