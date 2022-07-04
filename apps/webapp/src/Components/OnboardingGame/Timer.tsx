import { Dispatch, SetStateAction, useEffect } from 'react'
import { TimeText, TimeContainer } from '../../Style/OnboardingGame'
import { useSpring } from 'react-spring'

interface TimerProps {
  active: boolean
  time: number
  setTime: Dispatch<SetStateAction<any>>
}

const Timer = (props: TimerProps) => {
  useEffect(() => {
    let interval: any
    if (!props.active) {
      props.setTime(0)
    }
    if (props.active) {
      interval = setInterval(() => {
        props.setTime((time: number) => time + 1)
      }, 10)
    } else {
      clearInterval(interval)
    }
    return () => clearInterval(interval)
  }, [props.active])

  const animateTime = useSpring({
    from: {
      marginTop: '-5rem'
    },
    to: {
      marginTop: '0rem'
    }
  })

  const ms = props.time / 1000

  return (
    <TimeContainer style={animateTime}>
      <TimeText>{ms}</TimeText>
    </TimeContainer>
  )
}

export default Timer
