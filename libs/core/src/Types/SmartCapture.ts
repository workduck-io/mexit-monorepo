export interface SmartCaptureLabel {
  id: string
  name: string
  field?: string
  path: string
  properties?: any
}

export interface SmartCaptureConfig {
  entityId: string
  regex: string
  base: string
  labels: SmartCaptureLabel[]
}

export type SmartCaptureStore = {
  config: SmartCaptureConfig[]
  clear: () => void
  getById: (configId: string) => SmartCaptureConfig
  getMatchingURLConfig: (url: string) => SmartCaptureConfig
  setSmartCaptureList: (list: SmartCaptureConfig[]) => void
}
