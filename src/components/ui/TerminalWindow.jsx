import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import styled from '@emotion/styled';
import Typewriter from './Typewriter';
import BlinkingCursor from './BlinkingCursor';

const lines = [
  { command: 'whoami', output: 'Abhiragh A R' },
  { command: 'cat role.txt', output: ['Associate System Engineer', 'LearningDevOps', 'Linux Enthusiast'] },
  { command: 'echo $MISSION', output: 'Building scalable, automated infrastructure with precision' },
];

const TerminalContainer = styled(motion.div)`
  width: 100%;
  max-width: 36rem;
  background-color: #000000;
  border: 2px solid #00FF41;
  border-radius: 0.5rem;
  box-shadow: 0 0 10px rgba(0, 255, 65, 0.5),
              0 0 20px rgba(0, 255, 65, 0.3),
              inset 0 0 10px rgba(0, 255, 65, 0.1);
  overflow: hidden;
`;

const TerminalHeader = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
  padding: 0.75rem 1rem;
  background-color: #1E2430;
  border-bottom: 1px solid #00FF41;
`;

const HeaderButton = styled.span`
  width: 0.75rem;
  height: 0.75rem;
  border-radius: 9999px;
  display: inline-block;
`;

const TerminalBody = styled.div`
  padding: 1.25rem;
  font-family: 'JetBrains Mono', monospace;
  color: #FFFFFF;
  background-color: #0A0E1A;
`;

const LineContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
`;

const Prompt = styled.span`
  color: #00FF41;
`;

const Command = styled.span`
  color: #FFFFFF;
`;

const Output = styled.div`
  color: #8B949E;
  margin: 0.25rem 0 0.75rem 1.25rem;
`;

const TerminalWindow = () => {
  const [completedLines, setCompletedLines] = useState([]);

  const handleLineComplete = (index) => {
    setTimeout(() => {
      setCompletedLines(prev => [...prev, index]);
    }, 200);
  };

  return (
    <TerminalContainer
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 1 }}
    >
      <TerminalHeader>
        <HeaderButton style={{ backgroundColor: '#FF5F56' }} />
        <HeaderButton style={{ backgroundColor: '#FFBD2E' }} />
        <HeaderButton style={{ backgroundColor: '#27C93F' }} />
      </TerminalHeader>
      <TerminalBody>
        {lines.map((line, index) => (
          <div key={index}>
            <LineContainer>
              <Prompt>root@portfolio:~#</Prompt>
              <Command>
                <Typewriter text={line.command} onComplete={() => handleLineComplete(index)} />
              </Command>
            </LineContainer>
            {completedLines.includes(index) && (
              <Output>
                {Array.isArray(line.output) ? (
                  line.output.map((o, i) => <div key={i}>{'>'} {o}</div>)
                ) : (
                  <div>{'>'} {line.output}</div>
                )}
              </Output>
            )}
          </div>
        ))}
        {completedLines.length === lines.length && (
            <LineContainer>
                <Prompt>root@portfolio:~#</Prompt>
                <BlinkingCursor />
            </LineContainer>
        )}
      </TerminalBody>
    </TerminalContainer>
  );
};

export default TerminalWindow;