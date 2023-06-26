import { mog } from '@mexit/core'

import { useApi } from './API/useNodeAPI'
import { useInternalLinks } from './useInternalLinks'
import { useSnippets } from './useSnippets'

export type EntityType =
  | 'HIGHLIGHT'
  | 'NOTE'
  | 'CAPTURE'
  | 'NAMESPACE'
  | 'PROMPT'
  | 'SNIPPET'
  | 'LINK'
  | 'USER'
  | 'VIEW'
  | 'WORKSPACE'

interface UpdateData {
  operationType: 'CREATE' | 'UPDATE' | 'DELETE'
  entityType: EntityType
  entityId: string

  payload?: any
}

const useBroadcastHandler = () => {
  const { updateILinksFromAddedRemovedPaths } = useInternalLinks()
  const { getById: getSnippetById, getDataAPI: getNodeData } = useApi()
  const { deleteSnippet, addSnippet, updateSnippet } = useSnippets()

  const snippetUpdatesHandler = (data: UpdateData) => {
    switch (data.operationType) {
      case 'CREATE':
      case 'UPDATE': {
        getSnippetById(data.entityId).then((response) => {
          if (data.operationType === 'CREATE') {
            addSnippet(response)
          } else {
            updateSnippet(response)
          }
        })

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
        getNodeData(data.entityId)
        break
      }
      case 'DELETE': {
        break
      }
    }
  }

  const namespaceUpdatesHandler = (data: UpdateData) => {
    switch (data.operationType) {
      case 'CREATE': {
        break
      }
      case 'UPDATE': {
        // if (data?.payload?.body) {
        // TODO: as refactor can end up happening in a non-active namespace for this user
        // updateILinksFromAddedRemovedPaths(data.payload.body)
        // } else if (data?.payload?.data) {
        // }

        break
      }
      case 'DELETE': {
        break
      }
    }
  }

  const updatesHandler = (data: UpdateData) => {
    mog('broadcast update data', { data })
    switch (data.entityType) {
      case 'HIGHLIGHT': {
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
        break
      }
      case 'USER': {
        break
      }
      case 'VIEW': {
        break
      }
    }
  }

  return {
    updatesHandler
  }
}

export { useBroadcastHandler }
