export enum FeatureFlags {
  // Add new feature flags here
  // Example: 'feature-flag-name' = 'feature-flag-name'
  ACTIONS = 'actions',
  PRESENTATION = 'presentation'
}

export type FeatureFlagsType = {
  [key in FeatureFlags]: boolean
}
