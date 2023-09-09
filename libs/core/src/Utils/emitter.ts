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
    return this.emitter
      .emit('propertyChanged', {
        oldData: { ...currentProperties, blockId: templateBlockId },
        newData: newProperty,
        nodeId
      })
      .then((d) => {
        mog('Property Change Handler Event', {
          oldData: { ...currentProperties, blockId: templateBlockId },
          newData: newProperty,
          nodeId,
          d
        })
      })
      .catch((err) => {
        console.log('HELLO', err)
      })
  }

  handlePropertyChange = (callback?: (result: any[]) => Promise<void>) => {
    mog('Listening for property change', { a: 1 })
    return this.emitter.on('propertyChanged', propertyChangeHandler(callback))
  }
}

export const emitter = new EmitterX()

const propertyChangeHandler = (callback?) => (data) => {
  const nodeMetadata = useMetadataStore.getState().metadata.notes[data.nodeId]
  nodeMetadata.usedTemplateID = 'SNIPPET_wNfTU6ywm4fYFAi6mtKAX' //Just for testing

  if (!nodeMetadata.usedTemplateID) return
  const templateData = useSnippetStore.getState().snippets[nodeMetadata.usedTemplateID]
  mog("Node's metadata", { templateData })

  if (!templateData) return

  const result = evaluateDecisionTree(data.oldData, data.newData, {
    conditions: templateData.content
      .filter((item) => item.properties?.properties?.conditionId)
      .map((item) => {
        const condition = templateData.metadata.conditions[item.properties?.properties?.conditionId]
        return {
          ...condition,
          action: { noteId: data.nodeId, block: transformTemplateBlockForInsert(item), type: condition.action }
        }
      })
  })

  if (callback) callback(result)
}

export const transformTemplateBlockForInsert = (block) => {
  return {
    ...block,
    id: generateTempId(),
    properties: { ...block.properties, templateBlockId: block.id }
  }
}
