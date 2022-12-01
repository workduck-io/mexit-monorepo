import { useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'

import { useAuth } from '@workduck-io/dwindle'
import { Button,LoadingButton } from '@workduck-io/mex-components'

import { ForgotPasswordFormData, VerifyFormData } from '@mexit/core'
import { AuthForm, BackCard, ButtonFields,CenteredColumn , FooterCard , Title  } from '@mexit/shared'

import Input, { InputFormError, PasswordNotMatch, PasswordRequirements } from '../Components/Input'
import { NavigationType, ROUTE_PATHS, useRouting } from '../Hooks/useRouting'
import { useAuthentication, useAuthStore } from '../Stores/useAuth'
import { EMAIL_REG, PASSWORD } from '../Utils/constants'

export const ForgotPassword = () => {
  const [reqCode, setReqCode] = useState(false)
  const [newPassword, setNewPassword] = useState<string>()
  const [arePasswordEqual, setArePasswordEqual] = useState<boolean>(true)
  const forgotPasswordForm = useForm<ForgotPasswordFormData>()
  const verifyForm = useForm<VerifyFormData>()
  const { goTo } = useRouting()

  const { registerDetails, verifySignup } = useAuthentication()
  const registered = useAuthStore((store) => store.registered)
  const isForgottenPassword = useAuthStore((store) => store.isForgottenPassword)
  const setIsForgottenPassword = useAuthStore((store) => store.setIsForgottenPassword)
  const { forgotPassword, verifyForgotPassword } = useAuth()

  const regErrors = forgotPasswordForm.formState.errors
  const verErrors = verifyForm.formState.errors

  const regSubmitting = forgotPasswordForm.formState.isSubmitting
  const verSubmitting = verifyForm.formState.isSubmitting

  const onForgotPasswordSubmit = async (data: ForgotPasswordFormData) => {
    setIsForgottenPassword(true)
    setNewPassword(data.newpassword)
    await forgotPassword(data.email)
  }

  const onVerifySubmit = async (data: VerifyFormData) => {
    try {
      const res = await verifyForgotPassword(data.code, newPassword)
      if (res === 'SUCCESS') {
        toast('Password changed successfully')
        goTo(ROUTE_PATHS.login, NavigationType.push)
      } else {
        toast('Something went wrong, Try again')
        goTo(ROUTE_PATHS.forgotpassword, NavigationType.push)
      }
    } catch (err) {
      toast('Error occured!')
    }
    setIsForgottenPassword(false)
  }

  const onCancelVerification = (e) => {
    e.preventDefault()
    setIsForgottenPassword(false)
  }

  return (
    <CenteredColumn>
      <BackCard>
        <Title>Forgot Password</Title>
        {!isForgottenPassword ? (
          <AuthForm onSubmit={forgotPasswordForm.handleSubmit(onForgotPasswordSubmit)}>
            <InputFormError
              name="email"
              label="Email"
              inputProps={{
                ...forgotPasswordForm.register('email', {
                  required: true,
                  pattern: EMAIL_REG
                })
              }}
              errors={regErrors}
            ></InputFormError>

            <InputFormError
              name="newpassword"
              label="New Password"
              inputProps={{
                type: 'password',
                ...forgotPasswordForm.register('newpassword', {
                  required: true,
                  pattern: PASSWORD,
                  onChange: (e) => setNewPassword(e.target.value)
                })
              }}
              errors={regErrors}
            ></InputFormError>

            {regErrors.newpassword?.type === 'pattern' ? <PasswordRequirements /> : undefined}

            <InputFormError
              name="confirmnewpassword"
              label="Confirm New Password"
              inputProps={{
                type: 'password',
                ...forgotPasswordForm.register('confirmNewPassword', {
                  required: true,
                  pattern: PASSWORD,
                  deps: ['newpassword'],
                  onChange: (e) => {
                    if (e.target.value.toString() !== newPassword) {
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

            <ButtonFields>
              <LoadingButton
                loading={regSubmitting}
                alsoDisabled={regErrors.email !== undefined || regErrors.newpassword !== undefined || !arePasswordEqual}
                type="submit"
                primary
                large
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

            <ButtonFields>
              <Button large onClick={onCancelVerification}>
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
