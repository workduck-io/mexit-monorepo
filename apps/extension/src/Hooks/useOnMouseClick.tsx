import React, { useCallback, useMemo, useRef } from 'react'

/**
 * Alternative to onClick: on mouse down/up on the same target
 */
export const useOnMouseClick = (cb: () => void) => {
  const isMouseDownRef = useRef(false)

  const onMouseDown = useCallback((e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault()
    isMouseDownRef.current = true
  }, [])

  const onMouseUp = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      e.preventDefault()
      if (isMouseDownRef.current) {
        cb()
        isMouseDownRef.current = false
      }
    },
    [cb]
  )

  return useMemo(
    () => ({
      onMouseDown,
      onMouseUp,
    }),
    [onMouseDown, onMouseUp]
  )
}
