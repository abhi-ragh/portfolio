import styled from '@emotion/styled';
import DitherCanvas from './DitherCanvas';

const HeroContainer = styled.header`
  display: flex;
  flex-direction: column;
  width: 100%;
  position: relative;
`;

const TextBlock = styled.div`
  padding: 3rem 1.5rem 4rem 1.5rem;
  max-width: 900px;
  margin: 0 auto;
  width: 100%;
  box-sizing: border-box;

  @media (min-width: 768px) {
    padding: 4.5rem 3rem 6rem 3rem;
  }
`;

const DescriptorText = styled.p`
  font-family: var(--font-serif);
  font-size: 1.35rem;
  line-height: 1.6;
  color: var(--ink);
  font-weight: 400;
  letter-spacing: -0.01em;

  @media (min-width: 768px) {
    font-size: 1.65rem;
    max-width: 720px;
  }

  span.accent-italic {
    font-style: italic;
    color: var(--ink);
  }
`;

const LocationMeta = styled.div`
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--ink-muted);
  margin-top: 1.75rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
`;

const HeroSection = () => {
  return (
    <HeroContainer id="hero">
      <DitherCanvas />
      <TextBlock>
        <DescriptorText>
          Abhiragh A R — Cloud infrastructure engineer working on AWS &amp; Linux reliability, alongside an archive of film photography and visual notes.
        </DescriptorText>
        <LocationMeta>
          Kochi, Kerala &mdash; 9.9312° N, 76.2673° E
        </LocationMeta>
      </TextBlock>
    </HeroContainer>
  );
};

export default HeroSection;
