import React, { FunctionComponent } from 'react'

import { SuperBlock } from '.'

/**
 * HOC adding Super Block.
 */
export const withSuperBlock: <T>(Component: FunctionComponent<T>) => FunctionComponent<any> =
  // eslint-disable-next-line react/display-name
  (Component) => (props) => {
    return (
      <SuperBlock>
        <Component {...props} />
      </SuperBlock>
    )
  }
