import React from 'react';
import styled from 'styled-components';
import Nav from '../Nav';
import Footer from '../Footer';

function MainContainer({ children }) {
  return (
    <Container>
      <Nav />
      <Content>
        {children}
      </Content>
      <Footer />
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
  flex: 1;
  overflow-y: scroll;
`;



export default MainContainer;
