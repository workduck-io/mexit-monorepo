import { ELEMENT_HR, ELEMENT_SECTION_SEPARATOR, NodeEditorContent } from '@mexit/core'

export const splitToSlides = (content: NodeEditorContent): NodeEditorContent[][] => {
  return content.reduce(
    (acc, val) => {
      if (val.type === ELEMENT_HR) return [...acc, [[]]]
      else {
        const currentSlideIdx = acc.length - 1
        const currentSlide = acc[currentSlideIdx]

        const currectSectionIdx = currentSlide.length - 1
        if (val.type === ELEMENT_SECTION_SEPARATOR) {
          acc[currentSlideIdx] = [...currentSlide, []]
          return acc
        }
        acc[currentSlideIdx][currectSectionIdx] = [...currentSlide[currectSectionIdx], val]

        return acc
      }
    },
    [[[]]]
  )
}
