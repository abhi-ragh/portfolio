import { useState } from 'react';
import styled from '@emotion/styled';
import { motion, AnimatePresence } from 'framer-motion';

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

const LayoutSplit = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  border-top: 1px solid var(--ink);

  @media (min-width: 1024px) {
    grid-template-columns: 1.25fr 1fr;
  }
`;

const ProjectList = styled.div`
  display: flex;
  flex-direction: column;
  border-bottom: 1px solid var(--ink);

  @media (min-width: 1024px) {
    border-bottom: none;
    border-right: 1px solid var(--ink);
  }
`;

const ProjectRow = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  padding: 1.5rem;
  border-bottom: 1px solid rgba(245, 243, 239, 0.15);
  align-items: baseline;
  gap: 0.5rem;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  color: var(--ink);
  cursor: pointer;
  transform: translateX(0);

  &:last-child {
    border-bottom: none;
  }

  @media (min-width: 640px) {
    grid-template-columns: 1.1fr 1fr auto;
    gap: 1.5rem;
    padding: 1.75rem 2.5rem;
  }

  background-color: ${props => props.isActive ? 'var(--ink)' : 'transparent'};
  color: ${props => props.isActive ? 'var(--paper)' : 'var(--ink)'};

  .project-title {
    color: ${props => props.isActive ? 'var(--paper)' : 'var(--ink)'};
    transform: ${props => props.isActive ? 'translateX(8px)' : 'translateX(0)'};
    transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .project-desc {
    color: ${props => props.isActive ? 'var(--paper)' : 'var(--carbon)'};
    opacity: ${props => props.isActive ? '0.9' : '0.85'};
  }
  .project-year {
    color: ${props => props.isActive ? 'var(--paper)' : 'var(--ink)'};
    opacity: ${props => props.isActive ? '0.7' : '0.6'};
  }

  &:hover {
    background-color: var(--ink);
    color: var(--paper);
    transform: translateX(5px); /* Slips horizontally on hover */
    
    .project-title {
      color: var(--paper);
      transform: translateX(8px);
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
`;

const ProjectDesc = styled.div`
  font-family: var(--font-serif);
  font-style: italic;
  font-size: 1.0625rem;
`;

const ProjectYear = styled.div`
  font-family: var(--font-mono);
  font-size: 0.875rem;

  @media (min-width: 640px) {
    text-align: right;
  }
`;

const InspectorPanelWrapper = styled.div`
  padding: 2rem 1.5rem;
  background-color: var(--paper);
  display: flex;
  justify-content: center;
  align-items: flex-start;

  @media (min-width: 640px) {
    padding: 2.5rem;
  }

  @media (min-width: 1024px) {
    position: sticky;
    top: 0;
    height: 100%;
  }
`;

const InspectorPanel = styled.div`
  background-color: var(--chalk);
  border: 2px solid var(--ink);
  padding: 1.5rem;
  box-shadow: 6px 6px 0px var(--rust);
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  width: 100%;
  transform: rotate(0.8deg); /* Asymmetrical offset */
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);

  &:hover {
    transform: rotate(0deg) translate(-2px, -2px);
    box-shadow: 8px 8px 0px var(--ink);
  }
`;

const InspectorLabel = styled.div`
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  opacity: 0.5;
  border-bottom: 1px dashed rgba(245, 243, 239, 0.2);
  padding-bottom: 0.5rem;
  margin-bottom: 0.25rem;
`;

const ArtifactCode = styled(motion.pre)`
  font-family: var(--font-mono);
  font-size: 0.75rem;
  line-height: 1.5;
  color: var(--ink);
  overflow-x: auto;
  white-space: pre-wrap;
  word-break: break-all;
  background-color: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(245, 243, 239, 0.1);
  padding: 1rem;
  border-radius: 4px;
`;

const ArtifactHeader = styled(motion.div)`
  font-family: var(--font-display);
  font-size: 1.125rem;
  font-weight: 500;
  color: var(--rust);
`;

const projectsData = [
  {
    title: 'MSP AWS Account Assessor',
    desc: 'IAM audit tooling, multi-account',
    year: '2025',
    artifactTitle: 'scan_report.txt (organizational unit tree)',
    artifactContent: `[ROOT ORGANISATIONAL UNIT]
 ├── production-core (account: 9482-xxxx)
 │    └── Alerts: 2 critical (IAM wildcard policy found)
 ├── staging-sandbox (account: 1109-xxxx)
 │    └── Alerts: 0 critical
 └── shared-services (account: 5543-xxxx)
      └── Alerts: 1 warning (unrestricted SSH)`
  },
  {
    title: 'NAT Gateway migration',
    desc: 'us-east-2, iptables, cost reduction',
    year: '2024',
    artifactTitle: 'routes.tf (subnets router configuration)',
    artifactContent: `# main.tf (redacted migration snippet)
resource "aws_route_table" "private" {
  vpc_id = aws_vpc.main.id

-  route {
-    cidr_block     = "0.0.0.0/0"
-    nat_gateway_id = aws_nat_gateway.old.id
-  }
+  route {
+    cidr_block           = "0.0.0.0/0"
+    network_interface_id = aws_instance.nat_instance.id
+  }
}`
  },
  {
    title: '503 incident investigation',
    desc: 'nginx fd exhaustion, Novo AU',
    year: '2024',
    artifactTitle: 'nginx_error.log & diagnostics',
    artifactContent: `[error] 2045#2045: *529432 open() "/var/www/html/index.html"
failed (24: Too many open files) while connecting to upstream

abhiragh@nginx-lb:~$ ulimit -n
1024  <-- Socket descriptor limit reached

abhiragh@nginx-lb:~$ cat /etc/security/limits.conf
* soft nofile 65535
* hard nofile 65535`
  },
  {
    title: 'MSP Auditor Dashboard',
    desc: 'Flask, SSE terminal streaming',
    year: '2025',
    artifactTitle: 'event_stream.json (raw SSE payload)',
    artifactContent: `{
  "event": "terminal_stream",
  "payload": {
    "account": "msp-prod-01",
    "command": "aws iam list-users",
    "timestamp": 1782236045,
    "status": "STREAMING",
    "buffer": "usr_9921, usr_0294, usr_1190"
  }
}`
  },
  {
    title: 'Void / Voidpulse',
    desc: 'Custom GNOME themes, Fedora',
    year: '2024',
    artifactTitle: 'theme_override.ini (GTK/GNOME specs)',
    artifactContent: `[org/gnome/desktop/interface]
gtk-theme='Void-Dark'
icon-theme='Void-Paper'
cursor-theme='Adwaita'
font-name='Space Grotesk 10'
monospace-font-name='IBM Plex Mono 10'`
  }
];

const Experience = () => {
  const [activeIdx, setActiveIdx] = useState(0);

  return (
    <SectionContainer id="experience">
      <SectionHeader>
        <SectionLabel>[01] Selected Work</SectionLabel>
      </SectionHeader>
      <LayoutSplit>
        <ProjectList>
          {projectsData.map((project, idx) => (
            <ProjectRow 
              key={idx} 
              isActive={activeIdx === idx}
              onMouseEnter={() => setActiveIdx(idx)}
              onClick={() => setActiveIdx(idx)}
            >
              <ProjectTitle className="project-title">{project.title}</ProjectTitle>
              <ProjectDesc className="project-desc">{project.desc}</ProjectDesc>
              <ProjectYear className="project-year">{project.year}</ProjectYear>
            </ProjectRow>
          ))}
        </ProjectList>
        <InspectorPanelWrapper>
          <InspectorPanel>
            <InspectorLabel>Evidence Inspector</InspectorLabel>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIdx}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem', width: '100%' }}
              >
                <ArtifactHeader>
                  {projectsData[activeIdx].title}
                </ArtifactHeader>
                <div style={{ fontSize: '0.8125rem', opacity: 0.6, fontFamily: 'var(--font-mono)', marginTop: '-0.25rem' }}>
                  Artifact: {projectsData[activeIdx].artifactTitle}
                </div>
                <ArtifactCode>
                  {projectsData[activeIdx].artifactContent}
                </ArtifactCode>
              </motion.div>
            </AnimatePresence>
          </InspectorPanel>
        </InspectorPanelWrapper>
      </LayoutSplit>
    </SectionContainer>
  );
};

export default Experience;