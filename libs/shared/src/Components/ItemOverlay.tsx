import React from 'react'

import { StyledItemOverlay } from '../Style/Layouts'

type ItemOverlayProps = {
  onHover?: boolean
  children: React.ReactNode
}

export const ItemOverlay: React.FC<ItemOverlayProps> = ({ children, onHover }) => {
  return <StyledItemOverlay onHover={onHover}>{children}</StyledItemOverlay>
}
