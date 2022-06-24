import React, { useEffect, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'

import { MEXIT_FRONTEND_AUTH_BASE } from '@mexit/core'
import { BackCard, Button, CenteredColumn, Description, Title } from '@mexit/shared'
import { checkCustomProtocolHandler } from './checkCustomProtocol'
import { useAuthentication } from '../../Stores/useAuth'
import config from '../../config'
import { ServiceIcon } from '../../Icons/Icons'

const allowedServices = ['Google', 'Telegram', 'Slack', 'Asana', 'Figma', 'GitHub', 'Jira', 'Linear']

const GenericOAuthRedirect = () => {
  const [hasDesktopApp, setHasDesktopApp] = useState<boolean>(true)
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { serviceName } = useParams()
  const { loginViaGoogle } = useAuthentication()

  useEffect(() => {
    if (!allowedServices.find((i) => i === serviceName)) {
      console.log('Allowed Service: ', serviceName)
      navigate('/404')
    }
  }, [serviceName, navigate])

  const showWebappOpener = () => {
    switch (serviceName) {
      case 'Telegram':
      case 'Google':
      case 'Slack':
        return true

      case 'Asana':
      case 'Figma':
      case 'GitHub':
      case 'Jira':
      case 'Linear':
      default:
        return false
    }
  }

  const handleWebappOpen = async (e) => {
    e.preventDefault()

    switch (serviceName) {
      case 'Google': {
        const code = searchParams.get('code')
        await loginViaGoogle(code, config.cognito.APP_CLIENT_ID, MEXIT_FRONTEND_AUTH_BASE)
        navigate('/')
        break
      }

      case 'Telegram':
      case 'Slack': {
        const serviceId = searchParams.get('serviceId')
        navigate(`/integrations/portal/${serviceName.toUpperCase()}?serviceId=${serviceId}`)
        break
      }
      case 'Asana':
      case 'Figma':
      case 'GitHub':
      case 'Jira':
      case 'Linear': {
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
      case 'Google': {
        const code = searchParams.get('code')
        const url = `mex://navigate/?code=${code}`
        checkProtocolAndOpen(url, event)
        break
      }

      case 'Slack':
      case 'Telegram': {
        const serviceId = searchParams.get('serviceId')
        const url = `mex://navigate/integrations/portal/${serviceName.toUpperCase()}?serviceId=${serviceId}`
        checkProtocolAndOpen(url, event)
        break
      }

      case 'Asana':
      case 'Figma':
      case 'GitHub':
      case 'Jira':
      case 'Linear': {
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
        {!hasDesktopApp && <Description>You Don't Have the Desktop App. Please Install to Continue</Description>}
      </BackCard>
    </CenteredColumn>
  )
}

export default GenericOAuthRedirect
