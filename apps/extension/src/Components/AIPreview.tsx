import { useMemo } from 'react'

import { addProperty, mog, NodeEditorContent } from '@mexit/core'
import { AIPreview, useAIOptions } from '@mexit/shared'

import { generateEditorPluginsWithComponents } from '../Editor/plugins'
import { useSaveChanges } from '../Hooks/useSaveChanges'
import { getElementById } from '../Utils/cs-utils'

import components from './Editor/EditorPreviewComponents'

const AIPreviewContainer = () => {
  const { appendAndSave } = useSaveChanges()
  const { getAIMenuItems } = useAIOptions()

  const handleOnInsert = (content: NodeEditorContent, nodeId: string) => {
    const blockWithSource = content.map((superBlock) =>
      addProperty(superBlock, {
        url: window.location.href,
        title: document.title
      })
    )
    mog('CONTENT IS', { content, blockWithSource })

    appendAndSave({ nodeid: nodeId, content: blockWithSource })
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

  return (
    <AIPreview
      plugins={plugins}
      insertInNote
      onInsert={handleOnInsert}
      getDefaultItems={getAIMenuItems}
      root={getElementById('mexit-container')}
    />
  )
}

export default AIPreviewContainer
