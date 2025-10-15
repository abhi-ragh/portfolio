import { motion } from 'framer-motion';
import TerminalButton from './TerminalButton';
import styled from '@emotion/styled';

const CardContainer = styled(motion.div)`
  background-color: #1E2430;
  border: 2px solid #00FF41;
  border-radius: 0.5rem;
  padding: 2rem;
  box-shadow: 0 0 10px rgba(0, 255, 65, 0.5),
              0 0 20px rgba(0, 255, 65, 0.3),
              inset 0 0 10px rgba(0, 255, 65, 0.1);
  transition: all 0.3s;
  aspect-ratio: 1.5 / 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  &:hover {
    box-shadow: 0 0 20px rgba(0, 255, 65, 0.8),
                0 0 30px rgba(0, 255, 65, 0.5),
                inset 0 0 20px rgba(0, 255, 65, 0.2);
  }
`;

const ProjectName = styled.h4`
  font-size: 1.25rem;
  font-family: 'JetBrains Mono', monospace;
  color: #00FF41;
  margin-bottom: 0.5rem;
`;

const ProjectTitle = styled.h3`
  font-size: 1.5rem;
  font-family: 'Google Sans', sans-serif;
  font-weight: 500;
  color: #FFFFFF;
  margin-bottom: 1rem;
`;

const ProjectDescription = styled.p`
  color: #8B949E;
  font-family: 'Roboto Mono', monospace;
  font-size: 1rem;
  margin-bottom: 1rem;
`;

const StackContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
`;

const StackTag = styled.span`
  background-color: transparent;
  border: 1px solid #FFFFFF;
  border-radius: 9999px;
  padding: 0.25rem 0.75rem;
  font-size: 0.75rem;
  font-family: 'Roboto Mono', monospace;
  text-transform: uppercase;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 1rem;
`;

const ProjectCard = ({ project }) => {
  return (
    <CardContainer
      whileHover={{ y: -10, scale: 1.02 }}
    >
      <div>
        <ProjectName>./{project.name}</ProjectName>
        <ProjectTitle>{project.title}</ProjectTitle>
        <ProjectDescription>{project.description}</ProjectDescription>
      </div>
      <div>
        <StackContainer>
          {project.stack.map(tech => (
            <StackTag key={tech}>{tech}</StackTag>
          ))}
        </StackContainer>
        <ButtonContainer>
          <TerminalButton text="VIEW CODE" href={project.codeLink} color="red" />
          {project.demoLink && <TerminalButton text="DEMO" href={project.demoLink} color="yellow" />}
        </ButtonContainer>
      </div>
    </CardContainer>
  );
};

export default ProjectCard;