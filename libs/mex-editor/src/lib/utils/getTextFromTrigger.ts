import { escapeRegExp, getText } from '@udecode/plate';
import { TEditor } from '@udecode/plate-core';
import { BaseRange, Editor, Point } from 'slate';

export const getTextFromTrigger = (
  editor: TEditor,
  { at, trigger }: { at: Point; trigger: string }
): { range: BaseRange; textAfterTrigger: string } | undefined => {
  const escapedTrigger = escapeRegExp(trigger);
  const triggerRegex = new RegExp(`^${escapedTrigger}`);
  const noWhiteSpaceRegex = new RegExp(`\\S+`);

  let start: Point | undefined = at;
  let end: Point | undefined;

  try {
    // eslint-disable-next-line no-constant-condition
    while (true) {
      end = start;

      if (!start) break;

      start = Editor.before(editor, start);
      const charRange = start && Editor.range(editor, start, end);
      const charText = getText(editor, charRange);

      // Match non-whitespace character on before text
      if (!charText.match(noWhiteSpaceRegex)) {
        start = end;
        break;
      }
    }

    // Range from start to cursor
    const range = start && Editor.range(editor, start, at);
    const text = getText(editor, range);

    if (!range || !text.match(triggerRegex)) return undefined;
    return {
      range,
      textAfterTrigger: text.substring(trigger.length),
    };
  } catch (e) {
    console.error(e);
    return undefined;
  }
};
