import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import styled from 'styled-components'
import { Plate, usePlateEditorRef } from '@udecode/plate'

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
  const [nodePath, setNodePath] = useState<string>(nodeId)
  const [isLoading, setIsLoading] = useState(false)

  const editor = usePlateEditorRef()
  const navigate = useNavigate()

  useEffect(() => {
    setIsLoading(true)
    async function getPublicNodeContent() {
      const URL = apiURLs.getPublicNode(nodeId)
      try {
        const res = await axios.get<any>(URL, {
          headers: {
            'workspace-id': WORKSPACE_NAME
          }
        })
        setNodeContent(res.data.content)
        setNodePath(res.data.path ?? nodeId)
      } catch (error) {
        navigate('/404')
      }
    }
    getPublicNodeContent()
    setIsLoading(false)
  }, [setNodeContent, setIsLoading]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (editor) editor.children = nodeContent

    console.log('Node Content updated: ', nodeContent)
  }, [editor, nodeContent])

  return (
    <SPlate>
      <Editor
        nodeUID={!isLoading ? nodeId : 'NODE_LOADING'}
        nodePath={nodeId}
        content={nodeContent ?? DEFAULT_CONTENT.content}
      />
    </SPlate>
  )
}

export default PublicNodeEditor
