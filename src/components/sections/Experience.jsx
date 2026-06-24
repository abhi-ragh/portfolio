import styled from '@emotion/styled';

const DashboardContainer = styled.section`
  padding: 0;
  width: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  padding: 1.5rem;
  gap: 1.75rem;

  @media (min-width: 1024px) {
    grid-template-columns: 1.15fr 1fr;
    padding: 2rem;
    gap: 2.25rem;
    align-items: center;
  }
`;

const LeftColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
`;

const RightColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
  padding: 1rem 0;

  @media (min-width: 1024px) {
    padding: 0;
  }
`;

const PanelLabel = styled.div`
  font-family: var(--font-mono);
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--ink);
  opacity: 0.6;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  margin-bottom: 0.5rem;
`;

// Unified Brutalist Card design pattern
const BrutalistCard = styled.div`
  background-color: var(--chalk);
  border: 2px solid var(--ink);
  padding: 1.6rem;
  box-shadow: 6px 6px 0px var(--rust);
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  width: 100%;
  transform: rotate(${props => props.rot || '0deg'});
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);

  &:hover {
    transform: rotate(0deg) translate(-2px, -2px);
    box-shadow: 8px 8px 0px var(--ink);
  }
`;

const PanelWindowHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px dashed rgba(245, 243, 239, 0.2);
  padding-bottom: 0.5rem;
  margin-bottom: 0.25rem;
`;

const PanelTitleText = styled.span`
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  opacity: 0.5;
  color: var(--ink);
`;

const WindowDots = styled.div`
  display: flex;
  gap: 0.35rem;
  
  span {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: var(--ink);
    opacity: 0.3;
  }
`;

// right column infra stack tags
const StackGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const StackTag = styled.span`
  font-family: var(--font-mono);
  font-size: 0.75rem;
  padding: 0.3rem 0.65rem;
  border: 1px solid var(--ink);
  border-radius: 4px;
  cursor: default;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  transform: rotate(${props => props.rot || '0deg'});

  &:hover {
    background-color: var(--rust);
    border-color: var(--rust);
    color: var(--ink);
    transform: rotate(0deg) scale(1.08);
    box-shadow: 4px 4px 0px var(--ink);
  }
`;

// timeline styles
const Timeline = styled.div`
  position: relative;
  border-left: 2px dashed rgba(245, 243, 239, 0.15);
  margin-left: 0.5rem;
  padding-left: 1.6rem;
  display: flex;
  flex-direction: column;
  gap: 2.25rem;
`;

const TimelineItem = styled.div`
  position: relative;
`;

const TimelineDot = styled.div`
  position: absolute;
  left: calc(-1.6rem - 6px);
  top: 6px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: ${props => props.isActive ? 'var(--rust)' : 'var(--ink)'};
  border: 2px solid var(--paper);
  box-shadow: ${props => props.isActive ? '0 0 8px var(--rust)' : 'none'};
`;

const JobTitle = styled.h4`
  font-family: var(--font-display);
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--ink);
  margin: 0;
`;

const JobCompany = styled.div`
  font-family: var(--font-serif);
  font-style: italic;
  font-size: 0.9375rem;
  color: var(--rust);
  margin-top: 0.15rem;
`;

const JobPeriod = styled.div`
  font-family: var(--font-mono);
  font-size: 0.75rem;
  opacity: 0.6;
  margin-top: 0.25rem;
  color: var(--ink);
`;

const JobDetails = styled.ul`
  margin-top: 0.5rem;
  padding-left: 1rem;
  font-size: 0.8125rem;
  color: var(--carbon);
  font-family: var(--font-body);
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  
  li {
    list-style-type: square;
  }
`;

// inner container terminal blocks
const InnerTerminalBlock = styled.div`
  background-color: rgba(0, 0, 0, 0.25);
  border: 1px solid rgba(245, 243, 239, 0.1);
  border-radius: 4px;
  padding: 1rem;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--carbon);
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  position: relative;
  overflow: hidden;
`;

const BlockStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  color: var(--rust);
  font-weight: bold;
`;

const stackData = [
  'AWS', 'Terraform', 'Python', 'Linux', 'Docker', 'Bash', 'Nginx', 
  'Ansible', 'Prometheus', 'Grafana', 'MySQL', 'PostgreSQL', 'IAM', 'VPC'
];

const tagRotations = ['-1.5deg', '1.2deg', '-0.8deg', '2deg', '-1.2deg', '0.8deg', '-2deg', '1.5deg'];

const Experience = () => {
  return (
    <DashboardContainer>
      <DashboardGrid>
        {/* Left Column: Careers timeline */}
        <LeftColumn>
          {/* Careers Log Card */}
          <div id="about">
            <PanelLabel>[01] Professional Log</PanelLabel>
            <BrutalistCard rot="0.5deg">
              <PanelWindowHeader>
                <PanelTitleText>CAREERS_LOG (TTY4)</PanelTitleText>
                <WindowDots>
                  <span />
                  <span />
                  <span />
                </WindowDots>
              </PanelWindowHeader>
              <Timeline>
                <TimelineItem>
                  <TimelineDot isActive={true} />
                  <JobTitle>Junior Engineer - Cloud</JobTitle>
                  <JobCompany>Saints &amp; Masters</JobCompany>
                  <JobPeriod>Nov 2025 - Present</JobPeriod>
                  <JobDetails>
                    <li>Automate cloud infrastructure provisioning, system security, and identity governance on AWS.</li>
                    <li>Monitor cluster resources and system telemetry metrics with Prometheus &amp; Grafana.</li>
                    <li>Perform alert diagnostic logs triage to resolve critical environment incident occurrences.</li>
                  </JobDetails>
                </TimelineItem>

                <TimelineItem>
                  <TimelineDot isActive={false} />
                  <JobTitle>DevOps Intern</JobTitle>
                  <JobCompany>Nubinix / Saints &amp; Masters</JobCompany>
                  <JobPeriod>June 2025 - Nov 2025</JobPeriod>
                  <JobDetails>
                    <li>Orchestrated container builds and testing pipelines via automated CI/CD workflows.</li>
                    <li>Optimized internal egress routing with customized NAT setups, reducing network costs.</li>
                    <li>Configured load balancers, secure gateways, and local system environments.</li>
                  </JobDetails>
                </TimelineItem>

                <TimelineItem>
                  <TimelineDot isActive={false} />
                  <JobTitle>Associate System Engineer Intern</JobTitle>
                  <JobCompany>Bridge Global Software Solutions</JobCompany>
                  <JobPeriod>Jan 2025 - June 2025</JobPeriod>
                  <JobDetails>
                    <li>Administered OS servers (Linux &amp; Windows) for system audits and permissions setup.</li>
                    <li>Maintained databases (MySQL) handling backups, migration validation, and maintenance chores.</li>
                    <li>Created scripts for operational automations and local system monitoring alerts.</li>
                  </JobDetails>
                </TimelineItem>
              </Timeline>
            </BrutalistCard>
          </div>
        </LeftColumn>

        {/* Right Column: Stack, Evidence Workspace (WIP) & Certifications */}
        <RightColumn>
          {/* Infrastructure Stack Card */}
          <div>
            <PanelLabel>[02] System Stack</PanelLabel>
            <BrutalistCard rot="-0.6deg">
              <PanelWindowHeader>
                <PanelTitleText>INFRA_STACK (TTY3)</PanelTitleText>
                <WindowDots>
                  <span />
                  <span />
                  <span />
                </WindowDots>
              </PanelWindowHeader>
              <StackGrid>
                {stackData.map((tag, idx) => (
                  <StackTag 
                    key={tag} 
                    rot={tagRotations[idx % tagRotations.length]}
                  >
                    [{tag}]
                  </StackTag>
                ))}
              </StackGrid>
            </BrutalistCard>
          </div>

          {/* Redesigned Evidence Workspace (Work In Progress) */}
          <div id="experience">
            <PanelLabel>[03] Evidence Workspace</PanelLabel>
            <BrutalistCard rot="0.8deg">
              <PanelWindowHeader>
                <PanelTitleText>EVIDENCE_WORKSPACE (TTY2)</PanelTitleText>
                <WindowDots>
                  <span />
                  <span />
                  <span />
                </WindowDots>
              </PanelWindowHeader>
              <InnerTerminalBlock>
                <BlockStatus>
                  <span className="terminal-cursor" style={{ width: '8px', height: '8px', margin: 0 }} />
                  <span>[STATUS: WIP]</span>
                </BlockStatus>
                <div>evidence_dir/: Indexes offline...</div>
                <div style={{ opacity: 0.5 }}>&gt; Work in progress</div>
              </InnerTerminalBlock>
            </BrutalistCard>
          </div>

          {/* Certifications Log Card */}
          <div>
            <PanelLabel>[04] Certifications Log</PanelLabel>
            <BrutalistCard rot="-0.7deg">
              <PanelWindowHeader>
                <PanelTitleText>CERTIFICATIONS (TTY5)</PanelTitleText>
                <WindowDots>
                  <span />
                  <span />
                  <span />
                </WindowDots>
              </PanelWindowHeader>
              <InnerTerminalBlock>
                <BlockStatus>
                  <span className="terminal-cursor" style={{ width: '8px', height: '8px', margin: 0 }} />
                  <span>[STATUS: PENDING]</span>
                </BlockStatus>
                <div>certifications_log.db: Fetching assets...</div>
                <div style={{ opacity: 0.5 }}>&gt; Coming Soon</div>
              </InnerTerminalBlock>
            </BrutalistCard>
          </div>
        </RightColumn>
      </DashboardGrid>
    </DashboardContainer>
  );
};

export default Experience;