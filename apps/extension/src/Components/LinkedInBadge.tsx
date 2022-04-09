import React from 'react'
import styled from 'styled-components'

const BadgeContainer = styled.div`
  display: flex;
  padding: 0 0.5em;
`

export default function LinkedInBadge() {
  return (
    // TODO: A nice tooltip interaction on hover or click would be nice
    <BadgeContainer title="Mex User">
      <svg width="21" height="21" viewBox="0 0 25 25" fill="#5E259C" xmlns="http://www.w3.org/2000/svg">
        <path d="M7.46864 6.60626C4.6221 5.89872 3.12692 4.87024 0.998779 1.64887C3.26109 12.5991 6.63926 17.0542 14.1246 20.6711C10.3438 16.0107 8.13675 12.243 7.46864 6.60626Z" />
        <path d="M18.1871 24.5771C12.9258 17.388 9.8833 9.19526 9.8833 0.974876C11.8094 3.83689 13.0892 4.72996 15.6488 5.75698C16.4071 10.267 18.8129 14.4038 21.8865 17.8868C20.7563 20.5327 20.1171 21.5706 18.1871 24.5771Z" />
        <path d="M22.6654 15.8458C24.1976 10.8041 24.7669 6.68091 24.9988 0.577148C23.1378 3.99264 21.621 5.42155 18.9922 6.29282C19.304 9.07383 20.8285 13.6569 22.6654 15.8458Z" />
      </svg>
    </BadgeContainer>
  )
}
