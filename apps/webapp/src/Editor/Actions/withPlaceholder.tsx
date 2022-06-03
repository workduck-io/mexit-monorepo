import { ELEMENT_H1, ELEMENT_PARAGRAPH, ELEMENT_TH, withPlaceholders } from '@udecode/plate'
import { useEditorStore } from '../../Stores/useEditorStore'

export const withStyledPlaceHolders = (components: any) => {
  const isEditing = useEditorStore.getState().isEditing

  if (isEditing) return components

  return withPlaceholders(components, [
    {
      key: ELEMENT_PARAGRAPH,
      placeholder: 'Type  `[[`  to see links or type  `/`  to see actions',
      hideOnBlur: true
    },
    {
      key: ELEMENT_TH,
      placeholder: 'Header',
      hideOnBlur: true
    }
  ])
}
