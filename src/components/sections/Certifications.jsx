import styled from '@emotion/styled';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import { motion } from 'framer-motion';

const certifications = [
  {
    title: 'Introduction to Linux (LFS101)',
    issuer: 'The Linux Foundation',
    status: 'Completed',
  },
  {
    title: 'Automate the Boring Stuff with Python',
    issuer: 'Udemy',
    status: 'Completed',
  },
  {
    title: 'Docker Essentials',
    issuer: 'IBM',
    status: 'Completed',
  },
];

const CertificationsContainer = styled.section`
  padding: 6rem 0;
  background-color: #0A0E1A;
`;

const Container = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1.5rem;
`;

const CertificationsTitle = styled.h2`
  font-size: 2.5rem;
  font-family: 'Google Sans', sans-serif;
  font-weight: 500;
  text-align: center;
  margin-bottom: 4rem;
`;

const CertificationsList = styled.div`
`;

const Prompt = styled.p`
  font-family: 'Roboto Mono', monospace;
  font-size: 1.125rem;
  color: #8B949E;
  margin-bottom: 2rem;
`;

const CertificationItem = styled.div`
  background-color: #1E2430;
  border-left: 4px solid #00FF41;
  border-radius: 0 0.5rem 0.5rem 0;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
  &:hover {
    box-shadow: 0 4px 30px rgba(0, 255, 65, 0.3);
    border-left-color: #EA4335;
    transform: translateX(0.5rem);
  }
`;

const CertificationTitle = styled.h3`
  font-family: 'Roboto Mono', monospace;
  font-size: 1.125rem;
  color: #FBBC04;
`;

const CertificationInfo = styled.p`
  font-family: 'Roboto Mono', monospace;
  font-size: 1rem;
  color: #8B949E;
  padding-left: 1rem;
`;

const Certifications = () => {
  const [ref, isInView] = useScrollAnimation();

  return (
    <CertificationsContainer id="certifications">
      <Container>
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 30 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        >
          <CertificationsTitle>CERTIFICATIONS_LOG</CertificationsTitle>
          <CertificationsList>
            <Prompt>abhiragh@portfolio:~$ cat certifications.txt</Prompt>
            {certifications.map((cert, index) => (
              <CertificationItem key={index}>
                <CertificationTitle>[VERIFIED] {cert.title}</CertificationTitle>
                <CertificationInfo>├─ Issuer: {cert.issuer}</CertificationInfo>
                <CertificationInfo>└─ Status: ✓ {cert.status}</CertificationInfo>
              </CertificationItem>
            ))}
          </CertificationsList>
        </motion.div>
      </Container>
    </CertificationsContainer>
  );
};

export default Certifications;