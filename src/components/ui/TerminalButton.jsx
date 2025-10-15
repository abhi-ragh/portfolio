import { motion } from 'framer-motion';
import styled from '@emotion/styled';

const StyledButton = styled(motion.a)`
  border-width: 2px;
  padding: 0.75rem 1.5rem;
  color: #FFFFFF;
  transition: all 0.3s;
  font-family: 'Roboto Mono', monospace;

  &:hover {
    color: #0A0E1A;
  }
`;

const TerminalButton = ({ text, href, color }) => {
  const colors = {
    red: {
      borderColor: '#EA4335',
      hoverBg: '#EA4335',
    },
    yellow: {
      borderColor: '#FBBC04',
      hoverBg: '#FBBC04',
    },
    blue: {
      borderColor: '#4285F4',
      hoverBg: '#4285F4',
    },
  };

  return (
    <StyledButton
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={{ borderColor: colors[color].borderColor }}
      whileHover={{ scale: 1.05, backgroundColor: colors[color].hoverBg }}
      whileTap={{ scale: 0.95 }}
    >
      [{text} →]
    </StyledButton>
  );
};

export default TerminalButton;
