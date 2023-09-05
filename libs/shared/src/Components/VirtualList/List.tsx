import React, { useRef } from 'react'
import { useVirtual } from 'react-virtual'

import { ListContainer } from './styled'

export const VirtualList = ({ items, style = {}, ItemRenderer }) => {
  const parentRef = useRef<HTMLDivElement>(null)

  const rowVirtualizer = useVirtual({
    size: items.length,
    parentRef,
    estimateSize: React.useCallback(() => 200, [])
  })

  return (
    <ListContainer ref={parentRef} maxHeight="100%" style={style}>
      <div>
        {items.map((virtualRow) => {
          return (
            <div key={virtualRow.index}>
              <ItemRenderer item={virtualRow} />
            </div>
          )
        })}
      </div>
    </ListContainer>
  )
}
