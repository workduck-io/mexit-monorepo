import { ReactElement } from 'react'

import { useTheme } from 'styled-components'

import { MIcon } from '@mexit/core'
import { GenericFlex, IconDisplay } from '@mexit/shared'

import { SectionHeading, StyledSidebarSection } from './styled'

type SidebarSectionProps = {
  label: string
  icon: MIcon
  children: ReactElement
}

const SidebarSection: React.FC<SidebarSectionProps> = ({ label, children, icon }) => {
  const theme = useTheme()

  return (
    <StyledSidebarSection>
      <SectionHeading>
        <GenericFlex>
          <IconDisplay color={theme.tokens.text.fade} icon={icon} />
          <span>{label}</span>
        </GenericFlex>
      </SectionHeading>
      {children}
    </StyledSidebarSection>
  )
}

export default SidebarSection
