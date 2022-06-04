import { PlatePlugin, SelectEditorOptions } from '@udecode/plate'

import { EditableProps } from 'slate-react/dist/components/editable'
import { CustomElements } from '../constants'

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
