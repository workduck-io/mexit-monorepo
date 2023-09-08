import { Edge, MarkerType, Node, Position } from 'react-flow-renderer'

export const transformTemplateToNodes = (template): Node[] => {
  return template.content.map((block, i) => {
    return {
      id: block.id,
      position: { x: 100, y: 400 * i },
      type: 'custom',
      targetPosition: Position.Left,
      sourcePosition: Position.Right,
      data: { ...block.properties, type: block.type }
    }
  })
}

export const transformTemplateToEdges = (template, metadata): Edge[] => {
  return template.content
    .map((block, i) => {
      const conditionId = block.properties?.conditionId
      if (!conditionId) return

      const condition = metadata.conditions?.[conditionId]

      if (!condition) return

      return {
        id: `${condition.blockId}-${block.id}`,
        source: metadata.conditions[conditionId].blockId,
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
