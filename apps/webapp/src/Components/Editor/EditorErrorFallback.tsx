import React, { useEffect } from 'react'
import { FallbackProps } from 'react-error-boundary'

import styled from 'styled-components'

import { Button } from '@workduck-io/mex-components'

import { IS_DEV } from '@mexit/core'
import { CardShadow, Title } from '@mexit/shared'

import { useEditorErrorStore } from '../../Hooks/useEditorActions'

const ErrorWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.large};
`

const ErrorCard = styled.div`
  ${CardShadow}
  padding: ${({ theme: { spacing } }) => spacing.large};
  background-color: ${({ theme }) => theme.tokens.surfaces.modal};
  border-radius: ${({ theme }) => theme.borderRadius.small};

  border: 1px solid rgba(${({ theme }) => theme.tokens.colors.red}, 0.5);
`

const EditorErrorFallback = ({ error, resetErrorBoundary }: FallbackProps) => {
  const alreadyErrored = useEditorErrorStore((s) => s.alreadyErrored)
  const setErrorState = useEditorErrorStore((s) => s.setErrorState)
  const prevNode = useEditorErrorStore((s) => s.prevNode)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (!useEditorErrorStore.getState().alreadyErrored) {
        setErrorState('', false)
      }
    }, 1000)

    return () => clearTimeout(timeoutId)
  }, [])

  return (
    <ErrorWrapper role="alert">
      <ErrorCard>
        <Title>Ooops! Something went wrong</Title>
        {IS_DEV && <pre>Error: {error.message}</pre>}
        {alreadyErrored && (
          <p>Looks like the node {prevNode} has corrupted contents. Next reset will open the base node. </p>
        )}
        <p>You can reset the editor to the last state.</p>
        <Button onClick={resetErrorBoundary}>Reset Editor</Button>
      </ErrorCard>
    </ErrorWrapper>
  )
}

export default EditorErrorFallback
