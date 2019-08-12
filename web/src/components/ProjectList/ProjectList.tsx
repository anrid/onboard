import React from 'react'
import styled from 'styled-components'
import ProjectListHeader from './ProjectListHeader'
import ProjectGroup from './ProjectGroup'
import Project from './Project'

const Wrapper = styled.section`
  width: 100%;
  margin-right: 4.8rem;
`

const Title = styled.div`
  margin: 1.2rem 0 1.2rem 0;
  width: 100%;
  font-size: 1.4rem;
  font-weight: bold;
  color: var(--grey-1000);
`

const ProjectGroups = styled.section`
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  flex-wrap: wrap;
  & > div + div {
    margin-left: 1.2rem;
  }
`

const Projects = styled.section`
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  flex-wrap: wrap;
  & > div + div {
    margin-left: 1.2rem;
  }
`

const ProjectList: React.FC = () => {
  return (
    <Wrapper>
      <ProjectListHeader />

      <Title>Project Groups</Title>
      <ProjectGroups>
        <ProjectGroup title="IT Projects" info="2 projects" />
        <ProjectGroup title="HR Projects" info="4 projects" />
      </ProjectGroups>

      <Title>Projects</Title>
      <Projects>
        <Project
          project={{ id: 'a', name: 'Project A', tasks_count: 10, completed_tasks_count: 3 }}
          starred
        />
        <Project
          project={{ id: 'b', name: 'Project B', tasks_count: 10, completed_tasks_count: 3 }}
          starred
        />
      </Projects>
    </Wrapper>
  )
}

export default ProjectList
