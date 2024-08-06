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
    if (auth.role === 'ADMIN' && data.type.type !== '서비스센터 상담') {
      return;
    }

    navigate(`/chat/${Number(data.id)}/messages`, { state: { status: data.status.status } });
  };

  return (
    <Container hovered={isHovered}>
      <Wrapper
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleWrapperClick}
        selectedIndex={selectedIndex}
      >
        <Title>
          {selectedIndex === 2 ? (
            data.user2 ? (
              <>
                {data.user1.name}님과 {data.user2.name}님의 대화
              </>
            ) : (
              <>{data.user1.name}님의 대기 중인 상담</>
            )
          ) : selectedIndex === 1 ? (
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
          {selectedIndex === 2 && <ChatType>{data.type.type}</ChatType>}
        </Title>
        <Preview>
          {selectedIndex !== 2 ? (
            <>
              {data.status.status !== '진행' && `(${data.status.status})`}{' '}
              {data.lastMessage !== null
                ? data.lastMessage.content
                    .replace(/\n/g, ' ')
                    .replace(
                      'dpt: ',
                      data.lastMessage.user.role === 'DOCTOR' ? '진료과 정보 제공: ' : 'dpt: '
                    )
                : '메시지가 없습니다'}
            </>
          ) : (
            <div style={{ display: 'flex' }}>
              <ProfileImage user={data.user1} size={'3rem'} doctorProfile={data.doctorProfile} />
              {data.user2 ? (
                <ProfileImage user={data.user2} size={'3rem'} doctorProfile={data.doctorProfile} />
              ) : null}
            </div>
          )}
        </Preview>
      </Wrapper>
      {selectedIndex !== 2 && (
        <ProfileImage
          user={
            selectedIndex === 1
              ? data.user1
              : auth.userId === data.user1.id
                ? data.user2
                : data.user1
          }
          size={'6rem'}
          doctorProfile={data.doctorProfile}
        />
      )}
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
  width: ${({ selectedIndex }) => (selectedIndex !== 2 ? '70%' : '100%')};
  height: 100%;
`;

const Title = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  font-size: 2rem;
  font-weight: bold;
  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const HospitalName = styled.div`
  font-size: 0.8rem;
  color: #706c6c;
  font-weight: 400;
`;

const ChatType = styled.p`
  color: #706c6c;
  font-size: 1.2rem;
  @media (max-width: 768px) {
    font-size: 0.8rem;
  }
`;

const Preview = styled.div`
  width: 70%;
  font-size: 1.5rem;
  overflow: hidden;
  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

export default ChatRoomDetail;
