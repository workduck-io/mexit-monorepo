import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import styled from 'styled-components'
// import { Plate } from '@udecode/plate'

import Editor from './Editor'
import { DEFAULT_CONTENT, WORKSPACE_NAME } from '../Data/defaults'
import { apiURLs } from '@mexit/shared'

const SPlate = styled.div`
  flex: 1;
  max-width: 800px;
  margin: 1rem;
  padding: 1rem;
`

const PublicNodeEditor = ({ nodeId }) => {
  const [nodeContent, setNodeContent] = useState<any[]>()
  const [isLoading, setIsLoading] = useState(false)

  const navigate = useNavigate()

  useEffect(() => {
    setIsLoading(true)
    async function getPublicNodeContent() {
      const URL = apiURLs.getPublicNode(nodeId)
      try {
        const res = await axios.get(URL, {
          headers: {
            'workspace-id': WORKSPACE_NAME
          }
        })
        setNodeContent(res.data.content)
      } catch (error) {
        navigate('/404')
      }
    }
    getPublicNodeContent()
    setIsLoading(false)
  }, [setNodeContent, setIsLoading]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <SPlate>
      {/* <Plate id={!isLoading ? nodeId : 'NODE_LOADING'} value={nodeContent ?? DEFAULT_CONTENT.content} /> */}
      <Editor
        nodeUID={!isLoading ? nodeId : 'NODE_LOADING'}
        nodePath={nodeId}
        content={nodeContent ?? DEFAULT_CONTENT.content}
      />
    </SPlate>
  )
}

export default PublicNodeEditor
