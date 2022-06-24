import React from 'react'
import styled from 'styled-components'

export type MexIconType = { height: string; width: string }

const MexIcon = styled.span<MexIconType>`
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.primary};
`

const Mex: React.FC<MexIconType> = ({ height, width }) => {
  return <MexIcon height={height} width={width} />
}

export default Mex
