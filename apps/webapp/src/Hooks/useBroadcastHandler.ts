import { mog, useDataStore, useHighlightStore, useLinkStore, useViewStore } from '@mexit/core'

import { UpdateData } from '../Types/Socket'

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

  const highlightUpdatesHandler = (data: UpdateData) => {
    switch (data.operationType) {
      case 'CREATE': {
        addHighlightInStore({ entityId: data.entityId, properties: data.payload.properties })
        break
      }
      case 'UPDATE': {
        // Currently we directly append to note and don't update the highlight entity
        break
      }
      case 'DELETE': {
        removeHighlightFromStore(data.entityId)
        break
      }
    }
  }

  const snippetUpdatesHandler = (data: UpdateData) => {
    switch (data.operationType) {
      case 'CREATE': {
        addSnippet(data.payload)
        break
      }
      case 'UPDATE': {
        updateSnippet(data.payload)

        break
      }
      case 'DELETE': {
        deleteSnippet(data.entityId)
        break
      }
    }
  }

  const noteUpdatesHandler = (data: UpdateData) => {
    switch (data.operationType) {
      case 'CREATE':
      case 'UPDATE': {
        // getNodeData(data.entityId)
        break
      }
      // TODO: No delete updates
      case 'DELETE': {
        break
      }
    }
  }

  const namespaceUpdatesHandler = (data: UpdateData) => {
    switch (data.operationType) {
      case 'CREATE': {
        // TODO: this is suffering from the same issue as views, multiple requests for the same thing
        addNamespace(data.payload)
        addSpace(data.payload)
        break
      }
      case 'UPDATE': {
        if (data?.payload?.body) {
          const res = execRefactorFromResponse(data.payload.body as RefactorResponse)
        } else if (data?.payload?.data) {
          const ns = data.payload.data
          mog('ns', { ns })
          // addNamespace(ns)
          // addSpace(ns)
        }

        break
      }
      case 'DELETE': {
        deleteNamespace(data.entityId)
        break
      }
    }
  }

  const linkUpdatesHandler = (data: UpdateData) => {
    switch (data.operationType) {
      case 'CREATE': {
        // getLink(data.entityId)
        break
      }
      case 'DELETE': {
        const newLinks = useLinkStore.getState().links.filter((l) => l.url !== data.entityId)
        setLinks(newLinks)
        break
      }
    }
  }

  // TODO: accessive number of updates here, first stop the updates from coming back to the user then this
  const viewUpdatesHandler = (data: UpdateData) => {
    switch (data.operationType) {
      case 'CREATE':
      case 'UPDATE': {
        addViewStore(data.payload)

        break
      }
      case 'DELETE': {
        removeViewStore(data.entityId)
        break
      }
    }
  }

  const userUpdatesHandler = (data: UpdateData) => {
    switch (data.operationType) {
      case 'UPDATE': {
        getUserDetailsUserId(data.entityId)
      }
    }
  }

  const updatesHandler = (data: UpdateData) => {
    mog('broadcast update data', { data })
    switch (data.entityType) {
      case 'HIGHLIGHT': {
        highlightUpdatesHandler(data)
        break
      }
      case 'NOTE': {
        noteUpdatesHandler(data)
        break
      }
      case 'CAPTURE': {
        break
      }
      case 'NAMESPACE': {
        namespaceUpdatesHandler(data)
        break
      }
      case 'PROMPT': {
        break
      }
      case 'SNIPPET': {
        snippetUpdatesHandler(data)
        break
      }
      case 'LINK': {
        linkUpdatesHandler(data)
        break
      }
      case 'USER': {
        userUpdatesHandler(data)
        break
      }
      case 'VIEW': {
        viewUpdatesHandler(data)
        break
      }
    }
  }

  return {
    updatesHandler
  }
}

export { useBroadcastHandler }
