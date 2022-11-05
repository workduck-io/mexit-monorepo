import { ELEMENT_H2 } from '@udecode/plate'

import { ELEMENT_PARAGRAPH, mog } from '@mexit/core'

import { SmartCaptureConfig, SmartCaptureURLRegex } from '../Data/SmartCaptureConfig'
import { FormBuilder } from '../Types/Form'
import { convert2DArrayToTable } from './tableUtils'

export const checkURL = (url: string) => {
  for (const URLRegex of SmartCaptureURLRegex) {
    if (url.match(URLRegex.regex)) {
      return URLRegex.WebPage
    }
  }
  return null
}

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

export const getProfileData = async (webPage: string) => {
  const formData: FormBuilder = []
  formData.push({
    id: 'LABEL_1001',
    label: 'Title',
    value: document.title,
    properties: {
      type: ELEMENT_PARAGRAPH
    }
  })
  const captureRules = SmartCaptureConfig[webPage]
  for (const rule of captureRules) {
    const ele = document.evaluate(rule.path, document, null, XPathResult.ANY_TYPE, null).iterateNext()

    if (ele !== null) {
      formData.push({
        id: rule.id,
        label: rule.label,
        value: ele.textContent.trim(),
        properties: rule.properties
      })
    } else {
      mog('value is null')
    }
  }

  mog('FormData', { formData, serialized: formToBlocks(formData) })
  return formData
}
