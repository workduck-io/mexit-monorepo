import fullscreenExitLine from '@iconify/icons-ri/fullscreen-exit-line'
import fullscreenLine from '@iconify/icons-ri/fullscreen-line'
import globalLine from '@iconify/icons-ri/global-line'
import magicLine from '@iconify/icons-ri/magic-line'
// npm install --save-dev @iconify/react @iconify/icons-ri
import { Icon } from '@iconify/react'
import Tippy from '@tippyjs/react'
import * as React from 'react'
import { InputPrompt, InputWrapper, MediaInput } from './MediaEmbedElement.styles'

export const MediaEmbedUrlInput = ({
  url,
  onChange,
  setExpand,
  htmlData,
  max,
  setMax
}: {
  url: string
  onChange: any // eslint-disable-line @typescript-eslint/no-explicit-any
  setExpand: any // eslint-disable-line @typescript-eslint/no-explicit-any
  max: boolean
  setMax: any // eslint-disable-line @typescript-eslint/no-explicit-any
  htmlData: string | undefined
}) => {
  const [value, setValue] = React.useState(url)

  return (
    <InputWrapper>
      <InputPrompt
        onClick={() => {
          setExpand((i: boolean) => !i)
        }}
      >
        {htmlData ? <Icon icon={magicLine} height={18} /> : <Icon icon={globalLine} height={18} />}
      </InputPrompt>
      <MediaInput
        data-testid="MediaEmbedUrlInput"
        value={value}
        onClick={(e) => e.stopPropagation()}
        onChange={(e) => {
          const newUrl = e.target.value
          setValue(newUrl)
          onChange(newUrl)
        }}
      />
      <Tippy
        theme="mex-bright"
        moveTransition="transform 0.25s ease-out"
        placement="right"
        content={max ? 'Minimize' : 'Maximize'}
      >
        <InputPrompt
          onClick={() => {
            setMax((i: boolean) => !i)
          }}
        >
          {max ? <Icon icon={fullscreenExitLine} height={18} /> : <Icon icon={fullscreenLine} height={18} />}
        </InputPrompt>
      </Tippy>
    </InputWrapper>
  )
}
