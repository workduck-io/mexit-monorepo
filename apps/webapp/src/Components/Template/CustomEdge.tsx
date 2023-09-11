import { useTheme } from 'styled-components'

import {
  Edge,
  EdgeLabelRenderer,
  EdgeProps,
  getBezierEdgeCenter,
  getSmoothStepPath,
  useReactFlow,
  useStoreApi
} from '@workduck-io/react-flow'

import { capitalize, getMenuItem, usePropertyValueStore, useSnippetStore } from '@mexit/core'
import { DefaultMIcons, IconDisplay, InsertMenu } from '@mexit/shared'

import { FlexBetween } from '../../Editor/Styles/InlineBlock'
import { useSnippetBuffer } from '../../Hooks/useEditorBuffer'

import BaseEdge from './BaseEdge'
import { CustomHeader } from './CustomComponents'

export const CEdge = ({
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
}: EdgeProps) => {
  const edgePath = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition
  })

  const [labelX, labelY] = getBezierEdgeCenter({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition
  })

  const { setEdges } = useReactFlow()
  const { addOrUpdateValBuffer } = useSnippetBuffer()
  const store = useStoreApi()

  const PropertyValues = usePropertyValueStore((store) => store.propertyValues)

  const saveFlow = (edges: any) => {
    const snippet = useSnippetStore.getState().editor.snippet

    const tempContent = snippet?.content
    const tempMetadata = snippet.metadata ?? {}

    edges.map((edge) => {
      tempMetadata.conditions = { ...tempMetadata.conditions, [edge.data.conditionId]: edge.data.condition }
      const blockIndex = tempContent.findIndex((val) => val.id === edge.target)
      tempContent[blockIndex].properties.conditionId = edge.data.conditionId
    })

    addOrUpdateValBuffer(snippet.id, tempContent, tempMetadata)
  }

  const onSelect = (valueType: 'OLD' | 'NEW') => (event: string) => {
    const { edges } = store.getState()
    const newEdges = Array.from(edges.values()).map((edge: Edge) => {
      if (edge.id === id) {
        edge.data = {
          ...edge.data,
          condition: { ...edge.data.condition, [valueType === 'OLD' ? 'oldValue' : 'newValue']: event }
        }
      }
      return edge
    })
    setEdges(newEdges)
    saveFlow(newEdges)
  }

  const onDelete = () => {
    const { edges } = store.getState()
    const newEdges = Array.from(edges.values()).filter((e) => e.id !== id)
    setEdges(newEdges)
    saveFlow(newEdges)
  }

  const theme = useTheme()

  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} centerX={labelX} centerY={labelY} />
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            fontSize: 10,
            pointerEvents: 'all',
            background: theme.tokens.surfaces.app,
            borderRadius: theme.borderRadius.small
          }}
          className="nodrag nopan"
        >
          <FlexBetween style={{ flexDirection: 'column', margin: '0px' }}>
            <CustomHeader>
              <FlexBetween style={{ margin: '0px' }}>
                <strong>{data.condition.field.toUpperCase()}</strong>
                <i>: changes from</i>
              </FlexBetween>
            </CustomHeader>
            <FlexBetween
              style={{
                background: theme.tokens.surfaces.app,
                borderRadius: theme.borderRadius.small,
                margin: theme.spacing.small
              }}
            >
              <InsertMenu
                title={`${capitalize(data.condition.field)}: From`}
                key={id + 'old'}
                isMenu
                onClick={onSelect('OLD')}
                placeholder={`Select a ${capitalize(data.condition.field)}`}
                selected={data.condition.oldValue}
                items={PropertyValues[data.condition.field]?.concat('any').map((item) => getMenuItem(item))}
              />
              <IconDisplay icon={DefaultMIcons.RIGHT_ARROW} />
              <InsertMenu
                key={id + 'new'}
                title={`${capitalize(data.condition.field)}: To`}
                isMenu
                selected={data.condition.newValue}
                onClick={onSelect('NEW')}
                items={PropertyValues[data.condition.field]
                  .filter((item) => item !== data.oldValue)
                  .map((item) => getMenuItem(item))}
              />
              <IconDisplay onClick={onDelete} icon={DefaultMIcons.DELETE} />
            </FlexBetween>
          </FlexBetween>
        </div>
      </EdgeLabelRenderer>
    </>
  )
}
