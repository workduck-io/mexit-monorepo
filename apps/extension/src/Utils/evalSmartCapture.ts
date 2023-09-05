import { ELEMENT_H2 } from '@udecode/plate'

import {
  createSuperBlockContent,
  ELEMENT_PARAGRAPH,
  NodeEditorContent,
  SmartCaptureConfig as SmartCaptureConfigType,
  SmartCaptureLabel,
  SuperBlocks
} from '@mexit/core'

import { FormBuilder } from '../Types/Form'

import { convert2DArrayToTable } from './tableUtils'

export const formToBlocks = (formData: FormBuilder, convertToTable = false) => {
  let content = [] as NodeEditorContent

  if (convertToTable) {
    const dataArray = formData.map((item) => {
      return [item.label, item.value]
    })

    content = [convert2DArrayToTable(dataArray)]
  } else {
    content = formData.map((item) => {
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

  return createSuperBlockContent(SuperBlocks.CAPTURE, content)
}

const extractData = (rule: SmartCaptureLabel) => {
  const ele = document.evaluate(rule.path, document, null, XPathResult.ANY_TYPE, null).iterateNext()
  if (ele !== null) {
    return {
      id: rule.id,
      label: rule.name,
      field: rule.field,
      value: ele.textContent.trim(),
      properties: rule.properties
    }
  }
}

export const evaluateConfig = (config: SmartCaptureConfigType) => {
  const formData: FormBuilder = []
  formData.push(
    {
      id: 'LABEL_1001',
      label: 'Title',
      field: 'heading',
      value: document.title,
      properties: {
        type: ELEMENT_PARAGRAPH
      }
    },
    {
      id: 'LABEL_1001',
      label: 'Email',
      field: 'email',
      value: 'example@gmail.com',
      properties: {
        icon: 'email',
        type: ELEMENT_PARAGRAPH
      }
    }
  )
  for (const rule of config.labels) {
    const data = extractData(rule)
    if (data) {
      formData.push(data)
    }
  }
  return formData
}
