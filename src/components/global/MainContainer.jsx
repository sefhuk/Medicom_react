import React from 'react';
import styled from 'styled-components';
import Nav from '../Nav';

function MainContainer({ children }) {
  return (
    <Container>
      <Nav />
      <Content>{children}</Content>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 70dvh;
  margin: 0 auto;
  height: 100dvh;
`;


const Content = styled.div`
  padding: 1em;
`;

export default MainContainer;
