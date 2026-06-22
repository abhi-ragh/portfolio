import { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { SectionGrid, LeftMargin, MainContent } from '../layout/SectionGrid';
import { supabase } from '../../supabaseClient';

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
  gap: 2.5rem;
  overflow-x: auto;
  padding: 1.5rem 0.5rem 2.5rem 0.5rem;
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
  flex: 0 0 auto;
  scroll-snap-align: start;
  display: flex;
  flex-direction: column;
  
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
  
  /* Fixed height, auto width to scale to the image's ratio */
  height: 220px;
  width: fit-content;
  display: block;

  @media (min-width: 640px) {
    height: 320px;
  }
`;

const GalleryImage = styled.img`
  height: 100%;
  width: auto;
  display: block;
  object-fit: contain; /* Displays the full image without cropping */
  filter: grayscale(10%) contrast(96%);
`;

const localItems = [
  {
    src: kochiPhoto,
    alt: 'Kochi port, Monsoon 2024'
  },
  {
    src: mountainSketch,
    alt: 'Western Ghats contours'
  },
  {
    src: streetRain,
    alt: 'MG Road at Twilight'
  },
  {
    src: brutalistSketch,
    alt: 'Brutalist drafts'
  },
  {
    src: palmPhoto,
    alt: 'Monsoon dew'
  }
];

const About = () => {
  const [galleryItems, setGalleryItems] = useState(localItems);

  useEffect(() => {
    async function fetchSupabaseImages() {
      if (!supabase) return;

      try {
        const { data: files, error } = await supabase.storage
          .from('photos')
          .list('', {
            limit: 100,
            sortBy: { column: 'name', order: 'asc' },
          });

        if (error) throw error;

        if (files && files.length > 0) {
          const items = files
            .filter(file => file.name !== '.emptyFolderPlaceholder')
            .map(file => {
              const { data } = supabase.storage
                .from('photos')
                .getPublicUrl(file.name);

              const cleanTitle = file.name
                .substring(0, file.name.lastIndexOf('.'))
                .replace(/[_-]/g, ' ');

              return {
                src: data.publicUrl,
                alt: cleanTitle
              };
            });
          
          if (items.length > 0) {
            setGalleryItems(items);
          }
        }
      } catch (err) {
        console.warn('Supabase storage query failed, loading local media files:', err);
      }
    }

    fetchSupabaseImages();
  }, []);

  return (
    <SectionGrid id="about">
      <LeftMargin />
      <MainContent style={{ paddingRight: 0 }}>
        <SectionLabel>Outside work</SectionLabel>
        <SectionTitle>Photos & art</SectionTitle>
        <GalleryWrapper>
          <HorizontalScroll>
            {galleryItems.map((item, index) => (
              <CardContainer key={index}>
                <ImageFrame className="image-frame">
                  <GalleryImage src={item.src} alt={item.alt} />
                </ImageFrame>
              </CardContainer>
            ))}
          </HorizontalScroll>
        </GalleryWrapper>
      </MainContent>
    </SectionGrid>
  );
};

export default About;