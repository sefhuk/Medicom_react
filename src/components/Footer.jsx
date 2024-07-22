import React from 'react';
import styled from 'styled-components';

function Footer() {
  return <FooterBar>하단바</FooterBar>;
}

const FooterBar = styled.footer`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 8dvh;
  text-align: center;
  background-color: skyblue;
`;

export default Footer;
