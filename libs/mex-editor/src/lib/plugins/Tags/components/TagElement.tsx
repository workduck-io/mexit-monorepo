import * as React from 'react';
import { useEditorRef } from '@udecode/plate';
import { Transforms } from 'slate';
import { useFocused, useSelected } from 'slate-react';
import { TagElementProps } from './TagElement.types';
import { STag, STagRoot } from './TagElement.styles';
import { useHotkeys } from '../../../hooks/useHotKeys';
import { useOnMouseClick } from '../../../hooks/useOnMouseClick';

/**
 * TagElement with no default styles.
 * [Use the `styles` API to add your own styles.](https://github.com/OfficeDev/office-ui-fabric-react/wiki/Component-Styling)
 */
const TagElement = ({
  attributes,
  children,
  element,
  onClick,
}: TagElementProps) => {
  const editor = useEditorRef();
  const selected = useSelected();
  const focused = useFocused();

  const onClickProps = useOnMouseClick(() => {
    openTag(element.value);
  });

  useHotkeys(
    'backspace',
    () => {
      if (selected && focused && editor.selection) {
        Transforms.move(editor);
      }
    },
    [selected, focused]
  );
  useHotkeys(
    'delete',
    () => {
      if (selected && focused && editor.selection) {
        Transforms.move(editor, { reverse: true });
      }
    },
    [selected, focused]
  );

  const openTag = (tag: string) => {
    onClick(tag);
  };

  return (
    <STagRoot
      {...attributes}
      data-slate-value={element.value}
      contentEditable={false}
    >
      <STag {...onClickProps}>#{element.value}</STag>
      {children}
    </STagRoot>
  );
};

export default TagElement;