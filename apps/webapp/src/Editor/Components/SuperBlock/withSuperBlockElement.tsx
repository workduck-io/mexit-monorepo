import { FC } from 'react'

import { Value } from '@udecode/plate'
import { useFocused, useReadOnly, useSelected } from 'slate-react'

import { useEditorBlockSelection } from '../../Actions/useEditorBlockSelection'
import useUpdateBlock from '../../Hooks/useUpdateBlock'

import { MetadataFields, PropertiyFields, SuperBlockElementProps, SuperBlockProps } from './SuperBlock.types'

export const withSuperBlockElement = (Component: FC<SuperBlockProps>) => {
  const SuperBlockElement = <V extends Value>(props: SuperBlockElementProps<V>) => {
    const { children, element, ...blockProps } = props

    const isReadOnly = useReadOnly()
    const isBlockActive = useFocused()
    const isBlockSelected = useSelected()

    const { updateMetadataProperties } = useUpdateBlock()
    const { deleteParentBlock } = useEditorBlockSelection()

    const handleOnChange = (properties: Partial<PropertiyFields>) => {
      updateMetadataProperties(element, properties)
    }

    const handleOnDelete = () => {
      deleteParentBlock(element.id)
    }

    if (!element) return <></>

    return (
      <Component
        {...(blockProps as any)}
        id={element.id}
        parent={blockProps?.editor?.id}
        type={element.type}
        isReadOnly={isReadOnly}
        isActive={isBlockActive}
        isSelected={isBlockSelected}
        value={element.properties ?? ({} as PropertiyFields)}
        metadata={element.metadata ?? ({} as MetadataFields)}
        onChange={handleOnChange}
        onDelete={handleOnDelete}
      >
        {children}
      </Component>
    )
  }

  const compnentDisplayName = Component.displayName || Component.name || 'Component'

  SuperBlockElement.displayName = `withSuperBlockElement(${compnentDisplayName})`

  return SuperBlockElement
}
