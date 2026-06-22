import styled from '@emotion/styled';
import { SectionGrid, LeftMargin, MainContent } from '../layout/SectionGrid';

import kochiPhoto from '../../kochi_port_monsoon.jpg';
import mountainSketch from '../../mountain_sketch.jpg';
import streetRain from '../../street_rain.jpg';
import brutalistSketch from '../../brutalist_sketch.jpg';
import palmPhoto from '../../palm_photo.jpg';

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
  margin-bottom: 2rem;

  @media (min-width: 768px) {
    font-size: 3rem;
  }
`;

const GalleryWrapper = styled.div`
  width: 100%;
  position: relative;
`;

const HorizontalScroll = styled.div`
  display: flex;
  gap: 2rem;
  overflow-x: auto;
  padding: 1rem 0.5rem 2.5rem 0.5rem;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
  
  /* Simple line scrollbar */
  &::-webkit-scrollbar {
    height: 4px;
  }
  &::-webkit-scrollbar-track {
    background: rgba(26, 26, 26, 0.05);
  }
  &::-webkit-scrollbar-thumb {
    background: var(--ink);
  }
`;

const CardContainer = styled.div`
  flex: 0 0 280px;
  scroll-snap-align: start;
  display: flex;
  flex-direction: column;
  
  @media (min-width: 640px) {
    flex: 0 0 380px;
  }

  /* Alternate tilts for organic field-note sketchbook feel */
  &:nth-of-type(odd) .image-frame {
    transform: rotate(-0.8deg);
  }
  &:nth-of-type(even) .image-frame {
    transform: rotate(0.8deg);
  }

  &:hover .image-frame {
    transform: rotate(0deg) scale(1.02);
  }
`;

const ImageFrame = styled.div`
  border: 1px solid var(--ink);
  background-color: var(--chalk);
  padding: 10px;
  box-shadow: 0 4px 15px rgba(26, 26, 26, 0.04);
  transition: transform 0.3s ease;
  width: 100%;
  aspect-ratio: 3/2;
  overflow: hidden;
`;

const GalleryImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: grayscale(10%) contrast(96%);
`;

const ImageCaption = styled.p`
  font-family: var(--font-display);
  font-style: italic;
  font-size: 0.95rem;
  line-height: 1.4;
  color: var(--ink);
  margin-top: 1rem;
  padding-left: 0.25rem;
`;

const mediaItems = [
  {
    src: kochiPhoto,
    alt: 'Kochi port dynamic sky',
    caption: 'Shot this waiting for the ferry. Kochi port, Monsoon 2024.'
  },
  {
    src: mountainSketch,
    alt: 'Mountain range ink sketch',
    caption: 'A quick notebook sketch of the Western Ghats peak contours.'
  },
  {
    src: streetRain,
    alt: 'Rainy street night in Kochi',
    caption: 'Rain on MG Road, Kochi. Twilight.'
  },
  {
    src: brutalistSketch,
    alt: 'Brutalist concrete building sketch with vines',
    caption: 'Drafting brutalist structures overlapping with organic creepers.'
  },
  {
    src: palmPhoto,
    alt: 'Rain wet palm leaves close-up',
    caption: 'Monsoon dew on wet palm leaves outside the window.'
  }
];

const About = () => {
  return (
    <SectionGrid id="about">
      <LeftMargin />
      <MainContent style={{ paddingRight: 0 }}>
        <SectionLabel>Outside work</SectionLabel>
        <SectionTitle>Photos & art</SectionTitle>
        <GalleryWrapper>
          <HorizontalScroll>
            {mediaItems.map((item, index) => (
              <CardContainer key={index}>
                <ImageFrame className="image-frame">
                  <GalleryImage src={item.src} alt={item.alt} />
                </ImageFrame>
                <ImageCaption>{item.caption}</ImageCaption>
              </CardContainer>
            ))}
          </HorizontalScroll>
        </GalleryWrapper>
      </MainContent>
    </SectionGrid>
  );
};

export default About;