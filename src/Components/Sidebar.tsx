import React from 'react'
import styled from 'styled-components'
import useDataStore from '../store/useDataStore'

const Container = styled.div`
  width: 20rem;
  border-right: 1px solid #333;
`

function Sidebar() {
  const ilinks = useDataStore((store) => store.ilinks)
  const tags = useDataStore((store) => store.tags)
  return (
    <Container>
      <section>
        {ilinks.map((i) => (
          <div key={i.nodeid}>{`${i.path}: ${i.nodeid}`}</div>
        ))}
      </section>
      <br />
      <section>
        {tags.map((i, index) => (
          <div key={`TAG_${index}_${index.toString()}`}>{i.value}</div>
        ))}
      </section>
    </Container>
  )
}

export default Sidebar
