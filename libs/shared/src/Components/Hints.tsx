import React, { FC, useState } from 'react'

import { useTheme } from 'styled-components'

import { useInterval } from '../Hooks/useRelativeTime'
import { Group } from '../Style/Layouts'
import { Description } from '../Style/Typography'
import { randomNumberBetween } from '../Utils/helpers'

export type HintsType = {
  hints: Array<string>
  show?: boolean
}

export const Hints: FC<HintsType> = ({ hints, show }) => {
  const [index, setIndex] = useState(randomNumberBetween(0, hints.length - 1))

  useInterval(() => setIndex((index + 1) % hints.length), show ? 7000 : null)
  const theme = useTheme()

  return (
    <Group>
      {/* <Description color={theme.tokens.text.fade}>Hint:&ensp;</Description> */}
      <Description color={theme.tokens.text.fade}>{hints[index]}</Description>
    </Group>
  )
}
