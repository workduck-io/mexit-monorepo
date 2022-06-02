import { ELEMENT_H1, ELEMENT_PARAGRAPH } from '@udecode/plate'

const HEADINGS = 100
const PARAGRAPHS = 7

const heading = `Sizzle dang. Aliquam break yo neck, yall massa a mauris.`
const paragraph = `Sizzle tortor in we gonna chung ultricies consequizzle. Crazy bow wow wow, arcu ac dignissizzle posuere, black lorizzle tellivizzle dang, a blandizzle sizzle dolizzle black velizzle. Pellentesque izzle shut the shizzle up nec elizzle varizzle tincidunt. Curabitur turpizzle nisi, pulvinar at, shizzle my nizzle crocodizzle eleifend, check it out izzle, metus. Nunc rizzle neque. Mammasay mammasa mamma oo sa its fo rizzle i saw beyonces tizzles and my pizzle went crizzle sit amet, consectetuer adipiscing the bizzle. Fo shizzle my nizzle dang elit. In bow wow wow. Vestibulum shizznit erizzle pot velizzle pot dictizzle. Dang bling bling mammasay mammasa mamma oo sa sizzle amet nibh. Its fo rizzle commodo. For sure eu pimpin' izzle neque lacinia mofo. Aenizzle shizznit massa get down get down urna pharetra lobortis. Hizzle enizzle est, bibendizzle pulvinizzle, you son of a bizzle funky fresh, imperdizzle vitae, lacus. Break yo neck, yall fo shizzle mah nizzle fo rizzle, mah home g-dizzle own yo' izzle massa fizzle shizznit. Curabitur dizzle nisl quis you son of a bizzle ornare nonummy.`

export const getHugeDocument = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const hugeDocument: any[] = []

  for (let h = 0; h < HEADINGS; h++) {
    hugeDocument.push({
      type: ELEMENT_H1,
      children: [{ text: heading }]
    })

    for (let p = 0; p < PARAGRAPHS; p++) {
      hugeDocument.push({
        type: ELEMENT_PARAGRAPH,
        children: [{ text: paragraph }]
      })
    }
  }

  return hugeDocument
}
