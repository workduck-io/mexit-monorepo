import { DefaultMIcons } from '@mexit/shared'

import { SuperBlockProps } from '../SuperBlock.types'
import SuperBlockTitle from '../SuperBlockTitle'
import { SuperBlock } from '..'

const SmartCaptureSuperBlock: React.FC<SuperBlockProps> = (props) => {
  const { children, ...restProps } = props

  return (
    <SuperBlock
      {...restProps}
      $isActive={props.isActive}
      $isSelected={props.isSelected}
      LeftHeaderRenderer={() => {
        return <SuperBlockTitle heading="Smart Capture" value={props.value} icon={DefaultMIcons.EDIT} />
      }}
    >
      {children}
    </SuperBlock>
  )
}

export default SmartCaptureSuperBlock
