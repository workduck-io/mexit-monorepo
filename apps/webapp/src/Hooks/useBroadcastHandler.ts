import {
  deserializeContent,
  mog,
  SEPARATOR,
  UpdateData,
  UpdateKey,
  useDataStore,
  useHighlightStore,
  useLinkStore,
  userPreferenceStore as useUserPreferenceStore,
  useTimestampStore,
  useViewStore
} from '@mexit/core'

import { useLinks } from './useLinks'
import { useNamespaces } from './useNamespaces'
import { RefactorResponse, useRefactor } from './useRefactor'
import { useSnippets } from './useSnippets'
import { useUpdater } from './useUpdater'

const useBroadcastHandler = () => {
  const { deleteSnippet, addSnippet, updateSnippet } = useSnippets()
  const addViewStore = useViewStore((store) => store.addView)
  const removeViewStore = useViewStore((store) => store.removeView)
  const removeHighlightFromStore = useHighlightStore((store) => store.removeHighlight)
  const addHighlightInStore = useHighlightStore((store) => store.addHighlightEntity)
  const setLinks = useLinkStore((store) => store.setLinks)
  const addNamespace = useDataStore((store) => store.addNamespace)
  const updateNamespace = useDataStore((store) => store.updateNamespace)
  const { getNamespace } = useNamespaces()
  const addSpace = useDataStore((store) => store.addSpace)
  const deleteNamespace = useDataStore((store) => store.deleteNamespace)
  const { execRefactorFromResponse } = useRefactor()
  const addILink = useDataStore((store) => store.addILink)
  const { updateFromContent } = useUpdater()
  const { getPathFromNodeid } = useLinks()
  const { getDefaultNamespaceId } = useNamespaces()
  const updateActiveNamespace = useUserPreferenceStore((s) => s.setActiveNamespace)
  const updateTimestamp = useTimestampStore((s) => s.setTimestamp)

  const lookup: Partial<Record<UpdateKey, (data: UpdateData) => void>> = {
    'HIGHLIGHT-CREATE': (data) => addHighlightInStore({ entityId: data.entityId, properties: data.payload.properties }),
    'HIGHLIGHT-DELETE': (data) => removeHighlightFromStore(data.entityId),
    'SNIPPET-CREATE': (data) => addSnippet(data.payload),
    'SNIPPET-UPDATE': (data) => updateSnippet(data.payload),
    'SNIPPET-DELETE': (data) => deleteSnippet(data.entityId),
    'NOTE-CREATE': (data) => {
      const parentPath = data.payload?.referenceID ? getPathFromNodeid(data.payload.referenceID) + SEPARATOR : ''
      const path = parentPath + data.payload.title

      addILink({
        ilink: path,
        namespace: data.payload.namespaceID,
        nodeid: data.entityId
      })
      updateFromContent(data.entityId, deserializeContent(data.payload.data))
    },
    'NOTE-UPDATE': (data) => {
      updateFromContent(data.entityId, deserializeContent(data.payload.data))
    },
    'NOTE-DELETE': (data) => {
      // TODO: archive any node and it's children
    },
    'NAMESPACE-CREATE': (data) => {
      addNamespace(data.payload)
      addSpace(data.payload)
    },
    'NAMESPACE-UPDATE': (data) => {
      if (data?.payload?.body) {
        execRefactorFromResponse(data.payload.body as RefactorResponse)
      } else if (data?.payload?.data) {
        const d = data.payload.data
        const ns = { id: d?.id, name: d?.name, ...(d?.metadata && { icon: d?.metadata?.icon }) }
        const localNamespace = getNamespace(ns.id)
        updateNamespace({ ...localNamespace, ...ns })
      }
    },
    'NAMESPACE-DELETE': (data) => {
      deleteNamespace(data.entityId)
      updateActiveNamespace(getDefaultNamespaceId())
    },
    'LINK-CREATE': (data) => {
      const filteredLinks = useLinkStore.getState().links.filter((l) => l.url !== data.entityId)
      setLinks([...filteredLinks, { ...data.payload, title: data.payload.properties.title }])
    },
    'LINK-DELETE': (data) => {
      const newLinks = useLinkStore.getState().links.filter((l) => l.url !== data.entityId)
      setLinks(newLinks)
    },
    'VIEW-UPDATE': (data) => {
      addViewStore({ id: data.entityId, ...data.payload.properties, ...data.payload })
    },
    'VIEW-DELETE': (data) => removeViewStore(data.entityId),
    'USER-UPDATE': (data) => {
      // TODO: update user details I don't know where
    },
    'WORKSPACE-UPDATE': (data) => {
      //TODO
    }
  }

  const updatesHandler = (data: UpdateData) => {
    mog('broadcast update data', { data })

    lookup[`${data.entityType}-${data.operationType}`](data)
    updateTimestamp(Date.now().toString())
  }

  return {
    updatesHandler
  }
}

export { useBroadcastHandler }
