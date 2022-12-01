import React from 'react'

import { Button } from '@workduck-io/mex-components'

import { getFavicon } from '@mexit/core'
import { Label, ProjectIconMex, ToggleButton } from '@mexit/shared'

import { useSputlitStore } from '../../../Stores/useSputlitStore'
import { Title } from '../../Action/styled'
import { Controls, ToggleAndSubmit } from '../Screenshot/Screenshot.style'
import { SourceHeaderStyled } from './styled'

const SourceHeader = ({ source, title }) => {
  const isTable = useSputlitStore((s) => s.smartCaptureSaveType)
  const toggleIsTable = useSputlitStore((s) => s.toggleSmartCaptureSaveType)

  return (
    <SourceHeaderStyled>
      <Controls>
        <ProjectIconMex icon={getFavicon(source)} />
        <Title>{title}</Title>
      </Controls>

      <Controls>
        <Controls>
          <Label id="wd-mex-smart-capture-data-type">Save as Table</Label>
          <ToggleButton size="xs" checked={isTable === 'tabular'} onChange={toggleIsTable} />
        </Controls>
        <ToggleAndSubmit>
          <Button form="wd-mex-smart-capture-form">Save</Button>
        </ToggleAndSubmit>
      </Controls>
    </SourceHeaderStyled>
  )
}

export default SourceHeader
