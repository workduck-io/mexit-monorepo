import { memo } from 'react'

import styled from 'styled-components'

import { Handle, Position } from '@workduck-io/react-flow'

import { usePropertyValueStore } from '@mexit/core'
import { FlexBetween } from '@mexit/shared'

import { CustomBody, CustomHeader } from './CustomComponents'

const FlowNode = styled.div`
  background: ${({ theme }) => theme.tokens.surfaces.modal};
  color: ${({ theme }) => theme.tokens.text.default};
  border-radius: ${({ theme }) => theme.borderRadius.small};
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
  border-radius: ${({ theme }) => theme.borderRadius.small};
`

function CustomNode({ id, data }) {
  const propertyKeys = usePropertyValueStore((s) => s.getPropertyList())
  return (
    <FlowNode>
      <Handle type="target" position={Position.Left} />
      <CustomHeader>
        <FlexBetween>
          <strong>{data.type}</strong>
          <strong>{data.title}</strong>
        </FlexBetween>
      </CustomHeader>
      <CustomBody>
        {Object.keys(data)
          .filter((item) => propertyKeys.includes(item))
          .map((k) => {
            return (
              <FlowProperty>
                <strong>{k}</strong>
                {/* <p>:{JSON.stringify(data[k])}</p> */}
                <Handle key={id + k} id={k} type="source" position={Position.Right} />
              </FlowProperty>
            )
          })}
      </CustomBody>
    </FlowNode>
  )
}

export const CNode = memo(CustomNode)
