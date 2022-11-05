export type SmartCaptureConfigType = {
  [webPage: string]: { id: string; label: string; path: string; properties: SmartCaptureFieldPropertiesType }[]
}

export type SmartCaptureURLRegexType = {
  WebPage: string
  regex: string | RegExp
}[]

export enum SmartCaptureFieldTypes {
  NUMBER = 'NUMBER',
  TEXT = 'TEXT'
}

export declare enum TextFieldHeight {
  SMALL = 'SMALL',
  MEDIUM = 'MEDIUM',
  LARGE = 'LARGE'
}

export interface SmartCaptureFieldBaseType {
  placeholder?: string
  required?: boolean
  flex?: number
  row?: number
  height?: TextFieldHeight
}

export interface SmartCaptureFieldPropertiesType extends SmartCaptureFieldBaseType {
  type: string // * Editor Element Type
  renderType?: SmartCaptureFieldTypes
}
