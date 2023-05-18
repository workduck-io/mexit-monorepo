import React from 'react'

import { Group } from '../Style/Layouts'
import { CheckBox } from '../Style/ToggleButton'
import { TextElement } from '../Style/Typography'

export const Toggle: React.FC<{
  text: string
  defaultChecked?: boolean
  size?: 'small' | 'medium' | 'large'
  onChange: (checked: boolean) => void
}> = ({ text, defaultChecked = false, size = 'medium', onChange }) => {
  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.checked)
  }

  return (
    <Group>
      <CheckBox type="checkbox" defaultChecked={defaultChecked} onChange={handleOnChange} />
      <TextElement size={size}>{text}</TextElement>
    </Group>
  )
}
