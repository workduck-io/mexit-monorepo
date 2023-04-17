import { useMemo } from 'react'

import { NodeEditorContent } from '@mexit/core'
import { AIPreview, useAIOptions } from '@mexit/shared'

import { generateEditorPluginsWithComponents } from '../Editor/plugins'
import { useSaveChanges } from '../Hooks/useSaveChanges'
import { getElementById } from '../Utils/cs-utils'

import components from './Editor/EditorPreviewComponents'

const AIPreviewContainer = () => {
  const { appendAndSave } = useSaveChanges()
  const { getAIMenuItems } = useAIOptions()

  const handleOnInsert = (content: NodeEditorContent, nodeId: string) => {
    appendAndSave({ nodeid: nodeId, content })
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
