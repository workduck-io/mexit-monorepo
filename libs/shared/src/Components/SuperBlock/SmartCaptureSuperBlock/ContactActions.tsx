import React, { useMemo } from 'react'

import { getElementById, getMenuItem } from '@mexit/core'

import { getMIcon } from '../../Icons'
import { InsertMenu } from '../../InsertMenu'

type ContactActionProps = {
  value: any
  onChange: any
}

const ContactActions: React.FC<ContactActionProps> = ({ value, onChange }) => {
  const stages = useMemo(() => {
    return [
      getMenuItem('Outreach', () => undefined, false, undefined, undefined, 'stage-1'),
      getMenuItem('Demo', () => undefined, false, undefined, undefined, 'stage-2'),
      getMenuItem('Negotiation', () => undefined, false, undefined, undefined, 'stage-3'),
      getMenuItem('Closed', () => undefined, false, undefined, undefined, 'stage-4')
    ]
  }, [])

  const onClick = (stage: string) => {
    onChange({
      stage
    })
  }

  return (
    <InsertMenu
      name="stage"
      allowSearch
      isMenu
      id="mexit-stage-actions"
      root={getElementById('ext-side-nav')}
      items={stages}
      onClick={onClick}
      selected={value?.['stage']}
      title="Stage"
      icon={getMIcon('ICON', 'pajamas:stage-all')}
    />
  )
}

export default ContactActions
