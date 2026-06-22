import styled from '@emotion/styled';
import { SectionGrid, LeftMargin, MainContent, MetaLabel, MetaValue } from '../layout/SectionGrid';
import kochiPhoto from '../../kochi_port_monsoon.jpg';

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

const PhotoContainer = styled.div`
  max-width: 720px;
  margin-bottom: 1.5rem;
  /* Visual break from grid: tilt photo slightly */
  transform: rotate(-0.8deg);
  transition: transform 0.3s ease;
  
  border: 1px solid var(--ink);
  background-color: var(--chalk);
  padding: 10px;
  box-shadow: 0 4px 12px rgba(26, 26, 26, 0.05);

  &:hover {
    transform: rotate(0deg) scale(1.01);
  }
`;

const PhotoImage = styled.img`
  width: 100%;
  height: auto;
  display: block;
  filter: grayscale(10%) contrast(95%);
`;

const PhotoCaption = styled.p`
  font-family: var(--font-display);
  font-style: italic;
  font-size: 1rem;
  line-height: 1.5;
  color: var(--ink);
  opacity: 0.9;
  max-width: 600px;
  margin-top: 1rem;
  padding-left: 0.25rem;
`;

const About = () => {
  return (
    <SectionGrid id="about">
      <LeftMargin>
        <div>
          <MetaLabel>Medium</MetaLabel>
          <MetaValue>Fujifilm X-T30</MetaValue>
        </div>
        <div>
          <MetaLabel>Also</MetaLabel>
          <MetaValue>Pencil + ink</MetaValue>
        </div>
      </LeftMargin>
      <MainContent>
        <SectionLabel>Outside work</SectionLabel>
        <SectionTitle>Photos & art</SectionTitle>
        <PhotoContainer>
          <PhotoImage src={kochiPhoto} alt="Kochi port just before monsoon rain" />
        </PhotoContainer>
        <PhotoCaption>
          Shot this waiting for the ferry. The light does something strange just before the rain.
        </PhotoCaption>
      </MainContent>
    </SectionGrid>
  );
};

export default About;