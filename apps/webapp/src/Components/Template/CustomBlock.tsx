import { memo } from 'react'
import {
  BaseEdge,
  Edge,
  EdgeLabelRenderer,
  EdgeProps,
  getSmoothStepPath,
  Handle,
  Position,
  useReactFlow,
  useStoreApi
} from 'reactflow'

import styled, { useTheme } from 'styled-components'

import { getMenuItem } from '@mexit/core'
import { DefaultMIcons, FlexBetween, IconDisplay, InsertMenu } from '@mexit/shared'

const FlowNode = styled.div`
  background: ${({ theme }) => theme.tokens.surfaces.modal};
  color: ${({ theme }) => theme.tokens.text.default};
`

const FlowProperty = styled.div`
  display: flex;
  position: relative;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.medium};
  margin-bottom: ${({ theme }) => theme.spacing.small};
  background: ${({ theme }) => theme.tokens.surfaces.app};
  color: ${({ theme }) => theme.tokens.text.default};
  text-transform: capitalize;
`

function CustomNode({ id, data }) {
  return (
    <FlowNode>
      <Handle type="target" position={Position.Left} />
      <div className="custom-node__header">
        <FlexBetween>
          <strong>{data.type}</strong>
          <strong>{data.title}</strong>
        </FlexBetween>
      </div>
      <div className="custom-node__body">
        {Object.keys(data).map((k) => {
          return (
            <FlowProperty>
              <strong>{k}</strong>
              {/* <p>:{JSON.stringify(data[k])}</p> */}
              <Handle key={id + k} id={k} type="source" position={Position.Right} />
            </FlowProperty>
          )
        })}
      </div>
    </FlowNode>
  )
}

export const CNode = memo(CustomNode)

export function CEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  animated,
  targetPosition,
  data,
  style = {},
  markerEnd
}: EdgeProps) {
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition
  })

  const { setEdges } = useReactFlow()
  const store = useStoreApi()

  const PropertyValues = {
    priority: ['low', 'medium', 'high'],
    status: ['todo', 'pending', 'completed']
  }

  const onSelect = (valueType: 'OLD' | 'NEW') => (event: string) => {
    const { edges } = store.getState()
    setEdges(
      Array.from(edges.values()).map((edge: Edge) => {
        if (edge.id === id) {
          edge.data = {
            ...edge.data,
            condition: { ...edge.data.condition, [valueType === 'OLD' ? 'oldValue' : 'newValue']: event }
          }
        }

        return edge
      })
    )
  }

  const theme = useTheme()

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            fontSize: 12,
            // everything inside EdgeLabelRenderer has no pointer events by default
            // if you have an interactive element, set pointer-events: all
            pointerEvents: 'all'
          }}
          className="nodrag nopan"
        >
          <FlexBetween
            style={{
              background: theme.tokens.surfaces.app,
              padding: theme.spacing.small,
              borderRadius: theme.borderRadius.small
            }}
          >
            <InsertMenu
              title={`${data.condition.field.toUpperCase()}: FROM`}
              key={id + 'old'}
              isMenu
              onClick={onSelect('OLD')}
              selected={data.condition.oldValue}
              items={PropertyValues[data.condition.field]?.map((item) => getMenuItem(item))}
            />
            <IconDisplay icon={DefaultMIcons.ADD} />
            <InsertMenu
              key={id + 'new'}
              title={`${data.condition.field.toUpperCase()}: TO`}
              isMenu
              selected={data.condition.newValue}
              onClick={onSelect('NEW')}
              items={PropertyValues[data.condition.field]
                .filter((item) => item !== data.oldValue)
                .map((item) => getMenuItem(item))}
            />
          </FlexBetween>
        </div>
      </EdgeLabelRenderer>
    </>
  )
}
