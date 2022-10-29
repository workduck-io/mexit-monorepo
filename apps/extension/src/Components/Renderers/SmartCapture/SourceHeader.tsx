import React from 'react'

import { Button } from '@workduck-io/mex-components'

import { getFavicon } from '@mexit/core'
import { ProjectIconMex } from '@mexit/shared'

import { Title } from '../../Action/styled'
import { Controls, ToggleAndSubmit } from '../../Screenshot/Screenshot.style'
import { SourceHeaderStyled } from './styled'

const SourceHeader = ({ source, title }) => {
  return (
    <SourceHeaderStyled>
      <Controls>
        <ProjectIconMex icon={getFavicon(source)} />
        <Title>{title}</Title>
      </Controls>
      <ToggleAndSubmit>
        <Button form="wd-mex-smart-capture-form">Save</Button>
      </ToggleAndSubmit>
    </SourceHeaderStyled>
  )
}

export default SourceHeader
