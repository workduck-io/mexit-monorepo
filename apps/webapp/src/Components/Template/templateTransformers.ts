import { Edge, MarkerType, Node, Position } from 'reactflow'

import { mog, TestTemplateData } from '@mexit/core'

export const transformTemplateToNodes = (template): Node[] => {
  return template.content.map((block, i) => {
    return {
      id: block.id,
      position: { x: 100, y: 400 * i },
      type: 'custom',
      targetPosition: Position.Left,
      sourcePosition: Position.Right,
      data: { ...block.properties.properties, type: block.type }
    }
  })
}

export const nodes = transformTemplateToNodes(TestTemplateData)

mog('EDGE DETS NODE', { nodes })

export const transformTemplateToEdges = (template): Edge[] => {
  return template.content
    .map((block, i) => {
      const conditionId = block.properties.properties.conditionId
      if (!conditionId) return
      const condition = TestTemplateData.metadata.conditions[conditionId]
      return {
        id: `${condition.blockId}-${block.id}`,
        source: TestTemplateData.metadata.conditions[conditionId].blockId,
        target: block.id,
        data: { conditionId, condition },
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
}
export const edges = transformTemplateToEdges(TestTemplateData)

mog('EDGE DETS', { edges })
