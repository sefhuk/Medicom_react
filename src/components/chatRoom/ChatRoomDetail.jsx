import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import ProfileImage from '../chatMessage/ProfileImage';
import { useRecoilState } from 'recoil';
import { userauthState } from '../../utils/atom';

function ChatRoomDetail({ data, selectedIndex }) {
  const navigate = useNavigate();

  const [auth] = useRecoilState(userauthState);

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
          {selectedIndex === 1 ? (
            data.user1.name
          ) : auth.role !== 'USER' ? (
            data.user1.name
          ) : data.user2 ? (
            <>
              {data.user2.role === 'DOCTOR' ? '(의사) ' : '(관리자) '} {data.user2.name}
              {data.user2.role === 'DOCTOR' && (
                <HospitalName>{data.doctorProfile.hospitalName}</HospitalName>
              )}
            </>
          ) : (
            data.type.type
          )}
        </Title>
        <Preview>
          {data.status.status !== '진행' && `(${data.status.status})`}{' '}
          {data.lastMessage !== null
            ? data.lastMessage.content.replace(/\n/g, ' ')
            : '메시지가 없습니다'}
        </Preview>
      </Wrapper>
      <ProfileImage
        url={
          selectedIndex === 1
            ? data.user1.image
            : auth.userId === data.user1.id
              ? data.user2?.image
              : data.user1?.image
        }
        size={'6rem'}
      />
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
    background-color: ${({ hovered }) => (hovered === true ? '#c8c1c1' : 'white')};
    cursor: ${({ hovered }) => (hovered === true ? 'pointer' : null)};
  }
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  width: 70%;
  height: 100%;
`;

const Title = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  font-size: 2rem;
  font-weight: bold;
`;

const HospitalName = styled.div`
  font-size: 0.8rem;
  color: #706c6c;
  font-weight: 400;
`;

const Preview = styled.div`
  width: 70%;
  font-size: 1.5rem;
  overflow: hidden;
`;

export default ChatRoomDetail;
