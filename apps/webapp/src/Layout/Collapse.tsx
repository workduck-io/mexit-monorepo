import arrowRightSLine from '@iconify/icons-ri/arrow-right-s-line'
import { Icon, IconifyIcon } from '@iconify/react'
import React, { useMemo } from 'react'
import { useSpring } from 'react-spring'
import styled from 'styled-components'
import Infobox, { InfoboxProps } from '../Components/Infobox'
import { CollapseContent, CollapseHeader, CollapseToggle, CollapseWrapper } from '../Style/Collapse'

interface CollapseProps {
  oid?: string
  defaultOpen?: boolean
  title: string
  maximumHeight?: string
  icon?: string | IconifyIcon
  children?: React.ReactNode
  infoProps?: InfoboxProps
  stopPropagation?: boolean
}

export const CollapsableHeaderTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: bolder;
`

const Collapse = ({
  defaultOpen,
  maximumHeight,
  icon,
  infoProps,
  children,
  oid,
  title,
  stopPropagation
}: CollapseProps) => {
  const [hide, setHide] = React.useState(!defaultOpen ?? true)

  const springProps = useMemo(() => {
    const style = { maxHeight: '0vh' }

    if (!hide) {
      style.maxHeight = maximumHeight ?? '100vh'
    } else {
      style.maxHeight = '0vh'
    }

    return style
  }, [hide])

  const animationProps = useSpring(springProps)

  return (
    <CollapseWrapper id={`Collapse_${oid}`} onMouseUp={(e) => stopPropagation && e.stopPropagation()}>
      <CollapseHeader collapsed={hide}>
        <CollapseToggle
          onClick={() => {
            setHide((b) => !b)
          }}
        >
          <Icon icon={hide ? arrowRightSLine : icon} />
        </CollapseToggle>
        <CollapsableHeaderTitle
          onClick={() => {
            setHide((b) => !b)
          }}
        >
          {title}
        </CollapsableHeaderTitle>
        {infoProps && <Infobox {...infoProps} />}
      </CollapseHeader>

      <CollapseContent style={animationProps}>{children}</CollapseContent>
    </CollapseWrapper>
  )
}

export default Collapse
