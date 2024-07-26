import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import ProfileImage from '../chatMessage/ProfileImage';

function ChatRoomDetail({ data }) {
  const navigate = useNavigate();

  const [isHovered, setIsHovered] = useState(false);

  const handleWrapperClick = () => {
    navigate(`/chat/${Number(data.id)}/messages`, { state: { status: data.status.status } });
  };

  return (
    <Container hovered={isHovered}>
      <Wrapper
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleWrapperClick}
      >
        <Title>
          {data.type.type === 'AI 상담' ? (
            data.type.type
          ) : data.user2 === '서비스센터 상담' ? (
            data.type.type
          ) : data.user2 ? (
            <>
              Doc. {data.user2.name}
              <HospitalName>병원 이름</HospitalName>
            </>
          ) : (
            '매칭된 의사가 없습니다'
          )}
        </Title>
        <Preview>
          {data.status.status !== '진행' && `(${data.status.status})`}{' '}
          {data.lastMessage !== null
            ? data.lastMessage.content.replace(/\n/g, ' ')
            : '메시지가 없습니다'}
        </Preview>
      </Wrapper>
      <ProfileImage url={data.user2 ? data.user2.image : null} />
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  width: 95%;
  height: 18dvh;
  border: 2px solid black;
  border-radius: 10px;
  margin: 20px auto 0px;
  padding: 5px 30px;
  &:hover {
    background-color: ${({ hovered }) => (hovered ? '#c8c1c1' : 'white')};
    cursor: ${({ hovered }) => 'pointer'};
  }
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  width: 80%;
  height: 100%;
`;

const Title = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: bold;
`;

const HospitalName = styled.div`
  font-size: 0.8rem;
  color: #706c6c;
  font-weight: 400;
`;

const Preview = styled.div``;

export default ChatRoomDetail;
