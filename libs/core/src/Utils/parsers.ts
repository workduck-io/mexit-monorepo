import { ILink } from '../Types/Editor'
import { GenericSearchData, SearchRepExtra } from '../Types/Search'
import { Snippet } from '../Types/Snippet'
import { ELEMENT_EXCALIDRAW } from './editorElements'
import { convertContentToRawText } from './parseData'

export const hierarchyParser = (
  linkData: string[],
  namespace: string,
  options?: { withParentNodeId: boolean; allowDuplicates?: boolean }
): ILink[] => {
  const ilinks: ILink[] = []
  const idPathMapping: { [key: string]: string } = {}
  const pathIdMapping: { [key: string]: { nodeid: string; index: number } } = {}

  for (const subTree of linkData) {
    const nodes = subTree.split('#')

    let prefix: string
    let parentNodeId: string | undefined

    if (nodes.length % 2 !== 0) throw new Error('Invalid Linkdata Input')

    for (let index = 0; index < nodes.length; index += 2) {
      const nodeTitle = nodes[index]
      const nodeID = nodes[index + 1]

      const nodePath = prefix ? `${prefix}.${nodeTitle}` : nodeTitle

      /*
          Drafts.A and Drafts.B exist, we need to check if the Drafts parent node is the same by checking
          the parent nodeUID. This handles the case in which a nodeID might have two different node paths.

          We still do not handle the case where there are 2 nodes with the same path but different Node IDs,
          we handle that on the frontend for now
        */

      if (idPathMapping[nodeID]) {
        if (idPathMapping[nodeID] !== nodePath) {
          const ilinkAt = ilinks?.findIndex((ilink) => ilink.nodeid === nodeID)

          if (ilinkAt) {
            ilinks.splice(ilinkAt, 1, { ...ilinks[ilinkAt], path: nodePath })
          }
        }
      } else if (pathIdMapping[nodePath] && !options?.allowDuplicates) {
        // mog(`Found existing notePath: ${nodePath} with ${nodeID} at index: ${pathIdMapping[nodePath].index}`)
        ilinks[pathIdMapping[nodePath].index] = { nodeid: nodeID, path: nodePath, namespace }
      } else {
        // mog(`Inserting: ${nodePath} with ${nodeID} at index: ${ilinks.length}`)
        idPathMapping[nodeID] = nodePath
        pathIdMapping[nodePath] = { nodeid: nodeID, index: ilinks.length }
        const ilink: ILink = { nodeid: nodeID, path: nodePath, namespace }
        ilinks.push(options?.withParentNodeId ? { ...ilink, parentNodeId } : ilink)
      }

      prefix = nodePath
      parentNodeId = nodeID
    }
  }

  return ilinks
}

export const parseBlock = (content: any[], join?: string): string => {
  const text: string[] = []
  content?.forEach((n) => {
    if (n.text && n.text !== '') text.push(n.text)
    if (n.children && n.children.length > 0) {
      const childText = parseBlock(n.children)
      text.push(childText)
    }
  })
  return text.join(join ?? ' ')
}

export const parseNode = (nodeId: string, contents: any[], title = '', extra?: SearchRepExtra): GenericSearchData[] => {
  const result: GenericSearchData[] = []
  const extraKeys = extra ? Object.keys(extra) : []
  contents.forEach((block) => {
    if (block.type === ELEMENT_EXCALIDRAW) return

    let blockText = ''
    if (block.value && block.value !== '') blockText += `${block.value}`
    if (block.url && block.url !== '') blockText += ` ${block.url}`
    blockText += ' ' + convertContentToRawText(block.children, ' ', { extra })

    if (extraKeys.includes(block.type)) {
      if (extra[block.type]) {
        const blockKey = extra[block.type].keyToIndex
        blockText = extra[block.type].replacements[block[blockKey]]
      }
    }

    // if (block.type === ELEMENT_ACTION_BLOCK) blockText = camelCase(block.actionContext?.actionGroupId)

    if (blockText.trim().length !== 0) {
      const temp: GenericSearchData = { id: nodeId, text: blockText, blockId: block.id, title, data: block }
      result.push(temp)
    }
  })

  return result
}

export const parseSnippet = (snippet: Snippet): GenericSearchData => {
  const snip: GenericSearchData = {
    id: snippet.id,
    title: snippet.title,
    text: parseBlock(snippet.content, ' ')
  }
  return snip
}
