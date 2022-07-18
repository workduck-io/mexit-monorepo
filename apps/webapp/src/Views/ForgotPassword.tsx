import { useState } from 'react'
import { useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useAuth } from '@workduck-io/dwindle'
import { useAuthentication, useAuthStore } from '../Stores/useAuth'
import { Button, CenteredColumn } from '@mexit/shared'
import { BackCard, FooterCard } from '@mexit/shared'
import { Title } from '@mexit/shared'
import { EMAIL_REG, PASSWORD } from '../Utils/constants'
import { LoadingButton } from '../Components/Buttons/Buttons'
import { NavigationType, ROUTE_PATHS, useRouting } from '../Hooks/useRouting'
import { ForgotPasswordFormData, VerifyFormData } from '@mexit/core'
import { AuthForm, ButtonFields } from '@mexit/shared'
import { InputFormError, PasswordNotMatch, PasswordRequirements } from '../Components/Input'
import { Link } from 'react-router-dom'
import { Container, Message, SectionForm, SectionInteractive, Space, ErrorMessages } from '../Style/AuthFlow'
import { Form, FormGroup, Input, SubmitButton } from '../Style/Form'
import { Icon } from '@iconify/react'
import Errors from '../Components/Buttons/Errors'
import LoaderButton from '../Components/Buttons/LoaderButton'
import { useSpring } from 'react-spring'

export const ForgotPassword = () => {
  const [reqCode, setReqCode] = useState(false)
  const [newPassword, setNewPassword] = useState<string>()
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

  const animateForm = useSpring({
    from: {
      transform: 'translateX(100%)',
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

  const animateFormGroup = useSpring({
    from: {
      transform: 'translateX(100%)',
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

  const handleBlur = () => {
    console.log('blur')
  }

  return (
    <>
      {/*<CenteredColumn>
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
        <Link to={ROUTE_PATHS.login}>Login</Link>
      </FooterCard>
            </CenteredColumn>*/}

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
              <Form onSubmit={forgotPasswordForm.handleSubmit(onForgotPasswordSubmit)} style={animateForm}>
                {!enteredEmail ? (
                  <>
                    <FormGroup
                      style={animateFormGroup}
                      status={statusEmail}
                      tabIndex={-1}
                      onFocus={() => {
                        setStatusEmail('focus')
                        if (forgotPasswordForm.formState.errors.email) {
                          setStatusEmail('rest')
                        }
                      }}
                      onBlur={() => {
                        setStatusEmail('rest')
                        forgotPasswordForm.clearErrors()
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
                      style={animateFormGroup}
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
                        forgotPasswordForm.clearErrors()
                      }}
                    >
                      <Icon icon="bxs:lock" width={18} />
                      <Input
                        type={show ? 'text' : 'password'}
                        placeholder="Password"
                        name="newpassword"
                        {...forgotPasswordForm.register('newpassword', {
                          required: true,
                          pattern: PASSWORD
                        })}
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
                      style={animateFormGroup}
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
                          if (e.target.value.toString() !== newPassword) {
                            setArePasswordEqual(false)
                            setStatusConfirm('error')
                          } else {
                            setArePasswordEqual(true)
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
                    {regSubmitting ? <LoaderButton /> : <SubmitButton>Reset Password</SubmitButton>}
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
              <Form onSubmit={verifyForm.handleSubmit(onVerifySubmit)} style={animateForm}>
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
                    verifyForm.clearErrors()
                  }}
                >
                  <Icon icon="bxs:lock" width={24} />
                  <Input
                    placeholder="Enter the 6-Character code"
                    name="code"
                    {...verifyForm.register('code', {
                      required: true
                    })}
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
    </>
  )
}
