export interface ArchiveImage {
  id: string;
  caption: string;
  imageUrl: string;
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
  screenshots: string[];
  homepage: boolean;
  published: boolean;
}
