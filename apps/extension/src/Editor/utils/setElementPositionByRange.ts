import { PlateEditor, toDOMRange, Value } from '@udecode/plate'
import { Range } from 'slate'

/**
 * Set element position below a range.
 * This function has been put in try catch so editor errors will not be thrown up
 */
export const setElementPositionByRange = (editor: PlateEditor<Value>, { ref, at }: { ref: any; at: Range | null }) => {
  if (!at) return

  const el = ref.current
  if (!el) return

  const domRange = toDOMRange(editor, at)
  const rect = domRange.getBoundingClientRect()
  const top = rect.top + window.pageYOffset + 24
  const left = rect.left + window.pageXOffset
  const shouldFlip = window.innerHeight < top + el.offsetHeight
  // mog('ElementposByRange', {
  //   rect,
  //   domRange,
  //   top,
  //   left,
  //   shouldFlip,
  //   oH: el.offsetHeight,
  //   wH: window.innerHeight
  // })
  if (shouldFlip) {
    el.classList.add('reversed')
    el.style.top = `${top - el.offsetHeight - 24}px`
    el.style.left = `${left}px`
  } else {
    el.classList.remove('reversed')
    el.style.top = `${top}px`
    el.style.left = `${left}px`
  }
}
