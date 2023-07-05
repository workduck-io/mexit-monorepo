import { DefaultMIcons } from '@mexit/shared'

import { SuperBlock } from '../'

import { SuperBlockProps } from './../SuperBlock.types'
import SuperBlockTitle from './../SuperBlockTitle'

const ContentSuperBlock: React.FC<SuperBlockProps> = (props) => {
  const { children, ...restProps } = props

  return (
    <SuperBlock
      {...restProps}
      $isActive={props.isActive}
      $isSelected={props.isSelected}
      LeftHeaderRenderer={() => (
        <SuperBlockTitle onChange={props.onChange} icon={DefaultMIcons.NOTE} heading="Content" value={props.value} />
      )}
    >
      {children}
    </SuperBlock>
  )
}

export default ContentSuperBlock
