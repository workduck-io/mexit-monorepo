import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import mixpanel from 'mixpanel-browser'

import { useAuthentication } from '../Hooks/useAuth'
import { LoginFormData } from '../Types/Auth'

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
        console.log('Login Success!')
      })
      .catch((e) => {
        console.error('Error occured: ', e)
        temp = 'Error Occurred'
        mixpanel.track('Login Successful')
      })
    setLoginResult(JSON.stringify(temp))
  }
  return (
    <>
      <h3>Login</h3>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label>Email</label>
        <input placeholder="Email" {...register('email')} />
        <label>Password</label>
        <input type="password" {...register('password')} />

        <button type="submit">Submit</button>
      </form>
      <p>{loginResult}</p>
    </>
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
    <>
      <button onClick={onLogout}>Logout</button>
    </>
  )
}

export const Register = () => {
  return <></>
}
