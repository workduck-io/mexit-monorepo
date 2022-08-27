import React, { useEffect } from 'react'

import arrowLeftLine from '@iconify/icons-ri/arrow-left-line'

// import { ServiceContainer, GroupHeaderContainer, FloatingIcon } from './styled'
import { Button, IconButton } from '@workduck-io/mex-components'

import { NavigationType, ROUTE_PATHS, useRouting } from '../../Hooks/useRouting'
import { useKeyListener } from '../../Hooks/useShortcutListener'
import { FloatingIcon, ServiceContainer, GroupHeaderContainer } from './styled'

// type ServiceInfoProps = {}

const ServiceInfo: React.FC<any> = ({ children }) => {
  const { goTo } = useRouting()
  const { shortcutDisabled } = useKeyListener()

  const goBackToIntegrations = () => goTo(ROUTE_PATHS.integrations, NavigationType.replace)

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
