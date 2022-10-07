import { PlateEditor, Value, TElement } from '@udecode/plate'

import { QuickLinkType } from '@mexit/core'

import { CustomElements } from '../constants'
import { ComboboxItem } from './MultiCombobox'

export interface ComboboxKeyDownConfig {
  keys: Record<CustomElements, ComboboxItemType>
  slashCommands: Record<string, SlashCommandConfig>
  portalElement?: Element
}

export interface ComboboxItemOnChangeConfig {
  cbKey: ComboboxKey
  icon?: string
  trigger: string
  data?: ComboboxItem[]
  blockTrigger?: string
}

export interface SlashCommandConfig {
  command: string
  slateElementType: string
  options?: any
  getData?: (element: IComboboxItem) => Record<string, any>
  /**
   * On extended command, run the callback with the command and the editor
   */
  onExtendedCommand?: (query: string, editor: any) => void
}

export enum SlashType {
  embed = 'media_embed',
  table = 'table',
  canvas = 'excalidraw',
  remind = 'remind'
}

export interface RenderFunction<P = { [key: string]: any }> {
  (props: P, defaultRender?: (props?: P) => JSX.Element | null): JSX.Element | null
}

export interface IComboboxItem {
  /**
   * Arbitrary string associated with this option.
   */
  key: string

  /**
   * Text to render for this option
   */
  text: any

  itemType?: ComboboxItemType

  type?: QuickLinkType | SlashType

  /**
   * Icon to be rendered
   */
  icon?: string

  /**
   * Icon to be rendered on the right
   */
  rightIcons?: string[]

  /**
   * description text if any
   */
  desc?: string

  /**
   * Whether the option is disabled
   * @defaultvalue false
   */
  disabled?: boolean

  /**
   * Extedned
   * @defaultvalue false
   */
  extended?: boolean

  /**
   * Data available to onRenderItem.
   */
  data?: unknown

  // Inserted to element if present
  additional?: Record<string, any>
}

export enum ComboboxElementType {
  Normal = 0,
  Divider = 1,
  Header = 2
}

export enum ComboboxKey {
  TAG = 'tag',
  MENTION = 'mention',
  INTERNAL = 'internal',
  INLINE_BLOCK = 'inline_block',
  SLASH_COMMAND = 'slash_command',
  BLOCK = 'block'
}

export interface ComboboxItemProps {
  item: IComboboxItem
}

export interface ComboboxItemType {
  slateElementType: string
  newItemHandler: (item: string, parentId?: string) => void
  itemRenderer?: RenderFunction<ComboboxItemProps>
}

export interface ComboboxProps {
  isSlash?: boolean
  onSelectItem: (editor: PlateEditor<Value>, item: string) => void
  onRenderItem?: RenderFunction<ComboboxItemProps>
  portalElement?: Element
}

export interface InsertableElement extends TElement {
  type: string
  children: any[]
  value: string
  blockValue?: string
  blockId?: string
  // Also additional properties are added
}
