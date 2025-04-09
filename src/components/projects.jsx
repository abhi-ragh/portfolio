import React from 'react';
import ProjectCard from './projectcard.jsx';

const projectData = [
  {
    title: 'Vyn OS',
    description: 'Developed a customized Linux distribution focused on being beginner friendly and lightweight. Implemented compatibility layers and user interface optimizations.',
  },
  {
    title: 'Dent.ai',
    description: 'Developed a platform that employs AI to quickly analyze dental images, detect anomalies, and deliver tailored treatment insights with seamless clinical integration.',
  },
  {
    title: 'Explainable AI',
    description: 'Developed a system using LIME and SHAP techniques to improve AI model interpretability. Applied methods to two pre-existing models, enhancing trust in AI decision-making. Presented findings on the importance of explainability in modern AI applications.',
  },
  {
    title: 'Digital Mirage',
    description: 'Created a computer vision-based art piece using OpenCV, MediaPipe, and Pygame. Developed real-time interaction capabilities, resulting in an approach to environmental education and increased public awareness.',
  },
  {
    title: 'Adaptive Gamified Learning Platform',
    description: 'Designed a 2D platformer game combining fun gameplay with educational content. Implemented a question-answer system for enemy encounters, demonstrating proficiency in game development and UX design.',
  },
];

const Projects = () => {
  return (
    <div className="projects-section">
        <h2 className="section-title">Projects</h2>
      {projectData.map((project, index) => (
        <ProjectCard
          key={index}
          title={project.title}
          description={project.description}
        />
      ))}
      <div className="more-coming-soon">
        <p>More coming soon...</p>
      </div>
    </div>
  );
};

export default Projects;
