import arrowDownSLine from '@iconify/icons-ri/arrow-down-s-line'
import arrowLeftSLine from '@iconify/icons-ri/arrow-left-s-line'
import { Icon, IconifyIcon } from '@iconify/react'
import { CollapsableHeaderTitle, CollapseContent, CollapseHeader, CollapseToggle, CollapseWrapper } from '@mexit/shared'
import { Infobox, InfoboxProps } from '@workduck-io/mex-components'
import React, { useMemo } from 'react'
import { useSpring } from 'react-spring'

interface CollapseProps {
  oid?: string
  defaultOpen?: boolean
  title: string
  maximumHeight?: string
  icon?: string | IconifyIcon
  children?: React.ReactNode
  infoProps?: InfoboxProps
  stopPropagation?: boolean
  onTitleClick?: (e?: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
}

const Collapse = ({
  defaultOpen,
  maximumHeight,
  icon,
  infoProps,
  children,
  oid,
  title,
  stopPropagation,
  onTitleClick
}: CollapseProps) => {
  const [hide, setHide] = React.useState(!defaultOpen ?? true)

  const springProps = useMemo(() => {
    const style = { maxHeight: '0vh' }
    if (!hide) {
      style.maxHeight = maximumHeight
    } else {
      style.maxHeight = '0vh'
    }
    return style
  }, [hide])

  const animationProps = useSpring(springProps)

  return (
    <CollapseWrapper id={`Collapse_${oid}`} onMouseUp={(e) => stopPropagation && e.stopPropagation()}>
      <CollapseHeader collapsed={!hide} canClick={!!onTitleClick}>
        <CollapsableHeaderTitle onClick={(e) => onTitleClick && onTitleClick(e)}>
          <Icon className={'SidebarCollapseSectionIcon'} icon={icon} />
          {title}
          {infoProps && <Infobox {...infoProps} />}
        </CollapsableHeaderTitle>
        <CollapseToggle
          onClick={() => {
            setHide((b) => !b)
          }}
        >
          <Icon icon={hide ? arrowLeftSLine : arrowDownSLine} />
        </CollapseToggle>
      </CollapseHeader>

      <CollapseContent style={animationProps}>{children}</CollapseContent>
    </CollapseWrapper>
  )
}

export default Collapse
