import { RenderFunction } from '@udecode/plate';
import React from 'react';
import { useComboboxControls } from '../../hooks/useComboboxControls';
import { getCreateableOnSelect } from '../../hooks/useComboboxOnKeyDown';
import { useComboboxStore } from '../../store/combobox';
import { Combobox } from '../ComboBox';
import { ComboboxItemProps, ComboboxKeyDownConfig } from '../ComboBox/types';

import { useOnSelectItem } from './useMultiComboboxOnKeyDown';
export interface SingleComboboxConfig {
  slateElementType: string;
  newItemHandler: (newItem: string, parentId?: any) => any; // eslint-disable-line @typescript-eslint/no-explicit-any
  renderElement: RenderFunction<ComboboxItemProps>;
}

export const ElementComboboxComponent = ({
  keys,
  slashCommands,
  portalElement,
}: ComboboxKeyDownConfig) => {
  const comboboxKey: string = useComboboxStore.getState().key;
  const comboRenderType = keys[comboboxKey];
  const { changeHandler: onSelectItem, isSlash } = useOnSelectItem(
    comboboxKey,
    slashCommands,
    comboRenderType
  );
  // console.log({ slashCommands })
  const onNewItem = (newItem, parentId?) => {
    comboRenderType.newItemHandler(newItem, parentId);
  };

  const creatableOnSelectItem = getCreateableOnSelect(onSelectItem, onNewItem);

  return (
    <Combobox
      isSlash={isSlash}
      onSelectItem={isSlash ? (onSelectItem as any) : creatableOnSelectItem}
      onRenderItem={comboRenderType.itemRenderer}
      portalElement={portalElement}
    />
  );
};

// Handle multiple combobox
export const MultiComboboxContainer = (props: ComboboxKeyDownConfig) => {
  useComboboxControls(true);

  return <ElementComboboxComponent {...props} />;
};
