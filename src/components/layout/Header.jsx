import { useState, useEffect } from 'react';
import { motion, useScroll } from 'framer-motion';
import { Link } from 'react-scroll';
import styled from '@emotion/styled';
import BlinkingCursor from '../ui/BlinkingCursor';

const HeaderContainer = styled(motion.header)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 50;
  background-color: rgba(10, 14, 26, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid #00FF41;
  box-shadow: 0 0 10px rgba(0, 255, 65, 0.5),
              0 0 20px rgba(0, 255, 65, 0.3),
              inset 0 0 10px rgba(0, 255, 65, 0.1);
`;

const NavContainer = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 1.5rem;
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
`;

const LogoText = styled.span`
  color: #00FF41;
  font-family: 'Roboto Mono', monospace;
  font-size: 1.125rem;
`;

const Nav = styled.nav`
  display: none;
  @media (min-width: 768px) {
    display: flex;
    align-items: center;
    gap: 2.5rem;
  }
`;

const NavLink = styled(Link)`
  color: #FFFFFF;
  text-transform: uppercase;
  font-family: 'Roboto Mono', monospace;
  font-size: 0.875rem;
  cursor: pointer;
  position: relative;
  &:after {
    content: '___';
    position: absolute;
    left: 0;
    bottom: -0.25rem;
    color: #00FF41;
    opacity: 0;
    transition: opacity 0.3s;
  }
  &:hover:after {
    opacity: 1;
  }
  &:hover {
    color: #00FF41;
  }
`;

const ThemeButton = styled.button`
  border: 2px solid #00FF41;
  padding: 0.5rem 1rem;
  color: #00FF41;
  background-color: transparent;
  transition: all 0.3s;
  font-family: 'Roboto Mono', monospace;
  &:hover {
    background-color: #00FF41;
    color: #0A0E1A;
  }
`;

const HamburgerButton = styled.button`
  display: none;
  @media (max-width: 768px) {
    display: block;
    border: 2px solid #00FF41;
    padding: 0.5rem;
    background-color: transparent;
    color: #00FF41;
  }
`;

const MobileMenu = styled(motion.div)`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background-color: #0A0E1A;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { scrollY } = useScroll();

  useEffect(() => {
    return scrollY.onChange((latest) => {
      setIsScrolled(latest > 50);
    });
  }, [scrollY]);

  const navLinks = ['ABOUT', 'EXPERIENCE', 'PROJECTS', 'SKILLS', 'CERTIFICATIONS', 'CONTACT'];

  return (
    <HeaderContainer
      animate={{ height: isScrolled ? 60 : 80 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      <NavContainer>
        <LogoContainer>
          <LogoText>abhiragh@portfolio:~$</LogoText>
          <BlinkingCursor />
        </LogoContainer>
        <Nav>
          {navLinks.map((link, index) => (
            <motion.div
              key={link}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
            >
              <NavLink
                to={link.toLowerCase()}
                smooth={true}
                duration={500}
                aria-label={`Navigate to ${link} section`}
              >
                {link}
              </NavLink>
            </motion.div>
          ))}
        </Nav>
        <LogoContainer>
          <ThemeButton aria-label="Toggle theme">
            [THEME] ▢
          </ThemeButton>
        </LogoContainer>
        <HamburgerButton onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle mobile menu">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </HamburgerButton>
      </NavContainer>
      {isMenuOpen && (
        <MobileMenu
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          {navLinks.map((link) => (
            <NavLink
              key={link}
              to={link.toLowerCase()}
              smooth={true}
              duration={500}
              onClick={() => setIsMenuOpen(false)}
            >
              {link}
            </NavLink>
          ))}
        </MobileMenu>
      )}
    </HeaderContainer>
  );
};

export default Header;