import Tippy, { TippyProps } from '@tippyjs/react'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'

import { useRelativeTime } from '../Hooks/useRelativeTime'

interface RelativeTimeProps {
  dateNum: number
  tippy?: boolean
  tippyProps?: TippyProps
  refreshMs?: number
}

export const Relative = styled.div``

export const RelativeTime = ({ dateNum, tippy = true, tippyProps, refreshMs }: RelativeTimeProps) => {
  const [date, setDate] = useState(new Date(dateNum))
  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  } as const

  useEffect(() => {
    const d = new Date(dateNum)
    setDate(d)
  }, [dateNum])

  const relTime = useRelativeTime(date, refreshMs)
  const localDateString = date.toLocaleString('en-US', options)

  if (tippy)
    return (
      <Tippy
        delay={100}
        interactiveDebounce={100}
        placement="bottom"
        appendTo={() => document.body}
        theme="mex"
        content={localDateString}
        {...tippyProps}
      >
        <Relative>{relTime}</Relative>
      </Tippy>
    )

  return <>{relTime}</>
}
