import React, { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'

import { useAuth } from '@workduck-io/dwindle'
import { Button, LoadingButton } from '@workduck-io/mex-components'

import { RegisterFormData, UserRoleValues, VerifyFormData } from '@mexit/core'
import {
  AuthForm,
  BackCard,
  ButtonFields,
  CenteredColumn,
  FooterCard,
  Label,
  StyledCreatatbleSelect,
  Title
} from '@mexit/shared'

import { GoogleLoginButton } from '../Components/Buttons/Buttons'
import Input, { InputFormError, PasswordNotMatch, PasswordRequirements } from '../Components/Input'
import { ROUTE_PATHS } from '../Hooks/useRouting'
import { useAuthentication, useAuthStore, useInitializeAfterAuth } from '../Stores/useAuth'
import { StyledRolesSelectComponents } from '../Style/Select'
import { ALIAS_REG, EMAIL_REG, PASSWORD } from '../Utils/constants'

export const Register = () => {
  const [reqCode, setReqCode] = useState(false)
  const [password, setPassword] = useState<string>()
  const [arePasswordEqual, setArePasswordEqual] = useState<boolean>(true)
  const registerForm = useForm<RegisterFormData>()
  const verifyForm = useForm<VerifyFormData>()

  const { registerDetails, verifySignup } = useAuthentication()
  const registered = useAuthStore((store) => store.registered)
  const setRegistered = useAuthStore((store) => store.setRegistered)
  const { resendCode } = useAuth()
  const { initializeAfterAuth } = useInitializeAfterAuth()

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
      const loginData = await verifySignup(data.code, metadata)
      await initializeAfterAuth(loginData, true, false, true)
    } catch (err) {
      toast('Error occured!')
    }
  }

  const onCancelVerification = (e) => {
    e.preventDefault()
    setRegistered(false)
  }

  return (
    <CenteredColumn>
      <BackCard>
        <Title>Register</Title>
        {!registered ? (
          <>
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
              <InputFormError
                name="alias"
                label="Alias"
                inputProps={{
                  placeholder: 'Ex: CoolGuy',
                  ...registerForm.register('alias', {
                    required: true,
                    pattern: ALIAS_REG
                  })
                }}
                additionalInfo="Only Alphanumeric as content, and -_ as separators allowed"
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
                    pattern: PASSWORD,
                    onChange: (e) => setPassword(e.target.value)
                  })
                }}
                errors={regErrors}
              ></InputFormError>

              {regErrors.password?.type === 'pattern' ? <PasswordRequirements /> : undefined}

              <InputFormError
                name="confirmpassword"
                label="Confirm Password"
                inputProps={{
                  type: 'password',
                  ...registerForm.register('confirmPassword', {
                    required: true,
                    pattern: PASSWORD,
                    deps: ['password'],
                    onChange: (e) => {
                      if (e.target.value.toString() !== password) {
                        setArePasswordEqual(false)
                      } else {
                        setArePasswordEqual(true)
                      }
                    }
                  })
                }}
                errors={regErrors}
              ></InputFormError>

              {!arePasswordEqual ? <PasswordNotMatch /> : undefined}

              <ButtonFields position="center">
                <LoadingButton
                  loading={regSubmitting}
                  alsoDisabled={regErrors.email !== undefined || regErrors.password !== undefined || !arePasswordEqual}
                  type="submit"
                  primary
                  large
                >
                  Send Verification Code
                </LoadingButton>
              </ButtonFields>
            </AuthForm>
            <ButtonFields>
              <GoogleLoginButton text={'Register via Google'} />
            </ButtonFields>
          </>
        ) : (
          <AuthForm onSubmit={verifyForm.handleSubmit(onVerifySubmit)}>
            <Input
              name="code"
              label="Code"
              inputProps={{
                autoFocus: true,
                ...verifyForm.register('code', {
                  required: true
                })
              }}
              error={verErrors.code?.type === 'required' ? 'Code is required' : undefined}
            ></Input>

            <LoadingButton type="button" loading={reqCode} onClick={onResendRequest}>
              Resend Code
            </LoadingButton>
            <ButtonFields>
              <Button type="button" large onClick={onCancelVerification}>
                Cancel
              </Button>
              <LoadingButton
                loading={verSubmitting}
                alsoDisabled={verErrors.code !== undefined}
                type="submit"
                primary
                large
              >
                Verify Code
              </LoadingButton>
            </ButtonFields>
          </AuthForm>
        )}
        <br />
      </BackCard>
      <FooterCard>
        <Link to={ROUTE_PATHS.login}>Login</Link>
      </FooterCard>
    </CenteredColumn>
  )
}
