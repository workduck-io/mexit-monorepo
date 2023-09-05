import { ReactElement } from 'react'

import { useTheme } from 'styled-components'

import { MIcon } from '@mexit/core'
import { GenericFlex, IconDisplay, Loading } from '@mexit/shared'

import { SectionHeading, StyledSidebarSection } from './styled'

type SidebarSectionProps = {
  label: string
  icon: MIcon
  isLoading?: boolean
  children: ReactElement
  style?: any
  scrollable?: boolean
  rightComponent?: ReactElement
}

const SidebarSection: React.FC<SidebarSectionProps> = ({
  label,
  children,
  icon,
  style,
  rightComponent,
  isLoading,
  scrollable = false
}) => {
  const theme = useTheme()

  return (
    <StyledSidebarSection style={style} scrollable={scrollable}>
      <SectionHeading>
        <GenericFlex>
          <IconDisplay color={theme.tokens.text.fade} icon={icon} />
          <span>{label}</span>
          {isLoading && <Loading dots={2} transparent />}
        </GenericFlex>
        {rightComponent}
      </SectionHeading>
      {children}
    </StyledSidebarSection>
  )
}

export default SidebarSection
