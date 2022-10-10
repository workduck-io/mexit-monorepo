import React, { useState, useEffect, ReactElement } from 'react'

import {
  Plate,
  selectEditor, // PlaceholderProps,
  PlatePluginComponent,
  SelectEditorOptions,
  getPlateEditorRef
} from '@udecode/plate'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { EditableProps } from 'slate-react/dist/components/editable'

import { mog } from '@mexit/core'

import { useGlobalListener } from '../Hooks/useGlobalListener'
import { useComboboxConfig } from './Components/Combobox/config'
import { MultiComboboxContainer } from './Components/MultiCombobox/multiComboboxContainer'
import { useMexEditorStore } from './Hooks/useMexEditorStore'
import { PluginOptionType } from './Plugins'
import { MexEditorValue } from './Types/Editor'
import { ComboboxConfig } from './Types/MultiCombobox'
import useMultipleEditors from '../Stores/useEditorsStore'

export interface MexEditorOptions {
  editableProps?: EditableProps
  focusOptions?: SelectEditorOptions
  withDraggable?: boolean
  withBalloonToolbar?: boolean
  withGlobalListener?: boolean
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
  // placeholders?: Options<Array<PlaceholderProps>> // * Array of objects with `placeholder` text and element `key
  onChange?: (value: MexEditorValue) => void // * Callback on change
  options?: MexEditorOptions // * Power the editor with options
  meta?: InternalMetadata // * MetaData of current editor
  pluginOptions?: PluginOptionType // * Plugins to power the editor
  debug?: boolean // * Debug mode for content
  exclude?: Array<string> // * Array of elements from MEX_EDITOR_ELEMENTS
  BalloonMarkToolbarButtons?: ReactElement
  portalElement?: Element
}

export const MexEditorBase = (props: MexEditorProps) => {
  const [content, setContent] = useState<MexEditorValue>([])
  const setInternalMetadata = useMexEditorStore((store) => store.setInternalMetadata)
  const isEmpty = useMultipleEditors((store) => store.isEmpty)
  
  useEffect(() => {
    const editorRef = getPlateEditorRef()

    if (editorRef && props?.options?.focusOptions) {
      selectEditor(editorRef, props.options.focusOptions)
    }
    if (props.meta) setInternalMetadata(props.meta)
  }, [props.editorId]) // eslint-disable-line react-hooks/exhaustive-deps

  const { plugins, comboConfigData } = useComboboxConfig(
    props.editorId,
    props?.comboboxConfig,
    props?.components,
    props?.pluginOptions
  )

  const onChange = (value: MexEditorValue) => {
    if (props?.debug) setContent(value)
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
        {isEmpty && <MultiComboboxContainer config={comboConfigData} />}
        {props.options?.withGlobalListener !== false && <GlobalEditorListener />}
      </Plate>
      {props.debug && <pre>{JSON.stringify(content, null, 2)}</pre>}
    </>
  )
}

const withDndProvider = (Component: any) => {
  const DndDefaultEditor = (props: MexEditorProps) => (
    <DndProvider backend={HTML5Backend}>
      <Component {...props} />
    </DndProvider>
  )
  return DndDefaultEditor
}

const GlobalEditorListener = () => {
  useGlobalListener()
  return null
}

withDndProvider.displayName = 'DefaultEditor'

export default withDndProvider(MexEditorBase)
