export enum SupportedAIEventTypes {
  SUMMARIZE = 'SUMMARIZE',
  EXPLAIN = 'EXPLAIN',
  EXPAND = 'EXPAND',
  ACTIONABLE = 'ACTIONABLE',
  PROMPT = 'PROMPT'
}

export type ContentFormatType = 'markdown' | 'html' | 'audio' | 'video'

export interface AIEvent {
  role: 'user' | 'assistant'
  content?: string
  inputFormat?: ContentFormatType
  type?: SupportedAIEventTypes
}

export type AIEventHistory = [AIEvent, AIEvent]

export type AIEventsHistory = Array<AIEventHistory>