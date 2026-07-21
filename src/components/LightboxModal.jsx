import styled from '@emotion/styled';
import { motion, AnimatePresence } from 'framer-motion';

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(10, 10, 10, 0.95);
  backdrop-filter: blur(8px);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  box-sizing: border-box;
  cursor: zoom-out;
`;

const ImageWrapper = styled(motion.div)`
  max-width: 90vw;
  max-height: 80vh;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const LightboxImg = styled.img`
  max-width: 100%;
  max-height: 75vh;
  object-fit: contain;
  border: 1px solid var(--border);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.8);
`;

const CaptionBar = styled.div`
  margin-top: 1.25rem;
  font-family: var(--font-serif);
  font-size: 1.15rem;
  color: var(--ink);
  text-align: center;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const CategoryMeta = styled.span`
  font-family: var(--font-mono);
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: var(--ink-muted);
`;

const CloseButton = styled.button`
  position: absolute;
  top: 2rem;
  right: 2rem;
  background: transparent;
  border: 1px solid var(--border);
  color: var(--ink);
  font-family: var(--font-mono);
  font-size: 0.75rem;
  padding: 0.5rem 1rem;
  cursor: pointer;
  letter-spacing: 0.1em;
  transition: all 0.2s ease;

  &:hover {
    background-color: var(--ink);
    color: var(--paper);
  }
`;

const LightboxModal = ({ item, onClose }) => {
  if (!item) return null;

  return (
    <AnimatePresence>
      <Overlay
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <CloseButton onClick={onClose}>[ CLOSE × ]</CloseButton>
        <ImageWrapper
          initial={{ scale: 0.92, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.92, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <LightboxImg src={item.src} alt={item.alt || 'Gallery visual'} />
          <CaptionBar>
            <div>{item.alt}</div>
            {item.category && <CategoryMeta>{item.category}</CategoryMeta>}
          </CaptionBar>
        </ImageWrapper>
      </Overlay>
    </AnimatePresence>
  );
};

export default LightboxModal;
