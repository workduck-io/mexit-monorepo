import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Link, useNavigate } from 'react-router-dom'

import { LoginFormData } from '@mexit/core'
import { CenteredColumn } from '@mexit/shared'

import { GoogleLoginButton, LoadingButton } from '../Components/Buttons/Buttons'
import { InputFormError } from '../Components/Input'
import { useAuthentication } from '../Stores/useAuth'
import { BackCard, FooterCard } from '@mexit/shared'
import { Title } from '@mexit/shared'
import { ButtonFields, AuthForm } from '@mexit/shared'
import { EMAIL_REG } from '../Utils/constants'
import Analytics from '../Utils/analytics'
import { ROUTE_PATHS } from '../Hooks/useRouting'

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
          toast('Invalid Username or Password')
          setLoginResult('Invalid Username or Password')
        }
        temp = s.data
        Analytics?.track('Login Successful', {
          source: 'Browser Extension'
        })
        Analytics?.identify(s.data.email)
        console.log('Login Success!')
      })
      .catch((e) => {
        toast('An error Occured. Please Try Again Later')
        console.error('Error occured: ', e)
        temp = 'Error Occurred'
        Analytics?.track('Login Unsuccessful')
      })
    setLoginResult(JSON.stringify(temp))
  }

  return (
    <CenteredColumn>
      <BackCard>
        <Title>Login</Title>
        <AuthForm onSubmit={handleSubmit(onSubmit)}>
          <InputFormError
            name="email"
            label="Email"
            inputProps={{
              autoFocus: true,
              ...register('email', {
                required: true,
                pattern: EMAIL_REG
              })
            }}
            errors={errors}
          ></InputFormError>

          <InputFormError
            name="password"
            label="Password"
            inputProps={{
              type: 'password',
              ...register('password', {
                required: true
              })
            }}
            errors={errors}
          ></InputFormError>

          <ButtonFields>
            <LoadingButton
              loading={isSubmitting}
              alsoDisabled={errors.email !== undefined || errors.password !== undefined}
              buttonProps={{ type: 'submit', primary: true, large: true }}
            >
              Login
            </LoadingButton>
          </ButtonFields>
        </AuthForm>
        <ButtonFields>
          <GoogleLoginButton text={'Login via Google'} />
        </ButtonFields>
      </BackCard>
      <FooterCard>
        <Link to={ROUTE_PATHS.forgotpassword}>Forgot Password?</Link>
      </FooterCard>
      <FooterCard>
        <Link to={ROUTE_PATHS.register}>Register</Link>
      </FooterCard>
    </CenteredColumn>
  )
}
