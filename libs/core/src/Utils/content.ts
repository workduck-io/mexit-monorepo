import { uniq } from 'lodash'

import { NodeEditorContent, NodeMetadata } from '../Types/Editor'
import { ELEMENT_MENTION } from './editorElements'
import { generateTempId } from './idGenerator'

const ELEMENT_TODO_LI = 'action_item'
const ELEMENT_PARAGRAPH = 'p'
const ELEMENT_TAG = 'tag'

export const getTagsFromContent = (content: any[]): string[] => {
  let tags: string[] = []

  content.forEach((n) => {
    if (n.type === 'tag' || n.type === ELEMENT_TAG) {
      tags.push(n.value)
    }
    if (n.children && n.children.length > 0) {
      tags = tags.concat(getTagsFromContent(n.children))
    }
  })

  return uniq(tags)
}

export const getMentionsFromContent = (content: any[]): string[] => {
  let mentions: string[] = []

  content.forEach((n) => {
    if (n.type === ELEMENT_MENTION) {
      // mog('mention in content', { n })
      mentions.push(n.value)
    }
    if (n.children && n.children.length > 0) {
      mentions = mentions.concat(getMentionsFromContent(n.children))
    }
  })

  return uniq(mentions)
}

export const getTodosFromContent = (content: NodeEditorContent): NodeEditorContent => {
  const todos: NodeEditorContent = []

  content.forEach((n) => {
    if (n.type === ELEMENT_TODO_LI) {
      todos.push(n)
    }
  })

  return todos
}

// Inserts temporary ids to all elements
export const insertId = (content: any[]) => {
  if (content.length === 0) {
    return content
  }
  return content.map((item) => {
    if (item.children) item.children = insertId(item.children)
    return {
      ...item,
      id: generateTempId()
    }
  })
}

// Removes existing element IDs
export const removeId = (content: any[]) => {
  if (content.length === 0) {
    return content
  }
  return content.map((item) => {
    if (item.children) item.children = removeId(item.children)
    if (item.id) delete item.id
    return item
  })
}

export const removeNulls = (obj: any): any => {
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

export const extractMetadata = (data: any): NodeMetadata => {
  if (data) {
    const metadata: any = {
      lastEditedBy: data.lastEditedBy,
      updatedAt: data.updatedAt,
      createdBy: data.createdBy,
      createdAt: data.createdAt,
      elementMetadata: data?.elementMetadata
    }

    return removeNulls(metadata)
  }
}

export const updateEmptyBlockTypes = (content: NodeEditorContent, type: string = ELEMENT_PARAGRAPH) => {
  content.forEach((element) => {
    if (!element.type) {
      element['type'] = type
    }

    if (element.children && element.children.length > 0) {
      updateEmptyBlockTypes(element.children, type)
    }
  })
}

export const insertItemInArray = <T>(array: T[], item: T, index: number): Array<T> => [
  ...array.slice(0, index),
  item,
  ...array.slice(index)
]
