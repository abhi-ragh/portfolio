import { ArrowUp } from 'lucide-react';
import { Link } from 'react-scroll';
import { useState, useEffect } from 'react';
import { useScroll } from 'framer-motion';
import styled from '@emotion/styled';
import BlinkingCursor from '../ui/BlinkingCursor';

const FooterContainer = styled.footer`
  background-color: #000000;
  border-top: 1px solid #00FF41;
  padding: 3rem 0;
  box-shadow: 0 0 10px rgba(0, 255, 65, 0.5),
              0 0 20px rgba(0, 255, 65, 0.3),
              inset 0 0 10px rgba(0, 255, 65, 0.1);
`;

const Container = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1.5rem;
  text-align: center;
  color: #8B949E;
  font-family: 'Roboto Mono', monospace;
  font-size: 0.875rem;
`;

const FooterContent = styled.div`
  background-color: #1E2430;
  max-width: 36rem;
  margin: 0 auto;
  padding: 1.5rem;
  border-radius: 0.5rem;
  border: 1px solid #8B949E;
`;

const BackToTopButton = styled.button`
  position: fixed;
  bottom: 2.5rem;
  right: 2.5rem;
  background-color: #1E2430;
  border: 2px solid #00FF41;
  border-radius: 0.375rem;
  width: 4rem;
  height: 4rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #00FF41;
  transition: all 0.3s;
  &:hover {
    background-color: #00FF41;
    color: #0A0E1A;
  }
`;

const Footer = () => {
  const [showTopBtn, setShowTopBtn] = useState(false);
  const { scrollY } = useScroll();

  useEffect(() => {
    return scrollY.onChange((latest) => {
      setShowTopBtn(latest > 500);
    });
  }, [scrollY]);

  return (
    <FooterContainer>
      <Container>
        <FooterContent>
          <p>root@portfolio:~$ cat footer.sh</p>
          <p>#!/bin/bash</p>
          <p>echo "Designed & Built by Abhiragh A R"</p>
          <p>echo "© 2025 | All Rights Reserved"</p>
          <p>exit 0</p>
          <BlinkingCursor />
        </FooterContent>
      </Container>
      {showTopBtn && (
        <Link to="hero" smooth={true} duration={500}>
          <BackToTopButton aria-label="Back to top">
            <ArrowUp size={24} />
          </BackToTopButton>
        </Link>
      )}
    </FooterContainer>
  );
};

export default Footer;