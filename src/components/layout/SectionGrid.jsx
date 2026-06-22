import styled from '@emotion/styled';

export const SectionGrid = styled.section`
  display: grid;
  grid-template-columns: 1fr;
  border-bottom: 1px solid var(--ink);
  background-color: var(--paper);
  color: var(--ink);
  width: 100%;
  
  @media (min-width: 768px) {
    grid-template-columns: 240px 1fr;
  }
`;

export const LeftMargin = styled.div`
  padding: 2.5rem 1.5rem;
  display: flex;
  flex-direction: column;
  background-color: var(--paper);
  border-bottom: 1px solid var(--ink);
  
  @media (min-width: 768px) {
    border-bottom: none;
    border-right: 1px solid var(--ink);
    padding: 3rem 2rem;
  }
`;

export const MainContent = styled.div`
  padding: 2.5rem 1.5rem;
  background-color: var(--paper);
  
  @media (min-width: 768px) {
    padding: 4rem 4rem;
  }
`;

export const MetaLabel = styled.span`
  font-family: var(--font-body);
  font-size: 0.75rem;
  text-transform: uppercase;
  color: var(--ink);
  opacity: 0.6;
  letter-spacing: 0.1em;
`;

export const MetaValue = styled.div`
  font-family: var(--font-body);
  font-size: 0.875rem;
  color: var(--ink);
  margin-top: 0.25rem;
  margin-bottom: 1.5rem;
`;
