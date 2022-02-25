import React from 'react'

function usePointerMovedSinceMount() {
  const [moved, setMoved] = React.useState(false)

  React.useEffect(() => {
    function handler() {
      setMoved(true)
    }

    if (!moved) {
      window.addEventListener('pointermove', handler)
      return () => window.removeEventListener('pointermove', handler)
    }
  }, [moved])

  return moved
}

export default usePointerMovedSinceMount
