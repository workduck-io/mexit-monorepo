import React, { useState } from 'react'
import styled from 'styled-components'
import { Logout } from './Auth'

const Image = styled.div`
  height: 50px;
  width: 50px;
  border-radius: 50%;
  background: #ccc;
`

const Dropdown = styled.div<{ show: boolean }>`
  display: ${(props) => (props.show ? 'flex' : 'none')};
  flex-direction: column;

  background: ${({ theme }) => theme.colors.background};
`

export default function UserDropdown() {
  const [showDropdown, setShowDropdown] = useState(false)

  return (
    <div>
      <Image onClick={() => setShowDropdown(!showDropdown)} />
      <Dropdown show={showDropdown}>
        <Logout />
      </Dropdown>
    </div>
  )
}
