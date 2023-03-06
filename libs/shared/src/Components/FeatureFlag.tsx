import React from 'react'

import { FeatureFlags, useAppStore } from '@mexit/core'

type FeatureFlagProps = {
  name: FeatureFlags
  children: React.ReactNode
  fallback?: React.ReactNode
}

export const useFeatureFlag = (name: FeatureFlags) => {
  const featureFlags = useAppStore((store) => store.featureFlags)
  return { isEnabled: featureFlags[name] }
}

export const FeatureFlag = ({ name, children, fallback = null }: FeatureFlagProps) => {
  const { isEnabled } = useFeatureFlag(name)

  return isEnabled ? <>{children}</> : <>{fallback}</>
}
