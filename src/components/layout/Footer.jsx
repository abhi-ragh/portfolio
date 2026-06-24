import styled from '@emotion/styled';

const FooterContainer = styled.footer`
  background-color: var(--paper);
  color: var(--ink);
  padding: 1rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;

  @media (min-width: 640px) {
    flex-direction: row;
    gap: 0;
    padding: 1.25rem 2.5rem;
  }
`;

const FooterLeft = styled.div`
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  opacity: 0.6;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const FooterLinks = styled.div`
  display: flex;
  gap: 1.5rem;
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  letter-spacing: 0.05em;
`;

const FooterLink = styled.a`
  color: var(--ink);
  opacity: 0.7;
  text-decoration: none;
  transition: opacity 0.2s ease, color 0.2s ease;
  text-transform: uppercase;

  &:hover {
    opacity: 1;
    color: var(--rust);
  }
`;

const Footer = () => {
  return (
    <FooterContainer id="footer">
      <FooterLeft>
        kochi, kerala &mdash; 2026
      </FooterLeft>
      <FooterLinks>
        <FooterLink href="https://github.com/abhi-ragh" target="_blank" rel="noopener noreferrer">
          Github
        </FooterLink>
        <FooterLink href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
          Linkedin
        </FooterLink>
        <FooterLink href="mailto:abhiragh0@gmail.com" target="_blank" rel="noopener noreferrer">
          Email
        </FooterLink>
      </FooterLinks>
    </FooterContainer>
  );
};

export default Footer;