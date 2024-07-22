import React from 'react';
import styled from 'styled-components';
import Nav from '../Nav';

function MainContainer({ children }) {
  return (
    <Container>
      <Nav />
      {children}
    </Container>
  );
}

const Container = styled.div`
  height: 92dvh;
  background-color: yellow;
  overflow-y: scroll;
`;

export default MainContainer;
