// import { Services, Title } from '@style/Integration'
import React from 'react'
import { Services, Title } from '../../Style/Integrations'
import ActionGroup from './ActionGroup'

type SectionProps<T> = {
  items: Array<T>
  title: string
  onClick: (item: T) => void
}

const Section = <T,>({ items, title, onClick }: SectionProps<T>) => {
  return (
    <>
      <Title>{title}</Title>
      <Services>
        {items.map((item, index) => (
          <ActionGroup key={index} group={item} onClick={() => onClick(item)} />
        ))}
      </Services>
    </>
  )
}

export default Section
