export interface ArchiveImage {
  id: string;
  caption: string;
  imageUrl: string;
  homepage: boolean;
  published: boolean;
  type: 'FILM PHOTOGRAPHY' | 'SKETCHBOOK DRAFT';
}

export interface Blog {
  id: string;
  url: string;
  title: string;
  description: string;
  image: string;
  homepage: boolean;
  published: boolean;
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
