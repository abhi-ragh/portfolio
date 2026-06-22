import styled from '@emotion/styled';

const FooterContainer = styled.footer`
  border-top: 1px solid var(--ink);
  background-color: var(--paper);
  color: var(--ink);
  padding: 2.5rem 1.5rem;
`;

const FooterContent = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: column;
  gap: 1rem;
  
  @media (min-width: 640px) {
    flex-direction: row;
    gap: 0;
  }
`;

const FooterLeft = styled.div`
  font-family: var(--font-body);
  font-size: 0.875rem;
  opacity: 0.8;
`;

const FooterLinks = styled.div`
  display: flex;
  gap: 1rem;
  font-family: var(--font-body);
  font-size: 0.875rem;
`;

const FooterLink = styled.a`
  color: var(--rust);
  transition: opacity 0.2s ease;
  
  &:hover {
    text-decoration: underline;
  }
`;

const FooterSeparator = styled.span`
  opacity: 0.4;
`;

const Footer = () => {
  return (
    <FooterContainer id="footer">
      <FooterContent>
        <FooterLeft>
          abhiragh@portfolio
        </FooterLeft>
        <FooterLinks>
          <FooterLink href="mailto:abhiragh0@gmail.com" target="_blank" rel="noopener noreferrer">
            mail
          </FooterLink>
          <FooterSeparator>·</FooterSeparator>
          <FooterLink href="https://github.com/abhi-ragh" target="_blank" rel="noopener noreferrer">
            github
          </FooterLink>
          <FooterSeparator>·</FooterSeparator>
          <FooterLink href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
            linkedin
          </FooterLink>
        </FooterLinks>
      </FooterContent>
    </FooterContainer>
  );
};

export default Footer;