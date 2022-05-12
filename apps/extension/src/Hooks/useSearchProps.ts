import BackIcon from '@iconify/icons-ph/caret-circle-left-light'
import LensIcon from '@iconify/icons-ph/magnifying-glass-bold'
import { cleanString, QuickLinkType } from '@mexit/core'
import { useEditorContext } from './useEditorContext'
import { useSputlitContext } from './useSputlitContext'

export const useSearchProps = () => {
  const { activeItem } = useSputlitContext()
  const { previewMode, node } = useEditorContext()

  const icon = !previewMode ? BackIcon : LensIcon

  const path = node.path
  const placeholder = !previewMode ? cleanString(path) : '[[  for Backlinks or / for actions'

  return {
    icon: activeItem?.icon ?? icon,
    placeholder: activeItem?.title ?? placeholder
  }
}
