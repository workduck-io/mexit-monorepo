import Emittery from 'emittery'

import { useMetadataStore, useSnippetStore } from '../Stores'

import { mog } from './mog'

export const emitter = new Emittery()

export type Condition = {
  field: string
  oldValue: any
  newValue: any
  blockId: string
  action: any
}

export interface DecisionTreeConfig {
  conditions: Condition[]
}

export function evaluateDecisionTree(
  oldData: Record<string, any>,
  newData: Record<string, any>,
  config: DecisionTreeConfig
): string | undefined {
  const conditions = config.conditions

  for (const condition of conditions) {
    // if (condition.blockId !== oldData['blockId']) return undefined
    const field = condition.field
    const oldValueCondition = condition.oldValue
    const newValueCondition = condition.newValue
    const action = condition.action

    const oldFieldValue = oldData[field]
    const newFieldValue = newData[field]
    // Evaluate the conditions based on old and new values
    const oldConditionMet = evaluateCondition(oldFieldValue, oldValueCondition)
    const newConditionMet = evaluateCondition(newFieldValue, newValueCondition)

    // If both old and new conditions are met, perform the action
    if (oldConditionMet && newConditionMet) {
      // Perform the desired action
      return action
    }
  }
  return undefined
}

function evaluateCondition(value: any, condition: string): boolean {
  // Implement your condition evaluation logic here
  // For example, check if value meets a certain condition
  return value === condition
}

export const TestTemplateData = {
  id: 'SNIPPET_QjUmXpbyftyxgwU3YdBni',
  title: 'Test Template',

  content: [
    {
      type: 'super-block-content',
      id: 'TEMP_eWez4',
      properties: {
        properties: {
          title: 'Untitled'
        }
      },
      children: [
        {
          type: 'p',
          id: 'TEMP_7eVbG',
          children: [
            {
              type: 'p',
              id: 'defaultValue',
              text: 'This is a test template'
            }
          ]
        }
      ]
    },
    {
      type: 'super-block-task',
      id: 'TEMP_bThtV',
      properties: {
        properties: {
          title: 'Untitled',
          entity: {
            active: 'super-block-task'
          },
          priority: 'medium'
        }
      },
      children: [
        {
          type: 'p',
          id: 'TEMP_wRHYG',
          children: [
            {
              type: 'p',
              id: 'TEMP_kTQQp',
              text: 'This is a task '
            }
          ]
        }
      ]
    },
    {
      type: 'super-block-task',
      id: 'TEMP_Ri9A7',
      properties: {
        properties: {
          conditionId: 'CONDITION_1',
          title: 'Untitled',
          entity: {
            active: 'super-block-task'
          },
          status: 'todo',
          priority: 'low'
        }
      },
      children: [
        {
          type: 'p',
          id: 'TEMP_4Mezq',
          children: [
            {
              type: 'p',
              id: 'TEMP_7q7RE',
              text: 'This is a conditional task 2'
            }
          ]
        }
      ]
    }
  ],
  metadata: {
    createdAt: 1692808312888,
    createdBy: '56d38253-4a11-4a28-a74e-6c632ce0af49',
    lastEditedBy: '56d38253-4a11-4a28-a74e-6c632ce0af49',
    userTags: [],
    pageMetaTags: [],
    conditions: {
      CONDITION_1: {
        field: 'priority',
        oldValue: 'low',
        newValue: 'high',
        action: 'APPEND',
        blockId: 'TEMP_bThtV'
      }
    }
  }
}

export function propertyChangeHandler(data) {
  const nodeMetadata = useMetadataStore.getState().metadata.notes[data.nodeId]
  nodeMetadata.templateId = 'SNIPPET_QjUmXpbyftyxgwU3YdBni'
  if (!nodeMetadata.templateId) return
  const templateData = useSnippetStore.getState().snippets[nodeMetadata.templateId]
  mog('Property Change Template', { templateData })
  if (!templateData) return
  const result = evaluateDecisionTree(data.oldData, data.newData, {
    conditions: templateData.content
      .filter((item) => item.properties.properties.conditionId)
      .map((item) => {
        const condition = templateData.metadata.conditions[item.properties.properties.conditionId]
        return {
          ...condition,
          action: { block: item, type: condition.action }
        }
      })
  })
  mog('Property Change Handler Result', { result })
}
