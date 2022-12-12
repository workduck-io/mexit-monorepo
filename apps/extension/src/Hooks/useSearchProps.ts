import { cleanString, getMIcon } from '@mexit/core'

import { useSputlitStore } from '../Stores/useSputlitStore'

import { useEditorStore } from './useEditorStore'

export const useSearchProps = () => {
  const activeItem = useSputlitStore((s) => s.activeItem)
  const previewMode = useEditorStore((s) => s.previewMode)
  const node = useSputlitStore((s) => s.node)

  const icon = !previewMode
    ? getMIcon('ICON', 'ph:caret-circle-left-light')
    : getMIcon('ICON', 'ph:magnifying-glass-bold')

  const path = node.path
  const placeholder = !previewMode ? cleanString(path) : 'Type something...'

  return {
    icon: activeItem?.icon ?? icon,
    placeholder: activeItem?.title ?? placeholder
  }
}
