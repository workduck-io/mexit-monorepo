import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import mixpanel from 'mixpanel-browser'

import { useAuthentication, useAuthStore } from '../Hooks/useAuth'
import { LoginFormData } from '../Types/Auth'
import { Input, InputRow, Label } from '../Styles/Form'
import { Button } from '../Styles/Button'
import styled from 'styled-components'

const Container = styled.div`
  width: 100%;
`

export const Login = () => {
  const [loginResult, setLoginResult] = useState('')
  const { login } = useAuthentication()
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting }
  } = useForm<LoginFormData>()

  const onSubmit = async (data: LoginFormData): Promise<void> => {
    let temp: any
    await login(data.email, data.password, true)
      .then((s) => {
        if (s.v === 'Incorrect username or password.') {
          console.log('Invalid Username or Password')
          setLoginResult('Invalid Username or Password')
        }
        temp = s.data
        mixpanel.track('Login Successful', {
          source: 'Browser Extension'
        })
        mixpanel.identify(s.data.email)
      })
      .catch((e) => {
        console.error('Error occured: ', e)
        temp = 'Error Occurred'
        mixpanel.track('Login Successful')
      })
    setLoginResult(JSON.stringify(temp))
  }

  return (
    <Container>
      <h3>Login</h3>
      <form onSubmit={handleSubmit(onSubmit)}>
        <InputRow>
          <Label>Email</Label>
          <Input {...register('email')} />
        </InputRow>
        <InputRow>
          <Label>Password</Label>
          <Input type="password" {...register('password')} />
        </InputRow>

        <Button type="submit" />
      </form>
      <p>{loginResult}</p>
    </Container>
  )
}

export const Logout = () => {
  const { logout } = useAuthentication()

  const onLogout = () => {
    logout()
    mixpanel.track('Logged Out')
    mixpanel.reset()
  }

  return (
    <div>
      <Button type="submit" value="Logout" onClick={onLogout} />
    </div>
  )
}
