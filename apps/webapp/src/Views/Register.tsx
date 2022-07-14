import React, { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'
import { useAuth } from '@workduck-io/dwindle'
import Cookies from 'universal-cookie'
import { useSpring } from 'react-spring'

import { RegisterFormData, VerifyFormData, UserRoleValues } from '@mexit/core'
import {
  AuthForm,
  BackCard,
  Button,
  ButtonFields,
  CenteredColumn,
  FooterCard,
  Label,
  StyledCreatatbleSelect,
  Title
} from '@mexit/shared'

import { useAuthentication, useAuthStore, useInitializeAfterAuth } from '../Stores/useAuth'
import { StyledRolesSelectComponents } from '../Style/Select'
import { AuthForm, ButtonFields, Label, StyledCreatatbleSelect } from '@mexit/shared'
import { CenteredColumn } from '@mexit/shared'
import { BackCard, FooterCard } from '@mexit/shared'
// import Input, { InputFormError, PasswordNotMatch, PasswordRequirements } from '../Components/Input'
import { Title } from '@mexit/shared'
import { EMAIL_REG, PASSWORD } from '../Utils/constants'
import { GoogleLoginButton, LoadingButton } from '../Components/Buttons/Buttons'
import { ROUTE_PATHS } from '../Hooks/useRouting'
import {
  OptionHeader,
  Container,
  Header,
  Message,
  SectionForm,
  SectionInteractive,
  SignInOptions,
  Space,
  TabLink,
  Tabs,
  Line,
  OptionButton,
  ErrorMessages
} from '../Style/AuthFlow'
import { Form, FormGroup, Input, SubmitButton } from '../Style/Form'
import { Icon } from '@iconify/react'
import LoaderButton from '../Components/Buttons/LoaderButton'
import Error from '../Components/Buttons/Errors'
import Creatable from 'react-select/creatable'

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

  const [show, setShow] = useState<boolean>(false)
  const [showConfirm, setShowConfirm] = useState<boolean>(false)
  const [email, setEmail] = useState<string>('')
  const [verify, setVerify] = useState<boolean>(false)

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

  const handleBlur = () => {
    console.log('blur')
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

  const animateTabContainer = useSpring({
    from: {
      marginBottom: -2 + 'rem'
    },
    to: {
      marginBottom: 0 + 'rem'
    }
  })

  const onCancelVerification = (e) => {
    e.preventDefault()
    setRegistered(false)
  }

  const customStyles = {
    container: (provided) => ({
      ...provided,
      width: '90%'
    }),
    menu: (provided) => ({
      ...provided,
      width: '80%'
    }),
    option: (provided) => ({
      ...provided,
      width: '100%'
    })
    // control: () => ({
    //   width: '80%'
    // })
  }

  const nextForm = !verify ? (
    <>
      <Space></Space>
      <Space></Space>
      <Message>
        <h1>Secure Your Account</h1>
      </Message>
      <Form style={animateForm}>
        <FormGroup>
          {regErrors.email && <Error message="Please enter a valid email!" handleBlur={handleBlur} />}
          <Icon icon="ic:round-email" width={24} />
          <Input
            type="email"
            placeholder="Email"
            value={email}
            {...registerForm.register('email', {
              required: true,
              pattern: EMAIL_REG
            })}
            onChange={(e) => {
              setEmail(e.target.value)
            }}
          />
        </FormGroup>
        <p>We'll send you a code to verify this mobile number. Message and data rates may apply.</p>
        <SubmitButton
          onClick={() => {
            setVerify(true)
          }}
        >
          Send Code
        </SubmitButton>
      </Form>
    </>
  ) : (
    <>
      <Space></Space>
      <Message>
        <h1>Enter the verification Code</h1>
      </Message>
      <Form onSubmit={verifyForm.handleSubmit(onVerifySubmit)} style={animateForm}>
        <FormGroup>
          <Icon icon="bxs:lock" width={24} />
          <Input
            placeholder="Enter the 6-Character code"
            name="code"
            {...verifyForm.register('code', {
              required: true
            })}
          />
        </FormGroup>
        {verErrors.code?.type === 'required' ? (
          <ErrorMessages>
            <Icon icon="ant-design:warning-outlined" width={16} />
            <span>Code is required!</span>
          </ErrorMessages>
        ) : undefined}
        {verSubmitting ? <LoaderButton /> : <SubmitButton>Verify</SubmitButton>}
      </Form>
    </>
  )

  return (
    <>
      {/*<CenteredColumn>
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

              <ButtonFields>
                <LoadingButton
                  loading={regSubmitting}
                  alsoDisabled={regErrors.email !== undefined || regErrors.password !== undefined || !arePasswordEqual}
                  buttonProps={{ type: 'submit', primary: true, large: true }}
                >
                  Send Verification Code
                </LoadingButton>
              </ButtonFields>
            </AuthForm>
            <GoogleLoginButton text={'Register via Google'} />
          </>
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
        <Link to={ROUTE_PATHS.login}>Login</Link>
      </FooterCard>
            </CenteredColumn>*/}
      <Container>
        <SectionInteractive></SectionInteractive>
        <SectionForm>
          {!registered ? (
            <>
              <Header state={'register'}>
                <Space></Space>
                <Message>
                  <h1>Create Account</h1>
                  <p>Welcome back! Please enter your details.</p>
                </Message>
              </Header>
              <Tabs style={animateTabContainer}>
                <TabLink to={ROUTE_PATHS.login} status={false}>
                  Login
                </TabLink>
                <TabLink to={ROUTE_PATHS.register} status={true}>
                  Register
                </TabLink>
              </Tabs>
              <Space></Space>
              <Form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} style={animateForm}>
                <FormGroup>
                  {regErrors.email && <Error message="Please enter a valid email!" handleBlur={handleBlur} />}
                  <Icon icon="ic:round-email" width={24} />
                  <Input
                    name="email"
                    type="email"
                    placeholder="Email"
                    {...registerForm.register('email', {
                      required: true,
                      pattern: EMAIL_REG
                    })}
                  />
                </FormGroup>
                <FormGroup>
                  <Icon icon="carbon:user-role" width={24} />
                  <Controller
                    control={registerForm.control}
                    render={({ field }) => (
                      // <StyledCreatatbleSelect
                      //   {...field}
                      //   isMulti
                      //   isCreatable
                      //   options={UserRoleValues}
                      //   closeMenuOnSelect={true}
                      //   closeMenuOnBlur={false}
                      //   components={StyledRolesSelectComponents}
                      //   placeholder="Ex. Developer, Designer"
                      // />
                      <Creatable
                        isCreatable
                        isMulti
                        options={UserRoleValues}
                        closeMenuOnSelect={true}
                        closeMenuOnBlur={false}
                        styles={customStyles}
                      />
                    )}
                    rules={{ required: true }}
                    name="roles"
                  />
                </FormGroup>
                <FormGroup>
                  {regErrors.password && <Error message="Please enter a valid password!" handleBlur={handleBlur} />}
                  <Icon icon="bxs:lock" width={24} />
                  <Input
                    type={show ? 'text' : 'password'}
                    name="password"
                    placeholder="Password"
                    {...registerForm.register('password', {
                      required: true,
                      pattern: PASSWORD
                    })}
                    onChange={(e) => {
                      setPassword(e.target.value)
                    }}
                  />
                  <Icon
                    icon={show ? 'bxs:hide' : 'bxs:show'}
                    width={24}
                    onClick={() => {
                      setShow(!show)
                    }}
                  />
                </FormGroup>
                <FormGroup>
                  {!arePasswordEqual ? <Error message="Passwords did not match!" handleBlur={handleBlur} /> : undefined}
                  <Icon icon="bxs:lock" width={24} />
                  <Input
                    type={showConfirm ? 'text' : 'password'}
                    placeholder="Confirm Password"
                    name="confirmpassword"
                    {...registerForm.register('confirmPassword', {
                      required: true,
                      pattern: PASSWORD
                    })}
                    onChange={(e) => {
                      if (e.target.value.toString() !== password) {
                        setArePasswordEqual(false)
                      } else {
                        setArePasswordEqual(true)
                      }
                    }}
                  />
                  <Icon
                    icon={showConfirm ? 'bxs:hide' : 'bxs:show'}
                    width={24}
                    onClick={() => {
                      setShowConfirm(!show)
                    }}
                  />
                </FormGroup>
                {regSubmitting ? <LoaderButton /> : <SubmitButton>Next</SubmitButton>}
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
            </>
          ) : (
            nextForm
          )}
        </SectionForm>
      </Container>
    </>
  )
}
