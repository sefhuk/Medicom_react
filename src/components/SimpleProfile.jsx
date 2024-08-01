import React from 'react';
import styled from 'styled-components';
import ProfileImage from './chatMessage/ProfileImage';

function SimpleProfile(props) {
  return (
    <Container>
      <Head>
        <ProfileImage user={props.user} size={'6rem'} />
        <Wrapper>
          <Name>{props.user.name}</Name>
          <HospitalName>어디어디 병원</HospitalName>
          <Departments>진료과목: 가정의학과, 외과</Departments>
        </Wrapper>
      </Head>
      <Profile></Profile>
    </Container>
  );
}

const Container = styled.div``;

const Head = styled.div`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  @media (max-width: 481px) {
    flex-direction: column;
  }
`;

const Wrapper = styled.div`
  width: 60%;
  @media (max-width: 481px) {
    font-size: 1.6rem;
    margin-top: 20px;
    width: 100%;
  }
`;

const Name = styled.p`
  font-size: 2rem;
  @media (max-width: 481px) {
    font-size: 1.6rem;
  }
`;

const HospitalName = styled.p`
  @media (max-width: 481px) {
    font-size: 1rem;
  }
`;

const Departments = styled.p`
  @media (max-width: 481px) {
    font-size: 1rem;
  }
`;

const Profile = styled.div``;

export default SimpleProfile;
