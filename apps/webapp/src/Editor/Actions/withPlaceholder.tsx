import { ELEMENT_PARAGRAPH, ELEMENT_TH, withPlaceholders } from '@udecode/plate'


export const withStyledPlaceHolders = (components: any) => {
  return withPlaceholders(components, [
    {
      key: ELEMENT_PARAGRAPH,
      placeholder: 'Type  `[[`  to see links or type  `/`  to see actions',
      hideOnBlur: true
    },
    {
      key: ELEMENT_TH,
      placeholder: 'Header',
      hideOnBlur: true
    }
  ])
}
