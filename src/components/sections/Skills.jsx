import styled from '@emotion/styled';
import { SectionGrid, LeftMargin, MainContent, MetaLabel, MetaValue } from '../layout/SectionGrid';

const SectionLabel = styled.div`
  font-family: var(--font-body);
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--rust);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 0.5rem;
`;

const SectionTitle = styled.h2`
  font-family: var(--font-display);
  font-size: 2.5rem;
  font-weight: 400;
  color: var(--ink);
  margin-bottom: 2.5rem;

  @media (min-width: 768px) {
    font-size: 3rem;
  }
`;

const TagContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
`;

const StackTag = styled.div`
  font-family: var(--font-body);
  font-size: 0.875rem;
  color: var(--ink);
  border: 1px solid var(--ink);
  background-color: transparent;
  padding: 0.5rem 1rem;
  transition: all 0.2s ease;
  cursor: default;

  &:hover {
    color: var(--rust);
    border-color: var(--rust);
    background-color: var(--chalk);
  }
`;

const skillsData = [
  'AWS',
  'Terraform',
  'Docker',
  'Python',
  'nginx',
  'Prometheus',
  'Grafana',
  'Linux',
  'Flask',
  'Git'
];

const Skills = () => {
  return (
    <SectionGrid id="skills">
      <LeftMargin>
        <div>
          <MetaLabel>Certs</MetaLabel>
          <MetaValue>AWS SAA</MetaValue>
        </div>
      </LeftMargin>
      <MainContent>
        <SectionLabel>Stack</SectionLabel>
        <SectionTitle>Tools I reach for</SectionTitle>
        <TagContainer>
          {skillsData.map((skill) => (
            <StackTag key={skill}>{skill}</StackTag>
          ))}
        </TagContainer>
      </MainContent>
    </SectionGrid>
  );
};

export default Skills;