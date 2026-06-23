import styled from '@emotion/styled';

const SectionContainer = styled.section`
  padding: 0;
  width: 100%;
`;

const SectionHeader = styled.div`
  padding: 2.5rem 1.5rem 1.5rem 1.5rem;
  
  @media (min-width: 640px) {
    padding: 3.5rem 2.5rem 2rem 2.5rem;
  }
`;

const SectionLabel = styled.div`
  font-family: var(--font-mono);
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--ink);
  opacity: 0.6;
  text-transform: uppercase;
  letter-spacing: 0.15em;
`;

const ProjectList = styled.div`
  display: flex;
  flex-direction: column;
  border-top: 1px solid var(--ink);
`;

const ProjectRow = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--ink);
  align-items: baseline;
  gap: 0.5rem;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  color: var(--ink);

  @media (min-width: 640px) {
    grid-template-columns: 1.3fr 2fr auto;
    gap: 2rem;
    padding: 1.75rem 2.5rem;
  }

  &:hover {
    background-color: var(--ink);
    color: var(--paper);
    
    .project-title {
      color: var(--paper);
    }
    .project-desc {
      color: var(--paper);
      opacity: 0.9;
    }
    .project-year {
      color: var(--paper);
      opacity: 0.7;
    }
  }
`;

const ProjectTitle = styled.div`
  font-family: var(--font-display);
  font-size: 1.25rem;
  font-weight: 500;
  color: var(--ink);
  transition: color 0.2s ease;
`;

const ProjectDesc = styled.div`
  font-family: var(--font-serif);
  font-style: italic;
  font-size: 1.0625rem;
  color: var(--carbon);
  opacity: 0.85;
  transition: color 0.2s ease, opacity 0.2s ease;
`;

const ProjectYear = styled.div`
  font-family: var(--font-mono);
  font-size: 0.875rem;
  color: var(--ink);
  opacity: 0.6;
  transition: color 0.2s ease, opacity 0.2s ease;

  @media (min-width: 640px) {
    text-align: right;
  }
`;

const projectsData = [
  {
    title: 'MSP AWS Account Assessor',
    desc: 'IAM audit tooling, multi-account',
    year: '2025'
  },
  {
    title: 'NAT Gateway migration',
    desc: 'us-east-2, iptables, cost reduction',
    year: '2024'
  },
  {
    title: '503 incident investigation',
    desc: 'nginx fd exhaustion, Novo AU',
    year: '2024'
  },
  {
    title: 'MSP Auditor Dashboard',
    desc: 'Flask, SSE terminal streaming',
    year: '2025'
  },
  {
    title: 'Void / Voidpulse',
    desc: 'Custom GNOME themes, Fedora',
    year: '2024'
  }
];

const Experience = () => {
  return (
    <SectionContainer id="experience">
      <SectionHeader>
        <SectionLabel>[01] Selected Work</SectionLabel>
      </SectionHeader>
      <ProjectList>
        {projectsData.map((project, idx) => (
          <ProjectRow key={idx}>
            <ProjectTitle className="project-title">{project.title}</ProjectTitle>
            <ProjectDesc className="project-desc">{project.desc}</ProjectDesc>
            <ProjectYear className="project-year">{project.year}</ProjectYear>
          </ProjectRow>
        ))}
      </ProjectList>
    </SectionContainer>
  );
};

export default Experience;