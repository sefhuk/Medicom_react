import React from 'react';
import styled from 'styled-components';
import Nav from '../Nav';
import Footer from '../Footer';

function MainContainer({ children }) {
  return (
    <Container>
      <Nav />
      {children}
      <Footer />
    </Container>
  );
}

const Container = styled.div`
  width: 70dvh;
  margin: 0 auto;
  height: 92dvh;
  overflow-y: scroll;
`;



export default MainContainer;
