import { ReactElement, useState } from 'react'

import { Container } from './SuperBlock.styled'
import { MetadataFields, PropertiyFields } from './SuperBlock.types'
import SuperBlockFooter from './SuperBlockFooter'
import SuperBlockHeader from './SuperBlockHeader'

export const SuperBlock: React.FC<{
  id?: string
  parent?: string

  className?: string
  style?: React.CSSProperties
  children?: any

  $isActive?: boolean
  $isSelected?: boolean
  $isReadOnly?: boolean

  value: PropertiyFields
  metadata: MetadataFields

  onChange?: (properties: Partial<PropertiyFields>) => void
  onDelete?: () => void

  // * Required Components To Render Header And Footer of SuperBlocks
  FooterRightComponent?: ReactElement
  LeftHeaderRenderer: ReactElement
}> = (props) => {
  const {
    LeftHeaderRenderer,
    id,
    parent,
    FooterRightComponent,
    children,
    value,
    metadata,
    onChange,
    onDelete,
    ...containerProps
  } = props

  const [isHovered, setIsHovered] = useState(false)

  const handleOnChange = (properitesToUpdate: Partial<PropertiyFields>) => {
    if (onChange) onChange(properitesToUpdate)
  }

  const handleMouseEnter = (e) => {
    setIsHovered(true)
  }

  const handleMouseLeave = (e) => {
    setIsHovered(false)
  }

  return (
    <Container
      {...containerProps}
      $isActive={isHovered || props.$isActive}
      $isSelected={isHovered || props.$isSelected}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <SuperBlockHeader
        id={id}
        value={value}
        parent={parent}
        metadata={metadata}
        isSelected={isHovered || props.$isSelected}
        isFocused={isHovered || props.$isActive}
        isReadOnly={props.$isReadOnly}
        onDelete={onDelete}
        LeftHeaderRenderer={LeftHeaderRenderer}
      />
      {children}
      <SuperBlockFooter
        isSelected={props.$isSelected}
        isReadOnly={props.$isReadOnly}
        FooterRightRenderer={FooterRightComponent}
        value={value}
        onChange={handleOnChange}
      />
    </Container>
  )
}
