import React from 'react'

import toast, { Toast } from 'react-hot-toast'
import styled from 'styled-components'

import { Button } from '@workduck-io/mex-components'

interface InteractiveToastProps {
  tid: string
  message: string
  actionName: string
  onClick: () => void
}

const Wrapper = styled.div`
  border-radius: ${({ theme }) => theme.borderRadius.small};
  background-color: ${({ theme }) => theme.colors.gray[8]};
  display: flex;
  gap: ${({ theme }) => theme.spacing.small};
  padding: ${({ theme }) => theme.spacing.small};
  align-items: center;
`

export const InteractiveToast = ({ tid, message, actionName, onClick }: InteractiveToastProps) => {
  return (
    <Wrapper>
      {message}
      <Button
        onClick={() => {
          onClick()
          toast.dismiss(tid)
        }}
      >
        {actionName}
      </Button>
    </Wrapper>
  )
}
