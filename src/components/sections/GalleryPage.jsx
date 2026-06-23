import { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { motion } from 'framer-motion';
import { supabase } from '../../supabaseClient';

import kochiPhoto from '../../kochi_port_monsoon.jpg';
import mountainSketch from '../../mountain_sketch.jpg';
import streetRain from '../../street_rain.jpg';
import brutalistSketch from '../../brutalist_sketch.jpg';
import palmPhoto from '../../palm_photo.jpg';

const GalleryContainer = styled.section`
  padding: 0;
  width: 100%;
`;

const SectionHeader = styled.div`
  padding: 2.5rem 1.5rem 1.5rem 1.5rem;
  
  @media (min-width: 640px) {
    padding: 3.5rem 2.5rem 2rem 2.5rem;
  }
`;

const SectionLabel = styled.div`
  font-family: var(--font-mono);
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--ink);
  opacity: 0.6;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  margin-bottom: 1rem;
`;

const GalleryTitle = styled.h2`
  font-family: var(--font-display);
  font-size: 2.5rem;
  font-weight: 500;
  color: var(--ink);
  margin-bottom: 1rem;
`;

const GalleryDescription = styled.p`
  font-family: var(--font-body);
  font-size: 1.25rem;
  color: var(--carbon);
  line-height: 1.6;
  max-width: 800px;
  margin-bottom: 0;
`;

const MasonryWrapper = styled.div`
  padding: 1.5rem;
  border-top: 1px solid var(--ink);

  @media (min-width: 640px) {
    padding: 2.5rem;
  }
`;

const MasonryContainer = styled.div`
  column-count: 1;
  column-gap: 2rem;
  width: 100%;
  
  @media (min-width: 640px) {
    column-count: 2;
  }
  
  @media (min-width: 1024px) {
    column-count: 3;
  }
`;

const ArrowIndicator = styled.div`
  font-family: var(--font-mono);
  font-size: 0.75rem;
  border: 1px solid var(--ink);
  border-radius: 50%;
  width: 22px;
  height: 22px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--ink);
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
`;

const CardContainer = styled.div`
  break-inside: avoid;
  margin-bottom: ${props => props.idx % 2 === 0 ? '3.5rem' : '2rem'}; /* Asymmetric offset heights */
  display: flex;
  flex-direction: column;
  
  /* Alternate tilts for organic sketchbook feel */
  &:nth-of-type(3n+1) .image-frame {
    transform: rotate(-1.5deg);
  }
  &:nth-of-type(3n+2) .image-frame {
    transform: rotate(1.2deg);
  }
  &:nth-of-type(3n) .image-frame {
    transform: rotate(-0.8deg);
  }

  &:hover {
    .image-frame {
      transform: rotate(0deg) scale(1.02);
      box-shadow: 0 12px 30px rgba(26, 26, 26, 0.15);
      border-color: var(--rust);
    }
    
    ${ArrowIndicator} {
      background-color: var(--rust);
      border-color: var(--rust);
      color: var(--paper);
      transform: rotate(-45deg); /* Point up-right on hover */
    }
  }
`;

const ImageFrame = styled.div`
  border: 2px solid var(--ink);
  background-color: var(--chalk);
  padding: 12px;
  box-shadow: 0 4px 15px rgba(26, 26, 26, 0.04);
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  width: 100%;
  display: block;
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
  border-bottom: 1px dashed rgba(245, 243, 239, 0.15);
  padding-bottom: 0.5rem;
`;

const CategoryTag = styled.span`
  font-family: var(--font-mono);
  font-size: 0.75rem;
  font-weight: 500;
  opacity: 0.6;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const GalleryImage = styled.img`
  width: 100%;
  height: auto;
  display: block;
  filter: grayscale(10%) contrast(96%);
`;

const Caption = styled.div`
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--ink);
  margin-top: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  opacity: 0.8;
  border-top: 1px dashed rgba(245, 243, 239, 0.15);
  padding-top: 0.5rem;
  word-break: break-word;
`;

const localItems = [
  {
    src: kochiPhoto,
    alt: 'Kochi port, Monsoon 2024',
    category: '[FILM PHOTOGRAPHY]'
  },
  {
    src: mountainSketch,
    alt: 'Western Ghats contours',
    category: '[SKETCHBOOK DRAFT]'
  },
  {
    src: streetRain,
    alt: 'MG Road at Twilight',
    category: '[FILM PHOTOGRAPHY]'
  },
  {
    src: brutalistSketch,
    alt: 'Brutalist drafts',
    category: '[SKETCHBOOK DRAFT]'
  },
  {
    src: palmPhoto,
    alt: 'Monsoon dew',
    category: '[FILM PHOTOGRAPHY]'
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 90,
      damping: 14
    }
  }
};

const getCategory = (name) => {
  const lower = name.toLowerCase();
  if (lower.includes('sketch') || lower.includes('contour') || lower.includes('draft') || lower.includes('art') || lower.includes('draw')) {
    return '[SKETCHBOOK DRAFT]';
  }
  if (lower.includes('photo') || lower.includes('port') || lower.includes('rain') || lower.includes('dew') || lower.includes('kochi')) {
    return '[FILM PHOTOGRAPHY]';
  }
  return '[DIGITAL CAPTURE]';
};

const GalleryPage = () => {
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
                alt: cleanTitle,
                category: getCategory(file.name)
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
    <GalleryContainer>
      <SectionHeader>
        <SectionLabel>[03] Outside work</SectionLabel>
        <GalleryTitle>Photos &amp; Art</GalleryTitle>
        <GalleryDescription>
          A curated collection of film photography, digital captures, and sketches.
          Loaded dynamically from Supabase Storage.
        </GalleryDescription>
      </SectionHeader>
      <MasonryWrapper>
        <MasonryContainer 
          as={motion.div}
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {galleryItems.map((item, index) => (
            <CardContainer 
              key={index}
              idx={index}
              as={motion.div}
              variants={cardVariants}
            >
              <ImageFrame className="image-frame">
                <CardHeader>
                  <CategoryTag>{item.category}</CategoryTag>
                  <ArrowIndicator>&rarr;</ArrowIndicator>
                </CardHeader>
                <GalleryImage src={item.src} alt={item.alt} loading="lazy" />
                <Caption>{item.alt}</Caption>
              </ImageFrame>
            </CardContainer>
          ))}
        </MasonryContainer>
      </MasonryWrapper>
    </GalleryContainer>
  );
};

export default GalleryPage;
