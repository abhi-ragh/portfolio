import { motion } from 'framer-motion';
import styled from '@emotion/styled';

const Cursor = styled(motion.span)`
  color: #00FF41;
  font-family: 'Roboto Mono', monospace;
  font-size: 1.125rem;
  margin-left: 0.25rem;
`;

const BlinkingCursor = () => {
  return (
    <Cursor
      animate={{ opacity: [0, 1, 0] }}
      transition={{ duration: 0.8, repeat: Infinity }}
    >
      █
    </Cursor>
  );
};

export default BlinkingCursor;
