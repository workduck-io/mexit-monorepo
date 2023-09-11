import '@workduck-io/react-flow/dist/style.css'
import './overview.css'

import { useCallback, useEffect, useMemo } from 'react'

import ReactFlow, { addEdge, Controls, MiniMap, useEdgesState, useNodesState } from '@workduck-io/react-flow'

import { generateConditionId, useSnippetStore } from '@mexit/core'

import { getLayoutedElements } from '../../Utils/dagre'

import { CEdge, CNode } from './CustomBlock'
import { transformTemplateToEdges, transformTemplateToNodes } from './templateTransformers'

const nodeTypes = {
  custom: CNode
}

const edgeTypes = {
  custom: CEdge
}

const minimapStyle = {
  height: 120
}

const onInit = (reactFlowInstance) => console.log('flow loaded:', reactFlowInstance)

const OverviewFlow = () => {
  const snippetId = useSnippetStore((store) => store.editor.snippet?.id)

  const snippet = useSnippetStore((store) => store.snippets[snippetId])
  const metadata = snippet?.metadata ?? {}

  const { initialEdges, initialNodes } = useMemo(() => {
    return getLayoutedElements(transformTemplateToNodes(snippet), transformTemplateToEdges(snippet, metadata))
  }, [snippetId])

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

  useEffect(() => {
    setNodes(initialNodes)
    setEdges(initialEdges)
  }, [snippetId])
  const onConnect = useCallback(
    (connection) =>
      setEdges((eds) => {
        const condition = {
          field: connection.sourceHandle,
          oldValue: undefined,
          newValue: undefined,
          action: 'APPEND',
          blockId: connection.source
        }

        return addEdge(
          {
            ...connection,
            type: 'custom',
            markerEnd: { type: 'arrowclosed' },
            animated: true,
            data: {
              conditionId: generateConditionId(),
              condition
            }
          },
          eds
        )
      }),
    []
  )

  // we are using a bit of a shortcut here to adjust the edge type
  // this could also be done with a custom edge for example
  //   const edgesWithUpdatedTypes = edges.map((edge) => {
  //     if (edge.sourceHandle) {
  //       const edgeType = nodes.find((node) => node.type === 'custom').data.selects[edge.sourceHandle]
  //       edge.type = edgeType
  //     }

  //     return edge
  //   })

  return (
    <>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={onInit}
        fitView
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
      >
        <MiniMap style={minimapStyle} />
        <Controls />
      </ReactFlow>
    </>
  )
}

export default OverviewFlow
