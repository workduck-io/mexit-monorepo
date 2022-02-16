import { nanoid } from 'nanoid'

import { NodeMetadata } from '../Types/Data'

const removeNulls = (obj: any): any => {
  if (obj === null) {
    return undefined
  }
  if (typeof obj === 'object') {
    for (const key in obj) {
      obj[key] = removeNulls(obj[key])
    }
  }
  return obj
}

const extractMetadata = (data: any): NodeMetadata => {
  const metadata: NodeMetadata = {
    lastEditedBy: data.lastEditedBy,
    updatedAt: data.updatedAt,
    createdBy: data.createdBy,
    createdAt: data.createdAt
  }
  return removeNulls(metadata)
}

// const ElementsWithProperties = [ELEMENT_PARAGRAPH]
// const ElementsWithURL = [ELEMENT_LINK, ELEMENT_IMAGE, ELEMENT_MEDIA_EMBED]

// Direct properties are collated in the properties for api
// and then unfurled when converting back to editor content
const directPropertyKeys = ['bold', 'italic', 'underline', 'highlight', 'code', 'url', 'value', 'body']
const PropKeysArray = [...directPropertyKeys] as const
type PropKeys = typeof PropKeysArray[number]
type DirectProperties = Record<PropKeys, boolean | string>

// Keys that will be replicated as is
const directKeys = []

// Keys that will be mapped to different key
const mappedKeys = {
  text: 'content'
}

// From content to api
export const serializeContent = (content: any[]) => {
  return content.map((el) => {
    const nl: any = {}
    const directProperties: DirectProperties = {}

    if (el.id) {
      nl.id = el.id
    } else {
      nl.id = `TEMP_${nanoid()}`
    }

    if (el.type) {
      if (el.type !== 'paragraph') {
        nl.elementType = el.type
      }
    }

    Object.keys(el).forEach((k) => {
      if (directPropertyKeys.includes(k)) {
        directProperties[k] = el[k]
      } else if (directKeys.includes(k)) {
        nl[k] = el[k]
      } else if (mappedKeys[k] !== undefined) {
        nl[mappedKeys[k]] = el[k]
      }
    })

    const nlproperties = {
      ...directProperties,
      ...el.properties
    }

    if (Object.keys(nlproperties).length > 0) {
      nl.properties = nlproperties
    }

    if (el.children) {
      nl.children = serializeContent(el.children)
    }

    // console.log('Process: ', nl, el)

    return nl
  })
}

// From API to content
export const deserializeContent = (sanatizedContent: any[]) => {
  return sanatizedContent.map((el) => {
    const nl: any = {}

    if (el.elementType !== 'paragraph' && el.elementType !== undefined) {
      nl.type = el.elementType
    }

    if (el.id !== undefined) {
      nl.id = el.id
    }

    nl.metadata = extractMetadata(el)

    // Properties
    if (el.properties) {
      const elProps = el.properties
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
