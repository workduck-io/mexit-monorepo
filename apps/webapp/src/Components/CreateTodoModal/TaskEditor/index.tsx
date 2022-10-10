import React, { useMemo } from 'react'

import { Plate } from '@udecode/plate'
import { debounce } from 'lodash'

import { NodeEditorContent } from '@mexit/core'
import { useEditorChange } from '@mexit/shared'

import { MultiComboboxContainer } from '../../../Editor/Components/MultiCombobox/multiComboboxContainer'
import useMultiComboboxOnChange from '../../../Editor/Components/MultiCombobox/useMultiComboboxChange'
import useMultiComboboxOnKeyDown from '../../../Editor/Components/MultiCombobox/useMultiComboboxOnKeyDown'
import { useEditorPluginConfig } from '../../../Editor/Hooks/useEditorConfig'
import { getTodoPlugins } from './plugins'

type TaskEditorType = {
  editorId: string
  content: NodeEditorContent
  readOnly?: boolean
  onChange?: (val: any) => void
}

const TaskEditor = ({ editorId, readOnly, content, onChange }: TaskEditorType) => {
  const config = useEditorPluginConfig(editorId)

  const plugins = useMemo(() => getTodoPlugins(), [])

  const pluginConfigs = {
    combobox: {
      onChange: useMultiComboboxOnChange(editorId, config.onChangeConfig),

      onKeyDown: useMultiComboboxOnKeyDown(config.onKeyDownConfig)
    }
  }

  const pluginsWithCombobox = [
    ...plugins,
    {
      key: 'MULTI_COMBOBOX',
      handlers: {
        onChange: pluginConfigs.combobox.onChange,
        onKeyDown: pluginConfigs.combobox.onKeyDown
      }
    }
  ]

  useEditorChange(editorId, content)

  const onDelayPerform = debounce(typeof onChange === 'function' ? onChange : () => undefined, 300)

  const onChangeContent = (val: NodeEditorContent) => {
    onDelayPerform(val)
  }

  const editableProps = { placeholder: 'Add description...', readOnly, autoFocus: true }

  return (
    <Plate
      id={editorId}
      initialValue={content}
      plugins={pluginsWithCombobox}
      onChange={onChangeContent}
      editableProps={editableProps}
    >
      <MultiComboboxContainer config={config.onKeyDownConfig} />
    </Plate>
  )
}

export default TaskEditor
