import { useMemo } from 'react'
import { useParams } from 'react-router-dom'

import { useViews } from '../../Hooks/useViews'

const View = () => {
  const viewId = useParams().viewId
  const { getView } = useViews()

  const view = useMemo(() => {
    return getView(viewId)
  }, [viewId])

  if (!view) return

  return <></>
}

export default View
