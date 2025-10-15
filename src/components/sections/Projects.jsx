import ProjectCard from '../ui/ProjectCard';
import { projects } from '../../projects.js';
import styled from '@emotion/styled';
import { useParallax } from '../../hooks/useParallax';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import { motion } from 'framer-motion';

const ProjectsContainer = styled.section`
  padding: 6rem 0;
  background-color: #0A0E1A;
  background-image: 
    linear-gradient(rgba(0, 255, 65, 0.1) 1px, transparent 1px),
    linear-gradient(90deg, rgba(0, 255, 65, 0.1) 1px, transparent 1px);
  background-size: 40px 40px;
`;

const Container = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1.5rem;
`;

const ProjectsTitle = styled.h2`
  font-size: 2.5rem;
  font-family: 'Google Sans', sans-serif;
  font-weight: 500;
  text-align: center;
  margin-bottom: 4rem;
`;

const ProjectsGrid = styled.div`
  display: grid;
  gap: 2rem;
  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const Projects = () => {
  const parallaxSpeed = 0.3;
  const yPos = useParallax(parallaxSpeed);
  const [ref, isInView] = useScrollAnimation();

  return (
    <ProjectsContainer id="projects" style={{ backgroundPositionY: yPos }}>
      <Container>
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 30 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        >
          <ProjectsTitle>PROJECTS_DIRECTORY</ProjectsTitle>
          <ProjectsGrid>
            {projects.map((project, index) => (
              <ProjectCard key={index} project={project} />
            ))}
          </ProjectsGrid>
        </motion.div>
      </Container>
    </ProjectsContainer>
  );
};

export default Projects;