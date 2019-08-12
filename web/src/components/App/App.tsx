import React from 'react'
import styled from 'styled-components'
import LeftNav from '../LeftNav/LeftNav'
import LeftMenu from '../LeftMenu/LeftMenu'
import ProjectList from '../ProjectList/ProjectList'

const Wrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  background-color: var(--grey-50);
  min-width: 100vw;
`

const App: React.FC = () => {
  return (
    <Wrapper>
      <LeftNav />
      <LeftMenu />
      <ProjectList />
    </Wrapper>
  )
}

export default App
