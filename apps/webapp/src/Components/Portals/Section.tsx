// import { Services, Title } from '@style/Integration'
import { IntegrationTitle,Services } from '@mexit/shared'
import React from 'react'

import ActionGroup from './ActionGroup'

type SectionProps<T> = {
  items: Array<T>
  title: string
  onClick: (item: T) => void
}

const Section = <T,>({ items, title, onClick }: SectionProps<T>) => {
  return (
    <>
      <IntegrationTitle>{title}</IntegrationTitle>
      <Services>
        {items.map((item, index) => (
          <ActionGroup key={index} group={item} onClick={() => onClick(item)} />
        ))}
      </Services>
    </>
  )
}

export default Section
