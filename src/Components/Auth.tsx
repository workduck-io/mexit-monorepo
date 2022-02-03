import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import mixpanel from 'mixpanel-browser'
import toast from 'react-hot-toast'
import { useAuth } from '@workduck-io/dwindle'

import { useAuthentication, useAuthStore } from '../Hooks/useAuth'
import { LoginFormData, RegisterFormData, VerifyFormData, UserRoleValues } from '../Types/Auth'
import { StyledRolesSelectComponents } from '../Style/Select'
import { AuthForm, ButtonFields, Label, StyledCreatatbleSelect } from '../Style/Form'
import { CenteredColumn } from '../Style/Layouts'
import { BackCard, FooterCard } from '../Style/Card'
import Input, { InputFormError } from './Input'
import { Title } from '../Style/Elements'
import { EMAIL_REG, PASSWORD } from '../Utils/constants'
import { LoadingButton } from './Buttons'
import { Button } from '../Style/Buttons'
import { PasswordRequirements } from './Input'

export const Login = () => {
  const [loginResult, setLoginResult] = useState('')
  const { login } = useAuthentication()
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting }
  } = useForm<LoginFormData>()
  const navigate = useNavigate()

  const onSubmit = async (data: LoginFormData): Promise<void> => {
    let temp: any
    await login(data.email, data.password, true)
      .then((s) => {
        if (s.v === 'Incorrect username or password.') {
          toast('Invalid Username or Password')
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
        toast('An error Occured. Please Try Again Later')
        console.error('Error occured: ', e)
        temp = 'Error Occurred'
        mixpanel.track('Login Unsuccessful')
      })
    setLoginResult(JSON.stringify(temp))
  }

  const handleNavigate = () => {
    navigate('/register')
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
      </BackCard>
      <FooterCard>
        <Button onClick={handleNavigate}>Register</Button>
      </FooterCard>
    </CenteredColumn>
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
  const [reqCode, setReqCode] = useState(false)
  const registerForm = useForm<RegisterFormData>()
  const verifyForm = useForm<VerifyFormData>()

  const { registerDetails, verifySignup } = useAuthentication()
  const registered = useAuthStore((store) => store.registered)
  const setRegistered = useAuthStore((store) => store.setRegistered)
  const { resendCode } = useAuth()

  const navigate = useNavigate()

  const regErrors = registerForm.formState.errors
  const verErrors = verifyForm.formState.errors

  const regSubmitting = registerForm.formState.isSubmitting
  const verSubmitting = verifyForm.formState.isSubmitting

  const onResendRequest = async (e) => {
    e.preventDefault()
    setReqCode(true)
    await resendCode()
      .then((r) => {
        toast('Verification code sent!')
      })
      .catch(() => toast.error('Code could not be sent'))

    setReqCode(false)
  }

  const onRegisterSubmit = async (data: RegisterFormData) => {
    await registerDetails(data).then((s) => {
      if (s === 'UsernameExistsException') {
        toast('You have already registered, please verify code.')
      }
    })
  }

  const onVerifySubmit = async (data: VerifyFormData) => {
    const metadata = { tag: 'MEXIT_WEBAPP' }
    try {
      await verifySignup(data.code, metadata)
    } catch (err) {
      toast('Error occured!')
    }
  }

  const onCancelVerification = (e) => {
    e.preventDefault()
    setRegistered(false)
  }

  const handleNavigate = () => {
    navigate('/login')
  }

  return (
    <CenteredColumn>
      <BackCard>
        <Title>Register</Title>
        {!registered ? (
          <AuthForm onSubmit={registerForm.handleSubmit(onRegisterSubmit)}>
            <InputFormError
              name="name"
              label="Name"
              inputProps={{
                autoFocus: true,
                ...registerForm.register('name', {
                  required: true
                })
              }}
              errors={regErrors}
            ></InputFormError>

            <InputFormError
              name="email"
              label="Email"
              inputProps={{
                ...registerForm.register('email', {
                  required: true,
                  pattern: EMAIL_REG
                })
              }}
              errors={regErrors}
            ></InputFormError>

            <Label htmlFor="roles">What roles are you part of?</Label>
            <Controller
              control={registerForm.control}
              render={({ field }) => (
                <StyledCreatatbleSelect
                  {...field}
                  isMulti
                  isCreatable
                  options={UserRoleValues}
                  closeMenuOnSelect={true}
                  closeMenuOnBlur={false}
                  components={StyledRolesSelectComponents}
                  placeholder="Ex. Developer, Designer"
                />
              )}
              rules={{ required: true }}
              name="roles"
            />

            <InputFormError
              name="password"
              label="Password"
              inputProps={{
                type: 'password',
                ...registerForm.register('password', {
                  required: true,
                  pattern: PASSWORD
                })
              }}
              errors={regErrors}
            ></InputFormError>

            {regErrors.password?.type === 'pattern' ? <PasswordRequirements /> : undefined}

            <ButtonFields>
              <LoadingButton
                loading={regSubmitting}
                alsoDisabled={regErrors.email !== undefined || regErrors.password !== undefined}
                buttonProps={{ type: 'submit', primary: true, large: true }}
              >
                Send Verification Code
              </LoadingButton>
            </ButtonFields>
          </AuthForm>
        ) : (
          <AuthForm onSubmit={verifyForm.handleSubmit(onVerifySubmit)}>
            <Input
              name="code"
              label="Code"
              inputProps={{
                ...verifyForm.register('code', {
                  required: true
                })
              }}
              error={verErrors.code?.type === 'required' ? 'Code is required' : undefined}
            ></Input>

            <LoadingButton
              loading={reqCode}
              buttonProps={{
                id: 'resendCodeButton',
                onClick: onResendRequest
              }}
            >
              Resend Code
            </LoadingButton>
            <ButtonFields>
              <Button large onClick={onCancelVerification}>
                Cancel
              </Button>
              <LoadingButton
                loading={verSubmitting}
                alsoDisabled={verErrors.code !== undefined}
                buttonProps={{ type: 'submit', primary: true, large: true }}
              >
                Verify Code
              </LoadingButton>
            </ButtonFields>
          </AuthForm>
        )}
        <br />
      </BackCard>
      <FooterCard>
        <Button onClick={handleNavigate}>Login</Button>
      </FooterCard>
    </CenteredColumn>
  )
}
