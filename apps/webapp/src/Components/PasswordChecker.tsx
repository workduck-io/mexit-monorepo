import { useState, useEffect } from 'react'
import {
  MeterContainer,
  PasswordRequirements,
  Meter,
  MeterWrapper,
  MeterInfo,
  RequirementWrapper,
  Requirement,
  RequirementIcon
} from '../Style/PasswordChecker'

interface CheckerProps {
  password: string
  show: boolean
}

const PasswordChecker = ({ password, show }: CheckerProps) => {
  const [status, setStatus] = useState<string>('Weak')
  const [count, setCount] = useState<number>(0)
  const [color, setColor] = useState<string>('')

  const [conditions, setConditions] = useState({
    length: {
      status: false,
      message: '6 Characters'
    },
    lower: {
      status: false,
      message: 'Lowercase'
    },
    upper: {
      status: false,
      message: 'Uppercase'
    },
    special: {
      status: false,
      message: 'Special'
    },
    number: {
      status: false,
      message: 'Number'
    }
  })

  const Map = [
    {
      key: 1,
      color: '#E0E0E0'
    },
    {
      key: 2,
      color: '#E0E0E0'
    },
    {
      key: 3,
      color: '#E0E0E0'
    },
    {
      key: 4,
      color: '#E0E0E0'
    }
  ]

  const lengthRegex = /^.{5,}$/
  const upperRegex = /[A-Z]/
  const lowerRegex = /[a-z]/
  const specialRegex = /[`!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~]/
  const numberRegex = /\d/

  const checkRequirements = () => {
    if (lengthRegex.test(password)) {
      conditions['length'].status = true
    }
    if (upperRegex.test(password)) {
      conditions['upper'].status = true
    }
    if (lowerRegex.test(password)) {
      conditions['lower'].status = true
    }
    if (numberRegex.test(password)) {
      conditions['number'].status = true
    }
    if (specialRegex.test(password)) {
      conditions['special'].status = true
    }
  }

  useEffect(() => {
    if (typeof password !== undefined) {
      checkRequirements()
      if (
        (lengthRegex.test(password) && upperRegex.test(password)) ||
        (lengthRegex.test(password) && numberRegex.test(password)) ||
        (lowerRegex.test(password) && upperRegex.test(password)) ||
        (numberRegex.test(password) && upperRegex.test(password))
      ) {
        setStatus('Weak')
        setCount(1)
        setColor('#FF1744')
      }
      if (
        (lengthRegex.test(password) && upperRegex.test(password) && lowerRegex.test(password)) ||
        (lengthRegex.test(password) && upperRegex.test(password) && numberRegex.test(password)) ||
        (lengthRegex.test(password) && specialRegex.test(password) && lowerRegex.test(password))
      ) {
        setStatus('Medium')
        setCount(2)
        setColor('#FF1744')
      }
      if (
        lengthRegex.test(password) &&
        upperRegex.test(password) &&
        numberRegex.test(password) &&
        lowerRegex.test(password)
      ) {
        setStatus('Good')
        setCount(3)
        setColor('#e76f51')
      }
      if (
        lengthRegex.test(password) &&
        upperRegex.test(password) &&
        numberRegex.test(password) &&
        lowerRegex.test(password) &&
        specialRegex.test(password)
      ) {
        setStatus('Strong')
        setCount(4)
        setColor('#2b9348')
      }
    }
    return () => {
      setStatus('Weak')
      setCount(1)
      setColor('#FF1744')
      // Object.entries(conditions).forEach((condition) => {
      //   condition[1].status = false
      // })
      if (!lengthRegex.test(password)) {
        conditions['length'].status = false
      }
      if (!upperRegex.test(password)) {
        conditions['upper'].status = false
      }
      if (!lowerRegex.test(password)) {
        conditions['lower'].status = false
      }
      if (!numberRegex.test(password)) {
        conditions['number'].status = false
      }
      if (!specialRegex.test(password)) {
        conditions['special'].status = false
      }
    }
  }, [password, Map, conditions])

  return (
    <>
      {show ? (
        <MeterContainer>
          <MeterWrapper>
            {Map.map((meter) => {
              let colorMeter = '#E0E0E0'
              if (meter.key <= count) {
                colorMeter = color
              }
              return <Meter color={colorMeter}></Meter>
            })}
          </MeterWrapper>
          <MeterInfo color={color}>
            <p>{status}</p>
          </MeterInfo>
        </MeterContainer>
      ) : undefined}
      {show ? (
        <PasswordRequirements>
          <RequirementWrapper>
            {Object.entries(conditions).map((condition) => {
              return (
                <Requirement>
                  <RequirementIcon
                    icon={condition[1].status ? 'charm:tick' : 'akar-icons:cross'}
                    status={condition[1].status}
                    width={10}
                  />
                  <p>{condition[1].message}</p>
                </Requirement>
              )
            })}
          </RequirementWrapper>
        </PasswordRequirements>
      ) : undefined}
    </>
  )
}

export default PasswordChecker
