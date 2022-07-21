import { useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useAuth } from '@workduck-io/dwindle'
import { useAuthentication, useAuthStore } from '../Stores/useAuth'
import { EMAIL_REG, PASSWORD } from '../Utils/constants'
import { NavigationType, ROUTE_PATHS, useRouting } from '../Hooks/useRouting'
import { ForgotPasswordFormData, VerifyFormData } from '@mexit/core'
import { Link } from 'react-router-dom'
import { Container, Message, SectionForm, SectionInteractive, Space } from '../Style/AuthFlow'
import { Form, FormGroup, Input, SubmitButton } from '../Style/Form'
import { Icon } from '@iconify/react'
import Errors from '../Components/Buttons/Errors'
import LoaderButton from '../Components/Buttons/LoaderButton'
import { LoadingButton } from '../Components/Buttons/Buttons'

export const ForgotPassword = () => {
  const [reqCode, setReqCode] = useState(false)
  const [newPassword, setNewPassword] = useState<string>()
  const [confirmPassword, setConfirmPassword] = useState<string>('')
  const [arePasswordEqual, setArePasswordEqual] = useState<boolean>(true)
  const forgotPasswordForm = useForm<ForgotPasswordFormData>()
  const verifyForm = useForm<VerifyFormData>()
  const { goTo } = useRouting()

  const [enteredEmail, setEnteredEmail] = useState<boolean>(false)
  const [show, setShow] = useState<boolean>(false)
  const [showConfirm, setShowConfirm] = useState<boolean>(false)

  const [statusEmail, setStatusEmail] = useState<string>('rest')
  const [statusPass, setStatusPass] = useState<string>('rest')
  const [statusConfirm, setStatusConfirm] = useState<string>('rest')
  const [statusCode, setStatusCode] = useState<string>('rest')

  const { registerDetails, verifySignup } = useAuthentication()
  const registered = useAuthStore((store) => store.registered)
  const isForgottenPassword = useAuthStore((store) => store.isForgottenPassword)
  const setIsForgottenPassword = useAuthStore((store) => store.setIsForgottenPassword)
  const { forgotPassword, verifyForgotPassword } = useAuth()
  const { resendCode } = useAuth()

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

  return (
    <Container>
      <SectionInteractive></SectionInteractive>
      <SectionForm>
        {!isForgottenPassword ? (
          <>
            <Space></Space>
            <Space></Space>
            {!enteredEmail ? (
              <Message>
                <h1>Reset Password</h1>
                <p>
                  Enter the email associated with your account and we'll send an email with instructions to reset your
                  password
                </p>
              </Message>
            ) : (
              <Message>
                <h2>Reset Account Password</h2>
                <p>Enter a new password</p>
              </Message>
            )}
            <Form onSubmit={forgotPasswordForm.handleSubmit(onForgotPasswordSubmit)}>
              {!enteredEmail ? (
                <>
                  <FormGroup
                    status={statusEmail}
                    tabIndex={-1}
                    onFocus={() => {
                      setStatusEmail('focus')
                      if (forgotPasswordForm.formState.errors.email) {
                        setStatusEmail('error')
                      }
                    }}
                    onBlur={() => {
                      setStatusEmail('rest')
                      if (forgotPasswordForm.formState.errors.email) {
                        setStatusEmail('error')
                      }
                    }}
                  >
                    <Icon icon="ic:round-email" width={18} />
                    <Input
                      type="email"
                      placeholder="Email"
                      name="email"
                      {...forgotPasswordForm.register('email', {
                        required: true,
                        pattern: EMAIL_REG
                      })}
                      onChange={(e) => {
                        if (regErrors.email) {
                          if (e.target.value !== undefined || e.target.value !== '') {
                            setStatusEmail('focus')
                            forgotPasswordForm.clearErrors()
                          }
                          if (!EMAIL_REG.test(e.target.value)) {
                            setStatusEmail('error')
                            forgotPasswordForm.setError('email', { type: 'focus' })
                          }
                        }
                        if (e.target.value === undefined || e.target.value === '') {
                          forgotPasswordForm.setError('email', { type: 'focus' })
                          setStatusEmail('error')
                        }
                        if (!EMAIL_REG.test(e.target.value)) {
                          setStatusEmail('error')
                          forgotPasswordForm.setError('email', { type: 'focus' })
                        }
                      }}
                    />
                  </FormGroup>
                  {regErrors.email && <Errors message="Please enter a valid email!" />}
                  <SubmitButton
                    onClick={() => {
                      setEnteredEmail(true)
                    }}
                  >
                    Send Instructions
                  </SubmitButton>
                </>
              ) : (
                <>
                  <FormGroup
                    status={statusPass}
                    tabIndex={-1}
                    onFocus={() => {
                      setStatusPass('focus')
                      if (forgotPasswordForm.formState.errors.newpassword) {
                        setStatusPass('error')
                      }
                    }}
                    onBlur={() => {
                      setStatusPass('rest')
                    }}
                  >
                    <Icon icon="bxs:lock" width={18} />
                    <Input
                      type={show ? 'text' : 'password'}
                      placeholder="Password"
                      name="newpassword"
                      {...forgotPasswordForm.register('newpassword', {
                        required: true
                      })}
                      onChange={(e) => {
                        if (regErrors.newpassword) {
                          if (e.target.value !== undefined || e.target.value !== '') {
                            setStatusPass('focus')
                            forgotPasswordForm.clearErrors()
                          }
                        }
                        if (e.target.value === undefined || e.target.value === '') {
                          forgotPasswordForm.setError('newpassword', { type: 'focus' })
                          setStatusPass('error')
                        }
                        if (e.target.value.toString() !== confirmPassword) {
                          setStatusConfirm('error')
                          setArePasswordEqual(false)
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
                  {regErrors.newpassword && <Errors message="Please enter a valid password!" />}
                  <FormGroup
                    tabIndex={-1}
                    status={statusConfirm}
                    onFocus={() => {
                      setStatusConfirm('focus')
                      if (forgotPasswordForm.formState.errors.confirmNewPassword) {
                        setStatusConfirm('error')
                      }
                    }}
                    onBlur={() => {
                      setStatusConfirm('rest')
                      setArePasswordEqual(true)
                      forgotPasswordForm.clearErrors()
                    }}
                  >
                    <Icon icon="bxs:lock" width={18} />
                    <Input
                      type={showConfirm ? 'text' : 'password'}
                      placeholder="Confirm Password"
                      name="confirmNewPassword"
                      {...forgotPasswordForm.register('confirmNewPassword', {
                        required: true,
                        pattern: PASSWORD
                      })}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value)
                        if (e.target.value.toString() !== newPassword) {
                          setArePasswordEqual(false)
                          setStatusConfirm('error')
                        } else {
                          setArePasswordEqual(true)
                          setStatusConfirm('rest')
                          forgotPasswordForm.clearErrors('confirmNewPassword')
                        }
                      }}
                    />
                    <Icon
                      icon={showConfirm ? 'bxs:hide' : 'bxs:show'}
                      width={18}
                      onClick={() => {
                        setShowConfirm(!show)
                      }}
                    />
                  </FormGroup>
                  {!arePasswordEqual ? <Errors message="Passwords are not equal!" /> : undefined}
                  <LoadingButton
                    loading={regSubmitting}
                    alsoDisabled={
                      regErrors.email !== undefined || regErrors.newpassword !== undefined || !arePasswordEqual
                    }
                    buttonProps={{ type: 'submit', primary: true, large: true }}
                  >
                    Send Verification Code
                  </LoadingButton>
                </>
              )}
            </Form>
          </>
        ) : (
          <>
            <Space></Space>
            <Space></Space>
            <Message>
              <h1>Enter the verification Code</h1>
              <p>Enter the verification code we sent to your email</p>
            </Message>
            <Form onSubmit={verifyForm.handleSubmit(onVerifySubmit)}>
              <FormGroup
                status={statusCode}
                tabIndex={-1}
                onFocus={() => {
                  setStatusCode('focus')
                  if (verifyForm.formState.errors.code) {
                    setStatusCode('error')
                  }
                }}
                onBlur={() => {
                  setStatusCode('rest')
                  if (verErrors.code) {
                    setStatusCode('error')
                  }
                }}
              >
                <Icon icon="bxs:lock" width={24} />
                <Input
                  placeholder="Enter the 6-Character code"
                  name="code"
                  {...verifyForm.register('code', {
                    required: true
                  })}
                  onChange={(e) => {
                    if (verErrors.code) {
                      if (e.target.value !== undefined || e.target.value !== '') {
                        setStatusCode('focus')
                        verifyForm.clearErrors()
                      }
                    }
                    if (e.target.value === undefined || e.target.value === '') {
                      verifyForm.setError('code', { type: 'focus' })
                      setStatusCode('error')
                    }
                  }}
                />
              </FormGroup>
              {verErrors.code && <Errors message="Please enter a code" />}
              {verSubmitting ? <LoaderButton /> : <SubmitButton>Verify</SubmitButton>}
            </Form>
            <Message>
              <Space></Space>
              <p>Didn't get a confirmation email?</p>
              <p>
                Check your spam folder or <span onClick={onResendRequest}>Send again</span>
              </p>
            </Message>
          </>
        )}
      </SectionForm>
    </Container>
  )
}
