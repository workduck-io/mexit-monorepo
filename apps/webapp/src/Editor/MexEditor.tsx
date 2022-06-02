import React, { useState, useEffect, ReactElement } from 'react'
import {
  Plate,
  selectEditor,
  usePlateEditorRef,
  Options,
  PlaceholderProps,
  PlatePlugin,
  PlatePluginComponent,
  SelectEditorOptions
} from '@udecode/plate'
import { EditableProps } from 'slate-react/dist/components/editable'

import { MexEditorValue } from './Types/Editor'
import { useMexEditorStore } from './Hooks/useMexEditorStore'
import { MultiComboboxContainer } from './Components/MultiCombobox/multiComboboxContainer'
import { useComboboxConfig } from './Components/Combobox/config'
import { ComboboxConfig } from './Types/MultiCombobox'

export interface MexEditorOptions {
  editableProps?: EditableProps
  focusOptions?: SelectEditorOptions
  withDraggable?: boolean
  withBalloonToolbar?: boolean
}

export interface InternalMetadata {
  path: string
  delimiter?: string
}

export interface MexEditorProps {
  comboboxConfig: ComboboxConfig
  components?: Record<string, PlatePluginComponent<any | undefined>> // * Pass components which you want to replace
  editorId: string // * Unique ID for the Mex Editor
  className?: string // * Pass className to styled Mex Editor
  value: MexEditorValue // * Initial value of editor, to set onChange content, use `editor.children = content`
  placeholders?: Options<Array<PlaceholderProps>> // * Array of objects with `placeholder` text and element `key
  onChange?: (value: MexEditorValue) => void // * Callback on change
  options?: MexEditorOptions // * Power the editor with options
  meta?: InternalMetadata // * MetaData of current editor
  plugins?: Array<PlatePlugin> // * Plugins to power the editor
  debug?: boolean // * Debug mode for content
  exclude?: Array<string> // * Array of elements from MEX_EDITOR_ELEMENTS
  BalloonMarkToolbarButtons?: ReactElement
  portalElement?: Element
}

export function MexEditor(props: MexEditorProps) {
  const editorRef = usePlateEditorRef()
  const [content, setContent] = useState<MexEditorValue>([])
  const setInternalMetadata = useMexEditorStore((store) => store.setInternalMetadata)

  useEffect(() => {
    if (editorRef && props?.options?.focusOptions) {
      selectEditor(editorRef, props.options.focusOptions)
    }
    setInternalMetadata(props.meta)
  }, [editorRef, props.editorId]) // eslint-disable-line react-hooks/exhaustive-deps

  const { plugins, comboConfigData } = useComboboxConfig(
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
        editableProps={props?.options?.editableProps}
        value={props.value}
        plugins={plugins}
        onChange={onChange}
      >
        {props.options?.withBalloonToolbar && props.BalloonMarkToolbarButtons}
        <MultiComboboxContainer config={comboConfigData} />
      </Plate>
      {props.debug && <pre>{JSON.stringify(content, null, 2)}</pre>}
    </>
  )
}

export default MexEditor
