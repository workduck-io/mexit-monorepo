import React from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Link, useNavigate } from 'react-router-dom'
import { Icon } from '@iconify/react'
import { LoginFormData } from '@mexit/core'
import { CenteredColumn } from '@mexit/shared'

import { GoogleLoginButton, LoadingButton } from '../Components/Buttons/Buttons'
import { InputFormError } from '../Components/Input'
import { useAuthentication, useInitializeAfterAuth } from '../Stores/useAuth'
import { BackCard, FooterCard } from '@mexit/shared'
import { Title } from '@mexit/shared'
import { ButtonFields, AuthForm } from '@mexit/shared'
import { EMAIL_REG } from '../Utils/constants'
import { ROUTE_PATHS } from '../Hooks/useRouting'
import Error from '../Components/Buttons/Errors'

import {
  Container,
  Header,
  LogoContainer,
  Message,
  SectionForm,
  SectionInteractive,
  Tabs,
  TabLink,
  SignInOptions,
  OptionHeader,
  Line,
  OptionButton
} from '../Style/AuthFlow'
import { Form, FormGroup, Input, RememberMe, SubForm, ForgotPassword, SubmitButton } from '../Style/Form'
import { Workduck_Logo } from './SVG'
import LoaderButton from '../Components/Buttons/LoaderButton'
import { useSpring } from 'react-spring'

export const Login = () => {
  const [loginResult, setLoginResult] = useState('')
  const [show, setShow] = useState(false)
  const { login } = useAuthentication()
  const { initializeAfterAuth } = useInitializeAfterAuth()
  const {
    handleSubmit,
    register,
    clearErrors,
    formState: { errors, isSubmitting }
  } = useForm<LoginFormData>()

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

  const handleBlur = () => {
    clearErrors()
  }

  const animateForm = useSpring({
    from: {
      transform: 'translateX(-100%)',
      opacity: 0
    },
    to: {
      transform: 'translateX(0%)',
      opacity: 1
    },
    config: {
      duration: 500
    }
  })

  return (
    <>
      {/*<CenteredColumn>
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
          </CenteredColumn>*/}
      <Container>
        <SectionInteractive></SectionInteractive>
        <SectionForm>
          <Header state={'login'}>
            <LogoContainer>{Workduck_Logo}</LogoContainer>
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
          <Form onSubmit={handleSubmit(onSubmit)} style={animateForm}>
            <FormGroup>
              {errors.email && <Error message="Please enter a valid email" handleBlur={handleBlur} />}
              <Icon icon="ic:round-email" width={24} />
              <Input
                type="email"
                placeholder="Email"
                name="email"
                {...register('email', {
                  required: true,
                  pattern: EMAIL_REG
                })}
              />
            </FormGroup>
            <FormGroup>
              {errors.password && <Error message="Please enter a password!" handleBlur={handleBlur} />}
              <Icon icon="bxs:lock" width={24} />
              <Input
                type={show ? 'text' : 'password'}
                placeholder="Password"
                name="password"
                {...register('password', {
                  required: true
                })}
              />
              <Icon
                icon={show ? 'bxs:hide' : 'bxs:show'}
                width={24}
                onClick={() => {
                  setShow(!show)
                }}
              />
            </FormGroup>
            <SubForm>
              <RememberMe>
                <input type="checkbox" />
                <label>Remember Me</label>
              </RememberMe>
              <Link to={ROUTE_PATHS.forgotpassword}>
                <ForgotPassword>Forgot password?</ForgotPassword>
              </Link>
            </SubForm>
            {isSubmitting ? <LoaderButton /> : <SubmitButton>Login</SubmitButton>}
          </Form>
          <SignInOptions>
            <OptionHeader>
              <Line></Line>
              <p>or sign in with</p>
              <Line></Line>
            </OptionHeader>
            <OptionButton>
              <GoogleLoginButton text={'Google'} />
            </OptionButton>
          </SignInOptions>
        </SectionForm>
      </Container>
    </>
  )
}
