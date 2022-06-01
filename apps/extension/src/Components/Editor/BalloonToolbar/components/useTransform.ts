import { Editor, Transforms } from 'slate'
import { TEditor, getNodes, getSelectionText, insertNodes } from '@udecode/plate'

import genereateName from 'project-name-generator'
import toast from 'react-hot-toast'
import { ELEMENT_ILINK, ILinkNode, useContentStore, useSnippetStore } from '@workduck-io/mex-editor'
import { convertContentToRawText } from '@mexit/core'
import { generateSnippetId, mog } from '@mexit/core'

export const useTransform = () => {
  // const addILink = useDataStore((s) => s.addILink)
  const addSnippet = useSnippetStore((s) => s.addSnippet)
  const setContent = useContentStore((s) => s.setContent)

  const convertSelectionToQABlock = (editor: TEditor) => {
    try {
      const selectionPath = Editor.path(editor, editor.selection)
      const val = selectionToValue(editor)
      const valText = convertContentToRawText(val)

      // mog('replaceSelectionWithLink  selPath', { selectionPath })

      Transforms.removeNodes(editor, { at: editor.selection, hanging: false })
      // Transforms.liftNodes(editor, { at: editor.selection, mode: 'lowest' })

      mog('replaceSelectionWithQA  ', { selectionPath, val, valText })
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
      getNodes(editor, {
        block: true
      })
    ).reduce((p: boolean, [node, _path]: any) => {
      // mog('isConvertable', { editor, p, node, ifb: isFlowBlock(node) })
      return p
    }, false)
  }

  const replaceSelectionWithLink = (editor: TEditor, ilink: string, inline: boolean) => {
    try {
      const selectionPath = Editor.path(editor, editor.selection)

      // mog('replaceSelectionWithLink  selPath', { selectionPath })

      if (inline) Transforms.delete(editor)
      else
        Transforms.removeNodes(editor, {
          at: editor.selection,
          hanging: false
        })
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
   * Converts selection to new snippet
   * Shows notification of snippet creation
   * @param editor
   */
  const selectionToValue = (editor: TEditor) => {
    if (!editor.selection) return
    if (!isConvertable(editor)) return

    const nodes = Array.from(
      getNodes(editor, {
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

    // Editor.withoutNormalizing(editor, () => {
    //   const selectionPath = Editor.path(editor, editor.selection)
    //   const nodes = Array.from(
    //     getNodes(editor, {
    //       mode: 'highest',
    //       block: true,
    //       at: editor.selection
    //     })
    //   )
    //   const lowest = Array.from(
    //     getNodes(editor, {
    //       mode: 'lowest',
    //       block: true,
    //       at: editor.selection
    //     })
    //   )

    //   const selText = getSelectionText(editor)

    //   const value = nodes.map(([node, _path]) => {
    //     return node
    //   })
    //   const isInline = lowest.length === 1
    //   const putContent = selText.length > NODE_PATH_CHAR_LENGTH

    //   const text = convertContentToRawText(value, NODE_PATH_SPACER)
    //   const parentPath = useEditorStore.getState().node.title
    //   const path = parentPath + SEPARATOR + (isInline ? getSlug(selText) : getSlug(text))

    //   const node = addILink({ ilink: path })

    //   replaceSelectionWithLink(editor, node.nodeid, isInline)
    //   // mog('We are here', { lowest, selText, esl: editor.selection, selectionPath, nodes, value, text, path, nodeid })
    //   setContent(node.nodeid, putContent ? value : defaultContent.content)
    //   // saveData()
    //   // mog('We are here', { esl: editor.selection, selectionPath, nodes, value, text, path })
    // })
  }

  /**
   * Converts selection to new snippet
   * Shows notification of snippet creation
   * @param editor
   */
  const selectionToSnippet = (editor: TEditor) => {
    if (!editor.selection) return
    if (!isConvertable(editor)) return

    Editor.withoutNormalizing(editor, () => {
      const selectionPath = Editor.path(editor, editor.selection)
      const nodes = Array.from(
        getNodes(editor, {
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
      addSnippet({
        id: snippetId,
        title: snippetTitle,
        content: value,
        icon: 'ri:quill-pen-line'
      })

      // mog('We are here', { esl: editor.selection, selectionPath, nodes, value })

      toast(`Snippet created '/snip.${snippetTitle}'`, { duration: 5000 })
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
