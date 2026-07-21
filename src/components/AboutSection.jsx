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

const SidebarCol = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const SectionLabel = styled.div`
  font-family: var(--font-mono);
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: var(--ink-muted);
`;

const AsciiAccent = styled.pre`
  font-family: var(--font-mono);
  font-size: 0.65rem;
  color: var(--ink-muted);
  opacity: 0.5;
  line-height: 1.2;
  margin-top: 1rem;
  user-select: none;
`;

const ContentCol = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const BioParagraph = styled.p`
  font-family: var(--font-serif);
  font-size: 1.25rem;
  line-height: 1.7;
  color: var(--ink);

  @media (min-width: 768px) {
    font-size: 1.4rem;
  }
`;

const HighlightSerif = styled.span`
  font-style: italic;
  color: var(--ink);
`;

const AboutSection = () => {
  return (
    <SectionWrapper id="about">
      <AsymmetricGrid>
        <SidebarCol>
          <SectionLabel>[ 01 / ABOUT ]</SectionLabel>
          <AsciiAccent>{`
  ┌─┐┌─┐┬─┐┌─┐
  ├─┤│ │├┬┘├┤ 
  ┴ ┴└─┘┴└─└─┘`}</AsciiAccent>
        </SidebarCol>

        <ContentCol>
          <BioParagraph>
            I spend most of my days provisioning cloud infrastructure, building automated pipelines, and making sure production systems don't fall over when nobody is watching.
          </BioParagraph>

          <BioParagraph>
            When I'm away from the terminal, I wander through the monsoon rains of Kochi with a 35mm camera or draft contour studies in my sketchbook. I value <HighlightSerif>quiet precision</HighlightSerif> in code, physical grain in photographs, and uncluttered space everywhere else.
          </BioParagraph>
        </ContentCol>
      </AsymmetricGrid>
    </SectionWrapper>
  );
};

export default AboutSection;
