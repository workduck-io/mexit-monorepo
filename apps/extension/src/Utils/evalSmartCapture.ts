import { ELEMENT_H2 } from '@udecode/plate'

import { ELEMENT_PARAGRAPH, SmartCaptureConfig as SmartCaptureConfigType, SmartCaptureLabel } from '@mexit/core'

import { FormBuilder } from '../Types/Form'
import { convert2DArrayToTable } from './tableUtils'

export const formToBlocks = (formData: FormBuilder, convertToTable = false) => {
  if (convertToTable) {
    const dataArray = formData.map((item) => {
      return [item.label, item.value]
    })

    return [convert2DArrayToTable(dataArray)]
  } else
    return formData.map((item) => {
      //TODO: Add cases for all types
      if (item.properties.type == ELEMENT_PARAGRAPH) {
        return {
          type: ELEMENT_PARAGRAPH,
          children: [
            {
              text: item.label + ': ',
              properties: { bold: true }
            },
            {
              text: item.value
            }
          ]
        }
      } else if (item.properties.type == ELEMENT_H2) {
        return {
          type: ELEMENT_H2,
          children: [
            {
              text: item.value,
              children: [{ text: '' }]
            }
          ]
        }
      }
    })
}

const extractData = (rule: SmartCaptureLabel) => {
  const ele = document.evaluate(rule.path, document, null, XPathResult.ANY_TYPE, null).iterateNext()

  if (ele !== null) {
    return {
      id: rule.id,
      label: rule.name,
      value: ele.textContent.trim(),
      properties: rule.properties
    }
  }
}

export const evaluateConfig = async (config: SmartCaptureConfigType) => {
  const formData: FormBuilder = []
  formData.push({
    id: 'LABEL_1001',
    label: 'Title',
    value: document.title,
    properties: {
      type: ELEMENT_PARAGRAPH
    }
  })
  for (const rule of config.labels) {
    const data = extractData(rule)
    if (data) {
      formData.push(data)
    }
  }
  return formData
}
