import TerminalButton from '../ui/TerminalButton';
import styled from '@emotion/styled';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import { motion } from 'framer-motion';

const ContactContainer = styled.section`
  padding: 6rem 0;
  background-color: #0A0E1A;
`;

const Container = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1.5rem;
`;

const ContactCard = styled.div`
  max-width: 56rem;
  margin: 0 auto;
  background-color: #1E2430;
  border: 2px solid #00FF41;
  border-radius: 0.75rem;
  padding: 3rem;
  animation: glow-pulse 2s infinite;
`;

const ContactTitle = styled.h2`
  font-size: 2rem;
  font-family: 'Google Sans', sans-serif;
  font-weight: 500;
  text-align: center;
  margin-bottom: 2rem;
`;

const ContactInfo = styled.div`
  font-family: 'Roboto Mono', monospace;
  font-size: 1.125rem;
  color: #FFFFFF;
  & > p {
    margin-bottom: 1rem;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin: 2rem 0;
`;

const Socials = styled.div`
  text-align: center;
  color: #8B949E;
  font-family: 'Roboto Mono', monospace;
`;

const Contact = () => {
  const [ref, isInView] = useScrollAnimation();

  return (
    <ContactContainer id="contact">
      <Container>
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 30 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        >
          <ContactCard>
            <ContactTitle>ESTABLISH_CONNECTION</ContactTitle>
            <ContactInfo>
              <p>> Location: Kollam, Kerala</p>
              <p>> Phone: +91 9074355010</p>
              <p>> Email: abhiragh0@gmail.com</p>
              <p>> GitHub: github.com/abhi-ragh</p>
            </ContactInfo>
            <ButtonContainer>
                          <TerminalButton text="COPY EMAIL" color="yellow" aria-label="Copy email address" />
                          <TerminalButton text="OPEN GITHUB" href="https://github.com/abhi-ragh" color="blue" aria-label="Open GitHub profile" />
                          <TerminalButton text="DOWNLOAD CV" color="red" aria-label="Download CV" />            </ButtonContainer>
            <Socials>
              <p>Or reach out via:</p>
              <p style={{ marginTop: '0.5rem' }}>$ send --platform [LINKEDIN] [TWITTER] [X]</p>
            </Socials>
          </ContactCard>
        </motion.div>
      </Container>
    </ContactContainer>
  );
};

export default Contact;