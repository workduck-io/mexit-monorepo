import React, { Suspense } from 'react'

import AliasWrapper from './Actions/AliasWrapper'
import { CreateTabCapture, ShowTabCaptures } from './TabCaptures'
import ColourPicker from './Actions/ColourPicker'
import UnixEpochConverter from './Actions/UnixEpoch'
import CorporateBS from './Actions/CorpBS'
import LibreTranslate from './Actions/LibreTranslate'
import CurrencyConverter from './Actions/CurrencyConverter'

const Renderer = ({ componentName, componentProps }: { componentName: string; componentProps: any }) => {
  const components = {
    AliasWrapper: AliasWrapper,
    CreateTabCapture: CreateTabCapture,
    ShowTabCaptures: ShowTabCaptures,
    ColourPicker: ColourPicker,
    UnixEpochConverter: UnixEpochConverter,
    CorporateBS: CorporateBS,
    LibreTranslate: LibreTranslate,
    CurrencyConverter: CurrencyConverter
  }

  const ActionComponent = components[componentName]

  return (
    <Suspense fallback={<></>}>
      <ActionComponent {...componentProps} />
    </Suspense>
  )
}

export default Renderer
