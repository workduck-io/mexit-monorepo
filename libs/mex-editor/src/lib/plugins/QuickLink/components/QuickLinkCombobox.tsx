import * as React from 'react';
import { Combobox } from '../../../components/ComboBox';
import { useOnSelectItem } from '../../../hooks/useOnSelectItem';
import { useComboboxStore } from '../../../store/combobox';
import { ComboboxKey } from '../../../types';
import { QuickLinkComboboxItem } from './QuickLinkComboboxItem';

export const ILinkComboboxComponent = () => {
  const onSelectItem = useOnSelectItem();

  return (
    <Combobox
      onSelectItem={onSelectItem as any}
      onRenderItem={QuickLinkComboboxItem}
    />
  );
};

export const ILinkCombobox = () => {
  const key = useComboboxStore((state) => state.key);

  return (
    <div style={key !== ComboboxKey.ILINK ? { display: 'none' } : {}}>
      <ILinkComboboxComponent />
    </div>
  );
};
