import styled from '@emotion/styled';

const FooterWrapper = styled.footer`
  padding: 3rem 1.5rem;
  border-top: 1px solid var(--border);
  max-width: 1100px;
  margin: 0 auto;
  width: 100%;
  box-sizing: border-box;

  @media (min-width: 768px) {
    padding: 4rem 3rem;
  }
`;

const OneLineFooter = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--ink-muted);
  letter-spacing: 0.05em;

  @media (min-width: 640px) {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
`;

const LocationYear = styled.div`
  text-transform: uppercase;
`;

const LinksGroup = styled.div`
  display: flex;
  gap: 1.75rem;
`;

const FooterLink = styled.a`
  color: var(--ink);
  text-decoration: none;
  transition: opacity 0.2s ease;
  opacity: 0.8;

  &:hover {
    opacity: 1;
    text-decoration: underline;
  }
`;

const FooterSection = () => {
  return (
    <FooterWrapper id="footer">
      <OneLineFooter>
        <LocationYear>
          Kochi, Kerala &mdash; 2026
        </LocationYear>
        <LinksGroup>
          <FooterLink href="https://github.com/abhi-ragh" target="_blank" rel="noopener noreferrer">
            GitHub
          </FooterLink>
          <FooterLink href="mailto:abhiragh0@gmail.com" target="_blank" rel="noopener noreferrer">
            Email
          </FooterLink>
        </LinksGroup>
      </OneLineFooter>
    </FooterWrapper>
  );
};

export default FooterSection;
