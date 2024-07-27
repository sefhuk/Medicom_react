import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

function Nav() {
  return (
    <NavBar>
      <Link to="/">Home</Link>
      <Link to="/boards">Boards</Link>
    </NavBar>
  );
}

const NavBar = styled.nav`
  height: 8dvh;
  background-color: #4682B4; /* SteelBlue */
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  a {
    text-decoration: none;
    color: #fff;
    font-size: 1.2em;
    margin: 0 1em;
    &:hover {
      text-decoration: underline;
    }
  }
`;

export default Nav;
