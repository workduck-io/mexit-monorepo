import React from 'react'

import { useSputlitStore } from '../../Stores/useSputlitStore'

const AvatarRenderer = () => {
  const { screenshot } = useSputlitStore()

  return <div dangerouslySetInnerHTML={{ __html: screenshot }} />
}

export default AvatarRenderer
