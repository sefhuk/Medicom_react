import React from 'react';
import styled from 'styled-components';
import Nav from '../Nav';
import Footer from '../Footer';

function MainContainer({ children, isChat }) {
  return (
    <Container>
      <Nav />
      <Content isChat={isChat}>{children}</Content>

    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  max-width: 60dvh;
  margin: 0 auto;
  height: 100dvh;
`;

const Content = styled.div`
  flex: 1;
  height: ${({ isChat }) => (isChat === true ? '76dvh' : '84dvh')};
  margin-bottom: ${({ isChat }) => (isChat === true ? '8dvh' : '0px')};
`;

export default MainContainer;
