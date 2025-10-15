import { motion } from 'framer-motion';
import styled from '@emotion/styled';

const CardContainer = styled(motion.div)`
  background-color: #1E2430;
  border: 1px solid #8B949E;
  border-radius: 0.5rem;
  padding: 3rem;
  box-shadow: 0 16px 24px rgba(0, 0, 0, 0.4), 0 8px 12px rgba(0, 0, 0, 0.3);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    box-shadow: 0 24px 36px rgba(0, 0, 0, 0.5), 0 12px 18px rgba(0, 0, 0, 0.4), 0 0 20px rgba(0, 255, 65, 0.6);
    transform: translateY(-8px);
    border-color: #00FF41;
  }
`;

const BaseCard = ({ children, className }) => {
  return (
    <CardContainer className={className}>
      {children}
    </CardContainer>
  );
};

export default BaseCard;
