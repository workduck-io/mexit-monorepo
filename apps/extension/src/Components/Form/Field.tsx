import React from 'react'

import { TextFieldHeight } from '@mexit/shared'

import { StyledTextAreaBlock } from './styled'
import { ELEMENT_H2,ELEMENT_PARAGRAPH } from '@udecode/plate'

const Field = ({ item, register }: { item: any; register: any }) => {
  switch (item.properties.type) {
    case ELEMENT_H2:
    case ELEMENT_PARAGRAPH:
      return (
        <StyledTextAreaBlock
          height={TextFieldHeight.MEDIUM}
          {...register(item.label, item.properties)}
          defaultValue={item.value}
        />
      )

    default:
      return (
        <StyledTextAreaBlock
          height={TextFieldHeight.MEDIUM}
          {...register(item.label, item.properties)}
          defaultValue={item.value}
        />
      )
  }
}

export default Field
