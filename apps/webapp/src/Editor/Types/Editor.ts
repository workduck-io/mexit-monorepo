import { CustomElements } from '../constants'
import { PlatePlugin, SelectEditorOptions } from '@udecode/plate'
import { EditableProps } from 'slate-react/dist/components/editable'

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
