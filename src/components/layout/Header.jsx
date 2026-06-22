import { useState } from 'react';
import { Link } from 'react-scroll';
import styled from '@emotion/styled';

const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 80px;
  z-index: 50;
  background-color: var(--paper);
  border-bottom: 1px solid var(--ink);
`;

const NavContainer = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 1.5rem;
`;

const LogoLink = styled(Link)`
  color: var(--ink);
  font-family: var(--font-display);
  font-size: 1.75rem;
  font-weight: 400;
  cursor: pointer;
  
  &:hover {
    color: var(--rust);
  }
`;

const Nav = styled.nav`
  display: flex;
  align-items: center;
  gap: 2.5rem;

  @media (max-width: 640px) {
    gap: 1.25rem;
  }
`;

const NavLink = styled(Link)`
  color: var(--ink);
  text-transform: uppercase;
  font-family: var(--font-body);
  font-size: 0.875rem;
  font-weight: 500;
  letter-spacing: 0.05em;
  cursor: pointer;
  position: relative;
  transition: color 0.2s ease;

  &:hover {
    color: var(--rust);
  }
`;

const Header = () => {
  return (
    <HeaderContainer>
      <NavContainer>
        <LogoLink to="hero" smooth={true} duration={500}>
          Abhiragh
        </LogoLink>
        <Nav>
          <NavLink to="experience" smooth={true} duration={500}>
            Work
          </NavLink>
          <NavLink to="hero" smooth={true} duration={500}>
            About
          </NavLink>
          <NavLink to="about" smooth={true} duration={500}>
            Photos
          </NavLink>
          <NavLink to="footer" smooth={true} duration={500}>
            Contact
          </NavLink>
        </Nav>
      </NavContainer>
    </HeaderContainer>
  );
};

export default Header;