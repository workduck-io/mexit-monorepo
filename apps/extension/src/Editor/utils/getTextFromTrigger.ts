import { escapeRegExp, getPointBefore, getRange } from '@udecode/plate'
import { TEditor, getEditorString } from '@udecode/plate-core'
import { BaseRange, Point } from 'slate'

export const getTextFromTrigger = (
  editor: TEditor,
  { at, trigger }: { at: Point; trigger: string }
): { range: BaseRange; textAfterTrigger: string } | undefined => {
  const escapedTrigger = escapeRegExp(trigger)
  const triggerRegex = new RegExp(`^${escapedTrigger}`)
  const noWhiteSpaceRegex = new RegExp(`\\S+`)

  let start: Point | undefined = at
  let end: Point | undefined

  try {
    // eslint-disable-next-line no-constant-condition
    while (true) {
      end = start

      if (!start) break

      start = getPointBefore(editor, start)
      const charRange = start && getRange(editor, start, end)
      const charText = getEditorString(editor, charRange)

      // Match non-whitespace character on before text
      if (!charText.match(noWhiteSpaceRegex)) {
        start = end
        break
      }
    }

    // Range from start to cursor
    const range = start && getRange(editor, start, at)
    const text = getEditorString(editor, range)

    if (!range || !text.match(triggerRegex)) return undefined
    return {
      range,
      textAfterTrigger: text.substring(trigger.length)
    }
  } catch (e) {
    console.error(e)
    return undefined
  }
}
