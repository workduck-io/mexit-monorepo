import 'reactflow/dist/style.css'
import './overview.css'

import { useCallback } from 'react'
import ReactFlow, { addEdge, Controls, MiniMap, Panel, useEdgesState, useNodesState } from 'reactflow'

import { generateConditionId, mog,TestTemplateData } from '@mexit/core'

import { CEdge, CNode } from './CustomBlock'
import { edges as initialEdges, nodes as initialNodes } from './templateTransformers'

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
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const onConnect = useCallback(
    (params) =>
      setEdges((eds) => {
        const condition = {
          field: params.sourceHandle,
          oldValue: undefined,
          newValue: undefined,
          action: 'APPEND',
          blockId: params.source
        }
        return addEdge(
          {
            ...params,
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

  const saveFlow = () => {
    const tempContent = TestTemplateData.content
    const tempMetadata = TestTemplateData.metadata

    edges.map((edge) => {
      tempMetadata.conditions = { ...tempMetadata.conditions, [edge.data.conditionId]: edge.data.condition }
      const blockIndex = tempContent.findIndex((val) => val.id === edge.target)
      tempContent[blockIndex].properties.properties.conditionId = edge.data.conditionId
    })
    mog('Updated Template Data', { tempMetadata, tempContent })
  }

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
        <MiniMap onClick={saveFlow} style={minimapStyle} zoomable pannable />
        <Controls />
        <Panel position="top-right">
          <button onClick={saveFlow}>Save</button>
        </Panel>
      </ReactFlow>
    </>
  )
}

export default OverviewFlow
