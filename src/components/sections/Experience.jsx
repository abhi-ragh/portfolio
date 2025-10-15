import { motion } from 'framer-motion';
import styled from '@emotion/styled';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

const experienceData = [
  {
    role: 'Associate System Engineer (Intern)',
    company: 'Bridge Global Software',
    date: 'June 2025 - Present',
    tasks: [
      'Linux/Windows admin',
      'CI/CD pipelines',
      'Docker containerization',
      'Cloud platforms',
      'MySQL database mgmt',
    ],
  },
];

const ExperienceContainer = styled.section`
  padding: 6rem 0;
  background-color: #0A0E1A;
`;

const Container = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 1.5rem;
`;

const ExperienceTitle = styled.h2`
  font-size: 2.5rem;
  font-family: 'Google Sans', sans-serif;
  font-weight: 500;
  text-align: center;
  margin-bottom: 4rem;
`;

const TimelineContainer = styled.div`
  position: relative;
`;

const TimelineLine = styled.div`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  height: 100%;
  width: 2px;
  background-color: #00FF41;
`;

const ExperienceItem = styled.div`
  margin-bottom: 4rem;
  display: flex;
  justify-content: center;
`;

const ExperienceCard = styled(motion.div)`
  width: 100%;
  max-width: 42rem;
  background-color: #1E2430;
  border: 1px solid #00FF41;
  border-radius: 0.5rem;
  padding: 2rem;
  box-shadow: 0 0 10px rgba(0, 255, 65, 0.5),
              0 0 20px rgba(0, 255, 65, 0.3),
              inset 0 0 10px rgba(0, 255, 65, 0.1);
  position: relative;
`;

const TimelineDot = styled.div`
  position: absolute;
  left: -3.2rem;
  top: 50%;
  transform: translateY(-50%);
  width: 1rem;
  height: 1rem;
  background-color: #FBBC04;
  border-radius: 9999px;
`;

const TimelineConnector = styled.div`
  position: absolute;
  left: -3rem;
  top: 50%;
  transform: translateY(-50%);
  width: 1.2rem;
  height: 2px;
  background-color: #FBBC04;
`;

const Role = styled.h3`
  font-size: 1.5rem;
  font-family: 'Roboto Mono', monospace;
  color: #FBBC04;
`;

const Company = styled.p`
  color: #8B949E;
  margin-bottom: 0.5rem;
`;

const TaskList = styled.ul`
  color: #FFFFFF;
  list-style: none;
  padding-left: 0;
`;

const Task = styled(motion.li)`
  position: relative;
  padding-left: 1.5rem;
  &:before {
    content: '>';
    position: absolute;
    left: 0;
    color: #00FF41;
  }
`;

const Experience = () => {
  const [ref, isInView] = useScrollAnimation();

  return (
    <ExperienceContainer id="experience">
      <Container>
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 30 }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        >
          <ExperienceTitle>EXPERIENCE_LOG</ExperienceTitle>
          <TimelineContainer>
            <TimelineLine />
            {experienceData.map((item, index) => (
              <ExperienceItem key={index}>
                <ExperienceCard
                  initial={{ opacity: 0, x: -100 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  <TimelineConnector />
                  <TimelineDot />
                  <Role>{item.role}</Role>
                  <Company>{item.company} | {item.date}</Company>
                  <TaskList>
                    {item.tasks.map((task, i) => (
                      <Task
                        key={i}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: 0.4 + i * 0.1 }}
                        viewport={{ once: true }}
                      >
                        {task}
                      </Task>
                    ))}
                  </TaskList>
                </ExperienceCard>
              </ExperienceItem>
            ))}
          </TimelineContainer>
        </motion.div>
      </Container>
    </ExperienceContainer>
  );
};

export default Experience;