import React from 'react';
import HomepageGalleryPreview from './HomepageGalleryPreview';
import type { ArchiveImage } from '../lib/types';

interface SelectedFramesProps {
  items?: ArchiveImage[];
}

export const SelectedFrames: React.FC<SelectedFramesProps> = ({ items }) => {
  return <HomepageGalleryPreview items={items} />;
};

export default SelectedFrames;
