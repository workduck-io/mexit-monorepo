import arrowRightSLine from '@iconify/icons-ri/arrow-right-s-line'
import { Icon, IconifyIcon } from '@iconify/react'
import React, { useMemo } from 'react'
import { useSpring } from 'react-spring'
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
}

const Collapse = ({ defaultOpen, maximumHeight, icon, infoProps, children, oid, title }: CollapseProps) => {
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
    <CollapseWrapper id={`Collapse_${oid}`}>
      <CollapseHeader
        onClick={() => {
          setHide((b) => !b)
        }}
      >
        <CollapseToggle>
          <Icon icon={hide ? arrowRightSLine : icon} />
        </CollapseToggle>
        <h2>{title}</h2>
        {infoProps && <Infobox {...infoProps} />}
      </CollapseHeader>

      <CollapseContent style={animationProps}>{children}</CollapseContent>
    </CollapseWrapper>
  )
}

export default Collapse
