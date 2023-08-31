import { memo } from 'react'
import { BaseEdge, EdgeLabelRenderer, EdgeProps, getBezierPath,Handle, Position } from 'reactflow'

import styled, { useTheme } from 'styled-components'

import { getMenuItem, mog } from '@mexit/core'
import { DefaultMIcons, FlexBetween, IconDisplay, InsertMenu } from '@mexit/shared'

const FlowNode = styled.div`
  background: ${({ theme }) => theme.tokens.surfaces.modal};
  color: ${({ theme }) => theme.tokens.text.default};
`

const FlowProperty = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.medium};
  margin-bottom: ${({ theme }) => theme.spacing.small};
  background: ${({ theme }) => theme.tokens.surfaces.app};
  color: ${({ theme }) => theme.tokens.text.default};
  text-transform: capitalize;
`

function CustomNode({ id, data }) {
  const theme = useTheme()
  return (
    <FlowNode>
      <Handle type="target" position={Position.Left} />
      <div className="custom-node__header">
        <strong>{data.title}</strong>
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

const onEdgeClick = (evt, id) => {
  evt.stopPropagation()
  alert(`remove ${id}`)
}

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
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition
  })
  const PropertyValues = {
    priority: ['low', 'medium', 'high'],
    status: ['todo', 'pending', 'completed']
  }

  const onSelect = (event) => {
    mog('Flow Property Change Event', { event })
  }
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
          <FlexBetween>
            <InsertMenu
              title={`${data.field.toUpperCase()}: FROM`}
              key={id + 'old'}
              isMenu
              onClick={onSelect}
              selected={data.oldValue}
              items={PropertyValues[data.field].map((item) => getMenuItem(item))}
            />
            <IconDisplay icon={DefaultMIcons.ADD} />
            <InsertMenu
              key={id + 'new'}
              title={`${data.field.toUpperCase()}: TO`}
              isMenu
              selected={data.newValue}
              onClick={onSelect}
              items={PropertyValues[data.field]
                .filter((item) => item !== data.oldValue)
                .map((item) => getMenuItem(item))}
            />
          </FlexBetween>
        </div>
      </EdgeLabelRenderer>
    </>
  )
}
