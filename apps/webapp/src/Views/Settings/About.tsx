import React from 'react'

import linkedinIcon from '@iconify/icons-logos/linkedin-icon'
import twitterIcon from '@iconify/icons-logos/twitter'
import globeIcon from '@iconify/icons-ph/globe'
import { Icon } from '@iconify/react'
import styled from 'styled-components'

import { BackCard, CenteredColumn, Links, Title } from '@mexit/shared'

import { version } from '../../../package.json'
// import { APIScratchpad, useAPIScratchpad } from '../../Hooks/API/scratchpad'

const Margin = styled.div`
  margin: 0.5rem 1rem;
`

const StyledIcon = styled(Icon)`
  margin-right: 0.4rem;
`

const Flex = styled.div`
  display: flex;
  align-items: center;
`

const About = () => {
  // Comment PRODUCTION

  return (
    <CenteredColumn>
      <BackCard>
        <Title colored>Mexit</Title>
        <Margin>Version: {version}</Margin>
        <Margin>
          <Flex>
            <Links href="https://workduck.io" target="_blank" rel="noopener norefer">
              <StyledIcon icon={globeIcon} />
              <h4>Website</h4>
            </Links>
            <Links href="https://www.linkedin.com/company/workduck-official" target="_blank" rel="noopener norefer">
              <StyledIcon icon={linkedinIcon} />
              <h4>Linkedin</h4>
            </Links>
            <Links href="https://twitter.com/workduckio" target="_blank" rel="noopener norefer">
              <StyledIcon icon={twitterIcon} />
              <h4>Twitter</h4>
            </Links>
          </Flex>
        </Margin>
        <br />
      </BackCard>
    </CenteredColumn>
  )
}

export default About
