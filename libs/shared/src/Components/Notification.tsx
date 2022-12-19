import React from 'react'
import { resolveValue, Toaster } from 'react-hot-toast'

import styled from 'styled-components'

const Notif = styled.div`
  visibility: visible;
  padding: ${({ theme: { spacing } }) => `${spacing.small} ${spacing.medium} `};
  background: ${({ theme }) => theme.tokens.surfaces.tooltip.default};
  color: ${({ theme }) => theme.tokens.text.default};
  box-shadow: ${({ theme }) => theme.tokens.shadow.medium};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  font: inherit;
`

export const Notification = () => {
  return (
    <Toaster position="bottom-center" reverseOrder={false} gutter={20}>
      {(t) => (
        <Notif id="notif" style={{ opacity: t.visible ? 1 : 0 }}>
          {resolveValue(t.message, t)}
        </Notif>
      )}
    </Toaster>
  )
}
