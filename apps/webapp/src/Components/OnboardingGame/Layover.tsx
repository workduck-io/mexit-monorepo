import { useTransition } from 'react-spring'
import { LayoverBackground } from '../../Style/OnboardingGame'
import { LayoverProps } from '../../Types/Game'

const Layover = (props: LayoverProps) => {
  const animateModal = useTransition(props.active, {
    from: {
      opacity: 0
    },
    enter: {
      opacity: 1
    },
    leave: { opacity: 0 },
    config: { duration: 500 }
  })

  return (
    <>
      {animateModal(
        (styles: any, item: any) =>
          item && (
            <LayoverBackground style={styles} onClick={props.cb}>
              {props.children}
            </LayoverBackground>
          )
      )}
    </>
  )
}

export default Layover
