import React from 'react'

import styled from 'styled-components'

import { Title } from '@mexit/shared'

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

  ${Title} {
    margin: 0;
    margin-top: ${({ theme }) => theme.spacing.medium};
  }
  section {
    display: flex;
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.small};
    border-radius: ${({ theme }) => theme.borderRadius.small};
    padding: ${({ theme }) => theme.spacing.small};
    background-color: ${({ theme }) => theme.tokens.surfaces.modal};
    min-width: 220px;
    ${Title} {
      font-size: 1rem;
      color: ${({ theme }) => theme.tokens.text.fade};
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
      background-color: ${({ theme }) => theme.tokens.surfaces.s[3]};
      box-shadow: ${({ theme }) => theme.tokens.shadow.small};
    }
  }
`

const SpecialSyntax = styled.span`
  color: ${({ theme }) => theme.tokens.colors.secondary};
`

const AutoformatHelp = () => {
  return (
    <AutoFormatWrapper>
      <Title>Markdown Hints</Title>
      <p>
        When you insert a <SpecialSyntax>Special Charaters</SpecialSyntax> we expand and transform the content as below:
      </p>
      <HintsContainer>
        <HintColumn>
          <section>
            <Title>Formatting</Title>
            <p>
              <b>Bold</b>
              <code>
                <SpecialSyntax>**</SpecialSyntax>bold<SpecialSyntax>**</SpecialSyntax>
              </code>
            </p>
            <p>
              <i>Italic</i>
              <code>
                <SpecialSyntax>*</SpecialSyntax>italic<SpecialSyntax>*</SpecialSyntax>
              </code>
            </p>
            <p>
              <b>Strikethrough</b>
              <code>
                <SpecialSyntax>~~</SpecialSyntax>strikethrough<SpecialSyntax>~~</SpecialSyntax>
              </code>
            </p>
          </section>
          <section>
            <Title>Headers</Title>
            <p>
              <code>
                <SpecialSyntax>h1</SpecialSyntax> Header 1
              </code>
              <code>
                <SpecialSyntax>h2</SpecialSyntax> Header 2
              </code>
              <code>
                <SpecialSyntax>h3</SpecialSyntax> Header 3
              </code>
              <code>
                <SpecialSyntax>h4</SpecialSyntax> Header 4
              </code>
            </p>
          </section>
        </HintColumn>

        <HintColumn>
          <section>
            <Title>Lists</Title>
            <p>
              <b>Unordered Lists</b>
              <code>
                <SpecialSyntax>*</SpecialSyntax> Item 1
              </code>
            </p>
            <p>
              <b>Ordered Lists</b>
              <code>
                <SpecialSyntax>1.</SpecialSyntax> Item 1
              </code>
            </p>
          </section>
          <section>
            <Title>Tasks</Title>
            <p>
              <code>
                <SpecialSyntax>[]</SpecialSyntax> Task 1
              </code>
            </p>
          </section>
          <section>
            <Title>Code</Title>
            <p>
              <b>Code Text</b>
              <code>
                <SpecialSyntax>`</SpecialSyntax>code<SpecialSyntax>`</SpecialSyntax>
              </code>
            </p>
            <p>
              <b>Code Block</b>
              <code>
                <SpecialSyntax>```</SpecialSyntax>code block<SpecialSyntax>```</SpecialSyntax>
              </code>
            </p>
          </section>
        </HintColumn>
      </HintsContainer>
    </AutoFormatWrapper>
  )
}

export default AutoformatHelp
