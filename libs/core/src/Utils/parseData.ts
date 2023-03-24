import { diskIndex, indexNames } from '../Data/search'
import { BlockType } from '../Stores/block.store'
import { NodeEditorContent } from '../Types/Editor'
import { GenericSearchData, PersistentData, SearchRepExtra } from '../Types/Search'

import {
  ELEMENT_CODE_BLOCK,
  ELEMENT_EXCALIDRAW,
  ELEMENT_IMAGE,
  ELEMENT_INLINE_BLOCK,
  ELEMENT_LINK,
  ELEMENT_MEDIA_EMBED,
  ELEMENT_TABLE,
  ELEMENT_TASK_VIEW_BLOCK,
  ELEMENT_TASK_VIEW_LINK,
  ELEMENT_TODO_LI
} from './editorElements'
import { getSlug } from './strings'

const ELEMENT_ILINK = 'ilink'

type ExcludeFromTextType = {
  types?: Set<string>
  fields?: Set<ExcludeFieldTypes>
}

type ExcludeFieldTypes = 'value' | 'url' | 'text'

type ContentConverterOptions = {
  exclude?: ExcludeFromTextType
  extra?: SearchRepExtra
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const convertContentToRawText = (
  content: any[],
  join?: string,
  options: ContentConverterOptions = {
    exclude: {
      types: new Set([])
    }
  }
): string => {
  const text: string[] = []
  const extraKeys = options?.extra ? Object.keys(options.extra) : []

  content?.forEach((n) => {
    if (options?.exclude?.types?.has(n.type)) return

    if (extraKeys.includes(n.type)) {
      if (options?.extra[n.type]) {
        const blockKey = options?.extra[n.type].keyToIndex
        const blockText = options?.extra[n.type].replacements[n[blockKey]]
        // console.log('Found Extra', { n, blockKey, blockText })
        if (blockText) text.push(blockText)
        return
      }
    }

    if (n.text && !options?.exclude?.fields?.has('text') && n.text !== '') text.push(n.text)

    // * Extract custom components (ILink, Tags, etc) `value` field
    if (n.value && !options?.exclude?.fields?.has('value') && n.value !== '') text.push(n.value)

    // * Extract custom components (Webem, Links) `url` field
    if (n.url && !options?.exclude?.fields?.has('url') && n.url !== '') text.push(n.url)

    if (n.children && n.children.length > 0) {
      const childText = convertContentToRawText(n.children, join ?? '', options)
      text.push(childText)
    }
  })

  const rawText = text.join(join ?? '')
  return rawText
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const convertEntryToRawText = (
  nodeUID: string,
  entry: any[],
  title = '',
  extra?: SearchRepExtra
): GenericSearchData => {
  return { id: nodeUID, title, text: convertContentToRawText(entry, ' ', { extra }) }
}

export const getHeadingBlock = (content: NodeEditorContent) => {
  // const isHeadingBlock = content[0].type === ELEMENT_QA_BLOCK

  return undefined
}

export const getTitleFromContent = (content: NodeEditorContent) => {
  const heading = getHeadingBlock(content)
  if (heading) return heading.title

  const text = convertContentToRawText(content, ' ', {
    exclude: { fields: new Set<ExcludeFieldTypes>(['value', 'url']) }
  })
  const title = getSlug(text)

  return title
}

export const convertDataToIndexable = (data: Partial<PersistentData>) => {
  const nodeBlockMap: { [key: string]: string[] } = {}
  const result: Record<indexNames, GenericSearchData[]> = Object.entries(indexNames).reduce((p, c) => {
    const idxResult = []
    const idxName = c[0]
    const titleNodeMap = new Map<string, string>()

    // Pre-process the data to get the title node map
    switch (idxName) {
      case indexNames.node: {
        data.ilinks.forEach((entry) => {
          titleNodeMap.set(entry.nodeid, entry.path)
        })
        break
      }

      case indexNames.archive: {
        data.archive?.forEach((entry) => {
          titleNodeMap.set(entry.nodeid, entry.path)
        })
        break
      }

      case indexNames.prompt: {
        data.prompts?.forEach((entry) => {
          titleNodeMap.set(entry.entityId, entry.title)
        })
        break
      }

      case indexNames.template:
      case indexNames.snippet: {
        const snippets = Array.isArray(data.snippets) ? data.snippets : Object.values(data.snippets)
        snippets.forEach((snippet) => {
          titleNodeMap.set(snippet.id, snippet.title)
        })
        break
      }

      case indexNames.shared: {
        data.sharedNodes.forEach((entry) => {
          titleNodeMap.set(entry.nodeid, entry.path)
        })
        break
      }

      default: {
        throw new Error('No corresponding index name found')
      }
    }

    // Process the filedata to get the indexable data
    if (idxName === indexNames.archive || idxName === indexNames.node || idxName === indexNames.shared) {
      Object.entries(data.contents).forEach(([k, v]) => {
        if (k !== '__null__' && titleNodeMap.has(k)) {
          if (!nodeBlockMap[k]) nodeBlockMap[k] = []
          v.content.forEach((block) => {
            const blockText = convertContentToRawText(block.children, ' ')
            // If the type is init, we index the initial empty block
            if (blockText.length !== 0 || v.type === 'init') {
              nodeBlockMap[k].push(block.id)
              const temp: GenericSearchData = {
                id: k,
                text: blockText,
                blockId: block.id,
                title: titleNodeMap.get(k),
                data: block
              }
              idxResult.push(temp)
            }
          })
        }
      })
    } else if (idxName === indexNames.snippet || idxName === indexNames.template) {
      const isTemplate = idxName === indexNames.template
      const snippets = Array.isArray(data.snippets) ? data.snippets : Object.values(data.snippets)

      snippets
        .filter((snip) => (isTemplate ? snip.template : !snip.template))
        .map((snip) => {
          const title = titleNodeMap.get(snip.id)
          const temp: GenericSearchData = {
            ...convertEntryToRawText(snip.id, snip.content, title),
            tag: [idxName]
          }
          nodeBlockMap[snip.id] = [snip.id] // Redundant right now, not doing block level indexing for snippets
          idxResult.push(temp)
        })
    } else if (idxName === indexNames.prompt) {
      data?.prompts?.forEach((prompt) => {
        const temp: GenericSearchData = {
          id: prompt.entityId,
          text: prompt.description,
          blockId: 'PROMPT',
          title: prompt.title
        }
        idxResult.push(temp)
      })
    } else {
      throw new Error('No corresponding index name found')
    }

    return { ...p, [idxName]: idxResult }
  }, diskIndex)

  return { result, nodeBlockMap }
}

type BeforeCopyOptions = {
  filter: (block: BlockType) => boolean
  converter?: (block: BlockType) => { changed: boolean; block: BlockType }
}

export const convertToCopySnippet = (
  content: Array<BlockType>,
  options: BeforeCopyOptions = { filter: defaultCopyFilter }
) => {
  return content.reduce((previousArr, block) => {
    const children = convertToCopySnippet(block.children || [], options)

    if (options.filter(block)) {
      if (options.converter) {
        const { changed, block: newBlock } = options.converter(block)
        previousArr.push(Object.assign({}, newBlock, children.length && !changed && { children }))
      } else {
        previousArr.push(Object.assign({}, block, children.length && { children }))
      }
    }

    return previousArr
  }, [])
}

export const defaultCopyConverter = (block) => {
  if (block.type === ELEMENT_TODO_LI) {
    return {
      changed: true,
      block: {
        type: 'ul',
        children: [
          {
            type: 'li',
            children: [{ type: 'lic', children: block.children }]
          }
        ]
      }
    }
  }

  if (block.type === ELEMENT_MEDIA_EMBED || block.type === ELEMENT_IMAGE) {
    return {
      changed: true,
      block: {
        type: ELEMENT_LINK,
        url: block.url,
        children: [{ text: '' }]
      }
    }
  }

  return { changed: false, block }
}

export const defaultCopyFilter = ({ type }) => {
  const exclude: Array<string> = [
    ELEMENT_EXCALIDRAW,
    // ELEMENT_ILINK,
    ELEMENT_TABLE,
    ELEMENT_INLINE_BLOCK,
    ELEMENT_TASK_VIEW_BLOCK,
    ELEMENT_TASK_VIEW_LINK,
    ELEMENT_CODE_BLOCK
  ]
  return !exclude.includes(type)
}

export const getBlocks = (content: NodeEditorContent): Record<string, any> | undefined => {
  if (content) {
    const blocks: Record<string, any> = {}
    let insertOp = false

    content.map((block) => {
      if (block.id) {
        if (!insertOp) insertOp = true
        const desc = convertContentToRawText(block.children)
        blocks[block.id] = { block, desc }
      }
    })

    if (insertOp) return blocks
  }

  return undefined
}
