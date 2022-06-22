import { toLocaleString } from "@mexit/core"
import Tippy, { TippyProps } from '@tippyjs/react'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'

import { useRelativeTime } from '../Hooks/useRelativeTime'

interface RelativeTimeProps {
  dateNum: number
  tippy?: boolean
  tippyProps?: TippyProps
  refreshMs?: number
  prefix?: string
}

export const Relative = styled.div``

export const RelativeTime = ({ dateNum, prefix, tippy = true, tippyProps, refreshMs }: RelativeTimeProps) => {
  const [date, setDate] = useState(new Date(dateNum))

  useEffect(() => {
    const d = new Date(dateNum)
    setDate(d)
  }, [dateNum])

  const relTime = useRelativeTime(date, refreshMs)
  const localDateString = toLocaleString(date)

  const tooltip = prefix ? `${prefix}: ${relTime}` : localDateString

  if (tippy)
    return (
      <Tippy
        delay={100}
        interactiveDebounce={100}
        placement="bottom"
        appendTo={() => document.body}
        theme="mex"
        content={tooltip}
        {...tippyProps}
      >
        <Relative>{relTime}</Relative>
      </Tippy>
    )

  return <>{relTime}</>
}
