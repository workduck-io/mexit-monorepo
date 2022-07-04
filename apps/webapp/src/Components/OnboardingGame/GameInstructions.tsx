import {
  InstructionCardContainer,
  InstructionContainer,
  InstructionCard,
  InsCardHeader,
  InsCardBody
} from '../../Style/OnboardingGame'
import { useSpring } from 'react-spring'
import { MexIcon } from '@mexit/shared'
const GameInstructions = () => {
  const animateCards = useSpring({
    from: {
      marginBottom: '-10rem',
      opacity: 0
    },
    to: {
      marginBottom: '0rem',
      opacity: 1
    }
  })

  return (
    <InstructionContainer>
      <h1>CLICK START TO PLAY!</h1>
      <InstructionCardContainer>
        <InstructionCard style={animateCards}>
          <InsCardHeader>
            <MexIcon fontSize={100} margin="1rem 0.25rem 1rem 0" icon="fluent:keyboard-24-filled" />
            <MexIcon fontSize={75} margin="1rem 0.25rem 1rem 0" icon="bi:mouse-fill" />
          </InsCardHeader>
          <InsCardBody>
            <h3>All Hands On Deck!</h3>
            <p>Keep both your hands ready on the mouse and keyboard to ensure perfect start!</p>
          </InsCardBody>
        </InstructionCard>
        <InstructionCard style={animateCards}>
          <InsCardHeader>
            <MexIcon fontSize={100} margin="1rem 0.25rem 1rem 0" icon="fluent:cursor-click-20-filled" />
          </InsCardHeader>
          <InsCardBody>
            <h3>Look Out For The Keys!</h3>
            <p>Click on the circle using the mouse and press the key shown in the square on the keyboard</p>
          </InsCardBody>
        </InstructionCard>
        <InstructionCard style={animateCards}>
          <InsCardHeader>
            <MexIcon fontSize={100} margin="1rem 0.25rem 1rem 0" icon="bxs:timer" />
          </InsCardHeader>
          <InsCardBody>
            <h3>Be The Fastest!</h3>
            <p>The faster your reaction time is, the higher the score. Let's GO!</p>
          </InsCardBody>
        </InstructionCard>
      </InstructionCardContainer>
    </InstructionContainer>
  )
}

export default GameInstructions
