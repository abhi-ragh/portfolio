import { useState, useEffect, lazy, Suspense } from 'react';
import { Global, css } from '@emotion/react';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Hero from './components/sections/Hero';
import LoadingScreen from './components/ui/LoadingScreen';

import LoadingSpinner from './components/ui/LoadingSpinner';

const About = lazy(() => import('./components/sections/About'));
const Experience = lazy(() => import('./components/sections/Experience'));
const Projects = lazy(() => import('./components/sections/Projects'));
const Skills = lazy(() => import('./components/sections/Skills'));
const Certifications = lazy(() => import('./components/sections/Certifications'));
const Contact = lazy(() => import('./components/sections/Contact'));

const GlobalStyles = css`
  @import url('https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@300;400;700&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Google+Sans:wght@400;500;700&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400&display=swap');

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    background-color: #0A0E1A;
    color: #FFFFFF;
    font-family: 'Roboto Mono', monospace;
    font-weight: 300;
    font-size: 16px;
  }

  h1 {
    font-family: 'Google Sans', sans-serif;
    font-size: 72px;
    font-weight: 700;
  }

  h2 {
    font-family: 'Google Sans', sans-serif;
    font-size: 48px;
    font-weight: 500;
  }

  h3 {
    font-family: 'Roboto Mono', monospace;
    font-size: 32px;
    font-weight: 400;
  }

  code, pre {
    font-family: 'JetBrains Mono', monospace;
    font-size: 14px;
  }

  .terminal-glow {
    box-shadow: 0 0 10px rgba(0, 255, 65, 0.5),
                0 0 20px rgba(0, 255, 65, 0.3),
                inset 0 0 10px rgba(0, 255, 65, 0.1);
  }

  @keyframes glow-pulse {
    0%, 100% { box-shadow: 0 0 10px rgba(0, 255, 65, 0.5); }
    50% { box-shadow: 0 0 20px rgba(0, 255, 65, 0.8); }
  }

  @keyframes float {
    0%, 100% { transform: translateY(0px) translateX(0px); }
    50% { transform: translateY(-20px) translateX(10px); }
  }

  @keyframes bounce {
    0%, 20%, 50%, 80%, 100% {transform: translateY(0);}
    40% {transform: translateY(-30px);}
    60% {transform: translateY(-15px);}
  }

  @keyframes gentle-float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-2px); }
  }
`;

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <Global styles={GlobalStyles} />
      <Header />
      <main>
        <Hero />
        <Suspense fallback={<LoadingSpinner />}>
          <About />
          <Experience />
          <Projects />
          <Skills />
          <Certifications />
          <Contact />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}

export default App;