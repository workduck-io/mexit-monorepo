import React, { useState, useEffect } from 'react'
import { Plate, selectEditor, usePlateEditorRef } from '@udecode/plate'
import { useComboboxConfig } from './components/ComboBox/config'
import { MultiComboboxContainer } from './components/MultiCombobox/multiComboboxContainer'
import { useMexEditorStore } from './store/editor'
import { MexEditorProps, MexEditorValue } from './types/editor'

export function MexEditor(props: MexEditorProps) {
  const editorRef = usePlateEditorRef()
  const [content, setContent] = useState<MexEditorValue>([])
  const setMetaData = useMexEditorStore((s) => s.setMetaData)

  useEffect(() => {
    if (editorRef && props?.options?.focusOptions) {
      selectEditor(editorRef, props.options.focusOptions)
    }
    setMetaData(props.meta)
  }, [editorRef, props.editorId, props?.options?.editableProps?.autoFocus])

  const { plugins, comboOnKeydownConfig } = useComboboxConfig(
    props.editorId,
    props?.comboboxConfig,
    props?.components,
    props?.plugins
  )

  const onChange = (value: MexEditorValue) => {
    setContent(value)
    if (props.onChange) {
      props.onChange(value)
    }
  }

  return (
    <>
      <Plate
        id={props.editorId}
        value={props.value}
        onChange={onChange}
        editableProps={props?.options?.editableProps}
        plugins={plugins}
      >
        <>
          <MultiComboboxContainer
            keys={comboOnKeydownConfig.keys}
            slashCommands={comboOnKeydownConfig.slashCommands}
            portalElement={props?.portalElement}
          />
          {props.options?.withBalloonToolbar && props.BalloonMarkToolbarButtons}
        </>
      </Plate>
      {props.debug && <pre>{JSON.stringify(content, null, 2)}</pre>}
    </>
  )
}

export default MexEditor
