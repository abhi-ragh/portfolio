import { useState, useEffect, useRef, Component } from 'react';
import { Global, css } from '@emotion/react';
import styled from '@emotion/styled';
import Footer from './components/layout/Footer';
import Hero from './components/sections/Hero';
import Experience from './components/sections/Experience';
import GalleryPage from './components/sections/GalleryPage';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '2rem', color: '#ff0000', backgroundColor: '#000', fontFamily: 'monospace', border: '2px solid red', margin: '2rem', borderRadius: '4px' }}>
          <h2 style={{ marginBottom: '1rem', color: '#ff3b30' }}>React Render Crash Detected</h2>
          <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all', color: '#ffffff' }}>
            {this.state.error ? this.state.error.stack || this.state.error.message : 'Unknown Error'}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}

const GlobalStyles = css`
  @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Newsreader:ital,opsz,wght@0,6..72,200..800;1,6..72,200..800&family=IBM+Plex+Mono:wght@300;400;500;600;700&display=swap');

  :root {
    --ink: #F5F3EF; /* Off-white text on dark */
    --paper: #0A0A0A; /* Stark deep black background */
    --carbon: #A5A5A5; /* Muted silver text */
    --rust: #FF5A36; /* Glowing neon coral-rust */
    --chalk: #161616; /* Card backgrounds */
    
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

  /* Blinking terminal cursor */
  @keyframes blink {
    50% { opacity: 0; }
  }
  .terminal-cursor {
    display: inline-block;
    width: 6px;
    height: 12px;
    background-color: #00FF41;
    margin-left: 5px;
    animation: blink 0.8s infinite;
    vertical-align: middle;
  }

  /* Custom scrollbars matching dark aesthetic */
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  ::-webkit-scrollbar-track {
    background: var(--paper);
    border-left: 1px solid rgba(245, 243, 239, 0.1);
  }
  ::-webkit-scrollbar-thumb {
    background: rgba(245, 243, 239, 0.15);
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
    grid-template-columns: 390px 1fr;
    height: 100vh;
    overflow: hidden;
  }
  
  @media (min-width: 1024px) {
    grid-template-columns: 460px 1fr;
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

const LogoContainer = styled.div`
  margin-left: -0.5rem; /* Asymmetric offset */
  transform: rotate(-1deg); /* Slight layout tilt for character */
`;

const Logo = styled.a`
  font-family: var(--font-display);
  font-size: 1.25rem;
  font-weight: 700;
  letter-spacing: -0.01em;
  text-transform: uppercase;
  color: var(--ink);
  background-color: var(--ink);
  color: var(--paper);
  padding: 0.25rem 0.75rem;
  text-decoration: none;
  display: inline-block;
  transition: all 0.2s ease;

  &:hover {
    background-color: var(--rust);
    color: var(--ink);
  }
`;

const MiddleContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 1.5rem 0;
  gap: 2rem;

  @media (min-width: 768px) {
    margin: 0;
  }
`;

const Clock = styled.div`
  font-family: var(--font-mono);
  font-size: 0.9375rem;
  color: var(--rust); /* Clock pops in rust */
  letter-spacing: 0.05em;
  border-left: 2px solid var(--rust);
  padding-left: 0.75rem;
`;

const TerminalLog = styled.div`
  border: 2px solid var(--ink);
  background-color: #0A0A0A;
  color: #00FF41; /* CRT Matrix Green */
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  padding: 0.75rem 1rem;
  margin-top: 0.5rem;
  box-shadow: 6px 6px 0px var(--rust); /* Offset rust shadow */
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  line-height: 1.3;
  width: 98%;
  transform: rotate(0.5deg); /* Asymmetric tilt */
`;

const TerminalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  border-bottom: 1px dashed rgba(0, 255, 65, 0.3);
  padding-bottom: 0.25rem;
  margin-bottom: 0.25rem;
  color: #FFFFFF;
  font-weight: bold;
`;

const StatusPanel = styled.div`
  border-top: 1px dashed rgba(245, 243, 239, 0.25);
  padding-top: 1.25rem;
  margin-top: 1.5rem;
  margin-bottom: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
`;

const StatusRow = styled.div`
  display: flex;
  justify-content: space-between;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--carbon);
`;

const StatusLabel = styled.span`
  opacity: 0.7;
`;

const StatusValue = styled.span`
  color: var(--ink);
  font-weight: 500;
`;

const NavList = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
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
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  cursor: pointer;
  transform: translateX(0);

  &:hover {
    opacity: 1;
    color: var(--rust);
    transform: translateX(8px); /* Asymmetric sliding animation */
  }
`;

const RightPanel = styled.div`
  background-color: var(--paper);
  display: flex;
  flex-direction: column;
  border-left: 1px solid rgba(245, 243, 239, 0.1);
  
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
  const [visibleLines, setVisibleLines] = useState(0);
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

  useEffect(() => {
    const timeouts = [
      setTimeout(() => setVisibleLines(1), 500),
      setTimeout(() => setVisibleLines(2), 1200),
      setTimeout(() => setVisibleLines(3), 1900),
      setTimeout(() => setVisibleLines(4), 2600)
    ];
    return () => timeouts.forEach(clearTimeout);
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
        const offsetAdjustment = window.innerWidth >= 1024 ? 56 : 32;
        rightPanelRef.current.scrollTo({
          top: element.offsetTop - offsetAdjustment,
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
          <LogoContainer>
            <Logo href="#">Abhiragh A R</Logo>
          </LogoContainer>
          
          <MiddleContainer>
            <Clock>{time}</Clock>
            <Hero />
            <TerminalLog>
              <TerminalHeader>
                <span>outage_timeline.log (TTY1)</span>
                <span>SEV-1</span>
              </TerminalHeader>
              {visibleLines >= 1 && <div>[02:14:02 AM] nginx: (24: Too many open files)</div>}
              {visibleLines >= 2 && <div>[02:14:05 AM] Alert: api-gateway fails readiness check</div>}
              {visibleLines >= 3 && <div>[02:18:11 AM] ulimit -n 65535 &amp;&amp; systemctl restart nginx</div>}
              {visibleLines >= 4 && (
                <div style={{ color: '#FFFFFF' }}>
                  [02:18:15 AM] HTTP/2 200 OK [System Restored]
                  <span className="terminal-cursor" />
                </div>
              )}
            </TerminalLog>
          </MiddleContainer>

          <div>
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
          </div>
        </LeftPanel>

        <RightPanel id="right-panel" ref={rightPanelRef}>
          {currentRoute === '#gallery' ? (
            <ErrorBoundary>
              <GalleryPage />
            </ErrorBoundary>
          ) : (
            <Experience parentRef={rightPanelRef} />
          )}
          <SectionSeparator />
          <Footer />
        </RightPanel>
      </AppGrid>
    </>
  );
}

export default App;