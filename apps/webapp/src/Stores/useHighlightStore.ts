import create from 'zustand'
import { persist } from 'zustand/middleware'

import {
  Contents,
  ElementHighlightMetadata,
  IDBStorage,
  ILink,
  mog,
  NodeContent,
  NodeEditorContent,
  SharedNode
} from '@mexit/core'

// import { asyncLocalStorage } from '../Utils/chromeStorageAdapter'

export interface SingleHighlight {
  elementMetadata: ElementHighlightMetadata
  nodeId: string
  shared?: boolean
}

export interface SourceHighlights {
  [blockId: string]: SingleHighlight
}

interface Highlighted {
  [sourceURL: string]: SourceHighlights
}

interface HighlightStore {
  /*
   * The current ids for specific editors to highlight
   */
  highlighted: Highlighted
  initHighlights: (ilinks: (ILink | SharedNode)[], contents: Contents) => void
  addHighlightedBlock: (nodeId: string, content: NodeEditorContent, url: string) => void
  clearHighlightedBlock: (url: string, blockId: string) => void
  clearAllHighlightedBlocks: () => void
}

export const sampleHighlightData = {
  'https://sahil-shubham.in/about/': {
    TEMP_gHyML: {
      elementMetadata: {
        type: 'highlight',
        saveableRange: {
          startMeta: {
            parentTagName: 'P',
            parentIndex: 1,
            textOffset: 80
          },
          endMeta: {
            parentTagName: 'P',
            parentIndex: 2,
            textOffset: 215
          },
          text: 'ks and crannies of containers and container orchestration. You also have a high chance of catching me writing css in an effort to make something “just right”. \nI also spend an ample amount of time with people from Kharagpur Open Source Society (KOSS), we are just a bunch of students passionate about FOSS and building things just for the fun  of it. We also conduct workshop',
          id: '0f8b52f1-7f6a-4ccb-b814-f6c52634d19b'
        },
        sourceUrl: 'https://sahil-shubham.in/about/'
      },
      nodeId: 'NODE_RWKHzd4BRE9bwNJqBR9x7',
      shared: false
    },
    TEMP_aWbi9: {
      elementMetadata: {
        type: 'highlight',
        saveableRange: {
          startMeta: {
            parentTagName: 'P',
            parentIndex: 0,
            textOffset: 0
          },
          endMeta: {
            parentTagName: 'P',
            parentIndex: 2,
            textOffset: 26
          },
          text: "I'm Sahil, a third year undergraduate student at IIT Kharagpur. I'm an Open Source enthusiast, and it is the reason for my love for programming. I mostly spend my time writing half broken code in JavaScript, sometimes Python, and recently started dabbling with Go. \nCurrently spending most of my time writing yaml and trying to understand the nooks and crannies of containers and container orchestration. You also have a high chance of catching me writing css in an effort to make something “just right”. \nI also spend an ample amou",
          id: '087ab0d1-5dec-4f42-a8d0-ca3a7727b21d'
        },
        sourceUrl: 'https://sahil-shubham.in/about/'
      },
      nodeId: 'NODE_RwGHXecFyMMF3LdhAMYaM',
      shared: false
    },
    TEMP_TBbHt: {
      elementMetadata: {
        type: 'highlight',
        saveableRange: {
          startMeta: {
            parentTagName: 'P',
            parentIndex: 3,
            textOffset: 0
          },
          endMeta: {
            parentTagName: 'P',
            parentIndex: 3,
            textOffset: 359
          },
          text: "At almost any time, I am listening to music. Over the time, I have gone from lofi to classical and finally been listening to a lot of jazz. I'm in love with Japanese jazz of the 90s, Jiro Inagaki, Ryo Fukui, and Indigo Jam Unit just to name a few of my favourites. I have also picked up neo-psychedelic music from a few people around me. Here’s one of my pers",
          id: '116eeda9-2592-4035-a2bf-2dd045529232'
        },
        sourceUrl: 'https://sahil-shubham.in/about/'
      },
      nodeId: 'NODE_RwGHXecFyMMF3LdhAMYaM',
      shared: false
    }
  }
}

export const useHighlightStore = create<HighlightStore>(
  persist(
    (set, get) => ({
      highlighted: {},
      initHighlights: (ilinks, contents) => {
        const highlighted = {}

        ilinks.forEach((ilink) => {
          contents[ilink.nodeid]?.content?.forEach(function (block) {
            if (block?.metadata?.elementMetadata && this) {
              highlighted[block.metadata.elementMetadata.sourceUrl] = {
                ...highlighted[block.metadata.elementMetadata.sourceUrl],
                [block.id]: {
                  elementMetadata: block.metadata.elementMetadata,
                  nodeId: this.nodeid,
                  shared: !!this?.owner
                }
              }
            }
          }, ilink)
        })

        // mog('initing highlights', { highlighted })
        set({ highlighted: highlighted })
      },
      addHighlightedBlock: (nodeId, content, url) => {
        const { highlighted } = get()
        const newHighlighted = { ...highlighted }

        content.forEach((item) => {
          if (item?.metadata?.elementMetadata) {
            newHighlighted[item.metadata.elementMetadata.sourceUrl] = {
              ...newHighlighted[item.metadata.elementMetadata.sourceUrl],
              [item.id]: {
                elementMetadata: item.metadata.elementMetadata,
                nodeId
              }
            }
          }
        })
        mog('addHighlighted', { newHighlighted })
        set({ highlighted: newHighlighted })
      },
      clearHighlightedBlock: (url, blockId) => {
        const oldHighlighted = get().highlighted
        delete oldHighlighted[url][blockId]
        set({ highlighted: oldHighlighted })
      },
      clearAllHighlightedBlocks: () => {
        const oldHighlighted = get().highlighted
        const newHighlighted = {}
        mog('clearAllHighlighted', { oldHighlighted })
        set({ highlighted: newHighlighted })
      }
    }),
    {
      name: 'highlights-store',
      getStorage: () => IDBStorage
    }
  )
)
