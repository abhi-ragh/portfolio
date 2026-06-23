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
  gap: 2rem;
  max-width: 800px;
  padding: 0 1.5rem 2.5rem 1.5rem;
  
  @media (min-width: 640px) {
    padding: 0 2.5rem 4.5rem 2.5rem;
  }
`;

const BioParagraph1 = styled.p`
  font-family: var(--font-body);
  font-size: 1.25rem;
  line-height: 1.6;
  color: var(--ink);
  letter-spacing: -0.01em;
`;

const BioParagraph2 = styled.p`
  font-family: var(--font-body);
  font-size: 1.21875rem;
  line-height: 1.6;
  color: var(--carbon);
  letter-spacing: -0.01em;
  margin-left: 1rem;
  border-left: 2px dashed rgba(245, 243, 239, 0.15);
  padding-left: 1.5rem;
  
  @media (min-width: 640px) {
    margin-left: 2.5rem;
    padding-left: 2rem;
  }
`;

const TagContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.875rem;
  margin-top: 2rem;
`;

const TechTag = styled.span`
  display: inline-block;
  font-family: var(--font-mono);
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--ink);
  border: 2px solid var(--ink);
  background-color: transparent;
  padding: 0.5rem 1rem;
  cursor: default;
  transform: rotate(${props => props.rot || '0deg'});
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);

  &:hover {
    color: var(--paper);
    border-color: var(--rust);
    background-color: var(--rust);
    transform: rotate(0deg) translateY(-4px) scale(1.05);
    box-shadow: 4px 4px 0px var(--ink);
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

const tagRotations = ['-1.5deg', '1.2deg', '-0.8deg', '2deg', '-1.2deg', '0.8deg', '-2deg', '1.5deg'];

const About = () => {
  return (
    <AboutContainer id="about">
      <SectionHeader>
        <SectionLabel>[02] About</SectionLabel>
      </SectionHeader>
      <AboutContent>
        <BioParagraph1>
          Junior cloud engineer at Saints &amp; Masters. I manage AWS infrastructure for
          clients, write the automation that makes things not break, and do the
          forensics when they do anyway.
        </BioParagraph1>
        <BioParagraph2>
          Before that: security operations, XDR alert triage, enough false positives to
          develop a healthy skepticism of alerts. I prefer evidence over assumptions.
        </BioParagraph2>
        <TagContainer>
          {skillsData.map((tag, idx) => (
            <TechTag 
              key={tag} 
              rot={tagRotations[idx % tagRotations.length]}
            >
              {tag}
            </TechTag>
          ))}
        </TagContainer>
      </AboutContent>
    </AboutContainer>
  );
};

export default About;