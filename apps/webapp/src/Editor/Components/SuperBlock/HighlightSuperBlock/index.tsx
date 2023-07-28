import { DefaultMIcons } from '@mexit/shared'

import { SuperBlockProps } from '../SuperBlock.types'
import SuperBlockTitle from '../SuperBlockTitle'
import { SuperBlock } from '..'

const HighlightSuperBlock: React.FC<SuperBlockProps> = (props) => {
  const { children, ...restProps } = props

  return (
    <SuperBlock
      {...restProps}
      $isActive={restProps.isActive}
      $isSelected={restProps.isSelected}
      $isReadOnly={props.isReadOnly}
      LeftHeaderRenderer={
        <SuperBlockTitle
          id={restProps.id}
          parent={restProps.parent}
          type={restProps.type}
          onChange={restProps.onChange}
          heading="Capture"
          value={restProps.value}
          icon={DefaultMIcons.HIGHLIGHT}
          isReadOnly={props.isReadOnly}
        />
      }
    >
      {children}
    </SuperBlock>
  )
}

export default HighlightSuperBlock
