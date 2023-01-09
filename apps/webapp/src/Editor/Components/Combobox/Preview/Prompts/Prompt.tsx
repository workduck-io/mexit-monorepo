import { PromptDataType } from '@mexit/core'
import { Group } from '@mexit/shared'

import { PromptDescription, PromptPreviewContainer, PromptTitle } from './styled'

type PromptProps = {
  prompt: PromptDataType
}

const Prompt: React.FC<PromptProps> = ({ prompt }) => {
  // const isLoading = useComboboxStore((s) => s.itemLoading?.item === prompt.entityId)

  return (
    <PromptPreviewContainer>
      <Group>
        {/* <IconDisplay isLoading={isLoading} icon={DefaultMIcons.PROMPT} size={18} /> */}
        <PromptTitle>{prompt.title}</PromptTitle>
      </Group>
      <PromptDescription>{prompt.description}</PromptDescription>
    </PromptPreviewContainer>
  )
}

export default Prompt
