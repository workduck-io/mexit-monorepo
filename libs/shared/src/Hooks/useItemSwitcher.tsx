import { useCallback, useEffect, useState } from 'react'

type Item = {
  id: string
}

type SwitchItemCallback<T extends Item> = (item: T) => void

export const useItemSwitcher = <T extends Item>(items: T[], onSwitchItem: SwitchItemCallback<T>) => {
  const [isLongPress, setIsLongPress] = useState(false)
  let longPressTimeout: NodeJS.Timeout

  const switchItem = useCallback(
    (item: T) => {
      onSwitchItem(item)
    },
    [onSwitchItem]
  )

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.altKey) {
        longPressTimeout = setTimeout(() => {
          setIsLongPress(true)
        }, 700)
      }
    }

    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.altKey) {
        clearTimeout(longPressTimeout)

        if (isLongPress) {
          const charCode = event.which || event.keyCode
          const pressedKey = Number(String.fromCharCode(charCode))

          if (!isNaN(pressedKey) && pressedKey >= 1 && pressedKey <= items.length) {
            const item = items[pressedKey - 1]
            switchItem(item)
          }
        }
      } else {
        setIsLongPress(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    document.addEventListener('keyup', handleKeyUp)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('keyup', handleKeyUp)
    }
  }, [isLongPress, items, switchItem])

  return {
    isLongPress
  }
}
