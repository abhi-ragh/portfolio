import { Component } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import GallerySection from './components/GallerySection';
import WorkSection from './components/WorkSection';
import BlogSection from './components/BlogSection';
import FooterSection from './components/FooterSection';
import './styles/global.css';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '3rem', color: '#E2DFD8', backgroundColor: '#0D0D0D', fontFamily: 'monospace' }}>
          <h2>Render Exception</h2>
          <pre>{this.state.error?.stack || this.state.error?.message}</pre>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  return (
    <ErrorBoundary>
      <Navbar />
      <main>
        <HeroSection />
        <AboutSection />
        <GallerySection />
        <WorkSection />
        <BlogSection />
      </main>
      <FooterSection />
    </ErrorBoundary>
  );
}

export default App;