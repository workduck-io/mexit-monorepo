import React from 'react'
import Tippy, { TippyProps } from '@tippyjs/react'
import informationLine from '@iconify/icons-ri/information-line'
import { Icon } from '@iconify/react'
import { InfoboxButton, InfoboxTip } from '../../Style/Infobox'

export interface InfoboxProps {
  icon?: string
  text: React.ReactNode
}

export const InfoboxTooltip = (props: TippyProps) => {
  return <Tippy theme="help-text" moveTransition="transform 0.25s ease-out" placement="auto" {...props} />
}

const Infobox = ({ icon, text }: InfoboxProps) => {
  return (
    <InfoboxTooltip content={<InfoboxTip>{text}</InfoboxTip>}>
      <InfoboxButton>
        <Icon icon={icon || informationLine} />
      </InfoboxButton>
    </InfoboxTooltip>
  )
}

export default Infobox
