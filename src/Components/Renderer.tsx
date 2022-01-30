import React, { Suspense } from 'react'
import AliasWrapper from '../Components/AliasWrapper'

function Renderer({ componentName, componentProps }: { componentName: string; componentProps: any }) {
  const components = {
    AliasWrapper: AliasWrapper
  }

  const ActionComponent = components[componentName]
  return (
    <Suspense fallback={<></>}>
      <ActionComponent {...componentProps} />
    </Suspense>
  )
}

export default Renderer
