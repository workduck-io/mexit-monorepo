import React, { Suspense } from 'react'
import AliasWrapper from '../Components/AliasWrapper'
import { CreateTabCapture, ShowTabCaptures } from './TabCaptures'

const Renderer = ({ componentName, componentProps }: { componentName: string; componentProps: any }) => {
  const components = {
    AliasWrapper: AliasWrapper,
    CreateTabCapture: CreateTabCapture,
    ShowTabCaptures: ShowTabCaptures
  }

  const ActionComponent = components[componentName]

  return (
    <Suspense fallback={<></>}>
      <ActionComponent {...componentProps} />
    </Suspense>
  )
}

export default Renderer
