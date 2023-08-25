import Emittery from 'emittery'

import { useMetadataStore, useSnippetStore } from '../Stores'

import { evaluateDecisionTree } from './decisionTree'
import { generateTempId } from './idGenerator'
import { mog } from './mog'

export class EmitterX {
  private emitter: Emittery

  constructor() {
    this.emitter = new Emittery()
  }

  emitPropertyChange = (currentProperties, newProperty, nodeId: string, templateBlockId: string) => {
    mog('Property Change Handler Event', {
      oldData: { ...currentProperties, blockId: templateBlockId },
      newData: newProperty,
      nodeId
    })

    return this.emitter.emit('propertyChanged', {
      oldData: { ...currentProperties, blockId: templateBlockId },
      newData: newProperty,
      nodeId
    })
  }

  handlePropertyChange = (callback?: (result: any[]) => void) => {
    return this.emitter.on('propertyChanged', propertyChangeHandler(callback))
  }
}

export const emitter = new EmitterX()

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
          conditionId: 'CONDITION_1',
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
        blockId: 'TEMP_qPhYW'
      }
    }
  }
}

const propertyChangeHandler = (callback?) => (data) => {
  const nodeMetadata = useMetadataStore.getState().metadata.notes[data.nodeId]
  nodeMetadata.templateId = 'SNIPPET_QjUmXpbyftyxgwU3YdBni' //Just for testing
  if (!nodeMetadata.templateId) return
  const templateData = TestTemplateData || useSnippetStore.getState().snippets[nodeMetadata.templateId]
  if (!templateData) return
  const result = evaluateDecisionTree(data.oldData, data.newData, {
    conditions: templateData.content
      .filter((item) => item.properties?.properties.conditionId)
      .map((item) => {
        const condition = templateData.metadata.conditions[item.properties.properties.conditionId]
        return {
          ...condition,
          action: { noteId: data.nodeId, block: transformTemplateBlockForInsert(item), type: condition.action }
        }
      })
  })
  if (callback) callback(result)
  mog('Property Change Handler Result', { result })
}

const transformTemplateBlockForInsert = (block) => {
  return {
    ...block,
    id: generateTempId(),
    properties: block.properties.properties
  }
}
