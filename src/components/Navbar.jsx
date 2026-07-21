import styled from '@emotion/styled';

const NavHeader = styled.nav`
  position: sticky;
  top: 0;
  z-index: 100;
  background-color: rgba(13, 13, 13, 0.9);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid var(--border);
  padding: 1rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;

  @media (min-width: 768px) {
    padding: 1.25rem 3rem;
  }
`;

const NavBrand = styled.a`
  font-family: var(--font-serif);
  font-size: 1.15rem;
  color: var(--ink);
  text-decoration: none;
  font-weight: 500;
  letter-spacing: -0.01em;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 1.5rem;

  @media (min-width: 640px) {
    gap: 2.25rem;
  }
`;

const NavLink = styled.a`
  font-family: var(--font-mono);
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--ink-muted);
  text-decoration: none;
  transition: color 0.2s ease;

  &:hover {
    color: var(--ink);
  }
`;

const Navbar = () => {
  return (
    <NavHeader>
      <NavBrand href="#hero">Abhiragh A R</NavBrand>
      <NavLinks>
        <NavLink href="#about">About</NavLink>
        <NavLink href="#gallery">Gallery</NavLink>
        <NavLink href="#work">Work</NavLink>
        <NavLink href="#blog">Blog</NavLink>
      </NavLinks>
    </NavHeader>
  );
};

export default Navbar;
