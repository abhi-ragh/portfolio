import styled from '@emotion/styled';

const SectionWrapper = styled.section`
  padding: 4rem 1.5rem;
  border-top: 1px solid var(--border);
  max-width: 1100px;
  margin: 0 auto;
  width: 100%;
  box-sizing: border-box;

  @media (min-width: 768px) {
    padding: 6rem 3rem;
  }
`;

const AsymmetricGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2.5rem;

  @media (min-width: 768px) {
    grid-template-columns: 240px 1fr;
    gap: 4rem;
  }
`;

const SectionLabel = styled.div`
  font-family: var(--font-mono);
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: var(--ink-muted);
`;

const ContentCol = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const WorkProse = styled.p`
  font-family: var(--font-serif);
  font-size: 1.25rem;
  line-height: 1.7;
  color: var(--ink);

  @media (min-width: 768px) {
    font-size: 1.4rem;
  }
`;

const ToolsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
  margin-top: 1rem;
  border-left: 1px solid var(--border);
  padding-left: 1.5rem;
`;

const ToolRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;

  @media (min-width: 640px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: baseline;
  }
`;

const ToolCategory = styled.span`
  font-family: var(--font-serif);
  font-size: 1.15rem;
  color: var(--ink);
  font-style: italic;
`;

const ToolItems = styled.span`
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--ink-muted);
  letter-spacing: 0.05em;
`;

const WorkSection = () => {
  return (
    <SectionWrapper id="work">
      <AsymmetricGrid>
        <div>
          <SectionLabel>[ 03 / WORK ]</SectionLabel>
        </div>

        <ContentCol>
          <WorkProse>
            Currently serving as an Associate System Engineer, managing AWS environments, automated deployment pipelines, and Linux server clusters for MSP clients.
          </WorkProse>

          <WorkProse>
            My day-to-day focus centers around zero-downtime reliability, infrastructure-as-code, and automating manual sysadmin tasks so teams can ship with confidence.
          </WorkProse>

          <ToolsList>
            <ToolRow>
              <ToolCategory>Cloud &amp; Infrastructure</ToolCategory>
              <ToolItems>AWS (EC2, VPC, IAM, S3), Linux, Terraform</ToolItems>
            </ToolRow>

            <ToolRow>
              <ToolCategory>Containers &amp; Orchestration</ToolCategory>
              <ToolItems>Docker, Kubernetes, GitLab CI/CD, Bash</ToolItems>
            </ToolRow>

            <ToolRow>
              <ToolCategory>Languages &amp; DBs</ToolCategory>
              <ToolItems>Python, C, SQL, MySQL, PostgreSQL</ToolItems>
            </ToolRow>
          </ToolsList>
        </ContentCol>
      </AsymmetricGrid>
    </SectionWrapper>
  );
};

export default WorkSection;
