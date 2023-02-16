import { useMemo } from 'react'
import { useParams } from 'react-router-dom'

import { useViews } from '../../Hooks/useViews'

import ViewRenderer from './ViewRenderer'

const View = () => {
  const viewId = useParams().viewId
  const { getView } = useViews()

  const view = useMemo(() => {
    return getView(viewId)
  }, [viewId])

  return <ViewRenderer viewType={view?.viewType} />
}

export default View
