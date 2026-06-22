import styled from '@emotion/styled';
import { SectionGrid, LeftMargin, MainContent, MetaLabel, MetaValue } from '../layout/SectionGrid';

const HeroTitle = styled.h1`
  font-family: var(--font-display);
  font-size: 3.5rem;
  font-weight: 400;
  color: var(--ink);
  line-height: 1.1;
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;

  @media (min-width: 768px) {
    font-size: 5rem;
    margin-top: 3rem;
  }
`;

const HeroSubtitle = styled.div`
  font-family: var(--font-body);
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--rust);
  margin-bottom: 2rem;
  letter-spacing: 0.05em;
  
  @media (min-width: 768px) {
    font-size: 1rem;
  }
`;

const HeroDescription = styled.p`
  font-family: var(--font-body);
  font-size: 1rem;
  line-height: 1.7;
  color: var(--ink);
  max-width: 580px;
  margin-bottom: 2.5rem;

  @media (min-width: 768px) {
    font-size: 1.125rem;
  }
`;

const ResumeButton = styled.a`
  display: inline-block;
  font-family: var(--font-body);
  font-size: 0.875rem;
  color: var(--ink);
  text-decoration: none;
  border: 1px solid var(--ink);
  background-color: transparent;
  padding: 0.75rem 1.5rem;
  transition: all 0.2s ease;
  
  &:hover {
    color: var(--rust);
    border-color: var(--rust);
    background-color: var(--chalk);
  }
`;

const Hero = () => {
  return (
    <SectionGrid id="hero">
      <LeftMargin>
        <div>
          <MetaLabel>Location</MetaLabel>
          <MetaValue>Kochi, Kerala</MetaValue>
        </div>
        <div>
          <MetaLabel>Role</MetaLabel>
          <MetaValue>DevOps / Cloud</MetaValue>
        </div>
        <div>
          <MetaLabel>Updated</MetaLabel>
          <MetaValue>Jun 2025</MetaValue>
        </div>
      </LeftMargin>
      <MainContent style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <HeroTitle>Abhiragh A R</HeroTitle>
        <HeroSubtitle>Cloud Infrastructure · DevOps · Automation</HeroSubtitle>
        <HeroDescription>
          Somewhere between having fun implementing solutions and having fun breaking things.
        </HeroDescription>
        <div>
          <ResumeButton href="#" target="_blank" rel="noopener noreferrer">
            Download résumé →
          </ResumeButton>
        </div>
      </MainContent>
    </SectionGrid>
  );
};

export default Hero;