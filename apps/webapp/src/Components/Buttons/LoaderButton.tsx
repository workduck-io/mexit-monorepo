import { LoadButton } from '../../Style/Form'
import { useSpring } from 'react-spring'
const LoaderButton = () => {
  const animateLoader = useSpring({
    from: {
      opacity: 0,
      marginLeft: '-10rem'
    },
    to: {
      opacity: 1,
      marginLeft: '0rem'
    }
  })

  return <LoadButton style={animateLoader}>Loading</LoadButton>
}

export default LoaderButton
