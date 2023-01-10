import React, { useEffect } from 'react'
import { ErrorBoundary } from 'react-error-boundary'

import arrowLeftLine from '@iconify/icons-ri/arrow-left-line'

// import { ServiceContainer, GroupHeaderContainer, FloatingIcon } from './styled'
import { Button, IconButton } from '@workduck-io/mex-components'
import { tinykeys } from '@workduck-io/tinykeys'

import { FloatingIcon, GroupHeaderContainer, ServiceContainer } from '@mexit/shared'

import { useKeyListener } from '../../Hooks/useChangeShortcutListener'
import { NavigationType, ROUTE_PATHS, useRouting } from '../../Hooks/useRouting'

type ServiceInfoProps = {
  children: React.ReactElement | React.ReactElement[]
  onBackRoute?: string
}

const ServiceInfo: React.FC<ServiceInfoProps> = ({ children, onBackRoute = ROUTE_PATHS.integrations }) => {
  const { goTo } = useRouting()
  const { shortcutDisabled } = useKeyListener()

  const goBackToIntegrations = () => goTo(onBackRoute, NavigationType.replace)

  useEffect(() => {
    const unsubscribe = tinykeys(window, {
      Escape: (event) => {
        event.preventDefault()
        if (!shortcutDisabled) goBackToIntegrations()
      }
    })

    return () => {
      unsubscribe()
    }
  }, [])

  return (
    <ErrorBoundary
      FallbackComponent={() => <Button onClick={() => goTo(ROUTE_PATHS.home, NavigationType.replace)}>Back</Button>}
    >
      <ServiceContainer>
        <GroupHeaderContainer>
          <FloatingIcon>
            <IconButton
              size={24}
              shortcut={`Esc`}
              icon={arrowLeftLine}
              onClick={goBackToIntegrations}
              title={'Return to Integrations'}
            />
          </FloatingIcon>
          {children}
        </GroupHeaderContainer>
      </ServiceContainer>
    </ErrorBoundary>
  )
}

export default ServiceInfo
