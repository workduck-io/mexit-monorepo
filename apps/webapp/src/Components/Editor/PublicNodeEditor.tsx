import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import styled from 'styled-components'

import Editor from './Editor'
import { WORKSPACE_NAME } from '../../Data/defaults'

import { apiURLs } from '@mexit/shared'

const SPlate = styled.div`
  flex: 1;
  max-width: 800px;
  margin: 1rem;
  padding: 1rem;
`

const PublicNodeEditor = ({ nodeId }) => {
  const [nodeContent, setNodeContent] = useState<any[]>()
  const [nodePath, setNodePath] = useState<string>(nodeId)

  const navigate = useNavigate()

  useEffect(() => {
    async function getPublicNodeContent() {
      const URL = apiURLs.getPublicNode(nodeId)
      try {
        const res = await axios.get<any>(URL, {
          headers: {
            'mex-workspace-id': WORKSPACE_NAME
          }
        })
        setNodeContent(res.data.content)
        setNodePath(res.data.path ?? nodeId)
      } catch (error) {
        navigate('/404')
      }
    }
    getPublicNodeContent()
  }, [setNodeContent]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <SPlate>
      {nodeContent && nodeContent.length > 0 && (
        <Editor readOnly={true} nodeUID={nodeId} nodePath={nodeId} content={nodeContent} />
      )}
    </SPlate>
  )
}

export default PublicNodeEditor
