import React from 'react'
import logo from '../../img/logo.svg'
import { Icon, Intent } from '@blueprintjs/core'
import styled from 'styled-components'
import { colors } from '../../design'
import bigTrouble from '../../img/bigtrouble.jpg'

const Wrapper = styled.nav`
  flex: none;
  background-color: var(--white);
  padding: 0.8rem 0;
  width: 6.4rem;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
`

const Logo = styled.img`
  width: 4.8rem;
  height: 5.6rem;
`

const PlusButton = styled.div`
  width: 4.8rem;
  height: 4.8rem;
  object-fit: contain;
  border-radius: 0.8rem;
  box-shadow: 0 0.5rem 1rem 0 var(--seafoam-green-50);
  background-image: linear-gradient(225deg, #31fbb3, var(--aquamarine) 69%, var(--teal-700));
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--white);
  cursor: pointer;
`

const Button = styled.div<{ active?: boolean }>`
  position: relative;
  width: 4.8rem;
  height: 4.8rem;
  border-radius: 0.8rem;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(${(props) => (props.active ? '--grey-200' : '--white')});
  cursor: pointer;
  :hover {
    background-color: var(--grey-200);
  }
`

const Avatar = styled.div<{ url: string }>`
  width: 4.8rem;
  height: 4.8rem;
  border-radius: 0.8rem;
  background-image: url(${({ url }) => url});
  background-size: cover;
  cursor: pointer;
`

const Upper = styled.section`
  & > *:not(:first-child) {
    margin-top: 1.2rem;
  }
`
const Lower = styled.section`
  & > *:not(:last-child) {
    margin-bottom: 1.2rem;
  }
`

const Badge = styled.div`
  position: absolute;
  top: 1.4rem;
  right: -0.2rem;
  width: 1.8rem;
  height: 1.8rem;
  box-shadow: 0 0.5rem 1rem 0 rgba(255, 173, 133, 0.5);
  background-image: linear-gradient(225deg, #ffad85, var(--red-600));
  color: var(--white);
  font-weight: bold;
  font-size: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 0.6rem;
  transform: rotateZ(45deg);
  span {
    transform: rotateZ(-45deg);
  }
`

const LeftNav: React.FC = () => {
  return (
    <Wrapper>
      <Upper>
        <Logo src={logo} alt="logo" />
        <PlusButton>
          <Icon
            icon="plus"
            color={colors['--white']}
            iconSize={Icon.SIZE_LARGE}
            intent={Intent.NONE}
          />
        </PlusButton>
        <Button>
          <Icon
            icon="home"
            color={colors['--grey-900']}
            iconSize={Icon.SIZE_LARGE}
            intent={Intent.NONE}
          />
        </Button>
        <Button active>
          <Icon
            icon="folder-close"
            color={colors['--grey-900']}
            iconSize={Icon.SIZE_LARGE}
            intent={Intent.NONE}
          />
        </Button>
        <Button>
          <Icon
            icon="stacked-chart"
            color={colors['--grey-900']}
            iconSize={Icon.SIZE_LARGE}
            intent={Intent.NONE}
          />
        </Button>
        <Button>
          <Icon
            icon="people"
            color={colors['--grey-900']}
            iconSize={Icon.SIZE_LARGE}
            intent={Intent.NONE}
          />
        </Button>
      </Upper>
      <Lower>
        <Button>
          <Icon
            icon="chat"
            color={colors['--grey-900']}
            iconSize={Icon.SIZE_LARGE}
            intent={Intent.NONE}
          />
          <Badge>
            <span>7</span>
          </Badge>
        </Button>
        <Button>
          <Avatar url={bigTrouble} />
        </Button>
      </Lower>
    </Wrapper>
  )
}

export default LeftNav
