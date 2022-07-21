import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Link, useNavigate } from 'react-router-dom'
import { Icon } from '@iconify/react'
import { LoginFormData } from '@mexit/core'
import { GoogleLoginButton, LoadingButton } from '../Components/Buttons/Buttons'
import { useAuthentication } from '../Stores/useAuth'
import { EMAIL_REG } from '../Utils/constants'
import { ROUTE_PATHS } from '../Hooks/useRouting'
import Error from '../Components/Buttons/Errors'
import ImagesContainer from '../Components/ImagesContainer'

import {
  Container,
  Header,
  Message,
  SectionForm,
  SectionInteractive,
  InteractiveContentWrapper,
  Tabs,
  TabLink,
  SignInOptions,
  OptionHeader,
  Line,
  AuthIcon,
  InteractiveHeader,
  SubContent
} from '../Style/AuthFlow'
import { Form, FormGroup, Input, RememberMe, SubForm, ForgotPassword, SubmitButton } from '../Style/Form'
import { useInitializeAfterAuth } from '../Stores/useAuth'
import { mog } from '@mexit/core'

export const Login = () => {
  const [loginResult, setLoginResult] = useState('')
  const [show, setShow] = useState(false)

  const [statusEmail, setStatusEmail] = useState<string>('rest')
  const [statusPassword, setStatusPassword] = useState<string>('rest')

  const { login } = useAuthentication()
  const { initializeAfterAuth } = useInitializeAfterAuth()
  const {
    handleSubmit,
    register,
    setError,
    clearErrors,
    formState: { errors, isSubmitting }
  } = useForm<LoginFormData>({ mode: 'onChange' })

  const onSubmit = async (data: LoginFormData): Promise<void> => {
    try {
      const { loginData, loginStatus } = await login(data.email, data.password)
      if (loginStatus === 'Incorrect username or password.') {
        toast('Invalid Username or Password')
      }

      if (loginStatus === 'success') await initializeAfterAuth(loginData, false, false, false)
    } catch (error) {
      toast('An Error Occured. Please Try Again Later')
      mog('LoginError', { error })
    }
  }
  return (
    <Container>
      <SectionInteractive>
        <InteractiveContentWrapper>
          <InteractiveHeader>
            <h1>Augment Thoughts.</h1>
            <h1> Automate Task.</h1>
          </InteractiveHeader>
        </InteractiveContentWrapper>
        <SubContent>
          <ImagesContainer />
          <p>3k+ founders and Product Managers joined us, now it’s your turn</p>
        </SubContent>
      </SectionInteractive>
      <SectionForm>
        <Header state={'login'}>
          <Message>
            <h1>Hello Again!</h1>
            <p>Welcome back! Please enter your details.</p>
          </Message>
        </Header>
        <Tabs>
          <TabLink status={true} to={ROUTE_PATHS.login}>
            Login
          </TabLink>
          <TabLink status={false} to={ROUTE_PATHS.register}>
            Register
          </TabLink>
        </Tabs>
        <Form onSubmit={handleSubmit(onSubmit)}>
          <FormGroup
            status={statusEmail}
            tabIndex={-1}
            onFocus={() => {
              setStatusEmail('focus')
              if (errors.email) {
                setStatusEmail('error')
              }
            }}
            onBlur={() => {
              setStatusEmail('rest')
              if (errors.email) {
                setStatusEmail('error')
              }
            }}
          >
            <AuthIcon icon="ic:baseline-alternate-email" width={16} />
            <Input
              type="email"
              placeholder="Email"
              name="email"
              {...register('email', {
                required: true,
                pattern: EMAIL_REG
              })}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSubmit(onSubmit)
                }
              }}
              onChange={(e) => {
                if (errors.email) {
                  if (e.target.value !== undefined || e.target.value !== '') {
                    setStatusEmail('focus')
                    clearErrors()
                  }
                  if (!EMAIL_REG.test(e.target.value)) {
                    setStatusEmail('error')
                    setError('email', { type: 'focus' })
                  }
                }
                if (e.target.value === undefined || e.target.value === '') {
                  setError('email', { type: 'focus' })
                  setStatusEmail('error')
                }
                if (!EMAIL_REG.test(e.target.value)) {
                  setStatusEmail('error')
                  setError('email', { type: 'focus' })
                }
              }}
            />
          </FormGroup>
          {errors.email && <Error message="Please enter a valid Email!" />}
          <FormGroup
            status={statusPassword}
            tabIndex={-1}
            onFocus={() => {
              setStatusPassword('focus')
              if (errors.password) {
                setStatusPassword('error')
              }
            }}
            onBlur={() => {
              setStatusPassword('rest')
              if (errors.password) {
                setStatusPassword('error')
              }
            }}
          >
            <AuthIcon icon="bx:lock" width={18} />
            <Input
              type={show ? 'text' : 'password'}
              placeholder="Password"
              name="password"
              {...register('password', {
                required: true
              })}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSubmit(onSubmit)
                }
              }}
              onChange={(e) => {
                if (errors.password) {
                  if (e.target.value !== undefined || e.target.value !== '') {
                    setStatusPassword('focus')
                    clearErrors()
                  }
                }
                if (e.target.value === undefined || e.target.value === '') {
                  setError('password', { type: 'focus' })
                  setStatusPassword('error')
                }
              }}
            />
            <Icon
              icon={show ? 'bxs:hide' : 'bxs:show'}
              width={18}
              onClick={() => {
                setShow(!show)
              }}
            />
          </FormGroup>
          {errors.password && <Error message="Please enter a password!" />}
          <SubForm>
            <RememberMe>
              <Input type="checkbox" />
              <span>Remember Me</span>
            </RememberMe>
            <Link to={ROUTE_PATHS.forgotpassword}>
              <ForgotPassword>Forgot password?</ForgotPassword>
            </Link>
          </SubForm>
          <LoadingButton
            loading={isSubmitting}
            alsoDisabled={errors.email !== undefined || errors.password !== undefined}
            buttonProps={{ type: 'submit', primary: true, large: true }}
          >
            Login
          </LoadingButton>
        </Form>
        <SignInOptions>
          <OptionHeader>
            <Line></Line>
            <p>or sign in with</p>
            <Line></Line>
          </OptionHeader>
          <GoogleLoginButton text={'Google'} />
        </SignInOptions>
      </SectionForm>
    </Container>
  )
}
