// projectcard.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';

const ProjectCard = ({ title, description }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      className="project-card"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <div
        className="card-header"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <h3>{title}</h3>
      </div>
      {isExpanded && (
        <motion.div
          className="card-content"
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
        >
          <p>{description}</p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ProjectCard;