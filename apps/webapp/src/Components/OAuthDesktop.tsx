import { MEXIT_FRONTEND_URL_BASE } from '@mexit/shared'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import config from '../config'
import { useAuthentication } from '../Stores/useAuth'
import { BackCard } from '../Style/Card'
import { CenteredColumn } from '../Style/Layouts'
import { Title } from '../Style/Typography'

export default function OAuthDesktop() {
  const URLparams = new URL(window.location.href).searchParams
  const code = URLparams.get('code')
  const mexProtocolURL = `mex://localhost:3333/?code=${code}`
  const navigate = useNavigate()
  const { loginViaGoogle } = useAuthentication()
  window.open(mexProtocolURL, '_self')

  const handleNavigatedLogin = async (e) => {
    e.preventDefault()
    await loginViaGoogle(code, config.cognito.APP_CLIENT_ID, MEXIT_FRONTEND_URL_BASE)
    navigate('/')
  }
  return (
    <CenteredColumn>
      <BackCard>
        <Title>Mex Web App</Title>
        <button style={{ cursor: 'pointer' }} onClick={(e: any) => handleNavigatedLogin(e)}>
          Continue to web app
        </button>
      </BackCard>
    </CenteredColumn>
  )
}
