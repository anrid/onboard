import React from 'react'
import styled from 'styled-components'
// import { colors } from '../../design'

const Wrapper = styled.nav`
  flex: none;
  margin-left: 3.6rem;
  margin-right: 4.8rem;
  padding: 2.6rem 0;
  width: 20.1rem;
  height: 100vh;
`

const SmallTitle = styled.div`
  width: 100%;
  padding: 0 1.2rem;
  font-size: 1.2rem;
  color: var(--grey-800);
  margin-bottom: 0.4rem;
`

const BigTitle = styled.div`
  width: 100%;
  padding: 0 1.2rem;
  font-size: 2rem;
  font-weight: 800;
  color: var(--grey-1000);
  margin-bottom: 2.4rem;
`

const MenuItem = styled.div`
  width: 100%;
  height: 4rem;
  padding: 0 1.2rem;
  border-radius: 0.4rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  :hover {
    background-color: var(--grey-200);
  }
`

const MenuItemText = styled.div`
  font-size: 1.4rem;
  color: var(--grey-1000);
`

const MenuItemCount = styled.div`
  font-size: 1.2rem;
  color: var(--grey-800);
`

const ActiveMenuItem = styled(MenuItem)`
  position: relative;
  background-color: var(--white);
  :hover {
    background-color: var(--white);
  }
`

const ActiveMenuItemBar = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 0.2rem;
  height: 4rem;
  border-top-left-radius: 0.4rem;
  border-bottom-left-radius: 0.4rem;
  box-shadow: 0 0.5rem 1rem 0 var(--seafoam-green-50);
  background-image: linear-gradient(183deg, #31fbb3, var(--aquamarine) 69%, var(--teal-700));
`

const Divider = styled.div`
  margin: 1.9rem 0;
  height: 0.1rem;
  width: 100%;
  background-color: var(--grey-300);
`

const LeftMenu: React.FC = () => {
  return (
    <Wrapper>
      <SmallTitle>Taskworld Japan</SmallTitle>
      <BigTitle>Projects</BigTitle>
      <ActiveMenuItem>
        <ActiveMenuItemBar />
        <MenuItemText>My Projects</MenuItemText>
        <MenuItemCount>9</MenuItemCount>
      </ActiveMenuItem>
      <MenuItem>
        <MenuItemText>Starred Projects</MenuItemText>
        <MenuItemCount>4</MenuItemCount>
      </MenuItem>
      <MenuItem>
        <MenuItemText>All Projects</MenuItemText>
        <MenuItemCount>100+</MenuItemCount>
      </MenuItem>
      <Divider />
      <MenuItem>
        <MenuItemText>Archived</MenuItemText>
        <MenuItemCount>50</MenuItemCount>
      </MenuItem>
    </Wrapper>
  )
}

export default LeftMenu
