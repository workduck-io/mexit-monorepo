export enum SupportedAIEventTypes {
  SUMMARIZE = 'SUMMARIZE',
  EXPLAIN = 'EXPLAIN',
  EXPAND = 'EXPAND',
  ACTIONABLE = 'ACTIONABLE',
  PROMPT = 'PROMPT'
}

export interface AIEvent {
  role: 'user' | 'assistant'
  content?: string
  type?: SupportedAIEventTypes
}

export type AIEventHistory = [AIEvent, AIEvent]

export type AIEventsHistory = Array<AIEventHistory>
