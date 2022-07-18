import React, { useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'
import { useAuth } from '@workduck-io/dwindle'
import Cookies from 'universal-cookie'
import { useSpring } from 'react-spring'
import { useTheme } from 'styled-components'

import { RegisterFormData, VerifyFormData, UserRoleValues } from '@mexit/core'
import { useAuthStore } from '../Stores/useAuth'
import { useAuthentication } from '../Stores/useAuth'
import { useInitializeAfterAuth } from '../Stores/useAuth'
import { EMAIL_REG, PASSWORD } from '../Utils/constants'
import { GoogleLoginButton } from '../Components/Buttons/Buttons'
import Analytics from '../Utils/analytics'
import { ROUTE_PATHS } from '../Hooks/useRouting'
import PasswordChecker from '../Components/PasswordChecker'
import {
  Container,
  Header,
  Message,
  SectionForm,
  SectionInteractive,
  InteractiveContentWrapper,
  Space,
  Tabs,
  TabLink,
  SignInOptions,
  OptionHeader,
  Line,
  AuthIcon,
  InteractiveHeader,
  SubContent,
  ImageContainer,
  ImageWrapper,
  Image
} from '../Style/AuthFlow'
import { Form, FormGroup, Input, SubmitButton } from '../Style/Form'
import LoaderButton from '../Components/Buttons/LoaderButton'
import Error from '../Components/Buttons/Errors'
import Creatable from 'react-select/creatable'

import male_1 from '../Assets/images/Male.png'
import male_2 from '../Assets/images/Male_1.png'
import female_1 from '../Assets/images/Female.png'
import female_2 from '../Assets/images/Female_1.png'

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

  const theme = useTheme()

  const [show, setShow] = useState<boolean>(false)
  const [showConfirm, setShowConfirm] = useState<boolean>(false)
  const [email, setEmail] = useState<string>('')
  const [verify, setVerify] = useState<boolean>(false)

  const [statusEmail, setStatusEmail] = useState<string>('rest')
  const [statusPass, setStatusPass] = useState<string>('rest')
  const [statusConfirm, setStatusConfirm] = useState<string>('rest')
  const [statusSelect, setStatusSelect] = useState<string>('rest')
  const [statusCode, setStatusCode] = useState<string>('rest')
  const [showStrength, setShowStrength] = useState<boolean>(false)

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

  const animateForm = useSpring({
    from: {
      opacity: 0
    },
    to: {
      opacity: 1
    },
    config: {
      duration: 250
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
      width: '100%',
      border: 'none'
    }),
    control: (provided) => ({
      display: 'flex',
      gap: '10px',
      maxHeight: '25px',
      fontSize: '14px',
      outline: 'none',
      width: '100%',
      color: '#B1B1B1',
      backgroundColor: `${theme.colors.gray[8]}`,
      border: 'none',
      marginLeft: '-0.65rem'
    }),
    menu: (provided) => ({
      ...provided,
      marginLeft: '-1.75rem',
      backgroundColor: `${theme.colors.gray[8]}`,
      width: '110%'
    }),
    option: (provided) => ({
      ...provided,
      color: `${theme.colors.primary}`
    }),
    indicatorSeparator: (provided) => ({
      display: 'none'
    }),
    indicatorsContainer: (provided) => ({
      ...provided,
      alignSelf: 'center',
      marginRight: '-1.25rem',
      color: '#5E6271'
    }),
    valueContainer: (provided) => ({
      ...provided,
      marginTop: '-0.05rem',
      backgroundColor: `${theme.colors.gray[8]}`,
      color: '#B1B1B1'
    }),
    placeholder: (provided) => ({
      color: '#5E6271',
      marginLeft: '0.25rem'
    })
  }

  const nextForm = !verify ? (
    <>
      <Space></Space>
      <Space></Space>
      <Message>
        <h1>Secure Your Account</h1>
      </Message>
      <Form>
        <FormGroup
          status={statusEmail}
          tabIndex={-1}
          onFocus={() => {
            setStatusEmail('focus')
            if (registerForm.formState.errors.email) {
              setStatusEmail('error')
            }
          }}
          onBlur={() => {
            setStatusEmail('rest')
            registerForm.clearErrors()
          }}
        >
          <AuthIcon icon="ic:baseline-alternate-email" width={18} />
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
        {regErrors.email && <Error message="Please enter a valid email!" />}
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
          <AuthIcon icon="bx:lock" width={18} />
          <Input
            placeholder="Enter the 6-Character code"
            name="code"
            {...verifyForm.register('code', {
              required: true
            })}
          />
        </FormGroup>
        {verErrors.code?.type === 'required' ? <Error message="Please enter the verification code!" /> : undefined}
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
  )

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
          <ImageContainer>
            <ImageWrapper>
              <Image src={male_1} alt="male-1" />
            </ImageWrapper>
            <ImageWrapper>
              <Image src={male_2} alt="male-2" />
            </ImageWrapper>
            <ImageWrapper>
              <Image src={female_1} alt="female-1" />
            </ImageWrapper>
            <ImageWrapper>
              <Image src={female_2} alt="female-2" />
            </ImageWrapper>
          </ImageContainer>
          <p>3k+ founders and Product Managers joined us, now it’s your turn</p>
        </SubContent>
      </SectionInteractive>
      <SectionForm>
        {!registered ? (
          <>
            <Header state={'register'}>
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

            <Form onSubmit={registerForm.handleSubmit(onRegisterSubmit)}>
              <FormGroup
                status={statusEmail}
                tabIndex={0}
                onFocus={() => {
                  setStatusEmail('focus')
                  if (regErrors.email) {
                    setStatusEmail('error')
                  }
                }}
                onBlur={() => {
                  setStatusEmail('rest')
                  registerForm.clearErrors()
                }}
              >
                <AuthIcon icon="ic:baseline-alternate-email" width={16} />
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
              {regErrors.email && <Error message="Please enter a valid email!" />}
              <FormGroup
                status={statusSelect}
                tabIndex={1}
                onFocus={() => {
                  setStatusSelect('focus')
                }}
                onBlur={() => {
                  setStatusSelect('rest')
                }}
              >
                <AuthIcon icon="system-uicons:user-male" width={18} />
                <Controller
                  control={registerForm.control}
                  render={({ field }) => (
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
              <FormGroup
                style={animateForm}
                status={statusPass}
                tabIndex={2}
                onFocus={() => {
                  setStatusPass('focus')
                  setShowStrength(true)
                  if (registerForm.formState.errors.password) {
                    setStatusPass('error')
                  }
                }}
                onBlur={() => {
                  setStatusPass('rest')
                  setShowStrength(false)
                  registerForm.clearErrors()
                }}
              >
                <AuthIcon icon="bx:lock" width={18} />
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
                <AuthIcon
                  icon={show ? 'bxs:hide' : 'bxs:show'}
                  width={18}
                  onClick={() => {
                    setShow(!show)
                  }}
                />
              </FormGroup>
              <PasswordChecker password={password} show={showStrength} />
              {registerForm.formState.errors.password && <Error message="Please enter a valid password!" />}
              <FormGroup
                style={animateForm}
                status={statusConfirm}
                tabIndex={3}
                onFocus={() => {
                  setStatusConfirm('foucs')
                }}
                onBlur={() => {
                  setStatusConfirm('rest')
                  setArePasswordEqual(true)
                  registerForm.clearErrors()
                }}
              >
                <AuthIcon icon="bx:lock" width={18} />
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
                      setStatusConfirm('error')
                    } else {
                      setArePasswordEqual(true)
                    }
                  }}
                />
                <AuthIcon
                  icon={showConfirm ? 'bxs:hide' : 'bxs:show'}
                  width={18}
                  onClick={() => {
                    setShowConfirm(!show)
                  }}
                />
              </FormGroup>
              {!arePasswordEqual ? <Error message="Passwords did not match!" /> : undefined}
              {regSubmitting ? <LoaderButton /> : <SubmitButton>Next</SubmitButton>}
            </Form>
            <SignInOptions>
              <OptionHeader>
                <Line></Line>
                <p>or sign in with</p>
                <Line></Line>
              </OptionHeader>
              <GoogleLoginButton text={'Google'} />
            </SignInOptions>
          </>
        ) : (
          nextForm
        )}
      </SectionForm>
    </Container>
  )
}
