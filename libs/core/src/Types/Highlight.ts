/**
IN STORE
{
    "TEMP_E4wiP": {
        "elementMetadata": {
            "type": "highlight",
            "saveableRange": {
                "startMeta": {
                    "parentTagName": "P",
                    "parentIndex": 1,
                    "textOffset": 553
                },
                "endMeta": {
                    "parentTagName": "P",
                    "parentIndex": 2,
                    "textOffset": 355
                },
                "text": "The species is both terrestrial (ground-living) and arboreal (tree-living); it inhabits savannah, woodland, rocky slopes and in some regions, dense forest. It is diurnal and is known to prey on birds and small mammals. Over suitable surfaces, it can move at speeds up to 16km/h (10mph) for short distances. Adult black mambas have few natural predators.",
                "id": "f0cda665-6660-47bd-99cd-46b48020e253"
            },
            "sourceUrl": "https://en.wikipedia.org/wiki/Black_mamba"
        },
        "nodeId": "NODE_yEpRnTWADYVbznTYqWBNR",
        "shared": false
    }
}
{
  "type": "highlight",
  "saveableRange": {
    "startMeta": {
      "parentTagName": "A",
      "parentIndex": 128,
      "textOffset": 0
    },
    "endMeta": {
      "parentTagName": "LI",
      "parentIndex": 56,
      "textOffset": 60
    },
    "text": "Village pump – Forum for discussions about Wikipedia itself, including policies and technical issues.\nSite news – Sources of news about Wikipedia and the broader Wikimedia movement.\nTeahouse – Ask basic questions about using or editing Wikipedia.\nHelp desk – Ask questions about using or editing Wikipedia.\nReference desk – Ask research questions about encyclopedic topics.\nContent portals – A unique way to navigate the encyclopedia.",
    "id": "63023772-32e9-4d85-b0e8-933cd429eab3"
  },
  "sourceUrl": "https://en.wikipedia.org/wiki/Main_Page"
}
 */

export interface HighlightMetaBlock2 {
  parentTagName: string
  parentIndex: number
  textOffset: number
}

const MetdataTypes = 'highlightV1' as const

export interface ElementHighlightMetadata2 {
  type: typeof MetdataTypes
  id: string
}

/**
 * SaveableRange is info about where the highlight is in the document.
 */
export interface SaveableRange {
  startMeta: HighlightMetaBlock2
  endMeta: HighlightMetaBlock2
  text: string
  id: string
}

export interface Highlight {
  /**
   * ID of the highlight
   */
  entityId: string

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
