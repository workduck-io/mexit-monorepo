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

  // * Required Components To Render Header And Footer of SuperBlocks
  FooterRightComponent?: any
  LeftHeaderRenderer: any
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
    ...containerProps
  } = props

  const handleOnChange = (properitesToUpdate: Partial<PropertiyFields>) => {
    if (onChange) onChange(properitesToUpdate)
  }

  return (
    <Container {...containerProps}>
      <SuperBlockHeader
        id={id}
        value={value}
        parent={parent}
        metadata={metadata}
        isSelected={props.$isSelected}
        isFocused={props.$isActive}
        LeftHeaderRenderer={LeftHeaderRenderer}
      />
      {children}
      <SuperBlockFooter FooterRightRenderer={FooterRightComponent} value={value} onChange={handleOnChange} />
    </Container>
  )
}
