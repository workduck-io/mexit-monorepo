import styled from 'styled-components'
import { Icon } from '@iconify/react'
export const MeterContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: -1rem;
  margin-bottom: -1.5rem;
`

export const PasswordRequirements = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: -0.75rem;
`

export const Meter = styled.div<{ color: string }>`
  height: 0.15rem;
  width: 21%;
  background-color: ${({ color }) => {
    return `${color}`
  }};
  border-radius: 0.5rem;
`

export const MeterWrapper = styled.div`
  width: 90%;
  display: flex;
  align-items: center;
  justify-content: space-around;
`

export const MeterInfo = styled.div<{ color: string }>`
  width: 12%;
  font-size: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ color }) => {
    return color
  }};
`

export const Requirement = styled.div`
  display: flex;
  align-items: center;
  font-size: 0.5rem;
`

export const RequirementWrapper = styled.div`
  width: 98%;
  padding: 0.25rem 0.35rem;
  display: flex;
  justify-content: space-between;
`

export const RequirementIcon = styled(Icon)<{ status: boolean }>`
  margin-top: -0.15rem;
  margin-right: 0.1rem;
  color: ${({ status }) => {
    return status ? '#17C788' : '#FF1744'
  }};
`
