import { QuickLinkType } from '@mexit/core'
import { PlateEditor } from '@udecode/plate'

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
   * Data available to onRenderItem.
   */
  data?: unknown
}

export enum ComboboxElementType {
  Normal = 0,
  Divider = 1,
  Header = 2
}

export enum ComboboxKey {
  TAG = 'tag',
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
  onSelectItem: (editor: PlateEditor, item: string) => void
  onRenderItem?: RenderFunction<ComboboxItemProps>
  portalElement?: Element
}
