import {
  deleteText,
  getNodeEntries,
  getNodeFragment,
  getPath,
  getSelectionText,
  insertNodes,
  removeNodes,
  TEditor,
  withoutNormalizing
} from '@udecode/plate'
import genereateName from 'project-name-generator'

import {
  convertContentToRawText,
  ELEMENT_ILINK,
  ELEMENT_QA_BLOCK,
  ELEMENT_SYNC_BLOCK,
  generateSnippetId,
  generateTempId,
  getSlug,
  NODE_PATH_SPACER,
  NodeEditorContent,
  SEPARATOR
} from '@mexit/core'
import { DefaultMIcons, ILinkNode } from '@mexit/shared'

import { getNodeIdFromEditor } from '../../../../Editor/Utils/helper'
import { useCreateNewNote } from '../../../../Hooks/useCreateNewNote'
import { useSnippets } from '../../../../Hooks/useSnippets'
import { useDataStore } from '../../../../Stores/useDataStore'
import { convertValueToTasks } from '../../../../Utils/convertValueToTasks'
import { useOpenToast } from '../../../Toast/useOpenToast'

export const useTransform = () => {
  const { openNoteToast, openSnippetToast } = useOpenToast()
  const { updateSnippet } = useSnippets()
  const { createNewNote } = useCreateNewNote()

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

      removeNodes(editor, { at: editor.selection, hanging: false })

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
      else removeNodes(editor, { at: editor.selection, hanging: true, mode: inline ? undefined : 'highest' })

      // Transforms.liftNodes(editor, { at: editor.selection, mode: 'lowest' })

      // mog('replaceSelectionWithLink  detFrag', { selectionPath, ilink, inline })

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
  const selectionToNode = (editor: TEditor, title?: string) => {
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

      const isInline = lowest.length === 1
      // Only query for lowest value if selection is inline
      const lowestValue = isInline ? getNodeFragment(editor, editor.selection) : []
      const value = isInline
        ? lowestValue
        : nodes.map(([node, _path]) => {
            return node
          })

      const text = convertContentToRawText(value, NODE_PATH_SPACER)

      const editorId = editor.id as string
      const nodeid = getNodeIdFromEditor(editorId)

      const ilinks = useDataStore.getState().ilinks
      const node = ilinks.find((n) => n.nodeid === nodeid)

      if (node) {
        const parentPath = node.path
        const namespace = node.namespace
        const childTitle = title ?? (isInline ? getSlug(selText) : getSlug(text))
        const path = parentPath + SEPARATOR + childTitle

        // mog('selectionToNode  ', {
        //   parentPath,
        //   lowest,
        //   lowestValue,
        //   value,
        //   childTitle,
        //   path,
        //   namespace,
        //   editorId,
        //   nodeid
        // })

        const note = createNewNote({
          path,
          noteContent: value,
          namespace: namespace,
          noRedirect: true
        })

        replaceSelectionWithLink(editor, note?.nodeid, isInline)

        if (note) {
          // TODO: Add Open Toast
          openNoteToast(note.nodeid, note.path)
        }
      }
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
  const selectionToSnippet = (editor: TEditor, title?: string) => {
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
      const snippetTitle = title ?? genereateName().dashed
      const newSnippet = {
        id: snippetId,
        title: snippetTitle,
        content: value,
        icon: DefaultMIcons.SNIPPET
      }

      updateSnippet(newSnippet)

      openSnippetToast(snippetId, snippetTitle)
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
