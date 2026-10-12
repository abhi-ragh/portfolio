export interface ArchiveImage {
  id: string;
  caption: string;
  imageUrl: string;
  width?: number;
  height?: number;
  homepage: boolean;
  published: boolean;
  type: 'FILM PHOTOGRAPHY' | 'SKETCHBOOK DRAFT';
}


export interface Project {
  id: string;
  title: string;
  description: string;
  github?: string;
  coverImage?: string;
  coverWidth?: number;
  coverHeight?: number;
  screenshots: string[];
  homepage: boolean;
  published: boolean;
}
