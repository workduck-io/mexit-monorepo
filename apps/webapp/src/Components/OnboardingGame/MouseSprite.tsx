import { CircleSprite } from '../../Style/OnboardingSprites'
import { useSpring } from 'react-spring'
import { useEffect, useState } from 'react'
import { MouseSpriteProps } from '../../Types/Game'
import { animated } from 'react-spring'

const MouseSprite = (props: MouseSpriteProps) => {
  const [transition, set] = useSpring(() => ({ opacity: 0 }))
  const [hover, setHover] = useState<boolean>(false)

  const animateHover = useSpring({
    width: hover ? '60' : '45',
    height: hover ? '60' : '45',
    config: {
      duration: 100
    }
  })

  useEffect(() => {
    set({
      opacity: 1,
      from: {
        opacity: 0
      }
    })
  }, [set, props.y, props.x])

  return (
    <CircleSprite
      onClick={props.clickHandler}
      x={props.x}
      y={props.y}
      style={transition}
      onMouseEnter={() => {
        setHover(true)
      }}
      onMouseLeave={() => {
        setHover(false)
      }}
    >
      <animated.svg
        width="45"
        height="45"
        fill="currentColor"
        className="bi bi-mouse-fill"
        viewBox="0 0 16 16"
        style={animateHover}
      >
        <path d="M3 5a5 5 0 0 1 10 0v6a5 5 0 0 1-10 0V5zm5.5-1.5a.5.5 0 0 0-1 0v2a.5.5 0 0 0 1 0v-2z" />
      </animated.svg>
    </CircleSprite>
  )
}

export default MouseSprite
