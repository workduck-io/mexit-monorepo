import React from 'react'

import { Input, ShareLabel, ShareSlider } from '../Style/ToggleButton'

type ShareButtonProps = {
  value?: any
  onChange?: () => void
  id?: string
  checked: boolean
  size?: string
  disabled?: boolean
  title?: string
}

export const ShareToggle: React.FC<ShareButtonProps> = ({ value, title, size, disabled, onChange, id, checked }) => {
  return (
    <ShareLabel htmlFor={id} disabled={disabled} title={title} size={size}>
      <Input id={id} type="checkbox" value={value} checked={checked} onChange={onChange} />
      <ShareSlider checked={checked} />
    </ShareLabel>
  )
}
