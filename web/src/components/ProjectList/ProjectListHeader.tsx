import React from 'react'
import styled from 'styled-components'
import { HTMLSelect, InputGroup } from '@blueprintjs/core'

const Header = styled.header`
  margin-top: 3.2rem;
  margin-bottom: 2.4rem;
  width: 100%;
  height: 3.6rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.6rem;
  font-weight: 600;
  color: var(--grey-1000);
`

const Left = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
`
const Right = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  & > *:not(:first-child) {
    margin-left: 1.2rem;
  }
`

const Select = styled.div`
  padding: 0 1.2rem;
  border-radius: 0.4rem;
  background-color: var(--white);
  display: flex;
  justify-content: flex-start;
  align-items: center;
  span {
    font-size: 1.2rem;
    font-weight: normal;
    color: var(--grey-800);
  }
  & > .bp3-html-select > select {
    background-image: none;
    background-color: var(--white);
    box-shadow: none;
    padding-right: 4rem;
    height: 3.6rem;
  }
  & > .bp3-html-select > .bp3-icon {
    top: 1rem;
    right: 0rem;
  }
`

const SearchBox = styled.div`
  & > .bp3-input-group > .bp3-input {
    height: 3.6rem;
    padding-left: 3.2rem;
    box-shadow: none;
  }
  .bp3-icon {
    margin: 0.9rem;
  }
`

const sortOptions = [
  { label: 'Recent', value: 'sort-by-recent' },
  { label: 'Activity', value: 'sort-by-activity' },
]

const ProjectListHeader: React.FC = () => {
  return (
    <Header>
      <Left>My Projects</Left>
      <Right>
        <Select>
          <span>Sort by</span>
          <HTMLSelect options={sortOptions} iconProps={{ icon: 'chevron-down' }} />
        </Select>
        <SearchBox>
          <InputGroup leftIcon="search" placeholder="Search Projects ..." />
        </SearchBox>
      </Right>
    </Header>
  )
}

export default ProjectListHeader
