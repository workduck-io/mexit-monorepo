import {
  TEditor,
  getNodes,
  getSelectionText,
  insertNodes,
  getNodeEntries,
  removeNodes,
  withoutNormalizing,
  getPath,
  deleteText
} from '@udecode/plate'
import genereateName from 'project-name-generator'
import toast from 'react-hot-toast'
import { Editor, Transforms } from 'slate'

import {
  convertContentToRawText,
  defaultContent,
  ELEMENT_QA_BLOCK,
  ELEMENT_SYNC_BLOCK,
  generateTempId,
  getSlug,
  NODE_PATH_CHAR_LENGTH,
  NODE_PATH_SPACER,
  SEPARATOR
} from '@mexit/core'
import { generateSnippetId, mog } from '@mexit/core'

import { useContentStore } from '../../../../Stores/useContentStore'
import { useSnippetStore } from '../../../../Stores/useSnippetStore'

export const useTransform = () => {
  const addSnippet = useSnippetStore((s) => s.addSnippet)

  // Checks whether a node is a flowblock
  const isFlowBlock = (node: any): boolean => {
    if (node.type === ELEMENT_SYNC_BLOCK) return true
    if (node.children) {
      if (node.children.length > 0)
        return node.children.map(isFlowBlock).reduce((p: boolean, c: boolean) => p || c, false)
    }
    return false
  }

  // Checks whether current editor selection can be converted
  const addQABlock = (editor: TEditor, block: { question: string; questionId: string }): boolean => {
    if (!editor) return false
    if (!editor?.selection) return false
    const { question, questionId } = block

    deleteText(editor)
    // If editor selection has flowblock it is not convertable
    insertNodes<any>(editor, [{ type: ELEMENT_QA_BLOCK, question, questionId, id: generateTempId(), children: [] }], {
      at: editor.selection
    })
  }

  const convertSelectionToQABlock = (editor: TEditor) => {
    try {
      // const selectionPath = getPath(editor, editor.selection)
      const val = selectionToValue(editor)
      const valText = convertContentToRawText(val)

      // mog('replaceSelectionWithLink  selPath', { selectionPath })

      removeNodes(editor, { at: editor.selection, hanging: false })
      // Transforms.liftNodes(editor, { at: editor.selection, mode: 'lowest' })

      // mog('replaceSelectionWithQA  ', { selectionPath, val, valText })
      //
      addQABlock(editor, { question: valText, questionId: generateSnippetId() })
    } catch (e) {
      console.error(e)
      return e
    }
  }

  // Checks whether current editor selection can be converted
  const isConvertable = (editor: TEditor): boolean => {
    if (!editor) return false
    if (!editor?.selection) return false
    // If editor selection has flowblock it is not convertable
    return !Array.from(
      getNodeEntries(editor, {
        block: true
      })
    ).reduce((p: boolean, [node, _path]: any) => {
      // mog('isConvertable', { editor, p, node, ifb: isFlowBlock(node) })
      return p || isFlowBlock(node)
    }, false)
  }

  /**
   * Converts selection to new snippet
   * Shows notification of snippet creation
   * @param editor
   */
  const selectionToValue = (editor: TEditor) => {
    if (!editor.selection) return
    if (!isConvertable(editor)) return

    const nodes = Array.from(
      getNodeEntries(editor, {
        mode: 'highest',
        block: true,
        at: editor.selection
      })
    )

    const value = nodes.map(([node, _path]) => {
      return node
    })

    return value
  }

  /**
   * Converts selection to new node
   * Inserts the link of new node in place of the selection
   * @param editor
   */
  const selectionToNode = (editor: TEditor) => {
    if (!editor.selection) return
    if (!isConvertable(editor)) return

    withoutNormalizing(editor, () => {
      // const selectionPath = getPath(editor, editor.selection)
      const nodes = Array.from(
        getNodeEntries(editor, {
          mode: 'highest',
          block: true,
          at: editor.selection
        })
      )
      const lowest = Array.from(
        getNodeEntries(editor, {
          mode: 'lowest',
          block: true,
          at: editor.selection
        })
      )

      const selText = getSelectionText(editor)

      const value = nodes.map(([node, _path]) => {
        return node
      })
      const isInline = lowest.length === 1
      const putContent = selText.length > NODE_PATH_CHAR_LENGTH

      const text = convertContentToRawText(value, NODE_PATH_SPACER)
      // const parentPath = useEditorStore.getState().node.title
      // const path = parentPath + SEPARATOR + (isInline ? getSlug(selText) : getSlug(text))

      // const note = createNewNote({ path, noteContent: putContent ? value : defaultContent.content, noRedirect: true })

      // replaceSelectionWithLink(editor, note?.nodeid, isInline)
      // mog('Replace Selection with node We are here', {
      //   lowest,
      //   selText,
      //   esl: editor.selection,
      //   selectionPath,
      //   nodes,
      //   value,
      //   text,
      //   path
      // })
      // saveData()
      // mog('We are here', { esl: editor.selection, selectionPath, nodes, value, text, path })
    })
  }
  /**
   * Converts selection to new snippet
   * Shows notification of snippet creation
   * @param editor
   */
  const selectionToSnippet = (editor: TEditor) => {
    if (!editor.selection) return
    if (!isConvertable(editor)) return

    withoutNormalizing(editor, () => {
      const selectionPath = getPath(editor, editor.selection)
      const nodes = Array.from(
        getNodeEntries(editor, {
          mode: 'highest',
          block: true,
          at: editor.selection
        })
      )

      const value = nodes.map(([node, _path]) => {
        return node
      })

      const snippetId = generateSnippetId()
      const snippetTitle = genereateName().dashed
      const newSnippet = {
        id: snippetId,
        title: snippetTitle,
        content: value,
        icon: 'ri:quill-pen-line'
      }
      // updateSnippet(newSnippet)
      // updater()
      // addSnippet()

      // mog('We are here', { esl: editor.selection, selectionPath, nodes, value })

      toast(`Snippet created [[${snippetTitle}]]`, { duration: 5000 })
      // setContent(nodeid, value)
      // saveData()
      // mog('We are here', { esl: editor.selection, selectionPath, nodes, value, text, path })
    })
  }

  return {
    selectionToNode,
    convertSelectionToQABlock,
    isConvertable,
    selectionToSnippet,
    selectionToValue
  }
}
