import { HASH_SEPARATOR, mog, NodeEditorContent, SEPARATOR } from '@mexit/core'

import { defaultContent } from '../Data/baseData'
import { useDataStore } from '../Stores/useDataStore'

import { useApi } from './API/useNodeAPI'
import { getNodeidFromPathAndLinks } from './useLinks'
import { useDataSaverFromContent } from './useSave'

const appendToText = (text: string, textToAppend: string, separator = SEPARATOR) => {
  if (!text) return textToAppend
  return `${text}${separator}${textToAppend}`
}

export const useHierarchy = () => {
  const { saveSingleNewNode, bulkCreateNodes } = useApi()
  const { saveEditorValueAndUpdateStores } = useDataSaverFromContent()

  const createNoteHierarchyString = (notePath: string, namespace: string) => {
    const ilinks = useDataStore.getState().ilinks
    let prefix = ''

    const noteLink = notePath.split(SEPARATOR).reduce((prevPath, currentNotePath) => {
      prefix = appendToText(prefix, currentNotePath)

      const currentNoteId = getNodeidFromPathAndLinks(ilinks, prefix, namespace)
      const linkWithTitle = appendToText(prevPath, currentNotePath, HASH_SEPARATOR)
      const link = appendToText(linkWithTitle, currentNoteId, HASH_SEPARATOR)

      return link
    }, '')

    return noteLink
  }

  const addInHierarchy = async (options: {
    noteId: string
    notePath: string
    parentNoteId: string
    namespace: string
    noteContent?: NodeEditorContent
  }) => {
    try {
      const { notePath, noteId, parentNoteId, noteContent } = options

      const content = noteContent ?? defaultContent.content
      const bulkNotePath = !parentNoteId ? createNoteHierarchyString(notePath, options.namespace) : notePath

      const node = parentNoteId
        ? await saveSingleNewNode(noteId, options.namespace, {
            path: notePath,
            parentNoteId,
            content
          })
        : await bulkCreateNodes(noteId, options.namespace, {
            path: bulkNotePath,
            content
          })

      saveEditorValueAndUpdateStores(noteId, node.namespace, content, { saveApi: false })

      return node
    } catch (error) {
      mog('Error while creating node', { error })
    }
  }

  return {
    addInHierarchy
  }
}
