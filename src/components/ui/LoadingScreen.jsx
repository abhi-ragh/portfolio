import { motion } from 'framer-motion';
import styled from '@emotion/styled';

const LoadingContainer = styled(motion.div)`
  position: fixed;
  inset: 0;
  background-color: #0A0E1A;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
`;

const LoadingContent = styled.div`
  text-align: center;
`;

const LoadingText = styled.p`
  color: #00FF41;
  font-family: 'Roboto Mono', monospace;
  font-size: 1.5rem;
  margin-bottom: 1rem;
`;

const LoadingBarContainer = styled.div`
  width: 16rem;
  height: 0.5rem;
  background-color: #1E2430;
  border-radius: 0.25rem;
`;

const LoadingBar = styled(motion.div)`
  height: 100%;
  background-color: #00FF41;
  border-radius: 0.25rem;
`;

const LoadingScreen = () => {
  return (
    <LoadingContainer
      initial={{ opacity: 1 }}
      animate={{ opacity: 0 }}
      transition={{ duration: 0.5, delay: 2 }}
    >
      <LoadingContent>
        <LoadingText>INITIALIZING PORTFOLIO...</LoadingText>
        <LoadingBarContainer>
          <LoadingBar
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: 1.5, ease: 'linear' }}
          />
        </LoadingBarContainer>
      </LoadingContent>
    </LoadingContainer>
  );
};

export default LoadingScreen;
