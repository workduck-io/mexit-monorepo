import { expose } from 'threads/worker'

import {
  NodeEditorContent,
  TodoType,
  ELEMENTS_IN_OUTLINE,
  LIST_ELEMENTS,
  HIGHLIGHTED_ELEMENTS,
  getTagsFromContent,
  getTodosFromContent,
  SearchRepExtra,
  convertContentToRawText,
  HighlightAnalysis
} from '@mexit/core'
import { getTitleFromContent } from '@mexit/core'

export interface OutlineItem {
  id: string
  title: string
  type: string
  level?: number
}

export interface NodeAnalysis extends HighlightAnalysis {
  nodeid: string
  tags: string[]
  outline: OutlineItem[]
  editorTodos: TodoType[]
  title?: string
}

export type AnalysisModifier = SearchRepExtra
export interface AnalysisOptions {
  title?: boolean
  modifier?: AnalysisModifier
}

export interface AnalyseContentProps {
  content: NodeEditorContent
  nodeid: string
  options?: AnalysisOptions
}

const getSingle = (content: NodeEditorContent) => {
  if (!content || content.length === 0) return ''
  if (content[0] && content[0]?.children?.length === 1) {
    return content[0]?.children
  } else {
    if (content[0]?.children) {
      return content[0]?.children
    } else return content[0]
  }
}

const getOutline = (content: NodeEditorContent, options?: AnalysisOptions): OutlineItem[] => {
  // console.log('getOutline', content)
  if (!content) return []
  const outline: OutlineItem[] = []
  let curHighlighted = ''
  let lastLevel = 1
  content.forEach((item) => {
    if (item && item.type) {
      let title = ''
      const extraKeys = options?.modifier ? Object.keys(options?.modifier) : []

      if (extraKeys.includes(item.type)) {
        if (options?.modifier?.[item.type]) {
          const blockKey = options?.modifier[item.type].keyToIndex
          title = options?.modifier[item.type].replacements[item[blockKey]]
        }
      }

      // Headings
      if (ELEMENTS_IN_OUTLINE.includes(item.type.toLowerCase())) {
        title = convertContentToRawText(item.children, ' ', { extra: options?.modifier })
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
          title = convertContentToRawText(item.children ? getSingle(item.children) : '', ' ', {
            extra: options?.modifier
          })
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
          title = convertContentToRawText(item.children, ' ', { extra: options?.modifier })
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

/**
 * Finds whether the block has a highlight
 * Ignores repeated block with same highlight
 */
const getHighlightBlocks = (content: NodeEditorContent): HighlightAnalysis => {
  const displayBlocksWithHighlight = []
  let prevBlockHighlightId: string | null = null
  for (const block of content) {
    const elMetadata = block.metadata?.elementMetadata
    const hasMetadata = elMetadata && elMetadata?.type === 'highlightV1' && elMetadata?.id
    if (hasMetadata) {
      if (prevBlockHighlightId !== elMetadata?.id) {
        displayBlocksWithHighlight.push(block.id)
      }
      prevBlockHighlightId = elMetadata?.id
    } else {
      prevBlockHighlightId = null
    }
  }
  // console.log('getHighlightBlocks', { content, displayBlocksWithHighlight })

  return { displayBlocksWithHighlight }
}

function analyseContent({ content, nodeid, options }: AnalyseContentProps): NodeAnalysis {
  if (!content)
    return {
      nodeid,
      outline: [],
      tags: [],
      editorTodos: [],
      displayBlocksWithHighlight: []
    }

  const analysisResult = {
    nodeid,
    outline: getOutline(content, options),
    tags: getTagsFromContent(content),
    editorTodos: getTodosFromContent(content),
    displayBlocksWithHighlight: getHighlightBlocks(content).displayBlocksWithHighlight
  }

  return options?.title ? { ...analysisResult, title: getTitleFromContent(content) } : analysisResult
}

expose({ analyseContent })
