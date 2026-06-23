import { useState, useEffect, useRef } from 'react';
import { Global, css } from '@emotion/react';
import styled from '@emotion/styled';
import Footer from './components/layout/Footer';
import Hero from './components/sections/Hero';
import Experience from './components/sections/Experience';
import About from './components/sections/About';
import GalleryPage from './components/sections/GalleryPage';

const GlobalStyles = css`
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Newsreader:ital,opsz,wght@0,6..72,200..800;1,6..72,200..800&family=IBM+Plex+Mono:wght@300;400;500;600;700&display=swap');

  :root {
    --ink: #1A1A1A;
    --paper: #F5F3EF; /* Warm off-white */
    --carbon: #2E2E2E;
    --rust: #C0472F;
    --chalk: #F9F7F3;
    
    --font-display: 'Space Grotesk', sans-serif;
    --font-body: 'Space Grotesk', sans-serif;
    --font-serif: 'Newsreader', serif;
    --font-mono: 'IBM Plex Mono', monospace;
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html, body {
    background-color: var(--paper);
    color: var(--ink);
    font-family: var(--font-body);
    font-weight: 400;
    font-size: 16px;
    line-height: 1.6;
    overflow-x: hidden;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  /* Custom scrollbars */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  ::-webkit-scrollbar-track {
    background: var(--paper);
    border-left: 1px solid rgba(26, 26, 26, 0.1);
  }
  ::-webkit-scrollbar-thumb {
    background: rgba(26, 26, 26, 0.2);
    border: 2px solid var(--paper);
  }
  ::-webkit-scrollbar-thumb:hover {
    background: var(--ink);
  }
`;

const AppGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  min-height: 100vh;
  width: 100vw;
  background-color: var(--paper);
  
  @media (min-width: 768px) {
    grid-template-columns: 360px 1fr;
    height: 100vh;
    overflow: hidden;
  }
  
  @media (min-width: 1024px) {
    grid-template-columns: 420px 1fr;
  }
`;

const LeftPanel = styled.aside`
  padding: 2.5rem 1.5rem;
  border-bottom: 2px solid var(--ink);
  display: flex;
  flex-direction: column;
  background-color: var(--paper);
  gap: 2rem;
  
  @media (min-width: 768px) {
    height: 100vh;
    border-bottom: none;
    border-right: 2px solid var(--ink);
    padding: 3.5rem 3rem;
    position: sticky;
    top: 0;
    overflow-y: auto;
    justify-content: space-between;
    gap: 0;
  }
`;

const Logo = styled.a`
  font-family: var(--font-display);
  font-size: 1.125rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--ink);
  text-decoration: none;
  transition: color 0.2s ease;

  &:hover {
    color: var(--rust);
  }
`;

const MiddleContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 2rem 0;
  gap: 1.5rem;

  @media (min-width: 768px) {
    margin: 0;
  }
`;

const Clock = styled.div`
  font-family: var(--font-mono);
  font-size: 1rem;
  color: var(--ink);
  opacity: 0.8;
  letter-spacing: 0.05em;
`;

const NavList = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;

  @media (min-width: 768px) {
    margin-top: 0;
  }
`;

const NavItem = styled.a`
  font-family: var(--font-mono);
  font-size: 0.875rem;
  text-transform: uppercase;
  color: var(--ink);
  opacity: 0.7;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  transition: opacity 0.2s ease, color 0.2s ease;
  cursor: pointer;

  &:hover {
    opacity: 1;
    color: var(--rust);
  }
`;

const RightPanel = styled.div`
  background-color: var(--paper);
  display: flex;
  flex-direction: column;
  
  @media (min-width: 768px) {
    height: 100vh;
    overflow-y: auto;
    scroll-behavior: smooth;
  }
`;

const SectionSeparator = styled.div`
  height: 2px;
  background-color: var(--ink);
  width: 100%;
`;

function App() {
  const [currentRoute, setCurrentRoute] = useState(window.location.hash || '#');
  const [time, setTime] = useState('');
  const rightPanelRef = useRef(null);

  useEffect(() => {
    const handleHashChange = () => {
      setCurrentRoute(window.location.hash || '#');
      if (rightPanelRef.current) {
        rightPanelRef.current.scrollTo(0, 0);
      } else {
        window.scrollTo(0, 0);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const hh = String(now.getHours()).padStart(2, '0');
      const mm = String(now.getMinutes()).padStart(2, '0');
      const ss = String(now.getSeconds()).padStart(2, '0');
      setTime(`${hh} : ${mm} : ${ss} IST`);
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleNavClick = (id) => {
    if (window.location.hash === '#gallery') {
      window.location.hash = '#';
      setTimeout(() => {
        scrollToElement(id);
      }, 100);
    } else {
      scrollToElement(id);
    }
  };

  const scrollToElement = (id) => {
    const element = document.getElementById(id);
    if (element) {
      if (rightPanelRef.current && window.innerWidth >= 768) {
        rightPanelRef.current.scrollTo({
          top: element.offsetTop,
          behavior: 'smooth'
        });
      } else {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <>
      <Global styles={GlobalStyles} />
      <AppGrid>
        <LeftPanel>
          <Logo href="#">Abhiragh A R</Logo>
          
          <MiddleContainer>
            <Clock>{time}</Clock>
            <Hero />
          </MiddleContainer>

          <NavList>
            <NavItem onClick={() => handleNavClick('experience')}>
              <span>[01]</span> Work
            </NavItem>
            <NavItem onClick={() => handleNavClick('about')}>
              <span>[02]</span> About
            </NavItem>
            <NavItem href="#gallery">
              <span>[03]</span> Outside work
            </NavItem>
            <NavItem href="#" target="_blank" rel="noopener noreferrer">
              <span>[04]</span> &darr; R&eacute;sum&eacute;
            </NavItem>
          </NavList>
        </LeftPanel>

        <RightPanel id="right-panel" ref={rightPanelRef}>
          {currentRoute === '#gallery' ? (
            <GalleryPage />
          ) : (
            <>
              <Experience />
              <SectionSeparator />
              <About />
            </>
          )}
          <SectionSeparator />
          <Footer />
        </RightPanel>
      </AppGrid>
    </>
  );
}

export default App;