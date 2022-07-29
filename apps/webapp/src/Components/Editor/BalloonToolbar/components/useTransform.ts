import {
  deleteText,
  getNodeEntries,
  getPath,
  getSelectionText,
  insertNodes,
  removeNodes,
  TEditor,
  withoutNormalizing
} from '@udecode/plate'
import genereateName from 'project-name-generator'
import toast from 'react-hot-toast'

import {
  NodeEditorContent,
  mog,
  generateSnippetId,
  getSlug,
  NODE_PATH_SPACER,
  SEPARATOR,
  ELEMENT_ILINK,
  convertContentToRawText,
  ELEMENT_SYNC_BLOCK,
  defaultContent,
  generateTempId,
  NODE_PATH_CHAR_LENGTH,
  ELEMENT_QA_BLOCK
} from '@mexit/core'
import { ILinkNode } from '@mexit/shared'

import { useCreateNewNote } from '../../../../Hooks/useCreateNewNote'
import { useSnippets } from '../../../../Hooks/useSnippets'
import { useUpdater } from '../../../../Hooks/useUpdater'
import { useEditorStore } from '../../../../Stores/useEditorStore'
import { convertValueToTasks } from '../../../../Utils/convertValueToTasks'

export const useTransform = () => {
  const { updateSnippet } = useSnippets()
  const { createNewNote } = useCreateNewNote()
  const { updater } = useUpdater()

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

  const replaceSelectionWithTask = (editor: TEditor, todoVal: NodeEditorContent) => {
    try {
      removeNodes(editor, { at: editor.selection, mode: 'highest' })

      const convertedVal = convertValueToTasks(todoVal)
      // mog('replaceSelectionWithTask  ', { todoVal, convertedVal })

      insertNodes<any>(editor, convertedVal, {
        at: editor.selection
      })
      // addQABlock(editor, { question: valText, questionId: generateSnippetId() })
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

  const replaceSelectionWithLink = (editor: TEditor, ilink: string, inline: boolean) => {
    try {
      const selectionPath = getPath(editor, editor.selection)

      // mog('replaceSelectionWithLink  selPath', { selectionPath })

      if (inline) deleteText(editor)
      else removeNodes(editor, { at: editor.selection, hanging: false })
      // Transforms.liftNodes(editor, { at: editor.selection, mode: 'lowest' })

      // mog('replaceSelectionWithLink  detFrag', { selectionPath })

      insertNodes<ILinkNode>(editor, [{ type: ELEMENT_ILINK, value: ilink, children: [] }], {
        at: editor.selection
      })
      // mog('replaceSelectionWithLink  insNode', { sel: editor.selection })
    } catch (e) {
      console.error(e)
      return e
    }
  }

  /**
   * Converts selection to Value
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
      const parentPath = useEditorStore.getState().node.title
      const path = parentPath + SEPARATOR + (isInline ? getSlug(selText) : getSlug(text))

      const note = createNewNote({ path, noteContent: putContent ? value : defaultContent.content, noRedirect: true })

      replaceSelectionWithLink(editor, note?.nodeid, isInline)
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
   * Converts selection to new Task
   * @param editor
   */
  const selectionToTask = (editor: TEditor) => {
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

      const value = nodes.map(([node, _path]) => {
        return node
      })

      replaceSelectionWithTask(editor, value)

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
      updateSnippet(newSnippet)
      updater()
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
    isFlowBlock,
    selectionToSnippet,
    selectionToTask,
    selectionToValue
  }
}
