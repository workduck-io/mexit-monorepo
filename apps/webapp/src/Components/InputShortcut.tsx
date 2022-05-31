import React, { useEffect, useState } from 'react'
import { CenterSpace, Description, Heading } from '@mexit/shared'

import useShortcutListener from '../Hooks/useShortcutListener'
import { useShortcutStore } from '../Hooks/useShortcutStore'
import { InputBlock } from '../Style/Form'

const InputShortcut = () => {
  const keybinding = useShortcutStore((state) => state.keybinding)
  const [value, setValue] = useState('')

  const currentShortcut = useShortcutStore((state) => state.currentShortcut)
  const resetStore = useShortcutStore((state) => state.resetStore)

  useShortcutListener()

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
      <InputBlock center autoFocus value={value} />
      <br />
      <Description>
        Press <strong>Esc</strong> to reset or hit <strong>Enter</strong> to save
      </Description>
    </CenterSpace>
  )
}

export default InputShortcut
