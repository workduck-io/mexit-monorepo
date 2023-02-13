import toast from 'react-hot-toast'

import { deleteText, getNodeEntries, getPlateEditorRef, usePlateId } from '@udecode/plate'
import { getRootProps } from '@udecode/plate-styled-components'
import { useFocused, useReadOnly, useSelected } from 'slate-react'

import { getNodeIdFromEditor } from '../../Editor/Utils/helper'
import useModalStore, { ModalsType } from '../../Stores/useModalStore'

import { TodoBase } from './Todo'

const Todo = (props: any) => {
  const { attributes, children, element } = props

  const rootProps = getRootProps(props)
  const hideDelete = useModalStore((m) => m.open === ModalsType.todo)

  const selected = useSelected()
  const focused = useFocused()

  const readOnly = useReadOnly()
  const editorId = usePlateId()
  // const nodeid = useEditorStore((store) => store.node.nodeid)
  const nodeid = getNodeIdFromEditor(editorId)

  const showDelete = !hideDelete && !readOnly

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
      readOnlyContent={readOnly}
      oid={'EditorTodo'}
      element={element}
      showOptions={selected && focused}
      todoid={element?.id}
      showDelete={showDelete}
      showPriority
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
