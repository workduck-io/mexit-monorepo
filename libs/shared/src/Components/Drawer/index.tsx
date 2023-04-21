import React from 'react'
import { useSpring } from 'react-spring'

import { DrawerContainer } from './styled'

interface DrawerProps {
  show: boolean
  children: React.ReactNode
}

export const Drawer: React.FC<DrawerProps> = ({ show, children }) => {
  const props = useSpring({
    top: show ? window.innerHeight - 400 : window.innerHeight + 40
  })

  return <DrawerContainer style={props}>{children}</DrawerContainer>
}
