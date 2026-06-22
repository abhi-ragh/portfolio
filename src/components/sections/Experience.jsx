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

const LogContainer = styled.div`
  display: flex;
  flex-direction: column;
  border-top: 1px solid var(--ink);
`;

const LogRow = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.5rem;
  padding: 1.25rem 0;
  border-bottom: 1px solid rgba(26, 26, 26, 0.1);
  font-family: var(--font-body);
  font-size: 0.875rem;
  line-height: 1.5;

  @media (min-width: 640px) {
    grid-template-columns: 80px 120px 1fr;
    gap: 1rem;
    align-items: baseline;
  }
  
  transition: background-color 0.2s ease;
  &:hover {
    background-color: rgba(192, 71, 47, 0.03);
  }
`;

const CommitHash = styled.span`
  color: var(--rust);
  font-weight: 500;
`;

const CommitDate = styled.span`
  color: var(--ink);
  opacity: 0.6;
`;

const CommitMsg = styled.span`
  color: var(--ink);
`;

const logEntries = [
  { hash: 'a3f91c', date: 'Jun 2025', desc: '503 incident – nginx fd exhaustion, Novo AU prod' },
  { hash: 'b82d04', date: 'May 2025', desc: 'Built IAM governance audit tool w/ WeasyPrint PDF output' },
  { hash: 'c11f7e', date: 'May 2025', desc: 'NAT Gateway -> NAT instance migration, t4g.medium' },
  { hash: 'd9a3b1', date: 'Apr 2025', desc: 'S3 VPC Gateway Endpoint setup, us-east-2 Dev + Release' },
  { hash: 'e04c22', date: 'Apr 2025', desc: 'Trend Micro XDR – certutil.exe MITRE T1105 false positive' }
];

const Experience = () => {
  return (
    <SectionGrid id="experience">
      <LeftMargin>
        <div>
          <MetaLabel>Period</MetaLabel>
          <MetaValue>2023 – now</MetaValue>
        </div>
      </LeftMargin>
      <MainContent>
        <SectionLabel>Experience</SectionLabel>
        <SectionTitle>Project log</SectionTitle>
        <LogContainer>
          {logEntries.map((entry) => (
            <LogRow key={entry.hash}>
              <CommitHash>{entry.hash}</CommitHash>
              <CommitDate>{entry.date}</CommitDate>
              <CommitMsg>{entry.desc}</CommitMsg>
            </LogRow>
          ))}
        </LogContainer>
      </MainContent>
    </SectionGrid>
  );
};

export default Experience;