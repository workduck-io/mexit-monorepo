import { FocusMode , useLayoutStore } from '@mexit/core'

const useLayout = () => {
  const toggleFocusModeBool = useLayoutStore((store) => store.toggleFocusMode)
  const setFocusMode = useLayoutStore((store) => store.setFocusMode)
  const showRHSidebar = useLayoutStore((store) => store.showRHSidebar)
  const hideRHSidebar = useLayoutStore((store) => store.hideRHSidebar)
  // const showShareOptions = useLayoutStore((store) => store.showShareOptions)
  // const toggleShareOptions = useLayoutStore((store) => store.toggleShareOptions)

  const showSidebar = useLayoutStore((store) => store.showSidebar)

  const toggleFocusMode = () => {
    if (useLayoutStore.getState().focusMode) {
      toggleFocusModeBool()
      showRHSidebar()
      // if (showShareOptions) toggleShareOptions()
    } else {
      toggleFocusModeBool()
      hideRHSidebar()
    }
  }

  const setFocusHover = (focusMode: FocusMode) => {
    setFocusMode(focusMode)
    if (focusMode.on) {
      showRHSidebar()
    } else {
      hideRHSidebar()
    }
  }

  const getFocusProps = (focusMode: FocusMode) => {
    return {
      onMouseEnter: () => {
        if (focusMode.on) setFocusHover({ on: true, hover: true })
      },
      onMouseLeave: () => {
        if (focusMode.on) setFocusHover({ on: true, hover: false })
      },
      $focusMode: focusMode.on,
      $focusHover: focusMode.hover
    }
  }
  return { toggleFocusMode, setFocusHover, getFocusProps }
}

export default useLayout
