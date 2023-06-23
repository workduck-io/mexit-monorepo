import { ReactNode } from 'react'

import useUpdateBlock from '../../Hooks/useUpdateBlock'

import { Container } from './SuperBlock.styled'
import SuperBlockFooter from './SuperBlockFooter'
import SuperBlockHeader from './SuperBlockHeader'

export const SuperBlock: React.FC<{
  className?: string
  as?: string | Element
  children?: ReactNode
  element?: any
  $isActive?: boolean
  $isSelected?: boolean
}> = ({ className, as, element, children, ...props }) => {
  const { updateMetadataProperties } = useUpdateBlock()

  const onChange = (properitesToUpdate: Record<string, unknown>) => {
    updateMetadataProperties(element, properitesToUpdate)
  }

  return (
    <Container className={className} {...props}>
      <SuperBlockHeader element={element} />
      {children}
      <SuperBlockFooter element={element} onChange={onChange} />
    </Container>
  )
}
