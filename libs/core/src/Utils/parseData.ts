import { indexNames, diskIndex } from '../Data/search'
import { NodeEditorContent } from '../Types/Editor'
import { GenericSearchData, PersistentData } from '../Types/Search'
import { getSlug } from './strings'

const ELEMENT_ILINK = 'ilink'

type ExcludeFromTextType = {
  types?: Set<string>
  fields?: Set<ExcludeFieldTypes>
}

type ExcludeFieldTypes = 'value' | 'url' | 'text'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const convertContentToRawText = (
  content: any[],
  join?: string,
  exclude: ExcludeFromTextType = {
    types: new Set([
      // ELEMENT_EXCALIDRAW,
      ELEMENT_ILINK
      // ELEMENT_INLINE_BLOCK
    ])
  }
): string => {
  const text: string[] = []

  content?.forEach((n) => {
    if (exclude?.types?.has(n.type)) return

    if (n.text && !exclude?.fields?.has('text') && n.text !== '') text.push(n.text)

    // * Extract custom components (ILink, Tags, etc) `value` field
    if (n.value && !exclude?.fields?.has('value') && n.value !== '') text.push(n.value)

    // * Extract custom components (Webem, Links) `url` field
    if (n.url && !exclude?.fields?.has('url') && n.url !== '') text.push(n.url)

    if (n.children && n.children.length > 0) {
      const childText = convertContentToRawText(n.children, join ?? '', exclude)
      text.push(childText)
    }
  })

  const rawText = text.join(join ?? '')
  return rawText
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const convertEntryToRawText = (nodeUID: string, entry: any[], title = ''): GenericSearchData => {
  return { id: nodeUID, title, text: convertContentToRawText(entry, ' ') }
}

export const getHeadingBlock = (content: NodeEditorContent) => {
  // const isHeadingBlock = content[0].type === ELEMENT_QA_BLOCK

  return undefined
}

export const getTitleFromContent = (content: NodeEditorContent) => {
  const heading = getHeadingBlock(content)
  if (heading) return heading.title

  const text = convertContentToRawText(content, ' ', { fields: new Set<ExcludeFieldTypes>(['value', 'url']) })
  const title = getSlug(text)

  return title
}

export const convertDataToIndexable = (data: PersistentData) => {
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
        data.archive.forEach((entry) => {
          titleNodeMap.set(entry.nodeid, entry.path)
        })
        break
      }

      case indexNames.template:
      case indexNames.snippet: {
        data.snippets.forEach((snippet) => {
          titleNodeMap.set(snippet.id, snippet.title)
        })
        break
      }

      default: {
        throw new Error('No corresponding index name found')
      }
    }

    // Process the filedata to get the indexable data
    if (idxName === indexNames.archive || idxName === indexNames.node) {
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
    } else if (idxName === indexNames.snippet) {
      data.snippets
        .filter((snip) => !snip.isTemplate)
        .map((snip) => {
          const title = titleNodeMap.get(snip.id)
          const temp: GenericSearchData = {
            ...convertEntryToRawText(snip.id, snip.content, title),
            tag: ['snippet']
          }
          nodeBlockMap[snip.id] = [snip.id] // Redundant right now, not doing block level indexing for snippets
          idxResult.push(temp)
        })
    } else if (idxName === indexNames.template) {
      data.snippets
        .filter((snip) => snip.isTemplate)
        .map((template) => {
          const title = titleNodeMap.get(template.id)
          const temp: GenericSearchData = {
            ...convertEntryToRawText(template.id, template.content, title),
            tag: ['template']
          }
          nodeBlockMap[template.id] = [template.id] // Redundant right now, not doing block level indexing for snippets
          idxResult.push(temp)
        })
    } else {
      throw new Error('No corresponding index name found')
    }

    return { ...p, [idxName]: idxResult }
  }, diskIndex)

  return { result, nodeBlockMap }
}
