import { useRef, useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { motion, useScroll, useTransform } from 'framer-motion';
import { supabase } from '../../supabaseClient';

import kochiPhoto from '../../kochi_port_monsoon.jpg';
import mountainSketch from '../../mountain_sketch.jpg';
import streetRain from '../../street_rain.jpg';
import palmPhoto from '../../palm_photo.jpg';

const localFallbackSnaps = [
  { src: kochiPhoto, caption: 'Kochi Monsoon' },
  { src: mountainSketch, caption: 'Western Ghats' },
  { src: streetRain, caption: 'MG Road twilight' },
  { src: palmPhoto, caption: 'Monsoon Dew' }
];

// Container wrapping the Dashboard & Detailed View
const LayoutContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

/* ==========================================================================
   1. DASHBOARD GRID STYLES (Initial View - Balanced CRT TTY Boxes Layout)
   ========================================================================== */

const DashboardViewport = styled.div`
  width: 100%;
  box-sizing: border-box;
  
  @media (min-width: 1024px) {
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }
`;

const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  padding: 1.5rem;
  width: 100%;
  box-sizing: border-box;

  @media (min-width: 1024px) {
    grid-template-columns: 1.15fr 0.85fr;
    padding: 2.5rem;
    max-width: 1100px;
    margin: 0 auto;
    gap: 2.25rem;
    align-items: center; /* Center boxes vertically in viewport */
  }
`;

const DashLabel = styled(motion.div)`
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  font-weight: 600;
  color: var(--ink);
  opacity: 0.6;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  margin-bottom: 0.5rem;
`;

const TimelineWindowWrapper = styled(motion.div)`
  display: flex;
  flex-direction: column;
  width: 100%;
  
  @media (min-width: 1024px) {
    height: 650px; /* Taller balanced height */
  }
`;

const RightColumnWrapper = styled(motion.div)`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 1.5rem;
  justify-content: space-between;

  @media (min-width: 1024px) {
    height: 650px; /* Taller balanced height */
  }
`;

const TerminalWindow = styled.div`
  background-color: #0A0A0A;
  border: 2px solid var(--ink);
  padding: 1.6rem; /* Increased padding */
  box-shadow: 6px 6px 0px var(--rust);
  display: flex;
  flex-direction: column;
  gap: 1.25rem; /* Increased inner gap */
  height: 100%;
  min-height: 0;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    border-color: var(--rust);
    box-shadow: 7px 7px 0px var(--ink);
  }
`;

const WindowHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px dashed rgba(245, 243, 239, 0.2);
  padding-bottom: 0.5rem;
  flex-shrink: 0;
`;

const WindowTitle = styled.span`
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  opacity: 0.5;
  color: var(--ink);
`;

const WindowDots = styled.div`
  display: flex;
  gap: 0.35rem;
  
  span {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: var(--ink);
    opacity: 0.3;
  }
`;

const WindowContentScroll = styled.div`
  flex: 1;
  overflow-y: auto;
  min-height: 0;
  
  /* Scrollbar hide for neat dashboard feel */
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

// Dashboard Timeline Styles (Compact preview)
const Timeline = styled.div`
  position: relative;
  border-left: 2px dashed rgba(245, 243, 239, 0.15);
  margin-left: 0.5rem;
  padding-left: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1.6rem; /* Increased gap between job timeline blocks */
`;

const TimelineItem = styled.div`
  position: relative;
`;

const TimelineDot = styled.div`
  position: absolute;
  left: calc(-1.25rem - 6px);
  top: 6px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: ${props => props.isActive ? 'var(--rust)' : 'var(--ink)'};
  border: 2px solid var(--paper);
  box-shadow: ${props => props.isActive ? '0 0 8px var(--rust)' : 'none'};
`;

const TimelineTitle = styled.h4`
  font-family: var(--font-display);
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--ink);
  margin: 0;
`;

const TimelineCompany = styled.div`
  font-family: var(--font-serif);
  font-style: italic;
  font-size: 0.8125rem;
  color: var(--rust);
  margin-top: 0.1rem;
`;

const TimelinePeriod = styled.div`
  font-family: var(--font-mono);
  font-size: 0.6875rem;
  opacity: 0.6;
  margin-top: 0.15rem;
`;

const TimelinePreviewText = styled.div`
  font-family: var(--font-body);
  font-size: 0.8125rem; /* Increased font size */
  color: var(--carbon);
  margin-top: 0.4rem; /* Increased margin */
  line-height: 1.5; /* Increased line height */
`;

const TerminalCTAPrompt = styled.div`
  margin-top: 1.75rem; /* Increased margin */
  border-top: 1px dashed rgba(245, 243, 239, 0.15);
  padding-top: 1.25rem; /* Increased padding */
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--rust);
  display: flex;
  flex-direction: column;
  gap: 0.3rem; /* Increased gap */
  flex-shrink: 0;
`;

// Dashboard Stack Tag style (brackets)
const DashTagGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem; /* Increased tag spacing gap */
`;

const DashTag = styled.span`
  font-family: var(--font-mono);
  font-size: 0.8125rem; /* Increased font size */
  padding: 0.35rem 0.65rem; /* Increased padding */
  border: 1px solid rgba(245, 243, 239, 0.2);
  border-radius: 3px;
  color: var(--ink);
  opacity: 0.8;
  cursor: default;

  &.more-indicator {
    color: var(--rust);
    border-color: rgba(255, 90, 54, 0.3);
    font-weight: 500;
  }
`;

const DashInnerBlock = styled.div`
  background-color: rgba(0, 0, 0, 0.25);
  border: 1px solid rgba(245, 243, 239, 0.1);
  border-radius: 4px;
  padding: 1.25rem 1.5rem; /* Increased padding */
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--carbon);
  display: flex;
  flex-direction: column;
  gap: 0.5rem; /* Increased gap */
`;

const DashBlockStatus = styled.div`
  display: flex;
  align-items: center;
  gap: 0.4rem;
  color: var(--rust);
  font-weight: bold;
  font-size: 0.75rem;
`;

/* ==========================================================================
   2. DETAILED SINGLE-COLUMN VIEW (Scroll Down - Open, Borderless Zine Theme)
   ========================================================================== */

const DetailedContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 5rem 1.5rem;
  gap: 6rem;
  box-sizing: border-box;
  background-color: #050505; /* Deep luxury black background */
  border-top: 1px solid rgba(245, 243, 239, 0.15);

  @media (min-width: 1024px) {
    padding: 7rem 4rem;
    gap: 8rem;
  }
`;

const SectionWrapper = styled(motion.div)`
  width: 100%;
  max-width: 1100px; /* Utilizing significantly more space */
  display: flex;
  flex-direction: column;
  scroll-margin-top: 2rem;

  @media (min-width: 1024px) {
    scroll-margin-top: 4rem;
  }
`;

const SectionLabel = styled.div`
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--rust); /* Pop in rust for full detail headers */
  text-transform: uppercase;
  letter-spacing: 0.25em;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  width: 100%;

  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background-color: rgba(255, 90, 54, 0.25);
  }
`;

// Open Zine-Style layouts - Completely eliminates outer borders, backgrounds, and drop-shadow box feel
const OpenJobRow = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 2.5rem 0;
  border-bottom: 1px solid rgba(245, 243, 239, 0.1);
  width: 100%;

  &:last-of-type {
    border-bottom: none;
  }

  @media (min-width: 1024px) {
    flex-direction: row;
    gap: 4rem;
    align-items: flex-start;
  }
`;

const JobLeftCol = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  
  @media (min-width: 1024px) {
    max-width: 320px;
    position: sticky;
    top: 5rem;
  }
`;

const JobRightCol = styled.div`
  flex: 2;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const JobTitleText = styled.h3`
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--ink);
  margin: 0;

  @media (min-width: 768px) {
    font-size: 1.875rem;
  }
`;

const JobCompanyText = styled.div`
  font-family: var(--font-serif);
  font-style: italic;
  font-size: 1.125rem;
  color: var(--rust);
  margin-top: 0.15rem;
`;

const JobPeriodText = styled.span`
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  color: var(--ink);
  opacity: 0.5;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-top: 0.35rem;
`;

const MiniTraceTerminal = styled.div`
  background-color: #030303;
  border: 1px solid rgba(245, 243, 239, 0.08);
  border-radius: 4px;
  padding: 0.85rem 1.15rem;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: #00FF41; /* Green matrix output */
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  box-shadow: inset 0 0 10px rgba(0,0,0,0.9);

  .user-input {
    color: var(--ink);
    opacity: 0.85;
  }
  
  .terminal-info-header {
    font-size: 0.6875rem;
    opacity: 0.3;
    color: var(--ink);
    margin-bottom: 0.15rem;
    text-transform: uppercase;
  }
`;

const JobBullets = styled.ul`
  margin: 0;
  padding-left: 1.15rem;
  font-family: var(--font-body);
  font-size: 0.9375rem;
  color: var(--carbon);
  display: flex;
  flex-direction: column;
  gap: 0.65rem;

  li {
    list-style-type: square;
    line-height: 1.6;
  }
`;

// Detailed Tech Stack Sticker Sheet (Unboxed)
const TechStickerSheet = styled(motion.div)`
  display: flex;
  flex-wrap: wrap;
  gap: 0.85rem;
  justify-content: flex-start;
  width: 100%;
  padding: 1rem 0;
`;

const TechSticker = styled(motion.span)`
  font-family: var(--font-mono);
  font-size: 0.875rem;
  padding: 0.5rem 1rem;
  border: 1px solid rgba(245, 243, 239, 0.3);
  border-radius: 4px;
  cursor: default;
  background-color: rgba(245, 243, 239, 0.02);
  color: var(--ink);
  display: inline-block;

  &:hover {
    background-color: var(--rust) !important;
    border-color: var(--rust) !important;
    color: var(--paper) !important;
    box-shadow: 5px 5px 0px var(--ink);
  }
`;

// Detailed Projects (Unboxed)
const EvidenceProjectList = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`;

const OpenProjectRow = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 2.5rem 0;
  border-bottom: 1px solid rgba(245, 243, 239, 0.1);
  width: 100%;

  &:last-of-type {
    border-bottom: none;
  }

  @media (min-width: 1024px) {
    flex-direction: row;
    gap: 4rem;
    align-items: flex-start;
  }
`;

const ProjectLeftCol = styled.div`
  flex: 1.1;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  
  @media (min-width: 1024px) {
    max-width: 380px;
    position: sticky;
    top: 5rem;
  }
`;

const ProjectRightCol = styled.div`
  flex: 1.9;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
`;

const ProjectTitleText = styled.h4`
  font-family: var(--font-display);
  font-size: 1.375rem;
  font-weight: 600;
  color: var(--ink);
  margin: 0;
`;

const ProjectDescription = styled.p`
  font-family: var(--font-body);
  font-size: 0.9375rem;
  color: var(--carbon);
  line-height: 1.6;
  margin: 0;
`;

// Detailed Certifications badging (Unboxed list with divider tags)
const OpenCertsList = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  width: 100%;
  padding: 1rem 0;

  @media (min-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const OpenCertItem = styled(motion.div)`
  padding: 1.5rem 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  border-top: 1px solid rgba(245, 243, 239, 0.1);

  .cert-title {
    font-family: var(--font-display);
    font-size: 1.0625rem;
    font-weight: 600;
    color: var(--ink);
    margin: 0;
    line-height: 1.4;
  }

  .cert-meta {
    font-family: var(--font-mono);
    font-size: 0.75rem;
    color: var(--carbon);
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
    margin-top: 0.25rem;
  }

  .verified-badge {
    color: var(--rust);
    font-weight: bold;
    font-size: 0.75rem;
    margin-top: 0.4rem;
    letter-spacing: 0.05em;
  }
`;

// Scattered Polaroid Snaps Preview (Expanded to utilize maximum horizontal width)
const SnapsContainer = styled.div`
  display: flex;
  gap: 1.25rem;
  overflow-x: auto;
  padding: 1.5rem 0.5rem;
  width: 100%;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
  
  @media (min-width: 768px) {
    display: block;
    position: relative;
    height: 330px;
    overflow: visible;
    margin: 2rem 0;
  }
`;

const PolaroidSnap = styled(motion.div)`
  flex-shrink: 0;
  background-color: var(--chalk);
  border: 2px solid var(--ink);
  padding: 10px; /* Uniform padding */
  width: 150px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
  cursor: pointer;
  transition: border-color 0.25s, box-shadow 0.25s;

  img {
    width: 100%;
    height: 110px;
    object-fit: cover;
    border: 1px solid rgba(245, 243, 239, 0.15);
  }

  &:hover {
    border-color: var(--rust) !important;
    box-shadow: 0 12px 28px rgba(255, 90, 54, 0.25);
  }

  @media (min-width: 768px) {
    position: absolute;
    width: 190px;
    
    img {
      height: 140px;
    }

    &:nth-of-type(1) {
      left: 0%;
      top: 15px;
    }
    &:nth-of-type(2) {
      left: 26%;
      top: 40px;
      z-index: 2;
    }
    &:nth-of-type(3) {
      left: 52%;
      top: 10px;
      z-index: 1;
    }
    &:nth-of-type(4) {
      left: 77%;
      top: 30px;
    }
  }
`;

const GalleryButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 2rem;
  width: 100%;
`;

const ViewGalleryLink = styled.a`
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  color: var(--ink);
  border: 2px solid var(--ink);
  padding: 0.75rem 1.75rem;
  text-decoration: none;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  cursor: pointer;
  letter-spacing: 0.05em;
  box-shadow: 4px 4px 0px rgba(245, 243, 239, 0.1);

  &:hover {
    background-color: var(--rust);
    border-color: var(--rust);
    color: var(--paper);
    box-shadow: 5px 5px 0px var(--ink);
    transform: translate(-3px, -3px);
  }
`;

/* ==========================================================================
   3. DATA SCHEMAS
   ========================================================================== */

const jobsData = [
  {
    title: 'Junior Engineer - Cloud',
    company: 'Saints & Masters',
    period: 'Nov 2025 - Present',
    preview: 'Automate cloud infrastructure provisioning, system security, and identity governance on AWS.',
    details: [
      'Automate cloud infrastructure provisioning, system security, and identity governance on AWS.',
      'Monitor cluster resources and system telemetry metrics with Prometheus & Grafana.',
      'Perform alert diagnostic logs triage to resolve critical environment incident occurrences.'
    ],
    terminalLogs: [
      '$ aws sts get-caller-identity',
      'ARN: arn:aws:iam::112233445566:user/abhiragh',
      '$ kubectl get pods -n monitoring',
      'STATUS: Prometheus-Server [RUNNING] [99.9% Uptime]'
    ]
  },
  {
    title: 'DevOps Intern',
    company: 'Nubinix / Saints & Masters',
    period: 'June 2025 - Nov 2025',
    preview: 'Orchestrated container builds and testing pipelines via automated CI/CD workflows.',
    details: [
      'Orchestrated container builds and testing pipelines via automated CI/CD workflows.',
      'Optimized internal egress routing with customized NAT setups, reducing network costs.',
      'Configured load balancers, secure gateways, and local system environments.'
    ],
    terminalLogs: [
      '$ git push origin production',
      '[CI-CD] Triggering build #4489...',
      '[DOCKER] Container image built and pushed to ECR.',
      '[DEPLOY] ECS Service update stable.'
    ]
  },
  {
    title: 'Associate System Engineer Intern',
    company: 'Bridge Global Software Solutions',
    period: 'Jan 2025 - June 2025',
    preview: 'Administered OS servers (Linux & Windows) for system audits and permissions setup.',
    details: [
      'Administered OS servers (Linux & Windows) for system audits and permissions setup.',
      'Maintained databases (MySQL) handling backups, migration validation, and maintenance chores.',
      'Created scripts for operational automations and local system monitoring alerts.'
    ],
    terminalLogs: [
      '$ systemctl status mysql',
      '● mysql.service - MySQL Community Server (ACTIVE)',
      '$ ./backup_validator.sh --daily',
      '[SUCCESS] Backup hashes validated successfully.'
    ]
  }
];

const stackData = [
  'AWS', 'Terraform', 'Python', 'Linux', 'Docker', 'Bash', 'Nginx', 
  'Ansible', 'Prometheus', 'Grafana', 'MySQL', 'PostgreSQL', 'IAM', 'VPC'
];

const projectsData = [
  {
    title: 'AWS Multi-Region Telemetry Pipeline',
    description: 'A global monitoring dashboard federating Prometheus servers across US-East, EU-West, and AP-South. Automated deployments with Terraform workspace definitions, securing telemetry data flow using custom AWS IAM rules and VPC peering.',
    logs: [
      '$ terraform apply -auto-approve',
      'Apply complete! Resources: 18 added, 0 changed, 0 destroyed.',
      'Outputs: telemetry_dns = "https://telemetry.global.saints.net"'
    ]
  },
  {
    title: 'Self-Healing CI/CD Auto-Rollback Engine',
    description: 'An ArgoCD dashboard validation service triggered via Github Actions. Tracks canary deployments and monitors real-time telemetry alerts. Instantly triggers rollback commands if the error rate exceeds 0.5% threshold.',
    logs: [
      '$ npm run monitor-canary',
      '[ALERT] HTTP 500 rate at 1.4% (> 0.5% max target)',
      '[ACTION] ArgoCD rollback execution to version v1.4.1... SUCCESS'
    ]
  }
];

const certsData = [
  { title: 'AWS Certified Solutions Architect', authority: 'Amazon Web Services', date: 'Dec 2025', id: 'AWS-ASA-9921' },
  { title: 'HashiCorp Certified Terraform Associate', authority: 'HashiCorp', date: 'Oct 2025', id: 'HC-TA-8843' },
  { title: 'Certified Kubernetes Administrator', authority: 'The Linux Foundation', date: 'Aug 2025', id: 'LF-CKA-7711' }
];

const tagRotations = ['-1.5deg', '1.2deg', '-0.8deg', '2deg', '-1.2deg', '0.8deg', '-2deg', '1.5deg'];

// Transitions from grid boxes to full zine columns
const listStaggerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12
    }
  }
};

const openTextVariants = {
  hidden: { 
    opacity: 0, 
    y: 35,
  },
  show: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 70,
      damping: 15,
      mass: 0.8
    }
  }
};

const Experience = ({ parentRef }) => {
  const containerRef = useRef(null);
  const [snaps, setSnaps] = useState([]);
  
  // Track scroll position of the scrollable RightPanel container ref
  const { scrollY } = useScroll({
    container: parentRef
  });

  const [isLargeScreen, setIsLargeScreen] = useState(false);
  useEffect(() => {
    const checkScreen = () => setIsLargeScreen(window.innerWidth >= 1024);
    checkScreen();
    window.addEventListener('resize', checkScreen);
    return () => window.removeEventListener('resize', checkScreen);
  }, []);

  useEffect(() => {
    async function fetchSnaps() {
      if (!supabase) return;
      try {
        const { data: files, error } = await supabase.storage
          .from('photos')
          .list('', {
            limit: 20,
            sortBy: { column: 'name', order: 'asc' }
          });
          
        if (error) throw error;
        
        if (files && files.length > 0) {
          const filtered = files.filter(f => f.name !== '.emptyFolderPlaceholder');
          const items = filtered.map(file => {
            const { data } = supabase.storage
              .from('photos')
              .getPublicUrl(file.name);
              
            const lastDot = file.name.lastIndexOf('.');
            const cleanTitle = lastDot !== -1
              ? file.name.substring(0, lastDot).replace(/[_-]/g, ' ')
              : file.name.replace(/[_-]/g, ' ');
              
            return {
              src: data.publicUrl,
              caption: cleanTitle
            };
          });
          
          if (items.length > 0) {
            // Shuffle and pick up to 4 snaps dynamically
            const shuffled = [...items].sort(() => 0.5 - Math.random());
            setSnaps(shuffled.slice(0, 4));
          }
        }
      } catch (err) {
        console.warn('Failed to fetch preview snaps from Supabase, loading fallbacks:', err);
      }
    }
    fetchSnaps();
  }, []);

  const activeSnaps = snaps.length > 0 ? snaps : localFallbackSnaps;

  // Pixel scroll-offset-driven transformations (for Desktop only)
  const otherOpacity = useTransform(scrollY, [0, 260], [1, 0]);
  const otherX = useTransform(scrollY, [0, 260], [0, 60]);
  
  const labelOpacity = useTransform(scrollY, [0, 160], [0.6, 0]);

  // EXPERIENCE CONTROL CENTER WINDOW ZOOM ANIMATION
  // Scale zooms up from 1x to 1.32x as user scrolls down the first screenful
  const expScale = useTransform(scrollY, [0, 420], [1, 1.32]);
  
  // Moves the left-aligned Careers window smoothly to the horizontal center as it zooms
  const expX = useTransform(scrollY, [0, 420], ["0%", "45%"]); 
  
  // Stays fully visible, then fades away completely to make way for detailed view below
  const expOpacity = useTransform(scrollY, [0, 280, 450], [1, 1, 0]);
  const expRotate = useTransform(scrollY, [0, 420], [0.5, 0]);

  return (
    <LayoutContainer ref={containerRef}>
      
      {/* ====================================================================
         1. CONTROL CENTER DASHBOARD (Top View - Stark CRT TTY Boxes Layout)
         ==================================================================== */}
      <DashboardViewport>
        <DashboardGrid>
          
          {/* Left Column: Careers Log Timeline (Compact, Preview content only) */}
          <TimelineWindowWrapper
            style={{
              scale: isLargeScreen ? expScale : 1,
              x: isLargeScreen ? expX : "0%",
              opacity: isLargeScreen ? expOpacity : 1,
              rotate: isLargeScreen ? expRotate : 0.5,
            }}
          >
            <DashLabel style={{ opacity: isLargeScreen ? labelOpacity : 0.6 }}>
              [01] Professional Log
            </DashLabel>
            <TerminalWindow>
              <WindowHeader>
                <WindowTitle>CAREERS_LOG (TTY4)</WindowTitle>
                <WindowDots><span /><span /><span /></WindowDots>
              </WindowHeader>
              <WindowContentScroll>
                <Timeline>
                  {jobsData.map((job, idx) => (
                    <TimelineItem key={idx}>
                      <TimelineDot isActive={idx === 0} />
                      <TimelineTitle>{job.title}</TimelineTitle>
                      <TimelineCompany>{job.company}</TimelineCompany>
                      <TimelinePeriod>{job.period}</TimelinePeriod>
                      <TimelinePreviewText>
                        {job.preview}
                      </TimelinePreviewText>
                    </TimelineItem>
                  ))}
                </Timeline>
              </WindowContentScroll>
              <TerminalCTAPrompt>
                <div>$ tail -n 2 careers_log.db</div>
                <div style={{ color: 'var(--ink)', opacity: 0.5 }}>[OK] Cloud profile active.</div>
                <div style={{ color: '#00FF41' }}>
                  [OK] Scroll down to view detailed timeline
                  <span className="terminal-cursor" style={{ width: '6px', height: '10px', margin: '0 0 0 4px' }} />
                </div>
              </TerminalCTAPrompt>
            </TerminalWindow>
          </TimelineWindowWrapper>

          {/* Right Column Windows: Stack, WIP Evidence, Pending Certs (Float/Fade out on scroll) */}
          <RightColumnWrapper
            style={{
              opacity: isLargeScreen ? otherOpacity : 1,
              x: isLargeScreen ? otherX : 0,
            }}
          >
            {/* Box 1: Tech Stack Preview */}
            <div style={{ flex: 1.1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
              <DashLabel style={{ opacity: isLargeScreen ? labelOpacity : 0.6 }}>
                [02] System Stack
              </DashLabel>
              <TerminalWindow>
                <WindowHeader>
                  <WindowTitle>INFRA_STACK (TTY3)</WindowTitle>
                  <WindowDots><span /><span /><span /></WindowDots>
                </WindowHeader>
                <WindowContentScroll>
                  <DashTagGrid>
                    {stackData.slice(0, 6).map((tag) => (
                      <DashTag key={tag}>[{tag}]</DashTag>
                    ))}
                    <DashTag className="more-indicator">
                      [+{stackData.length - 6} MORE]
                    </DashTag>
                  </DashTagGrid>
                </WindowContentScroll>
              </TerminalWindow>
            </div>

            {/* Box 2: Evidence WIP */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
              <DashLabel style={{ opacity: isLargeScreen ? labelOpacity : 0.6 }}>
                [03] Evidence Workspace
              </DashLabel>
              <TerminalWindow>
                <WindowHeader>
                  <WindowTitle>EVIDENCE_WORKSPACE (TTY2)</WindowTitle>
                  <WindowDots><span /><span /><span /></WindowDots>
                </WindowHeader>
                <WindowContentScroll style={{ display: 'flex', alignItems: 'center' }}>
                  <DashInnerBlock style={{ width: '100%' }}>
                    <DashBlockStatus>
                      <span className="terminal-cursor" style={{ width: '6px', height: '6px', margin: 0 }} />
                      <span>[STATUS: WIP]</span>
                    </DashBlockStatus>
                    <div>evidence_dir/: Indexes offline...</div>
                    <div style={{ opacity: 0.5 }}>&gt; Work in progress</div>
                  </DashInnerBlock>
                </WindowContentScroll>
              </TerminalWindow>
            </div>

            {/* Box 3: Certs Pending */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
              <DashLabel style={{ opacity: isLargeScreen ? labelOpacity : 0.6 }}>
                [04] Certifications Log
              </DashLabel>
              <TerminalWindow>
                <WindowHeader>
                  <WindowTitle>CERTIFICATIONS (TTY5)</WindowTitle>
                  <WindowDots><span /><span /><span /></WindowDots>
                </WindowHeader>
                <WindowContentScroll style={{ display: 'flex', alignItems: 'center' }}>
                  <DashInnerBlock style={{ width: '100%' }}>
                    <DashBlockStatus>
                      <span className="terminal-cursor" style={{ width: '6px', height: '6px', margin: 0 }} />
                      <span>[STATUS: PENDING]</span>
                    </DashBlockStatus>
                    <div>certifications_log.db: Fetching assets...</div>
                    <div style={{ opacity: 0.5 }}>&gt; Coming Soon</div>
                  </DashInnerBlock>
                </WindowContentScroll>
              </TerminalWindow>
            </div>
          </RightColumnWrapper>

        </DashboardGrid>
      </DashboardViewport>

      {/* ====================================================================
         2. DETAILED SINGLE-COLUMN VIEW (Scroll Down - Open, Borderless Zine Theme)
         ==================================================================== */}
      <DetailedContainer>
        
        {/* Full Careers Log Details */}
        <SectionWrapper id="experience">
          <SectionLabel>[01] Professional Log (Detailed)</SectionLabel>
          <motion.div 
            variants={listStaggerVariants} 
            initial="hidden" 
            whileInView="show" 
            viewport={{ once: true, amount: 0.1 }}
            style={{ width: '100%' }}
          >
            {jobsData.map((job, idx) => (
              <OpenJobRow key={idx} variants={openTextVariants}>
                <JobLeftCol>
                  <JobTitleText>{job.title}</JobTitleText>
                  <JobCompanyText>{job.company}</JobCompanyText>
                  <JobPeriodText>{job.period}</JobPeriodText>
                </JobLeftCol>
                <JobRightCol>
                  <MiniTraceTerminal>
                    <div className="terminal-info-header">diagnostic_trace_tty{4 + idx}.sh</div>
                    {job.terminalLogs.map((log, lIdx) => (
                      <div key={lIdx} className={log.startsWith('$') ? 'user-input' : ''}>
                        {log}
                      </div>
                    ))}
                  </MiniTraceTerminal>
                  <JobBullets>
                    {job.details.map((detail, dIdx) => (
                      <li key={dIdx}>{detail}</li>
                    ))}
                  </JobBullets>
                </JobRightCol>
              </OpenJobRow>
            ))}
          </motion.div>
        </SectionWrapper>

        {/* Full System Stack Details */}
        <SectionWrapper id="about">
          <SectionLabel>[02] System Stack (Detailed)</SectionLabel>
          <TechStickerSheet
            variants={listStaggerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.1 }}
          >
            {stackData.map((tag, idx) => (
              <TechSticker
                key={tag}
                variants={openTextVariants}
                style={{ rotate: tagRotations[idx % tagRotations.length] }}
                whileHover={{ scale: 1.08, rotate: 0 }}
              >
                [{tag}]
              </TechSticker>
            ))}
          </TechStickerSheet>
        </SectionWrapper>

        {/* Full Evidence Workspace Details */}
        <SectionWrapper>
          <SectionLabel>[03] Evidence Workspace (Projects)</SectionLabel>
          <EvidenceProjectList>
            {projectsData.map((project, idx) => (
              <OpenProjectRow 
                key={idx}
                variants={openTextVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.15 }}
              >
                <ProjectLeftCol>
                  <ProjectTitleText>{project.title}</ProjectTitleText>
                  <ProjectDescription>{project.description}</ProjectDescription>
                </ProjectLeftCol>
                <ProjectRightCol>
                  <MiniTraceTerminal>
                    <div className="terminal-info-header">prod_environment_verification.log</div>
                    {project.logs.map((log, lIdx) => (
                      <div key={lIdx} className={log.startsWith('$') ? 'user-input' : ''}>
                        {log}
                      </div>
                    ))}
                  </MiniTraceTerminal>
                </ProjectRightCol>
              </OpenProjectRow>
            ))}
          </EvidenceProjectList>
        </SectionWrapper>

        {/* Full Certifications Badge Details */}
        <SectionWrapper>
          <SectionLabel>[04] Certifications Log (Verified)</SectionLabel>
          <OpenCertsList>
            {certsData.map((cert, idx) => (
              <OpenCertItem
                key={idx}
                variants={openTextVariants}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.15 }}
              >
                <h5 className="cert-title">{cert.title}</h5>
                <div className="cert-meta">
                  <div>Authority: {cert.authority}</div>
                  <div>Issued: {cert.date}</div>
                  <div>ID: {cert.id}</div>
                  <div className="cert-verified">✓ VERIFIED IN REGISTRY</div>
                </div>
              </OpenCertItem>
            ))}
          </OpenCertsList>
        </SectionWrapper>

        {/* Random snaps with Gallery navigation link */}
        <SectionWrapper
          variants={openTextVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
        >
          <SectionLabel>[05] Outside Work Snaps</SectionLabel>
          <SnapsContainer>
            {activeSnaps.map((snap, idx) => {
              const snapRotations = ['-5deg', '3deg', '-3deg', '5deg'];
              return (
                <PolaroidSnap 
                  key={idx}
                  style={{ rotate: snapRotations[idx % snapRotations.length] }}
                  whileHover={{ scale: 1.15, rotate: '0deg', zIndex: 10, y: -15 }}
                >
                  <img src={snap.src} alt={snap.caption || 'Gallery snap'} />
                </PolaroidSnap>
              );
            })}
          </SnapsContainer>

          <GalleryButtonWrapper>
            <ViewGalleryLink href="#gallery">
              [VIEW FULL GALLERY &rarr;]
            </ViewGalleryLink>
          </GalleryButtonWrapper>
        </SectionWrapper>

      </DetailedContainer>
    </LayoutContainer>
  );
};

export default Experience;