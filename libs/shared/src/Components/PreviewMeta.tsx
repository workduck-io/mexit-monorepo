import React from 'react'
import styled from 'styled-components'
import { RelativeTime } from './RelativeTime'

export const Data = styled.div`
  color: ${({ theme }) => theme.colors.text.fade};
`

type PreviewMetaProps = {
  meta: any
}

const PreviewMetaContainer = styled.div`
  display: flex;
  width: 100%;
  margin-top: 1rem;
  padding: 0.5rem;
  border-top: 1px solid ${({ theme }) => theme.colors.gray[8]};
  align-items: center;
  justify-content: flex-end;

  ${Data} {
    font-size: 0.8em;
    color: ${({ theme }) => theme.colors.gray[6]};
  }
`

const PreviewMeta: React.FC<PreviewMetaProps> = ({ meta }) => {
  if (!meta) return <></>

  return (
    <PreviewMetaContainer>
      {meta.updatedAt !== undefined && (
        <Data>
          <RelativeTime dateNum={meta.updatedAt} />
        </Data>
      )}
    </PreviewMetaContainer>
  )
}

export { PreviewMeta }
