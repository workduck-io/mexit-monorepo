import { Icon } from '@iconify/react';
import {
  usePlateEditorRef,
  getPluginType,
  MARK_BOLD,
  MARK_ITALIC,
  MARK_UNDERLINE,
  BalloonToolbar,
  MarkToolbarButton,
  AlignToolbarButton,
  BlockToolbarButton,
  ELEMENT_H1,
  ELEMENT_H2,
  ELEMENT_H3,
  ELEMENT_OL,
  ELEMENT_UL,
  ListToolbarButton,
} from '@udecode/plate';
import React from 'react';
import { Separator } from './Seperator';

const IconButton = ({ icon }: { icon: string }) => (
  <Icon icon={icon} fontSize="24" />
);

const Toolbar = () => {
  const editor = usePlateEditorRef();
  const theme = 'dark';
  const arrow = false;

  return (
    <BalloonToolbar theme={theme} arrow={arrow}>
      <MarkToolbarButton
        type={getPluginType(editor, MARK_BOLD)}
        icon={<IconButton icon="ri:bold" />}
      />
      <MarkToolbarButton
        type={getPluginType(editor, MARK_ITALIC)}
        icon={<IconButton icon="ri:italic" />}
      />
      <MarkToolbarButton
        type={getPluginType(editor, MARK_UNDERLINE)}
        icon={<IconButton icon="ri:underline" />}
      />

      <Separator />

      <BlockToolbarButton
        type={getPluginType(editor, ELEMENT_H1)}
        icon={<IconButton icon="ri:h-1" />}
      />

      <BlockToolbarButton
        type={getPluginType(editor, ELEMENT_H2)}
        icon={<IconButton icon="ri:h-2" />}
      />

      <BlockToolbarButton
        type={getPluginType(editor, ELEMENT_H3)}
        icon={<IconButton icon="ri:h-3" />}
      />

      <Separator />

      <AlignToolbarButton
        value="left"
        icon={<IconButton icon="bx:bx-align-left" />}
      />
      <AlignToolbarButton
        value="center"
        icon={<IconButton icon="bx:bx-align-middle" />}
      />
      <AlignToolbarButton
        value="right"
        icon={<IconButton icon="bx:bx-align-right" />}
      />
    </BalloonToolbar>
  );
};

export default Toolbar;
