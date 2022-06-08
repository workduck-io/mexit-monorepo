import { PlateEditor } from '@udecode/plate'
import { useComboboxOnKeyDown } from '../../hooks/useComboboxOnKeyDown'
import { useElementOnChange } from '../../hooks/useElementOnChange'
import {
  ComboboxItemType,
  ComboboxKey,
  ComboboxKeyDownConfig,
  IComboboxItem,
  SlashCommandConfig
} from '../ComboBox/types'
import { useSlashCommandOnChange } from '../SlashCommands/useSlashCommandOnChange'
export interface ComboTypeHandlers {
  slateElementType: string
  newItemHandler: (newItem: string, parentId?) => any // eslint-disable-line @typescript-eslint/no-explicit-any
}

export const useOnSelectItem = (
  comboboxKey: string,
  slashCommands: Record<string, SlashCommandConfig>,
  singleComboConfig: ComboboxItemType
) => {
  const slashCommandOnChange = useSlashCommandOnChange(slashCommands)
  const elementOnChange = useElementOnChange(singleComboConfig)

  const isSlash = comboboxKey === ComboboxKey.SLASH_COMMAND

  const changeHandler = (editor: PlateEditor, item: IComboboxItem) => (isSlash ? slashCommandOnChange : elementOnChange)

  return { changeHandler, isSlash }
}

const useMultiComboboxOnKeyDown = (config: ComboboxKeyDownConfig) => {
  return useComboboxOnKeyDown(config)
}

export default useMultiComboboxOnKeyDown
