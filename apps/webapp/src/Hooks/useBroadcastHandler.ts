import { mog, useDataStore, useHighlightStore, useLinkStore, useViewStore } from '@mexit/core'

import { UpdateData, UpdateKey } from '../Types/Socket'

import { useUserService } from './API/useUserAPI'
import { RefactorResponse, useRefactor } from './useRefactor'
import { useSnippets } from './useSnippets'

const useBroadcastHandler = () => {
  const { deleteSnippet, addSnippet, updateSnippet } = useSnippets()
  const addViewStore = useViewStore((store) => store.addView)
  const removeViewStore = useViewStore((store) => store.removeView)
  const { getUserDetailsUserId } = useUserService()
  const removeHighlightFromStore = useHighlightStore((store) => store.removeHighlight)
  const addHighlightInStore = useHighlightStore((store) => store.addHighlightEntity)
  const { setLinks } = useLinkStore()
  const addNamespace = useDataStore((store) => store.addNamespace)
  const addSpace = useDataStore((store) => store.addSpace)
  const deleteNamespace = useDataStore((store) => store.deleteNamespace)
  const { execRefactorFromResponse } = useRefactor()

  const lookup: Partial<Record<UpdateKey, (data: UpdateData) => void>> = {
    'HIGHLIGHT-CREATE': (data) => addHighlightInStore({ entityId: data.entityId, properties: data.payload.properties }),
    'HIGHLIGHT-DELETE': (data) => removeHighlightFromStore(data.entityId),
    'SNIPPET-CREATE': (data) => addSnippet(data.payload),
    'SNIPPET-UPDATE': (data) => updateSnippet(data.payload),
    'SNIPPET-DELETE': (data) => deleteSnippet(data.entityId),
    'NOTE-CREATE': (data) => {
      // TODO: add note to store
    },
    'NOTE-UPDATE': (data) => {
      // TODO: update node content
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
        const ns = data.payload.data
        mog('ns', { ns })
        addNamespace(ns)
        addSpace(ns)
      }
    },
    'NAMESPACE-DELETE': (data) => deleteNamespace(data.entityId),
    'LINK-CREATE': (data) => {
      // TODO: add link to store
    },
    'LINK-DELETE': (data) => {
      const newLinks = useLinkStore.getState().links.filter((l) => l.url !== data.entityId)
      setLinks(newLinks)
    },
    'VIEW-UPDATE': (data) => addViewStore(data.payload),
    'VIEW-DELETE': (data) => removeViewStore(data.entityId),
    'USER-UPDATE': (data) => {
      // TODO: update user details I don't know where
    }
  }

  const updatesHandler = (data: UpdateData) => {
    mog('broadcast update data', { data })

    lookup[`${data.entityType}-${data.operationType}`](data)
  }

  return {
    updatesHandler
  }
}

export { useBroadcastHandler }
