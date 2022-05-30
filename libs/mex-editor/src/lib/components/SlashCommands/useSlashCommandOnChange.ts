import {
  getBlockAbove,
  getPluginType,
  insertNodes,
  insertTable,
  PlateEditor,
  TElement,
} from '@udecode/plate';
import { Editor, Transforms } from 'slate';
import { useComboboxStore } from '../../store/combobox';
import { IComboboxItem, SlashCommandConfig } from '../ComboBox/types';

export const useSlashCommandOnChange = (keys: {
  [type: string]: SlashCommandConfig;
}) => {
  const closeMenu = useComboboxStore((state) => state.closeMenu);

  return (editor: PlateEditor, item: IComboboxItem) => {
    const targetRange = useComboboxStore.getState().targetRange;
    const commandKey = Object.keys(keys).filter(
      (k) => keys[k].command === item.key
    )[0];

    const commandConfig = keys[commandKey];
    // console.log({ commandConfig })
    if (targetRange) {
      // console.log('useSlashCommandOnChange', { commandConfig, commandKey, keys, item })
      try {
        const pathAbove = getBlockAbove(editor)?.[1];
        const isBlockEnd =
          editor.selection &&
          pathAbove &&
          Editor.isEnd(editor, editor.selection.anchor, pathAbove);

        if (item.key === 'table') {
          Transforms.select(editor, targetRange);
          insertTable(editor, { header: true });
        } else {
          // console.log('useElementOnChange 2', { type, pathAbove, isBlockEnd });
          const type = getPluginType(editor, commandConfig.slateElementType);
          const data = commandConfig.getData ? commandConfig.getData(item) : {};

          Transforms.select(editor, targetRange);

          insertNodes<TElement>(editor, {
            type: type as any, // eslint-disable-line @typescript-eslint/no-explicit-any
            children: [{ text: '' }],
            ...commandConfig.options,
            ...data,
          });

          // move the selection after the inserted content
          Transforms.move(editor);
        }
      } catch (e) {
        console.error(e);
      }
      return closeMenu();
    }

    return undefined;
  };
};
