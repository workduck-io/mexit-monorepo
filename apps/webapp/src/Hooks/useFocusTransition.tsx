import { config, useTransition } from 'react-spring'
import { useLayoutStore } from '../Store/useLayoutStore'

export const useFocusTransition = () => {
  const focusMode = useLayoutStore((store) => store.focusMode)

  const transitions = useTransition(!focusMode, {
    from: {
      opacity: 0
      // width: '0%',
    },
    enter: {
      opacity: 1
      // width: '100%',
    },
    leave: {
      opacity: 0
      // width: '0%',
    },
    reverse: !focusMode,
    delay: 0,
    config: config.slow,
    onStart: ({ value }) => {
      // if (sidebarVisible) setSidebarWidth(0)
      // else setSidebarWidth(300)
    },
    onRest: ({ value }) => {
      // if (!sidebarVisible) setSidebarWidth(0)
    }
  })

  return { transitions }
}
