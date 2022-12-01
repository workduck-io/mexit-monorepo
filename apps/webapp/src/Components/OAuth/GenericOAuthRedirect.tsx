import React, { useEffect, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'

import { Button } from '@workduck-io/mex-components'

import { MEXIT_FRONTEND_AUTH_BASE } from '@mexit/core'
import { BackCard, CenteredColumn, Description, Title } from '@mexit/shared'

import config from '../../config'
import { ServiceIcon } from '../../Icons/Icons'
import { useAuthentication, useInitializeAfterAuth } from '../../Stores/useAuth'
import { checkCustomProtocolHandler } from './checkCustomProtocol'

const allowedServices = ['google', 'telegram', 'slack', 'asana', 'figma', 'github', 'jira', 'linear', 'whatsapp']

const GenericOAuthRedirect = () => {
  const [hasDesktopApp, setHasDesktopApp] = useState<boolean>(true)
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const serviceName = useParams().serviceName.toLowerCase()
  const { loginViaGoogle } = useAuthentication()
  const { initializeAfterAuth } = useInitializeAfterAuth()
  useEffect(() => {
    if (!allowedServices.find((i) => i === serviceName)) {
      navigate('/404')
    }
  }, [serviceName, navigate])

  const showWebappOpener = () => {
    switch (serviceName) {
      case 'telegram':
      case 'google':
      case 'slack':
      case 'whatsapp':
        return true

      case 'asana':
      case 'figma':
      case 'github':
      case 'jira':
      case 'linear':
      default:
        return false
    }
  }

  const handleWebappOpen = async (e) => {
    e.preventDefault()

    switch (serviceName) {
      case 'google': {
        const code = searchParams.get('code')
        const { loginStatus, loginData } = await loginViaGoogle(
          code,
          config.cognito.APP_CLIENT_ID,
          MEXIT_FRONTEND_AUTH_BASE
        )
        await initializeAfterAuth(loginData, true, true, false)
        navigate('/')
        break
      }

      case 'telegram':
      case 'slack':
      case 'whatsapp': {
        const serviceId = searchParams.get('serviceId')
        navigate(`/integrations/portal/${serviceName.toUpperCase()}?serviceId=${serviceId}`)
        break
      }
      case 'asana':
      case 'figma':
      case 'github':
      case 'jira':
      case 'linear': {
        navigate('/404')
        break
      }
    }
  }

  const checkProtocolAndOpen = (url, event) => {
    return checkCustomProtocolHandler(
      url,
      () => {
        event.preventDefault()
        setHasDesktopApp(false)
      },
      () => {
        window.open(url, '_self')
      }
    )
  }

  const handleDesktopAppOpen = (event: any) => {
    switch (serviceName) {
      case 'google': {
        const code = searchParams.get('code')
        const url = `mex://navigate/?code=${code}`
        checkProtocolAndOpen(url, event)
        break
      }

      case 'slack':
      case 'whatsapp':
      case 'telegram': {
        const serviceId = searchParams.get('serviceId')
        const url = `mex://navigate/integrations/portal/${serviceName.toUpperCase()}?serviceId=${serviceId}`
        checkProtocolAndOpen(url, event)
        break
      }

      case 'asana':
      case 'figma':
      case 'github':
      case 'jira':
      case 'linear': {
        const url = `mex://navigate/integrations/?actionGroupId=${serviceName}`
        checkProtocolAndOpen(url, event)
        break
      }
    }
  }

  return (
    <CenteredColumn>
      <BackCard>
        <ServiceIcon serviceName={serviceName.toUpperCase()} height="64" width="64" />
        <Title>OAuth Complete for {serviceName}!</Title>
        {showWebappOpener() && <Button onClick={handleWebappOpen}>Continue to Web App</Button>}
        <Button onClick={(e) => handleDesktopAppOpen(e)}>Continue to Desktop App</Button>
        {!hasDesktopApp && <Description>You Don&apos;t Have the Desktop App. Please Install to Continue</Description>}
      </BackCard>
    </CenteredColumn>
  )
}

export default GenericOAuthRedirect
