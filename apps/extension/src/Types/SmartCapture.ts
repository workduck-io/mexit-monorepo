export type SmartCaptureConfigType = {
  [webPage: string]: { label: string; path: string; properties }[]
}

export type SmartCaptureURLRegexType = {
  WebPage: string
  regex: string | RegExp
}[]
