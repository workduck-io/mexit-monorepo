import { uniq } from 'lodash'

import { Highlight } from '../Types'
import { NodeEditorContent, NodeMetadata } from '../Types/Editor'
import { MIcon } from '../Types/Store'

import { updateIds } from './dataTransform'
import { ELEMENT_LI, ELEMENT_LIC, ELEMENT_LINK, ELEMENT_MENTION, ELEMENT_UL } from './editorElements'
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

  content?.forEach((n) => {
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

export const removeNulls = (obj) => {
  return Object.fromEntries(
    Object.entries(obj)
      .filter(([_, v]) => v != null)
      .map(([k, v]) => [k, v === Object(v) ? removeNulls(v) : v])
  )
}

export const extractMetadata = (data: any, defaults?: { icon: MIcon }): NodeMetadata => {
  if (data) {
    const metadata: NodeMetadata = {
      lastEditedBy: data.lastEditedBy,
      updatedAt: data.updatedAt,
      createdBy: data.createdBy,
      createdAt: data.createdAt,
      elementMetadata: data?.elementMetadata,
      publicAccess: data?.publicAccess,
      iconUrl: data?.metadata?.iconUrl,
      templateID: data?.metadata?.templateID,
      icon: data?.metadata?.icon ?? defaults?.icon,
      title: data?.title
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

export const insertItemInArray = <T>(array: T[], items: Array<T>, index: number): Array<T> => [
  ...array.slice(0, index),
  ...items,
  ...array.slice(index)
]

export const getHighlightContent = (highlight: Highlight) => {
  const blockContent = highlight.properties.content
  if (blockContent)
    return blockContent.map((block) => ({
      ...updateIds(block),
      metadata: {
        elementMetadata: {
          id: highlight.entityId,
          type: 'highlightV1'
        }
      }
    }))

  return [
    {
      type: ELEMENT_PARAGRAPH,
      id: generateTempId(),
      metadata: {
        elementMetadata: {
          id: highlight.entityId,
          type: 'highlightV1'
        }
      },
      children: [{ text: highlight.properties?.saveableRange?.text ?? '' }]
    }
  ]
}

export const textChildren = (text: string) => [
  {
    text
  }
]

export const text = (text: string) => ({
  text
})

export const pText = (text: string) => ({
  type: ELEMENT_PARAGRAPH,
  text
})

export const emptyText = () => ({
  text: ''
})

export const emptyChildren = () => [
  {
    text: ''
  }
]

export const emptyP = () => ({
  type: ELEMENT_PARAGRAPH,
  children: emptyChildren()
})

export const pChildren = (children: any[]) => ({
  type: ELEMENT_PARAGRAPH,
  children
})

export const list = (listItems: string[]) => ({
  type: ELEMENT_UL,
  children: [
    ...listItems.map((item) => ({
      type: ELEMENT_LI,
      children: [
        {
          type: ELEMENT_LIC,
          children: [{ text: item }]
        }
      ]
    }))
  ]
})

export const tag = (value: string) => ({ type: ELEMENT_TAG, children: [{ text: '' }], value })

export const aLink = (url: string, text: string) => ({
  type: ELEMENT_LINK,
  url,
  children: textChildren(text)
})

export const task = (text: string) => ({
  type: ELEMENT_TODO_LI,
  children: textChildren(text)
})

export const heading = (level: number, text: string) => ({
  type: `h${level}`,
  children: textChildren(text)
})

export const mentionList = (ids: string[]) =>
  ids.map((id) => ({
    type: ELEMENT_MENTION,
    children: emptyChildren(),
    value: id
  }))
