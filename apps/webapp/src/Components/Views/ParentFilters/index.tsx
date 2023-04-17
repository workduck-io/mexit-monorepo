import { useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'

import { Icon } from '@iconify/react'
import { useTheme } from 'styled-components'

import { DefaultMIcons, FilterJoinDiv, getMIcon, Group, IconDisplay, SearchFilterWrapper } from '@mexit/shared'

import { DisplayFilter } from '../../../Components/Filters/Filter'
import { getFilterJoinIcon } from '../../../Hooks/useFilterValueIcons'
import { useViews } from '../../../Hooks/useViews'

import {
  CloseContainer,
  ParentFilter,
  ParentFilterContainer,
  ParentFiltersGrouped,
  StyledParentFilters
} from './styled'

type ParentFilters = {
  filters: Array<any>
}

const ParentFilters: React.FC<{ currentViewId?: string; noMargin?: boolean }> = ({ currentViewId, noMargin }) => {
  const [expanded, setExpanded] = useState(false)

  const theme = useTheme()
  const viewId = currentViewId ?? useParams().viewid
  const { getView, getParentViewFilters } = useViews()

  const parentFilters = useMemo(() => {
    const path = getView(viewId)?.path

    return getParentViewFilters(path)
  }, [viewId])

  if (!parentFilters.length) return null

  return (
    <StyledParentFilters $noMargin={noMargin}>
      <Group>
        <IconDisplay color={theme.tokens.colors.primary.default} icon={getMIcon('ICON', 'ri:filter-2-line')} />
        <span>Pre-Applied Filters</span>
        {!expanded && (
          <ParentFiltersGrouped onClick={() => setExpanded(true)}>
            {parentFilters.map(({ label, id }, i) => (
              <Group>
                <ParentFilter>
                  <IconDisplay color={theme.tokens.colors.primary.default} icon={DefaultMIcons.VIEW} />
                  <span>{label}</span>
                </ParentFilter>
                {i !== parentFilters.length - 1 && (
                  <FilterJoinDiv>
                    <IconDisplay icon={getFilterJoinIcon('all')} />
                    and
                  </FilterJoinDiv>
                )}
              </Group>
            ))}
          </ParentFiltersGrouped>
        )}
      </Group>
      {expanded && (
        <ParentFilterContainer>
          {parentFilters.map(({ id, label, filters }, i) => {
            return (
              <SearchFilterWrapper key={`${id}_${i}`}>
                <Group>
                  <Group>
                    <IconDisplay color={theme.tokens.colors.primary.default} icon={DefaultMIcons.VIEW} />
                    <span>{label}:</span>
                  </Group>
                  <Group>
                    {filters.map((filter, i) => {
                      return (
                        <DisplayFilter
                          key={`${filter.id}_${filter.type}`}
                          filter={filter}
                          hideJoin={i === filters.length - 1}
                        />
                      )
                    })}
                  </Group>
                </Group>
              </SearchFilterWrapper>
            )
          })}
          <CloseContainer>
            <Icon icon={DefaultMIcons.CLEAR.value} onClick={() => setExpanded(false)} />
          </CloseContainer>
        </ParentFilterContainer>
      )}
    </StyledParentFilters>
  )
}

export default ParentFilters
