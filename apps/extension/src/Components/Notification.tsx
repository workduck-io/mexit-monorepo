import React from 'react'
import styled from 'styled-components'
import { resolveValue, Toaster } from 'react-hot-toast'

const Notif = styled.div`
  visibility: visible;
  padding: ${({ theme: { spacing } }) => `${spacing.small} ${spacing.medium} `};
  background: ${({ theme }) => theme.colors.background.highlight};
  color: ${({ theme }) => theme.colors.text.default};
  box-shadow: 0px 5px 15px ${({ theme }) => theme.colors.gray[9]};
  border-radius: ${({ theme }) => theme.borderRadius.small};
  font: inherit;
`

export const Notification = () => {
  return (
    <Toaster position="bottom-center" reverseOrder={false} gutter={20}>
      {(t) => <Notif style={{ opacity: t.visible ? 1 : 0 }}>{resolveValue(t.message, t)}</Notif>}
    </Toaster>
  )
}
