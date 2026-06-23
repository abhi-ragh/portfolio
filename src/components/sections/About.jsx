import styled from '@emotion/styled';

const AboutContainer = styled.section`
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

const AboutContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 800px;
  padding: 0 1.5rem 2.5rem 1.5rem;
  
  @media (min-width: 640px) {
    padding: 0 2.5rem 4.5rem 2.5rem;
  }
`;

const BioParagraph = styled.p`
  font-family: var(--font-body);
  font-size: 1.25rem;
  line-height: 1.6;
  color: var(--carbon);
  letter-spacing: -0.01em;
`;

const TagContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 2rem;
`;

const TechTag = styled.span`
  font-family: var(--font-mono);
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--ink);
  border: 2px solid var(--ink);
  background-color: transparent;
  padding: 0.5rem 1rem;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  cursor: default;

  &:hover {
    color: var(--chalk);
    border-color: var(--rust);
    background-color: var(--rust);
    transform: translateY(-2px);
  }
`;

const skillsData = [
  'AWS',
  'Python',
  'Terraform',
  'Linux',
  'nginx',
  'IAM',
  'VPC',
  'Prometheus',
  'Grafana',
  'Flask',
  'bash'
];

const About = () => {
  return (
    <AboutContainer id="about">
      <SectionHeader>
        <SectionLabel>[02] About</SectionLabel>
      </SectionHeader>
      <AboutContent>
        <BioParagraph>
          Junior cloud engineer at Saints &amp; Masters. I manage AWS infrastructure for
          clients, write the automation that makes things not break, and do the
          forensics when they do anyway.
        </BioParagraph>
        <BioParagraph>
          Before that: security operations, XDR alert triage, enough false positives to
          develop a healthy skepticism of alerts. I prefer evidence over assumptions.
        </BioParagraph>
        <TagContainer>
          {skillsData.map((tag) => (
            <TechTag key={tag}>{tag}</TechTag>
          ))}
        </TagContainer>
      </AboutContent>
    </AboutContainer>
  );
};

export default About;