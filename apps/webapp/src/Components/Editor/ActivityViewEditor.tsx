import React, { useEffect, useState } from 'react'
import { client } from '@workduck-io/dwindle'
import { Plate } from '@udecode/plate'
import styled from 'styled-components'

import Editor from './Editor'
import { defaultContent } from '../../Stores/useEditorStore'
import { useAuthStore } from '../../Stores/useAuth'
import { apiURLs } from '@mexit/shared'

const SPlate = styled.div`
  max-width: 800px;
  margin: 1rem;
  padding: 1rem;
`

const ActivityViewEditor = () => {
  const userId = useAuthStore((store) => store.userDetails).userId
  const workspaceDetails = useAuthStore((store) => store.workspaceDetails)
  const nodeId = userId.replace(/-/g, '')

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [nodeContent, setNodeContent] = useState<any[]>()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setIsLoading(true)
    async function getActivityNodeContent() {
      const nodeContent = await client.get<any>(apiURLs.fetchActivities, {
        params: {
          blockSize: 10
        },
        headers: {
          'workspace-id': workspaceDetails.id
        }
      })
      //   console.log('Received Content: ', nodeContent.data)

      setNodeContent(nodeContent.data.content)
      setIsLoading(false)
    }
    getActivityNodeContent()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  //   const handleActivityNodeChange = (data: any) => {
  //     console.log('New Data: ', data)
  //     setNodeContent(data)
  //   }

  return (
    <Editor
      readOnly={true}
      nodeUID={!isLoading ? nodeId : 'NODE_LOADING'}
      nodePath={'Activity'}
      content={nodeContent ?? defaultContent.content}
    />
    // <Plate
    //   id={!isLoading ? nodeId : 'NODE_LOADING'}
    //   value={nodeContent?.content ?? defaultContent.content}
    //   editableProps={{
    //     readOnly: true
    //   }}
    // />
  )
}

export default ActivityViewEditor
