import { DefaultMIcons } from '@mexit/shared'

import { SuperBlockProps } from '../SuperBlock.types'
import SuperBlockTitle from '../SuperBlockTitle'
import { SuperBlock } from '..'

const HighlightSuperBlock: React.FC<SuperBlockProps> = (props) => {
  const { children, ...restProps } = props

  return (
    <SuperBlock
      {...restProps}
      $isActive={false}
      $isSelected
      LeftHeaderRenderer={() => {
        return <SuperBlockTitle heading="Capture" value={props.value} icon={DefaultMIcons.HIGHLIGHT} />
      }}
    >
      {children}
    </SuperBlock>
  )
}

export default HighlightSuperBlock
