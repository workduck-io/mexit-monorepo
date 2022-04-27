import { NodeEditorContent, TodoType, ELEMENTS_IN_OUTLINE, LIST_ELEMENTS, HIGHLIGHTED_ELEMENTS } from '@mexit/core'
import { expose } from 'threads/worker'

import { getTagsFromContent, getTodosFromContent } from '../Utils/content'
import { AnalyseContentProps } from './controller'
import { convertContentToRawText, getTitleFromContent } from '@mexit/core'
export interface OutlineItem {
  id: string
  title: string
  type: string
  level?: number
}

export interface NodeAnalysis {
  nodeid: string
  tags: string[]
  outline: OutlineItem[]
  editorTodos: TodoType[]
  title?: string
}

const getSingle = (content: NodeEditorContent) => {
  if (content[0] && content[0].children.length === 1) {
    return content[0].children
  } else return getSingle(content[0].children)
}

const getOutline = (content: NodeEditorContent): OutlineItem[] => {
  // console.log('getOutline', content)
  if (!content) return []
  const outline: OutlineItem[] = []
  let curHighlighted = ''
  let lastLevel = 1
  content.forEach((item) => {
    if (item && item.type) {
      // Headings
      if (ELEMENTS_IN_OUTLINE.includes(item.type.toLowerCase())) {
        const title = convertContentToRawText(item.children, ' ')
        if (title.trim() !== '')
          outline.push({
            type: item.type,
            title: title,
            id: item.id,
            level: ELEMENTS_IN_OUTLINE.indexOf(item.type) + 1
          })
        curHighlighted = ''
        lastLevel = ELEMENTS_IN_OUTLINE.indexOf(item.type) + 1
      } // Lists
      else if (LIST_ELEMENTS.includes(item.type.toLowerCase())) {
        if (item.children && item.children[0]) {
          const title = convertContentToRawText(getSingle(item.children), ' ')
          if (title.trim() !== '')
            outline.push({
              type: item.type,
              title: title,
              id: item.id,
              level: lastLevel
            })
        }
        curHighlighted = ''
      } else if (HIGHLIGHTED_ELEMENTS.includes(item.type.toLowerCase())) {
        if (curHighlighted !== item.type) {
          const title = convertContentToRawText(item.children, ' ')
          if (title.trim() !== '')
            outline.push({
              type: item.type,
              title: title,
              id: item.id,
              level: lastLevel
            })
        }
        curHighlighted = item.type
      } else curHighlighted = ''
    }
  })
  return outline
}

function analyseContent({ content, nodeid, options }: AnalyseContentProps): NodeAnalysis {
  if (!content)
    return {
      nodeid,
      outline: [],
      tags: [],
      editorTodos: []
    }

  const analysisResult = {
    nodeid,
    outline: getOutline(content),
    tags: getTagsFromContent(content),
    editorTodos: getTodosFromContent(content)
  }

  return options.title ? { ...analysisResult, title: getTitleFromContent(content) } : analysisResult
}

expose({ analyseContent })
