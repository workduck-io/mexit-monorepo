import { NodeEditorContent } from './Editor'

export interface HighlightMetaBlock {
  parentTagName: string
  parentIndex: number
  textOffset: number
}

const MetdataTypes = 'highlightV1' as const

export interface ElementHighlightMetadata {
  type: typeof MetdataTypes
  id: string
}

/**
 * SaveableRange is info about where the highlight is in the document.
 */
export interface SaveableRange {
  startMeta: HighlightMetaBlock
  endMeta: HighlightMetaBlock
  text: string
  id: string
}

export interface Highlight {
  /**
   * ID of the highlight
   */
  entityId?: string

  /**
   * Properties of the highlight
   */
  properties: {
    /**
     * Range of the highlighted content in page
     */
    saveableRange: SaveableRange
    /**
     * Source URL of the webpage on which the highlight was made
     */
    sourceUrl: string

    /**
     * Block Content
     */
    content: NodeEditorContent
  }

  /**
   * ID of the note where the content was added
   */
  nodeId?: string
}

export type Highlights = Highlight[]

/**
 * Map of highlight to the associated blocks (blockid)
 */
export interface HighlightBlockMap {
  [highlightId: string]: {
    [noteId: string]: string[]
  }
}

export interface HighlightAnalysis {
  /**
   * Blocks with highlights for whom the source needs to be displayed
   */
  displayBlocksWithHighlight: string[]
}
