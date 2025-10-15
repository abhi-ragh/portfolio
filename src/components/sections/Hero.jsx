import { ChevronDown } from 'lucide-react';
import { Link } from 'react-scroll';
import TerminalWindow from '../ui/TerminalWindow';
import AsciiArt from '../ui/AsciiArt';
import styled from '@emotion/styled';

const HeroContainer = styled.section`
  height: 100vh;
  background-color: #0A0E1A;
  display: grid;
  align-items: center;
  justify-content: center;
  position: relative;
  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem;
  }
`;

const TerminalContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const AsciiArtContainer = styled.div`
  display: none;
  @media (min-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const ScrollDownLink = styled(Link)`
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  animation: bounce 2s infinite;
  cursor: pointer;

  p {
    color: #00FF41;
    font-size: 0.875rem;
    margin-bottom: 0.5rem;
    font-family: 'Roboto Mono', monospace;
  }

  svg {
    width: 1.5rem;
    height: 1.5rem;
    margin: 0 auto;
    color: #00FF41;
  }
`;

const Hero = () => {
  return (
    <HeroContainer id="hero">
      <TerminalContainer>
        <TerminalWindow />
      </TerminalContainer>
      <AsciiArtContainer>
        <AsciiArt />
      </AsciiArtContainer>
      <ScrollDownLink
        to="about"
        smooth={true}
        duration={500}
      >
        <p>scroll down to initialize</p>
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </ScrollDownLink>
    </HeroContainer>
  );
};

export default Hero;