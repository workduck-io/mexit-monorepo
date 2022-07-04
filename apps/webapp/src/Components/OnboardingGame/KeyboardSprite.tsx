import { KeySprite } from '../../Style/OnboardingSprites'
import { useSpring } from 'react-spring'
import { useEffect } from 'react'
import { KeySpriteProps } from '../../Types/Game'

const KeyboardSprite = (props: KeySpriteProps) => {
  const [transition, set] = useSpring(() => ({ opacity: 0 }))

  useEffect(() => {
    set({
      opacity: 1,
      from: {
        opacity: 0
      }
    })
  }, [set, props.x, props.y])

  return (
    <KeySprite x={props.x} y={props.y} style={transition}>
      {props.letter}
    </KeySprite>
  )
}

export default KeyboardSprite
