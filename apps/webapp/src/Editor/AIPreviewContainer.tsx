import { AIPreview } from '@mexit/shared'

import { useCreateNewMenu } from '../Hooks/useCreateNewMenu'

import components from './Components/EditorPreviewComponents'
import { generateEditorPluginsWithComponents } from './Plugins'

const AIPreviewContainer = ({ id }) => {
  const { getAIMenuItems } = useCreateNewMenu()
  const plugins = generateEditorPluginsWithComponents(components, { exclude: { dnd: true } })

  return <AIPreview id={id} allowReplace insertInNote={false} plugins={plugins} getDefaultItems={getAIMenuItems} />
}

export default AIPreviewContainer
