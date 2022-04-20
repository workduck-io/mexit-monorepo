import { MEXIT_FRONTEND_AUTH_BASE } from '@mexit/core'
import { CenteredColumn, Title } from '@mexit/shared'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import config from '../config'
import { useAuthentication } from '../Stores/useAuth'
import { BackCard } from '../Style/Card'

export default function OAuthDesktop() {
  const [code, setCode] = useState<string>()
  const navigate = useNavigate()
  const { loginViaGoogle } = useAuthentication()

  useEffect(() => {
    const URLparams = new URL(window.location.href).searchParams
    const codeP = URLparams.get('code')
    setCode(codeP)
    const mexProtocolURL = `mex://localhost:3333/?code=${codeP}`
    console.log('Mex Protocol URL: ', mexProtocolURL)
    window.open(mexProtocolURL, '_self')
  }, [])

  const handleNavigatedLogin = async (e) => {
    e.preventDefault()
    await loginViaGoogle(code, config.cognito.APP_CLIENT_ID, MEXIT_FRONTEND_AUTH_BASE)
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
