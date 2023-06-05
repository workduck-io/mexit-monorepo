import React, { useEffect, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'

import { Button, LoadingButton } from '@workduck-io/mex-components'

import { API, API_BASE_URLS, config, useAuthStore, useCalendarStore } from '@mexit/core'
import { BackCard, CenteredColumn, Description, Group, Title } from '@mexit/shared'

import { ServiceIcon } from '../../Icons/Icons'
import { useAuthentication, useInitializeAfterAuth } from '../../Stores/useAuth'

import { checkCustomProtocolHandler } from './checkCustomProtocol'

const allowedServices = [
  'google',
  'telegram',
  'slack',
  'asana',
  'figma',
  'google_cal',
  'github',
  'jira',
  'linear',
  'whatsapp',
  'calendars'
]

const GenericOAuthRedirect = () => {
  const [hasDesktopApp, setHasDesktopApp] = useState<boolean>(true)
  const [isLoading, setIsLoading] = useState<boolean>(false)
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
      case 'google_cal':
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
    setIsLoading(true)

    try {
      switch (serviceName) {
        case 'google': {
          const code = searchParams.get('code')
          const { loginData } = await loginViaGoogle(
            code,
            config.cognito.APP_CLIENT_ID,

            `${API_BASE_URLS.oauth}/google`
          )
          await initializeAfterAuth(loginData, true, true, false)
          navigate('/')
          break
        }
        case 'google_cal': {
          const data = {
            accessToken: searchParams.get('access_token'),
            refreshToken: searchParams.get('refresh_token'),
            email: useAuthStore.getState().userDetails.email
          }

          useCalendarStore.getState().addToken('GOOGLE_CAL', data.accessToken)
          await API.calendar.persistAuth(data)

          navigate(`/integrations/calendars/${serviceName.toUpperCase()}`)
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
    } catch (err) {
      console.error('Error while handling webapp open', err)
    } finally {
      setIsLoading(false)
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
        <Group>
          {showWebappOpener() && (
            <LoadingButton loading={isLoading} onClick={handleWebappOpen}>
              Continue to Web App
            </LoadingButton>
          )}
          <Button onClick={(e) => handleDesktopAppOpen(e)}>Continue to Desktop App</Button>
          {!hasDesktopApp && <Description>You Don&apos;t Have the Desktop App. Please Install to Continue</Description>}
        </Group>
      </BackCard>
    </CenteredColumn>
  )
}

export default GenericOAuthRedirect
