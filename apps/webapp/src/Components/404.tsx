import React, { useEffect } from 'react'
import styled from 'styled-components'

import { CenteredColumn, Link, Title } from '@mexit/shared'
import { Navigate, useNavigate } from 'react-router-dom'

export const ImageWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;

  .defaultProfileIcon {
    padding: 1rem;
    background-color: ${({ theme }) => theme.colors.gray[8]};
    color: ${({ theme }) => theme.colors.primary};
  }
  svg,
  img {
    border-radius: ${({ theme }) => theme.borderRadius.small};
  }
  margin-right: ${({ theme }) => theme.spacing.large};
`

const RouteNotFoundComponent = () => {
  return (
    <CenteredColumn>
      <Title>Uh Oh! Not Found</Title>
      <ImageWrapper>
        <Link to="/">Sweet Home Alabama</Link>
      </ImageWrapper>
    </CenteredColumn>
  )
  return null
}

const RouteNotFound = () => {
  const navigate = useNavigate()
  useEffect(() => {
    navigate('404')
  }, [])

  return <RouteNotFoundComponent />
}

export default RouteNotFound
