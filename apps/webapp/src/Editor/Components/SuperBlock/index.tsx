import { ReactNode } from 'react'

import { Container } from './SuperBlock.styled'

export const SuperBlock: React.FC<{
  className?: string
  as?: string | Element
  children?: ReactNode
}> = ({ className, as, children }, ...props) => {
  return (
    <Container className={className} {...props}>
      {children}
    </Container>
  )
}
