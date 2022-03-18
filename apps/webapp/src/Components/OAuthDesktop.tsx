import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthentication } from '../Stores/useAuth'
import { BackCard } from '../Style/Card'
import { CenteredColumn } from '../Style/Layouts'
import { Title } from '../Style/Typography'

export default function OAuthDesktop() {
  const hash = window.location.hash
  const accessToken = new URLSearchParams(hash).get('#access_token')
  const idToken = new URLSearchParams(hash).get('id_token')
  const mexProtocolURL = `mex://localhost:3333/?access_token=${accessToken}&id_token=${idToken}`
  const navigate = useNavigate()
  const { loginViaGoogle } = useAuthentication()
  window.open(mexProtocolURL, '_self')

  const handleNavigatedLogin = async (e) => {
    e.preventDefault()
    await loginViaGoogle(idToken, accessToken, true)
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
