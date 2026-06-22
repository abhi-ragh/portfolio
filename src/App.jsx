import { useState, useEffect } from 'react';
import { Global, css } from '@emotion/react';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Hero from './components/sections/Hero';
import Experience from './components/sections/Experience';
import About from './components/sections/About';
import Skills from './components/sections/Skills';

const GlobalStyles = css`
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=IBM+Plex+Mono:wght@300;400;500;600;700&display=swap');

  :root {
    --ink: #1A1A1A;
    --paper: #F2EFE8;
    --carbon: #2E2E2E;
    --rust: #C0472F;
    --chalk: #F9F7F3;
    
    --font-display: 'DM Serif Display', serif;
    --font-body: 'IBM Plex Mono', monospace;
  }

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html {
    scroll-behavior: smooth;
    background-color: var(--paper);
  }

  body {
    background-color: var(--paper);
    color: var(--ink);
    font-family: var(--font-body);
    font-weight: 400;
    font-size: 16px;
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  button {
    font-family: inherit;
    cursor: pointer;
  }

  /* Simple scrollbar styling matching print aesthetic */
  ::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }
  ::-webkit-scrollbar-track {
    background: var(--paper);
  }
  ::-webkit-scrollbar-thumb {
    background: #D5D2CA;
    border-radius: 3px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: var(--ink);
  }
`;

function App() {
  return (
    <>
      <Global styles={GlobalStyles} />
      <Header />
      <main style={{ marginTop: '80px' }}>
        <Hero />
        <Experience />
        <About />
        <Skills />
      </main>
      <Footer />
    </>
  );
}

export default App;