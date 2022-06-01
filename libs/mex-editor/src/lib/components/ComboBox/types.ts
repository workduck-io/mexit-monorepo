import { PlateEditor, RenderFunction } from '@udecode/plate'
import { CustomElements } from '../../types/editor'

export interface ComboboxKeyDownConfig {
  keys: Record<CustomElements, ComboboxItemType>
  slashCommands: Record<string, SlashCommandConfig>
  portalElement?: Element
}

export interface ComboboxItemOnChangeConfig {
  cbKey: ComboboxKey
  trigger: string
  data: Array<any>
  icon?: string
}

export interface SlashCommandConfig {
  command: string
  slateElementType: string
  options?: any
  getData?: (element: IComboboxItem) => Record<string, any>
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

  /**
   * Text to render for this option
   */
  itemType?: ComboboxItemType

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
  ILINK = 'ilink',
  INLINE_BLOCK = 'inline_block',
  SLASH_COMMAND = 'slash_command'
}

export interface ComboboxItemProps {
  item: IComboboxItem
}

export interface ComboboxItemType {
  slateElementType?: string
  newItemHandler: (item: string, parentId?: string) => void
  itemRenderer?: RenderFunction<ComboboxItemProps>
}

export type ComboboxOnChangeConfig = Record<CustomElements, ComboboxItemOnChangeConfig>

export interface ComboboxConfig {
  onKeyDownConfig: ComboboxKeyDownConfig
  onChangeConfig: ComboboxOnChangeConfig
}

export interface ComboboxProps {
  isSlash?: boolean
  onSelectItem: (editor: PlateEditor, item: string) => void
  onRenderItem?: RenderFunction<ComboboxItemProps>
  portalElement?: Element
}
