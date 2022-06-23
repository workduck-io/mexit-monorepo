import { InfobarMode, useLayoutStore } from '../Stores/useLayoutStore'

const useToggleElements = () => {
  const setInfobarMode = useLayoutStore((store) => store.setInfobarMode)

  const toggleMode = (mode: InfobarMode) => {
    const infobar = useLayoutStore.getState().infobar
    if (infobar.mode === mode) {
      setInfobarMode('default')
    } else {
      setInfobarMode(mode)
    }
  }

  const toggleGraph = () => {
    toggleMode('graph')
  }

  const toggleReminder = () => {
    toggleMode('reminders')
  }

  return {
    toggleGraph,
    toggleReminder
  }
}

export default useToggleElements
