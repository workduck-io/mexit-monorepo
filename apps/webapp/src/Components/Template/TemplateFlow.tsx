import { useCallback } from 'react'
import ReactFlow, { Background, Controls, MiniMap, addEdge, useEdgesState, useNodesState } from 'reactflow'

import CustomBlock from './CustomBlock'
import { edges as initialEdges, nodes as initialNodes } from './dummyData'

import 'reactflow/dist/style.css'
import './overview.css'

const nodeTypes = {
  custom: CustomBlock
}

const minimapStyle = {
  height: 120
}

const onInit = (reactFlowInstance) => console.log('flow loaded:', reactFlowInstance)

const OverviewFlow = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [])

  // we are using a bit of a shortcut here to adjust the edge type
  // this could also be done with a custom edge for example
  const edgesWithUpdatedTypes = edges.map((edge) => {
    if (edge.sourceHandle) {
      const edgeType = nodes.find((node) => node.type === 'custom').data.selects[edge.sourceHandle]
      edge.type = edgeType
    }

    return edge
  })

  return (
    <ReactFlow
      nodes={nodes}
      edges={edgesWithUpdatedTypes}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onInit={onInit}
      fitView
      attributionPosition="top-right"
      nodeTypes={nodeTypes}
    >
      <MiniMap style={minimapStyle} zoomable pannable />
      <Controls />
      <Background color="#aaa" gap={16} />
    </ReactFlow>
  )
}

export default OverviewFlow
