import { useAuthStore } from '../Stores'
import { NodeEditorContent } from '../Types'

import { generateTempId } from './idGenerator'
import { directKeys, DirectProperties, directPropertyKeys, mappedKeys } from './serializer'

interface SerializedBlock {
  id: string
  elementType: string
  children: SerializedBlock[]
  metadata?: any
  properties?: any
}

// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace SerDesContent {
  export const serialize = (content: NodeEditorContent) => {
    const serializedContent = content.map((block) => {
      if (Object.keys(serializeSpecial).includes(block.type)) {
        return serializeSpecial[block.type](block)
      }
    })

    return serializedContent
  }
}

// From content to api
export const serializeContent = (content: any[]) => {
  return content.map((el) => {
    if (Object.keys(serializeSpecial).includes(el.type)) {
      return serializeSpecial[el.type](el)
    }

    const serializedBlock: SerializedBlock = {
      id: el.id,
      elementType: el.type,
      children: undefined
    }

    const directProperties: DirectProperties = {}

    Object.keys(el).forEach((k) => {
      if (directPropertyKeys.includes(k)) {
        directProperties[k] = el[k]
      } else if (directKeys.includes(k)) {
        serializedBlock[k] = el[k]
      } else if (mappedKeys[k] !== undefined) {
        serializedBlock[mappedKeys[k]] = el[k]
      }
    })

    if (Object.keys(directProperties).length > 0) {
      serializedBlock.properties = directProperties
    }

    if (el.children) {
      serializedBlock.children = serializeContent(el.children)
    }

    return serializedBlock
  })
}

export const serializeSpecial: { [elementType: string]: (element: any) => any } = {
  ilink: (el: any) => {
    const workspaceDetails = useAuthStore.getState().workspaceDetails
    if (el.blockId)
      return {
        type: 'blockILink',
        blockID: el.blockId,
        blockAlias: el.blockValue,
        nodeID: el.value,
        id: el.id,
        workspaceID: workspaceDetails.id
      }
    else
      return {
        type: 'nodeILink',
        nodeID: el.value,
        id: el.id,
        workspaceID: workspaceDetails.id
      }
  },
  a: (el: any) => {
    return {
      type: 'webLink',
      url: el.url,
      id: el.id,
      children: serializeContent(el.children ?? [])
    }
  }
}
export const deserializeSpecial: { [elementType: string]: (element: any) => any } = {
  nodeILink: (el: any) => {
    return {
      type: 'ilink',
      value: el.nodeID,
      id: el.id,
      children: [{ text: '', id: generateTempId() }]
    }
  },
  blockILink: (el: any) => {
    return {
      type: 'ilink',
      value: el.nodeID,
      blockId: el.blockID,
      blockValue: el.blockAlias,
      id: el.id,

      children: [{ text: '', id: generateTempId() }]
    }
  },
  webLink: (el: any) => {
    return {
      type: 'a',
      url: el.url,
      id: el.id,

      children: deserializeContent(el.children) ?? [{ text: '', id: generateTempId() }]
    }
  }
}

// From API to content
export const deserializeContent = (sanatizedContent: any[]) => {
  return sanatizedContent?.map((el) => {
    if (Object.keys(deserializeSpecial).includes(el.elementType)) {
      const dEl = deserializeSpecial[el.elementType](el)
      return dEl
    }
    const nl: any = {}

    if (el.elementType !== 'paragraph' && el.elementType !== undefined) {
      nl.type = el.elementType
    }

    if (el.id !== undefined) {
      nl.id = el.id
    }

    // Properties
    if (el.properties) {
      const elProps = { ...el.properties }
      Object.keys(el.properties).forEach((k) => {
        if (directPropertyKeys.includes(k)) {
          nl[k] = el.properties[k]
          delete elProps[k]
        }
      })

      if (Object.keys(elProps).length > 0) {
        nl.properties = elProps
      }
    }

    if (el.children && el.children.length > 0) {
      nl.children = deserializeContent(el.children ?? [])
    } else {
      nl.text = el.content
    }

    return nl
  })
}
