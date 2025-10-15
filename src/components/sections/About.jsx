import BaseCard from '../ui/BaseCard';
import styled from '@emotion/styled';
import { useParallax } from '../../hooks/useParallax';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import { motion } from 'framer-motion';

const AboutContainer = styled.section`
  padding: 6rem 0;
  background-color: #0A0E1A;
  background-image: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 40px,
    rgba(139, 148, 158, 0.05) 40px,
    rgba(139, 148, 158, 0.05) 41px
  );
  position: relative;

  &::before {
    content: "01010101010101010101010101010101";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    opacity: 0.03;
    font-family: 'Roboto Mono', monospace;
    word-wrap: break-word;
    line-height: 1.5;
  }
`;

const Container = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1.5rem;
`;

const AboutTitle = styled.h2`
  font-size: 2.5rem;
  font-family: 'Google Sans', sans-serif;
  font-weight: 500;
  color: #00FF41;
  border-bottom: 2px solid #00FF41;
  padding-bottom: 0.5rem;
  margin-bottom: 2rem;
`;

const AboutContent = styled.div`
  color: #FFFFFF;
  font-family: 'Roboto Mono', monospace;
  font-size: 1.125rem;
  line-height: 1.7;
`;

const SectionTitle = styled.h3`
  font-size: 1.5rem;
  font-family: 'Roboto Mono', monospace;
  color: #FBBC04;
  margin-bottom: 0.5rem;
`;

const About = () => {
  const parallaxSpeed = 0.3;
  const yPos = useParallax(parallaxSpeed);
  const [ref, isInView] = useScrollAnimation();

  return (
    <AboutContainer id="about" style={{ backgroundPositionY: yPos }}>
      <Container>
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 30 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        >
          <BaseCard>
            <AboutTitle># ABOUT ME</AboutTitle>
            <AboutContent>
              <p style={{ marginBottom: '1.5rem' }}>
                My name is Abhiragh A R, a BTech undergraduate in Computer Science and Engineering at Musaliar College of Engineering and Polytechnic.
              </p>
              <div style={{ marginBottom: '1.5rem' }}>
                <SectionTitle>Education:</SectionTitle>
                <p><span style={{ color: '#00FF41' }}>└─></span> Bachelor of Technology</p>
                <p style={{ marginLeft: '1.5rem' }}>Computer Science Engineering (2021-2025)</p>
              </div>
              <div>
                <SectionTitle>Current Status:</SectionTitle>
                <p><span style={{ color: '#00FF41' }}>└─></span> Associate System Engineer Intern</p>
                <p style={{ marginLeft: '1.5rem' }}>Bridge Global Software Solutions</p>
                <p style={{ marginLeft: '1.5rem' }}>[June 2025 - Present]</p>
              </div>
            </AboutContent>
          </BaseCard>
        </motion.div>
      </Container>
    </AboutContainer>
  );
};

export default About;