import dagre from 'dagre'

import { Edge, Node, Position } from '@workduck-io/react-flow'

const dagreGraph = new dagre.graphlib.Graph()
dagreGraph.setDefaultEdgeLabel(() => ({}))

export const getLayoutedElements = (nodes: Node[], edges: Edge[], direction = 'LR') => {
  const isHorizontal = direction === 'LR'
  dagreGraph.setGraph({ rankdir: direction, nodesep: 250, edgesep: 200, ranksep: 600 })

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: 0, height: 0 })
  })

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target)
  })

  dagre.layout(dagreGraph)

  nodes.forEach((node) => {
    const nodeWithPosition = dagreGraph.node(node.id)
    node.targetPosition = isHorizontal ? Position.Left : Position.Top
    node.sourcePosition = isHorizontal ? Position.Right : Position.Bottom

    // We are shifting the dagre node position (anchor=center center) to the top left
    // so it matches the React Flow node anchor point (top left).
    node.position = {
      x: nodeWithPosition.x + (Math.random() * 6 - 3) * 25,
      y: nodeWithPosition.y
    }

    return node
  })

  return { initialNodes: nodes, initialEdges: edges }
}
