import { Edge, MarkerType, Node, Position } from 'reactflow'

import { mog,TestTemplateData } from '@mexit/core'

export const nodes: Node[] = TestTemplateData.content.map((block, i) => {
  return {
    id: block.id,
    position: { x: 100, y: 400 * i },
    type: 'custom',
    targetPosition: Position.Left,
    sourcePosition: Position.Right,
    data: block.properties.properties
  }
})

mog('EDGE DETS NODE', { nodes })

// export const nodes: Node[] = [
//   {
//     id: '4',
//     type: 'custom',
//     position: { x: 100, y: 200 },
//     data: {
//       title: 'Customer Profile',
//       selects: {
//         'handle-0': 'smoothstep',
//         'handle-1': 'smoothstep'
//       }
//     }
//   },
//   {
//     id: '5',
//     type: 'output',
//     data: {
//       label: 'custom style'
//     },
//     className: 'circle',
//     style: {
//       background: '#2B6CB0',
//       color: 'white'
//     },
//     position: { x: 400, y: 200 },
//     sourcePosition: Position.Right,
//     targetPosition: Position.Left
//   },
//   {
//     id: '6',
//     type: 'output',
//     style: {
//       background: '#63B3ED',
//       color: 'white',
//       width: 100
//     },
//     data: {
//       label: 'Node'
//     },
//     position: { x: 400, y: 325 },
//     sourcePosition: Position.Right,
//     targetPosition: Position.Left
//   }
// ]

export const edges: Edge[] = TestTemplateData.content
  .map((block, i) => {
    const conditionId = block.properties.properties.conditionId
    if (!conditionId) return
    const condition = TestTemplateData.metadata.conditions[conditionId]
    return {
      id: `${condition.blockId}-${block.id}`,
      source: TestTemplateData.metadata.conditions[conditionId].blockId,
      target: block.id,
      data: condition,
      sourceHandle: condition.field,
      type: 'custom',
      animated: true,
      markerEnd: {
        type: MarkerType.ArrowClosed
      },
      edgeType: 'smoothstep'
    }
  })
  .filter((item) => !!item)

mog('EDGE DETS', { edges })
// export const edges: Edge[] = [
//   {
//     id: 'e4-5',
//     source: '4',
//     target: '5',
//     type: 'smoothstep',
//     sourceHandle: 'handle-0',
//     label: 'this is an edge label',
//     animated: true,
//     data: {
//       selectIndex: 0
//     },
//     markerEnd: {
//       type: MarkerType.ArrowClosed
//     }
//   },
//   {
//     id: 'e4-6',
//     source: '4',
//     target: '6',
//     type: 'smoothstep',
//     label: 'this is an edge label-2',
//     sourceHandle: 'handle-1',
//     data: {
//       selectIndex: 1
//     },
//     markerEnd: {
//       type: MarkerType.ArrowClosed
//     }
//   }
// ]
