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
  margin-bottom: 2rem;
  
  @media (min-width: 768px) {
    font-size: 3rem;
  }
`;

const JobTitle = styled.h3`
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 400;
  color: var(--ink);
  margin-bottom: 0.25rem;
`;

const JobCompany = styled.div`
  font-family: var(--font-body);
  font-size: 0.875rem;
  color: var(--rust);
  margin-bottom: 1.5rem;
  font-weight: 500;
`;

const JobDescription = styled.p`
  font-family: var(--font-body);
  font-size: 0.95rem;
  line-height: 1.7;
  color: var(--ink);
  margin-bottom: 1.5rem;
  max-width: 680px;
`;

const BulletList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const BulletItem = styled.li`
  font-family: var(--font-body);
  font-size: 0.875rem;
  line-height: 1.6;
  color: var(--ink);
  position: relative;
  padding-left: 1.5rem;
  max-width: 680px;

  &:before {
    content: "→";
    position: absolute;
    left: 0;
    color: var(--rust);
  }
`;

const Experience = () => {
  return (
    <SectionGrid id="experience">
      <LeftMargin>
        <div>
          <MetaLabel>Period</MetaLabel>
          <MetaValue>2025 – present</MetaValue>
        </div>
      </LeftMargin>
      <MainContent>
        <SectionLabel>Experience</SectionLabel>
        <SectionTitle>Work history</SectionTitle>
        
        <JobTitle>Junior Engineer - Cloud</JobTitle>
        <JobCompany>Saints and Masters</JobCompany>
        
        <JobDescription>
          Designing and deploying secure, scalable, and automated cloud infrastructure. Bridging the gap between software builds and systems engineering to improve reliability and operational performance.
        </JobDescription>
        
        <BulletList>
          <BulletItem>
            Provisioning and managing cloud-native infrastructure on AWS using Terraform to maintain architecture as code.
          </BulletItem>
          <BulletItem>
            Building and optimizing CI/CD deployment pipelines using automated workflows to support continuous delivery.
          </BulletItem>
          <BulletItem>
            Containerizing microservices and managing configuration configurations across multiple environments.
          </BulletItem>
          <BulletItem>
            Writing infrastructure helper utilities and automation scripts using Bash and Python to eliminate repetitive toil.
          </BulletItem>
          <BulletItem>
            Deploying telemetry setups using Prometheus and Grafana to track system resource utilization and alert on bottlenecks.
          </BulletItem>
        </BulletList>
      </MainContent>
    </SectionGrid>
  );
};

export default Experience;