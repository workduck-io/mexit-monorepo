import BackIcon from '@iconify/icons-ph/caret-circle-left-light'
import LensIcon from '@iconify/icons-ph/magnifying-glass-bold'

import { cleanString } from '@mexit/core'

import { useSputlitStore } from '../Stores/useSputlitStore'
import { useEditorContext } from './useEditorContext'

export const useSearchProps = () => {
  const activeItem = useSputlitStore((s) => s.activeItem)
  const { previewMode, node } = useEditorContext()

  const icon = !previewMode ? BackIcon : LensIcon

  const path = node.path
  const placeholder = !previewMode ? cleanString(path) : 'Type something...'

  return {
    icon: activeItem?.icon ?? icon,
    placeholder: activeItem?.title ?? placeholder
  }
}
