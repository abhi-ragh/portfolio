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
  gap: 1rem;
`;

const QuietHeader = styled.h3`
  font-family: var(--font-serif);
  font-size: 1.5rem;
  font-weight: 400;
  font-style: italic;
  color: var(--ink-muted);
`;

const QuietText = styled.p`
  font-family: var(--font-serif);
  font-size: 1.15rem;
  line-height: 1.6;
  color: var(--ink-muted);
  opacity: 0.7;
`;

const StatusMeta = styled.span`
  font-family: var(--font-mono);
  font-size: 0.7rem;
  letter-spacing: 0.1em;
  color: var(--ink-muted);
  opacity: 0.5;
  margin-top: 0.5rem;
`;

const BlogSection = () => {
  return (
    <SectionWrapper id="blog">
      <AsymmetricGrid>
        <div>
          <SectionLabel>[ 04 / WRITINGS ]</SectionLabel>
        </div>

        <ContentCol>
          <QuietHeader>Silence for now.</QuietHeader>
          <QuietText>
            Essays on Linux systems, photography notes, and thoughts on craft will assemble here in time.
          </QuietText>
          <StatusMeta>[ STATUS: UNPUBLISHED ]</StatusMeta>
        </ContentCol>
      </AsymmetricGrid>
    </SectionWrapper>
  );
};

export default BlogSection;
