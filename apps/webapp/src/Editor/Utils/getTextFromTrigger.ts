import { escapeRegExp, getText } from '@udecode/plate-core'
import { BaseRange, Editor, Point } from 'slate'
import { ComboTriggerType } from '../../Stores/useComboboxStore'

/**
 * Get text and range from trigger to cursor.
 * Starts with trigger and ends with non-whitespace character.
 */
export type TriggerOptions = {
  at: Point
  trigger: ComboTriggerType
  searchPattern?: string
  isTrigger?: boolean
}

export type TextFromTrigger = {
  range: BaseRange
  blockRange?: BaseRange
  textAfterTrigger: string
  isBlockTriggered?: boolean
  blockStart?: any
  textAfterBlockTrigger?: string
}

export const getTextFromTrigger = (editor: Editor, options: TriggerOptions): TextFromTrigger => {
  const escapedTrigger = escapeRegExp(options.trigger.trigger)
  const triggerRegex = new RegExp(`(?:^)${escapedTrigger}`)

  const start: Point | undefined =
    options.trigger.at ?? Editor.before(editor, options.at, { distance: options.trigger.trigger.length })

  // Range from start to cursor
  const range = start && Editor.range(editor, start, options.at)
  const text = getText(editor, range)

  if (!range || !text?.match(triggerRegex) || text.length > 100) return

  const isBlockTriggered = text.indexOf(options.trigger.blockTrigger) > -1
  const blockStart = options.trigger.blockAt ?? { ...options.at, offset: text.length - 1 }

  const textAfterTrigger = text.substring(
    options.trigger.trigger.length,
    isBlockTriggered ? blockStart.offset : options.at.offset
  )

  const res = {
    range,
    textAfterTrigger,
    blockStart: undefined
  }

  if (isBlockTriggered) {
    const blockRange =
      blockStart && Editor.range(editor, { ...blockStart, offset: blockStart.offset + range.anchor.offset }, options.at)
    // const t = getText(editor, blockRange)
    const blockText = text.substring(blockStart.offset + 1)

    return {
      ...res,
      isBlockTriggered,
      blockRange,
      blockStart,
      textAfterBlockTrigger: blockText
    }
  }

  return res
}
