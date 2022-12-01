import { NodeEditorContent } from '@mexit/core'

import { isEqual } from 'lodash'

export const areEqual = (val1: NodeEditorContent, val2: NodeEditorContent): boolean => {
  if (val1?.length !== val2?.length) {
    return false
  }

  const hash1 = JSON.stringify(val1)
  const hash2 = JSON.stringify(val2)

  return isEqual(hash1, hash2)
}
