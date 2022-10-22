import React, { useEffect, useState } from 'react'

import { CenterSpace, Description, Heading } from '@mexit/shared'
import { InputBlock } from '@mexit/shared'

import useChangeShortcutListener from '../Hooks/useChangeShortcutListener'
import { useShortcutStore } from '../Hooks/useShortcutStore'

const InputShortcut = () => {
  const keybinding = useShortcutStore((state) => state.keybinding)
  const [value, setValue] = useState('')

  const currentShortcut = useShortcutStore((state) => state.currentShortcut)
  const resetStore = useShortcutStore((state) => state.resetStore)

  useChangeShortcutListener()

  useEffect(() => {
    return () => resetStore()
  }, [resetStore])

  useEffect(() => {
    if (keybinding) {
      setValue(keybinding.alias.trim())
    }
  }, [keybinding])

  return (
    <CenterSpace>
      <Heading>Enter new shortcut for {currentShortcut.title} </Heading>
      <InputBlock center autoFocus defaultValue={value} />
      <br />
      <Description>
        Press <strong>Esc</strong> to reset or hit <strong>Enter</strong> to save
      </Description>
    </CenterSpace>
  )
}

export default InputShortcut
