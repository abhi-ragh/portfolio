import styled from '@emotion/styled';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import { motion } from 'framer-motion';

const skills = {
  Languages: ['Python', 'C', 'SQL', 'Bash'],
  Tools: ['Docker', 'Git', 'GitLab CI/CD', 'Terraform', 'Ansible'],
  Cloud: ['AWS', 'Azure', 'GCP'],
  Servers: ['Linux', 'Apache', 'Nginx', 'Windows'],
  Databases: ['MySQL', 'PostgreSQL'],
  'Soft Skills': ['Creativity', 'Critical Thinking', 'Decision Making', 'Time Management', 'Leadership'],
};

const SkillsContainer = styled.section`
  padding: 6rem 0;
  background-color: #0A0E1A;
`;

const Container = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1.5rem;
`;

const SkillsTitle = styled.h2`
  font-size: 2.5rem;
  font-family: 'Google Sans', sans-serif;
  font-weight: 500;
  text-align: center;
  margin-bottom: 4rem;
`;

const SkillsGrid = styled.div`
  display: grid;
  gap: 2rem;
  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const CategoryContainer = styled.div`
  border: 1px solid #00FF41;
  border-radius: 0.5rem;
  padding: 1.5rem;
`;

const CategoryTitle = styled.h3`
  font-size: 1.5rem;
  font-family: 'Roboto Mono', monospace;
  color: #FBBC04;
  margin-bottom: 1rem;
`;

const SkillList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const SkillTag = styled.span`
  border: 2px solid #8B949E;
  border-radius: 0.375rem;
  padding: 0.5rem 1rem;
  font-family: 'Roboto Mono', monospace;
  font-size: 0.875rem;
  cursor: default;
  transition: all 0.3s;
  animation: gentle-float 3s ease-in-out infinite;

  &:nth-of-type(2n) {
    animation-delay: 0.5s;
  }

  &:hover {
    background-color: #00FF41;
    color: #0A0E1A;
    border-color: #00FF41;
  }
`;

const Skills = () => {
  const [ref, isInView] = useScrollAnimation();

  return (
    <SkillsContainer id="skills">
      <Container>
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 30 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        >
          <SkillsTitle>SKILLS_MATRIX</SkillsTitle>
          <p style={{ color: '#8B949E', fontSize: '1.125rem', fontFamily: 'Roboto Mono, monospace', marginBottom: '2rem' }}>
            abhiragh@portfolio:~$ ls skills/
          </p>
          <SkillsGrid>
            {Object.entries(skills).map(([category, list]) => (
              <CategoryContainer key={category}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid #8B949E' }}>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <span style={{ width: '0.75rem', height: '0.75rem', borderRadius: '9999px', backgroundColor: '#FF5F56' }}></span>
                    <span style={{ width: '0.75rem', height: '0.75rem', borderRadius: '9999px', backgroundColor: '#FFBD2E' }}></span>
                    <span style={{ width: '0.75rem', height: '0.75rem', borderRadius: '9999px', backgroundColor: '#27C93F' }}></span>
                  </div>
                </div>
                <CategoryTitle>{category}</CategoryTitle>
                <SkillList>
                  {list.map(skill => (
                    <SkillTag key={skill}>[{skill}]</SkillTag>
                  ))}
                </SkillList>
              </CategoryContainer>
            ))}
          </SkillsGrid>
        </motion.div>
      </Container>
    </SkillsContainer>
  );
};

export default Skills;