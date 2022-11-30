import { deleteText, getNodeEntries, getPlateEditorRef, usePlateId } from '@udecode/plate'
import { getRootProps } from '@udecode/plate-styled-components'
import React from 'react'
import toast from 'react-hot-toast'
import { useReadOnly } from 'slate-react'

import { getNodeIdFromEditor } from '../../../Editor/utils/helper'
import { TodoBase } from './Todo'

const Todo = (props: any) => {
  const { attributes, children, element } = props

  const rootProps = getRootProps(props)

  const readOnly = useReadOnly()
  const editorId = usePlateId()
  // const nodeid = useEditorStore((store) => store.node.nodeid)
  const nodeid = getNodeIdFromEditor(editorId)

  // mog('Todo', { nodeid, editorId, readOnly })

  const onDeleteClick = () => {
    const editor = getPlateEditorRef()
    const blockNode = getNodeEntries(editor, {
      at: [],
      match: (node) => element.id === node.id,
      block: true
    })
    try {
      const [_, path] = Array.from(blockNode)[0]
      deleteText(editor, { at: [path[0]] })
      editor.insertText('')
    } catch (error) {
      toast('Unable to delete this todo')
    }
  }

  return (
    <TodoBase
      {...rootProps}
      {...attributes}
      readOnly={readOnly}
      oid={'EditorTodo'}
      todoid={element.id}
      parentNodeId={nodeid}
      controls={{
        onDeleteClick
      }}
    >
      {children}
    </TodoBase>
  )
}

export default Todo
