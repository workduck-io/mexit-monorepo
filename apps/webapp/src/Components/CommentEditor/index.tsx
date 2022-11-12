import { useMemo } from 'react'

import { Plate } from '@udecode/plate'
import { debounce } from 'lodash'

import { NodeEditorContent } from '@mexit/core'
import { useEditorChange } from '@mexit/shared'

import { MultiComboboxContainer } from '../../Editor/Components/MultiCombobox/multiComboboxContainer'
// import useMultiComboboxOnChange from '../../Editor/Components/MultiCombobox/useMultiComboboxChange'
// import useMultiComboboxOnKeyDown from '../../Editor/Components/MultiCombobox/useMultiComboboxOnKeyDown'
import { useEditorPluginConfig } from '../../Editor/Hooks/useEditorConfig'
import { getCommentPlugins } from './plugins'

type CommentEditorType = {
  editorId: string
  content: NodeEditorContent
  readOnly?: boolean
  onChange?: (val: any) => void
}

export const CommentEditor = ({ editorId, readOnly, content, onChange }: CommentEditorType) => {
  const config = useEditorPluginConfig(editorId)

  const plugins = useMemo(() => getCommentPlugins(), [])

  // const pluginConfigs = {
  //   combobox: {
  //     onChange: useMultiComboboxOnChange(editorId, config.onChangeConfig),

  //     onKeyDown: useMultiComboboxOnKeyDown(config.onKeyDownConfig)
  //   }
  // }

  // const pluginsWithCombobox = [
  //   ...plugins,
  //   {
  //     key: 'MULTI_COMBOBOX',
  //     handlers: {
  //       onChange: pluginConfigs.combobox.onChange,
  //       onKeyDown: pluginConfigs.combobox.onKeyDown
  //     }
  //   }
  // ]

  useEditorChange(editorId, content)

  const onDelayPerform = debounce(typeof onChange === 'function' ? onChange : () => undefined, 300)

  const onChangeContent = (val: NodeEditorContent) => {
    onDelayPerform(val)
  }

  const editableProps = { placeholder: 'Add Comment...', readOnly, autoFocus: true }

  return (
    <Plate
      id={editorId}
      initialValue={content}
      plugins={plugins}
      onChange={onChangeContent}
      editableProps={editableProps}
    >
      <MultiComboboxContainer config={config.onKeyDownConfig} />
    </Plate>
  )
}
