import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

import PublicNodeEditor from '../Components/Editor/PublicNodeEditor'
import Cookies from 'universal-cookie'
import { Title } from '@mexit/shared'
import PublicDataInfobar from '../Components/Infobar/PublicNodeInfobar'
import { defaultContent } from '../Data/baseData'
import { useApi } from '../Hooks/useApi'
import { usePublicNodeStore, PublicNode } from '../Stores/usePublicNodes'
import styled from 'styled-components'
import { EditorViewWrapper } from './EditorView'

const Heading = styled(Title)`
  margin: 1rem 2rem;
`

const PublicNodeView = () => {
  const nodeId = useParams().nodeId
  const getPublicNode = usePublicNodeStore((store) => store.getPublicNode)
  const { getPublicNodeAPI } = useApi()
  const navigate = useNavigate()
  const [node, setNode] = useState<PublicNode>(getPublicNode(nodeId))

  useEffect(() => {
    const cookies = new Cookies()
    const timestamp = Date.now()
    cookies.set('mexit-sharing', timestamp, { path: '/' })
  })

  useEffect(() => {
    async function getPublicNodeContent() {
      try {
        const node = await getPublicNodeAPI(nodeId)
        setNode({ ...node, id: nodeId })
      } catch (error) {
        console.log('Error occured in get public: ', error)
        navigate('/404')
      }
    }
    getPublicNodeContent()
  }, [])

  return (
    <EditorViewWrapper>
      <PublicNodeEditor nodeId={nodeId} node={node} />

      <PublicDataInfobar nodeId={nodeId} content={node?.content ?? defaultContent.content} />
    </EditorViewWrapper>
  )
}

export default PublicNodeView
