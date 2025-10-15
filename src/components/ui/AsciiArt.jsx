import { motion, useScroll, useTransform } from 'framer-motion';
import styled from '@emotion/styled';

const AsciiArtContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const AsciiPre = styled.pre`
  color: #00FF41;
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.75rem;
  line-height: 1.2;
`;

const CommandSpan = styled(motion.span)`
  position: absolute;
  color: #00FF41;
  font-family: 'JetBrains Mono', monospace;
  font-size: 1.125rem;
`;

const AsciiArt = () => {
  const commands = ['docker', 'terraform', 'kubectl', 'git'];
  const { scrollYProgress } = useScroll();
  const y1 = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -100]);

  return (
    <AsciiArtContainer>
      <AsciiPre>
        {
          `
    ╔═══════════════════════╗
    ║  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  ║
    ║  ▓▓ SERVER RACK ▓▓  ║
    ║  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  ║
    ║  ◉ ◉ ◉ ◉ ◉ ◉ ◉ ◉  ║
    ║  ━━━━━━━━━━━━━━━━━  ║
    ║  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  ║
    ║  ◉ ◉ ◉ ◉ ◉ ◉ ◉ ◉  ║
    ╚═══════════════════════╝
          `
        }
      </AsciiPre>
      {commands.map((cmd, i) => (
        <CommandSpan
          key={cmd}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1, y: i % 2 === 0 ? y1 : y2, animation: 'float 3s ease-in-out infinite' }}
          transition={{ duration: 0.5, delay: 1.5 + i * 0.2 }}
          style={{
            top: `${20 + i * 15}%`,
            left: `${10 + i * 20}%`,
          }}
        >
          {cmd}
        </CommandSpan>
      ))}
    </AsciiArtContainer>
  );
};

export default AsciiArt;
