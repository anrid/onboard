import React, { useState } from 'react'
import styled from 'styled-components'
import { Icon, Intent } from '@blueprintjs/core'
import { colors } from '../../design'
// import star from '../../img/icon-star-active-s.svg'

interface IProject {
  id: string
  name: string
  tasks_count: number
  completed_tasks_count: number
}

const Wrapper = styled.div`
  width: 25rem;
  height: 17rem;
  border-radius: 0.4rem;
  box-shadow: 0 0.2rem 0.4rem 0 rgba(17, 24, 43, 0.1);
  background-color: var(--white);
  margin-bottom: 1.2rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  flex: none;
  padding: 1.6rem;
  user-select: none;
`

const Top = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const Bottom = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
`

const Name = styled.div`
  font-size: 1.6rem;
  color: var(--grey-1000);
  line-height: 2rem;
  height: 2rem;
`

const Info = styled.div`
  font-size: 1.2rem;
  color: var(--grey-700);
  line-height: 1.6rem;
  height: 1.6rem;
  user-select: none;
`

const Star = styled.div`
  cursor: pointer;
`

const Project: React.FC<{ project: IProject; starred: boolean }> = ({ project, starred }) => {
  const [isStarred, setStar] = useState(starred)
  return (
    <Wrapper>
      <Top>
        <Name>{project.name}</Name>
        <Star onClick={() => setStar(!isStarred)}>
          {isStarred ? (
            <Icon
              icon="star"
              color={colors['--red-600']}
              iconSize={Icon.SIZE_STANDARD}
              intent={Intent.NONE}
            />
          ) : (
            <Icon
              icon="star-empty"
              color={colors['--grey-300']}
              iconSize={Icon.SIZE_STANDARD}
              intent={Intent.NONE}
            />
          )}
        </Star>
      </Top>
      <Bottom>
        <Info>{project.tasks_count}</Info>
      </Bottom>
    </Wrapper>
  )
}

export default Project
