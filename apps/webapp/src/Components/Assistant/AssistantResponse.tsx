import { useMemo } from 'react'

import { createPlateEditor, deserializeMd, focusEditor,getPlateEditorRef, insertNodes } from '@udecode/plate'

import { AIEvent , generateTempId,useEditorStore  } from '@mexit/core'
import { InsertMenu } from '@mexit/shared'

import components from '../../Editor/Components/EditorPreviewComponents'
import { generateEditorPluginsWithComponents } from '../../Editor/Plugins'
import Plateless from '../Editor/Plateless'

import { MessageBubble } from './styled'

const AssistantResponse = ({ event }: { event: AIEvent }) => {
  const node = useEditorStore((store) => store.node)

  const getContent = (content: string) => {
    if (!content) return

    const editor = getPlateEditorRef()
    const deserializedContent = deserializeMd(editor, content)?.map((node) => ({
      ...node,
      id: generateTempId()
    }))

    return deserializedContent
  }

  const insertContent = (content: string) => {
    const editor = getPlateEditorRef(node.nodeid)
    const deserializedContent = getContent(content)

    if (Array.isArray(deserializedContent) && deserializedContent.length > 0) {
      const at = [editor.children.length]

      try {
        insertNodes(editor, deserializedContent, {
          at
        })
        focusEditor(editor, at)
      } catch (err) {
        console.error('Unable to focus editor', err)
      }
    }
  }

  const handleOnInsert = (id?: string) => {
    const content = event?.content
    insertContent(content)
  }

  const plugins = useMemo(
    () =>
      generateEditorPluginsWithComponents(components, {
        exclude: {
          dnd: true
        }
      }),
    []
  )
  const baseEditor = createPlateEditor({ plugins })

  const content = deserializeMd(baseEditor, event.content)

  return (
    <MessageBubble role={event.role}>
      <Plateless content={content} multiline />

      <InsertMenu type="default" onClick={handleOnInsert} />
    </MessageBubble>
  )
}

export { AssistantResponse }
