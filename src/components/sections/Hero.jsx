import styled from '@emotion/styled';

const HeroContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const HeroTitle = styled.h1`
  font-family: var(--font-display);
  font-size: 2.25rem;
  font-weight: 500;
  color: var(--ink);
  line-height: 1.15;
  margin-bottom: 1.5rem;
  letter-spacing: -0.02em;

  @media (min-width: 768px) {
    font-size: 2.75rem;
  }
`;

const ItalicWord = styled.span`
  font-family: var(--font-serif);
  font-style: italic;
  font-weight: 400;
  color: var(--ink);
`;

const HeroDescription = styled.div`
  font-family: var(--font-body);
  font-size: 0.95rem;
  line-height: 1.6;
  color: var(--carbon);
  opacity: 0.9;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  
  p {
    margin: 0;
  }
`;

const Hero = () => {
  return (
    <HeroContainer id="hero">
      <HeroTitle>
        Cloud infrastructure.<br />
        Built <ItalicWord>carefully</ItalicWord>.<br />
        Fixed at <ItalicWord>2am</ItalicWord>.
      </HeroTitle>
      
      <HeroDescription>
        <p>
          I work on AWS infrastructure for MSP clients — the kind of work where getting it wrong means someone's production is down.
        </p>
        <p>
          Also: I draw things and take photos. Based in Kochi, Kerala.
        </p>
      </HeroDescription>
    </HeroContainer>
  );
};

export default Hero;