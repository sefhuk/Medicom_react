import styled from 'styled-components';

function Nav() {
  return <NavBar>네비게이션바</NavBar>;
}

const NavBar = styled.footer`
  height: 8dvh;
  text-align: center;
  background-color: skyblue;
`;

export default Nav;
