import { ReactNode } from 'react'

import useUpdateBlock from '../../Hooks/useUpdateBlock'

import { Container } from './SuperBlock.styled'
import SuperBlockFooter from './SuperBlockFooter'
import SuperBlockHeader from './SuperBlockHeader'

export const SuperBlock: React.FC<{
  className?: string
  style?: React.CSSProperties
  as?: string | Element
  children?: ReactNode
  element?: any
  $isActive?: boolean
  $isSelected?: boolean
  FooterRightComponent?: any
  LeftHeaderRenderer?: any
}> = ({ className, as, LeftHeaderRenderer, FooterRightComponent, element, children, ...props }) => {
  const { updateMetadataProperties } = useUpdateBlock()

  const onChange = (properitesToUpdate: Record<string, unknown>) => {
    updateMetadataProperties(element, properitesToUpdate)
  }

  return (
    <Container className={className} {...props}>
      <SuperBlockHeader LeftHeaderRenderer={LeftHeaderRenderer} element={element} />
      {children}
      <SuperBlockFooter
        FooterRightRenderer={FooterRightComponent}
        value={element?.metadata?.properties ?? {}}
        onChange={onChange}
      />
    </Container>
  )
}
