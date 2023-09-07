import type { BaseEdgeProps } from 'react-flow-renderer'

import EdgeText from './EdgeText'

const isNumeric = (n: any): n is number => !isNaN(n) && isFinite(n)

const BaseEdge = ({
  path,
  label,
  centerX,
  centerY,
  labelStyle,
  labelShowBg,
  labelBgStyle,
  labelBgPadding,
  labelBgBorderRadius,
  style,
  markerEnd,
  markerStart
}: BaseEdgeProps) => {
  return (
    <>
      <path
        style={style}
        d={path}
        fill="none"
        className="react-flow__edge-path"
        markerEnd={markerEnd}
        markerStart={markerStart}
      />
      {<path d={path} fill="none" strokeOpacity={0} strokeWidth={20} className="react-flow__edge-interaction" />}
      {label && isNumeric(centerX) && isNumeric(centerY) ? (
        <EdgeText
          x={centerX}
          y={centerY}
          label={label}
          labelStyle={labelStyle}
          labelShowBg={labelShowBg}
          labelBgStyle={labelBgStyle}
          labelBgPadding={labelBgPadding}
          labelBgBorderRadius={labelBgBorderRadius}
        />
      ) : null}
    </>
  )
}

BaseEdge.displayName = 'BaseEdge'

export default BaseEdge
