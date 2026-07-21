import { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { supabase } from '../supabaseClient';
import LightboxModal from './LightboxModal';

import kochiPhoto from '../kochi_port_monsoon.jpg';
import mountainSketch from '../mountain_sketch.jpg';
import streetRain from '../street_rain.jpg';
import brutalistSketch from '../brutalist_sketch.jpg';
import palmPhoto from '../palm_photo.jpg';

const SectionWrapper = styled.section`
  padding: 4rem 1.5rem;
  border-top: 1px solid var(--border);
  max-width: 1300px;
  margin: 0 auto;
  width: 100%;
  box-sizing: border-box;

  @media (min-width: 768px) {
    padding: 6rem 3rem;
  }
`;

const SectionHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 3.5rem;
`;

const SectionLabel = styled.div`
  font-family: var(--font-mono);
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: var(--ink-muted);
`;

const EditorialIntro = styled.p`
  font-family: var(--font-serif);
  font-size: 1.25rem;
  color: var(--ink);
  max-width: 600px;
  line-height: 1.6;
`;

// Asymmetric Editorial Column Flow
const EditorialFlow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 3.5rem;

  @media (min-width: 768px) {
    display: grid;
    grid-template-columns: repeat(12, 1fr);
    gap: 2.5rem;
    align-items: start;
  }
`;

const GalleryFrame = styled(motion.div)`
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  grid-column: span 12;

  @media (min-width: 768px) {
    grid-column: span ${props => props.$colSpan || 6};
    margin-top: ${props => props.$offsetY || '0px'};
  }
`;

const ImageContainer = styled.div`
  border: 1px solid var(--border);
  background-color: #121212;
  padding: 10px;
  overflow: hidden;
  position: relative;
  transition: border-color 0.3s ease, transform 0.3s ease;

  img {
    width: 100%;
    height: auto;
    display: block;
    filter: grayscale(12%) contrast(96%);
    transition: filter 0.4s ease, transform 0.4s ease;
  }

  &:hover {
    border-color: var(--ink);
    img {
      filter: grayscale(0%) contrast(100%);
      transform: scale(1.015);
    }
  }
`;

const ImageCaption = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  padding: 0 0.25rem;
`;

const CaptionTitle = styled.span`
  font-family: var(--font-serif);
  font-size: 1.05rem;
  color: var(--ink);
  font-style: italic;
`;

const TagMeta = styled.span`
  font-family: var(--font-mono);
  font-size: 0.68rem;
  color: var(--ink-muted);
  text-transform: uppercase;
  letter-spacing: 0.1em;
`;

const localFallbackItems = [
  {
    src: kochiPhoto,
    alt: 'Kochi Port & Monsoon Waves',
    category: 'Film Photography',
    colSpan: 7,
    offsetY: '0px'
  },
  {
    src: mountainSketch,
    alt: 'Western Ghats Contour Study',
    category: 'Sketchbook Draft',
    colSpan: 5,
    offsetY: '3rem'
  },
  {
    src: streetRain,
    alt: 'MG Road at Twilight',
    category: 'Film Photography',
    colSpan: 5,
    offsetY: '0px'
  },
  {
    src: brutalistSketch,
    alt: 'Structural Elevation Study',
    category: 'Sketchbook Draft',
    colSpan: 7,
    offsetY: '-2rem'
  },
  {
    src: palmPhoto,
    alt: 'Monsoon Dew & Palms',
    category: 'Film Photography',
    colSpan: 6,
    offsetY: '1rem'
  }
];

const getCategory = (name) => {
  const lower = name.toLowerCase();
  if (lower.includes('sketch') || lower.includes('contour') || lower.includes('draft') || lower.includes('draw')) {
    return 'Sketchbook Draft';
  }
  return 'Film Photography';
};

const GallerySection = () => {
  const [items, setItems] = useState(localFallbackItems);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    async function fetchSupabaseMedia() {
      if (!supabase) return;
      try {
        const { data: files, error } = await supabase.storage
          .from('photos')
          .list('', {
            limit: 50,
            sortBy: { column: 'name', order: 'asc' }
          });

        if (error) throw error;

        if (files && files.length > 0) {
          const filtered = files.filter(f => f.name !== '.emptyFolderPlaceholder');
          const spans = [7, 5, 5, 7, 6, 6, 8, 4];
          const offsets = ['0px', '3rem', '0px', '-2rem', '1rem', '0px', '2rem', '-1rem'];

          const fetchedItems = filtered.map((file, idx) => {
            const { data } = supabase.storage
              .from('photos')
              .getPublicUrl(file.name);

            const lastDot = file.name.lastIndexOf('.');
            const cleanTitle = lastDot !== -1
              ? file.name.substring(0, lastDot).replace(/[_-]/g, ' ')
              : file.name.replace(/[_-]/g, ' ');

            return {
              src: data.publicUrl,
              alt: cleanTitle,
              category: getCategory(file.name),
              colSpan: spans[idx % spans.length],
              offsetY: offsets[idx % offsets.length]
            };
          });

          if (fetchedItems.length > 0) {
            setItems(fetchedItems);
          }
        }
      } catch (err) {
        console.warn('Supabase fetch notice: using local fallback media', err);
      }
    }

    fetchSupabaseMedia();
  }, []);

  return (
    <SectionWrapper id="gallery">
      <SectionHeader>
        <SectionLabel>[ 02 / GALLERY ]</SectionLabel>
        <EditorialIntro>
          A mixed collection of 35mm film photography and pencil contour sketches. Given space to breathe.
        </EditorialIntro>
      </SectionHeader>

      <EditorialFlow>
        {items.map((item, idx) => (
          <GalleryFrame
            key={idx}
            $colSpan={item.colSpan}
            $offsetY={item.offsetY}
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.1 }}
            transition={{ duration: 0.5, delay: idx * 0.05 }}
            onClick={() => setSelectedItem(item)}
          >
            <ImageContainer>
              <img src={item.src} alt={item.alt} loading="lazy" />
            </ImageContainer>
            <ImageCaption>
              <CaptionTitle>{item.alt}</CaptionTitle>
              <TagMeta>{item.category}</TagMeta>
            </ImageCaption>
          </GalleryFrame>
        ))}
      </EditorialFlow>

      <LightboxModal item={selectedItem} onClose={() => setSelectedItem(null)} />
    </SectionWrapper>
  );
};

export default GallerySection;
