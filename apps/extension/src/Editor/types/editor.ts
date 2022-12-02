import { ReactElement } from 'react'

import { PlatePlugin, PlatePluginComponent, SelectEditorOptions } from '@udecode/plate'
import type { EditableProps } from 'slate-react/dist/components/editable'

import { ComboboxConfig, CustomElements } from '../components/ComboBox/types'

export type MexEditorValue = Array<any>

export type PluginOptions = Record<CustomElements, PlatePlugin>

export interface MexEditorOptions {
  editableProps?: EditableProps
  focusOptions?: SelectEditorOptions
  withDraggable?: boolean
  withBalloonToolbar?: boolean
}

export interface MetaData {
  path: string
  delimiter?: string
}

/* eslint-disable-next-line */
export interface MexEditorProps {
  comboboxConfig: ComboboxConfig
  components?: Record<string, PlatePluginComponent<any | undefined>> // * Pass components which you want to replace
  editorId: string // * Unique ID for the Mex Editor
  className?: string // * Pass className to styled Mex Editor
  value: MexEditorValue // * Initial value of editor, to set onChange content, use `editor.children = content`
  // TODO: lets see about this in a while
  // placeholders?: Options<Array<PlaceholderProps>>; // * Array of objects with `placeholder` text and element `key
  onChange?: (value: MexEditorValue) => void // * Callback on change
  options?: MexEditorOptions // * Power the editor with options
  meta?: MetaData // * MetaData of current editor
  plugins?: Array<PlatePlugin> // * Plugins to power the editor
  debug?: boolean // * Debug mode for content
  exlude?: Array<string> // * Array of elements from MEX_EDITOR_ELEMENTS
  BalloonMarkToolbarButtons?: ReactElement
  portalElement?: Element
}

export enum ComboboxKey {
  TAG = 'tag',
  ILINK = 'ilink',
  INLINE_BLOCK = 'inline_block',
  SLASH_COMMAND = 'slash_command'
}

export interface ComboboxItem {
  text: string
  value: string
  icon?: string
}

export interface ComboboxType {
  cbKey: ComboboxKey
  icon?: string
  trigger: string
  data: ComboboxItem[]
}
