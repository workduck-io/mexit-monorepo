import { Title } from '@mexit/shared'
import { transparentize } from 'polished'
import React from 'react'
import styled from 'styled-components'

const HintColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.small};
`

const HintsContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: ${({ theme }) => theme.spacing.small};
`

const AutoFormatWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 440px;
  gap: ${({ theme }) => theme.spacing.small};
  padding: ${({ theme }) => theme.spacing.small};

  section {
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.small};
    border-radius: ${({ theme }) => theme.borderRadius.small};
    padding: ${({ theme }) => theme.spacing.small};
    background-color: ${({ theme }) => theme.colors.gray[8]};
    min-width: 220px;
    ${Title} {
      font-size: 1rem;
      color: ${({ theme }) => theme.colors.text.fade};
      margin: 0;
    }
    p {
      display: flex;
      flex-direction: column;
      gap: ${({ theme }) => theme.spacing.small};
      margin: 0;
    }
    code {
      margin-bottom: ${({ theme }) => theme.spacing.tiny};
      padding: ${({ theme }) => theme.spacing.tiny};
      border-radius: ${({ theme }) => theme.borderRadius.tiny};
      font-size: 0.9rem;
      background-color: ${({ theme }) => transparentize(0.5, theme.colors.gray[7])};
    }
  }
`

const AutoformatHelp = () => {
  return (
    <AutoFormatWrapper>
      <Title>Markdown Hints</Title>
      <HintsContainer>
        <HintColumn>
          <section>
            <Title>Formatting</Title>
            <p>
              <b>Bold</b>
              <code>**bold**</code>
            </p>
            <p>
              <i>Italic</i>
              <code>*italic*</code>
            </p>
            <p>
              <b>Strikethrough</b>
              <code>~~Striked Text~~</code>
            </p>
          </section>
          <section>
            <Title>Headers</Title>
            <p>
              <code>h1 Header 1</code>
              <code>h2 Header 2</code>
              <code>h3 Header 3</code>
              <code>h4 Header 4</code>
            </p>
          </section>
        </HintColumn>

        <HintColumn>
          <section>
            <Title>Lists</Title>
            <p>
              <b>Unordered Lists</b>
              <code>- list item</code>
            </p>
            <p>
              <b>Ordered Lists</b>
              <code>1. list item</code>
            </p>
          </section>
          <section>
            <Title>Tasks</Title>
            <p>
              <code>[] Task Item</code>
            </p>
          </section>
          <section>
            <Title>Code</Title>
            <p>
              <b>Code Text</b>
              <code>`Code text`</code>
            </p>
            <p>
              <b>Code Block</b>
              <code>``` Code Block ```</code>
            </p>
          </section>
        </HintColumn>
      </HintsContainer>
    </AutoFormatWrapper>
  )
}

export default AutoformatHelp
