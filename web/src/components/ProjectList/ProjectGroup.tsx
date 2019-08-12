import React from 'react'
import styled from 'styled-components'
import { Icon, Intent } from '@blueprintjs/core'
import { colors } from '../../design'

const Wrapper = styled.div`
  width: 25rem;
  height: 5.6rem;
  border-radius: 0.4rem;
  box-shadow: 0 0.2rem 0.4rem 0 rgba(17, 24, 43, 0.1);
  background-color: var(--white);
  margin-bottom: 1.2rem;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex: none;
  padding: 0 1.6rem;
`

const Right = styled.div`
  margin-right: 1.2rem;
`

const Title = styled.div`
  font-size: 1.4rem;
  color: var(--grey-1000);
  line-height: 2rem;
  height: 2rem;
`

const Info = styled.div`
  font-size: 1.2rem;
  color: var(--grey-700);
  line-height: 1.6rem;
  height: 1.6rem;
`

const ProjectGroup: React.FC<{ title: string; info: string }> = ({ title, info }) => (
  <Wrapper>
    <Right>
      <Icon
        icon="projects"
        color={colors['--grey-700']}
        iconSize={Icon.SIZE_LARGE}
        intent={Intent.NONE}
      />
    </Right>
    <div>
      <Title>{title}</Title>
      <Info>{info}</Info>
    </div>
  </Wrapper>
)

export default ProjectGroup
